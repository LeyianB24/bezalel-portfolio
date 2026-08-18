import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/lib/order-email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📱 [M-PESA CALLBACK RECEIVED]:", JSON.stringify(body, null, 2));

    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback payload" }, { status: 400 });
    }

    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;

    if (ResultCode === 0 && CallbackMetadata) {
      // Payment Successful
      let mpesaReceiptNumber = "";
      let amount = 0;
      let phoneNumber = "";

      for (const item of CallbackMetadata.Item || []) {
        if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = String(item.Value);
        if (item.Name === "Amount") amount = Number(item.Value);
        if (item.Name === "PhoneNumber") phoneNumber = String(item.Value);
      }

      // Find matching order by paymentRef or checkoutRequestID
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { paymentRef: CheckoutRequestID },
            { status: OrderStatus.PAYMENT_PENDING },
          ],
        },
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (order && order.status !== OrderStatus.PAID) {
        // 1. Mark as PAID
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.PAID,
            mpesaRef: mpesaReceiptNumber || CheckoutRequestID,
          },
        });

        // 2. Decrement stock
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        }

        // 3. Dispatch confirmation email
        await sendOrderConfirmationEmail({
          orderId: order.id,
          customerName: order.name,
          customerEmail: order.email,
          customerPhone: order.phone || phoneNumber,
          items: order.items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: i.price,
          })),
          total: order.total,
          paymentMethod: "M-Pesa (STK Push)",
          paymentRef: mpesaReceiptNumber,
          shippingAddress: order.shippingAddress,
        });

        console.log(`✅ Order ${order.id} marked as PAID via M-Pesa webhook. Receipt: ${mpesaReceiptNumber}`);
      }
    } else {
      console.warn(`⚠️ M-Pesa transaction failed or was cancelled by user: ${ResultDesc}`);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Callback accepted" });
  } catch (error) {
    console.error("❌ M-Pesa Webhook Error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
