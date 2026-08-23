import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyApiAdminPermission } from "@/lib/permissions";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";

const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("STORE");
    if (errorResponse) return errorResponse;

    const json = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order status", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { id } = await params;

    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    const { logAudit } = await import("@/lib/audit");
    await logAudit({
      action: "ORDER_STATUS_CHANGED",
      entityType: "Order",
      entityId: id,
      metadata: {
        newStatus: json.status,
        customerName: order.name,
        customerEmail: order.email,
        total: order.total,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Orders PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
