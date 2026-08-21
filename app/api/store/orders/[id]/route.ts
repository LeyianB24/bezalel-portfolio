import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyApiAdminPermission } from "@/lib/permissions";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("STORE");
    if (errorResponse) return errorResponse;

    const json = await request.json();
    const { id } = await params;

    const order = await prisma.order.update({
      where: { id },
      data: { status: json.status },
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
