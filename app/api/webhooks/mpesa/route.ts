import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/lib/order-email";

export async function handleMpesaCallback(req: Request, pathSecret?: string) {
  try {
    const configuredSecret = process.env.MPESA_CALLBACK_SECRET;
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret");
    const providedSecret = pathSecret || querySecret;

    if (!configuredSecret || !providedSecret || providedSecret !== configuredSecret) {
      console.warn("⚠️ [M-PESA CALLBACK REJECTED]: Unauthorized request - invalid or missing webhook secret.");
      return NextResponse.json(
        { ResultCode: 1, ResultDesc: "Unauthorized: Invalid or missing webhook secret" },
        { status: 401 }
      );
    }

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
      let phoneNumber = "";

      for (const item of CallbackMetadata.Item || []) {
        if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = String(item.Value);
        if (item.Name === "PhoneNumber") phoneNumber = String(item.Value);
      }

      // Find matching order strictly by CheckoutRequestID (stored in paymentRef)
      const order = await prisma.order.findFirst({
        where: {
          paymentRef: CheckoutRequestID,
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!order) {
        console.warn(
          `⚠️ [M-PESA CALLBACK]: No matching order found for CheckoutRequestID "${CheckoutRequestID}". Callback logged for manual reconciliation. (Receipt: ${mpesaReceiptNumber || "N/A"}, Phone: ${phoneNumber || "N/A"})`
        );
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Callback logged for manual reconciliation" });
      }

      if (order.status !== OrderStatus.PAID) {
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
          paymentRef: mpesaReceiptNumber || CheckoutRequestID,
          shippingAddress: order.shippingAddress as Record<string, string>,
        });

        console.log(`✅ Order ${order.id} marked as PAID via M-Pesa webhook. Receipt: ${mpesaReceiptNumber}`);
      }
    } else {
      console.warn(`⚠️ M-Pesa transaction failed or was cancelled by user (CheckoutRequestID: ${CheckoutRequestID}): ${ResultDesc}`);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Callback accepted" });
  } catch (error) {
    console.error("❌ M-Pesa Webhook Error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return handleMpesaCallback(req);
}

export const dynamic = "force-dynamic";
