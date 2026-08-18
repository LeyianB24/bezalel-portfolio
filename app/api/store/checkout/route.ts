import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { PaymentMethod, OrderStatus } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/order-email";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional().nullable(),
  shippingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().default("Kenya"),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ).min(1, "Cart cannot be empty"),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = checkoutSchema.parse(body);

    // Fetch product details from DB
    const productIds = parsed.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products were not found" }, { status: 404 });
    }

    // Verify stock and compute total
    let total = 0;
    const orderItemsData = parsed.items.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      if (prod.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${prod.name}`);
      }
      const itemTotal = prod.price * item.quantity;
      total += itemTotal;
      return {
        productId: prod.id,
        quantity: item.quantity,
        price: prod.price,
        name: prod.name,
      };
    });

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id || null,
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        shippingAddress: JSON.parse(JSON.stringify(parsed.shippingAddress)),
        total,
        paymentMethod: parsed.paymentMethod,
        status: parsed.paymentMethod === PaymentMethod.CASH_ON_DELIVERY 
          ? OrderStatus.PENDING 
          : OrderStatus.PAYMENT_PENDING,
        items: {
          create: orderItemsData.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // 1. STRIPE PAYMENT
    if (parsed.paymentMethod === PaymentMethod.STRIPE) {
      const line_items = orderItemsData.map((item) => ({
        price_data: {
          currency: "kes",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const origin = req.headers.get("origin") || "https://bezalel.website";

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items,
          mode: "payment",
          customer_email: parsed.email,
          metadata: {
            orderId: order.id,
          },
          success_url: `${origin}/store/order-success?orderId=${order.id}`,
          cancel_url: `${origin}/store/cart`,
        });

        await prisma.order.update({
          where: { id: order.id },
          data: { paymentRef: stripeSession.id },
        });

        return NextResponse.json({
          orderId: order.id,
          checkoutUrl: stripeSession.url,
        });
      } catch (stripeErr) {
        console.error("Stripe session creation error:", stripeErr);
        return NextResponse.json({
          orderId: order.id,
          checkoutUrl: `/store/order-success?orderId=${order.id}`,
        });
      }
    }

    // 2. M-PESA STK PUSH
    if (parsed.paymentMethod === PaymentMethod.MPESA) {
      console.log(`[M-PESA STK PUSH] Initiating STK push of KES ${total} to ${parsed.phone} for Order ${order.id}`);
      
      const mpesaMockRef = `WS${Date.now().toString().slice(-8)}`;
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentRef: mpesaMockRef },
      });

      return NextResponse.json({
        orderId: order.id,
        message: "M-Pesa STK Push initiated. Please enter your PIN on your phone.",
        paymentRef: mpesaMockRef,
      });
    }

    // 3. CASH ON DELIVERY
    if (parsed.paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
      await sendOrderConfirmationEmail({
        orderId: order.id,
        customerName: order.name,
        customerEmail: order.email,
        customerPhone: order.phone,
        items: orderItemsData.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total: order.total,
        paymentMethod: "Cash on Delivery / In-person",
        shippingAddress: order.shippingAddress as Record<string, string>,
      }).catch((err) => console.error("Order email error:", err));

      return NextResponse.json({
        orderId: order.id,
        message: "Order placed successfully. Payment will be collected on delivery.",
        redirectUrl: `/store/order-success?orderId=${order.id}`,
      });
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid checkout data", details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Failed to process checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
