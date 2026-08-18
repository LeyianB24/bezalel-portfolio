import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/lib/order-email";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error(`⚠️ Stripe Webhook signature verification failed:`, message);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            items: {
              include: { product: true },
            },
          },
        });

        if (order && order.status !== OrderStatus.PAID) {
          const paymentRef = (typeof session.payment_intent === "string" ? session.payment_intent : session.id) || "stripe_paid";

          // 1. Update Order status to PAID
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: OrderStatus.PAID,
              stripeRef: paymentRef,
            },
          });

          // 2. Decrement product inventory
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
              },
            });
          }

          // 3. Dispatch order confirmation email via Resend
          await sendOrderConfirmationEmail({
            orderId: order.id,
            customerName: order.name,
            customerEmail: order.email,
            customerPhone: order.phone,
            items: order.items.map((i) => ({
              name: i.product.name,
              quantity: i.quantity,
              price: i.price,
            })),
            total: order.total,
            paymentMethod: "Stripe / Card",
            paymentRef,
            shippingAddress: order.shippingAddress as Record<string, string>,
          });

          console.log(`✅ Order ${orderId} marked as PAID via Stripe webhook.`);
        }
      } catch (dbError) {
        console.error("❌ Error updating order from Stripe webhook:", dbError);
        return NextResponse.json({ error: "Database error during webhook processing" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

export const dynamic = "force-dynamic";
