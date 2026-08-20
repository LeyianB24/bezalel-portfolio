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

    return NextResponse.json(order);
  } catch (error) {
    console.error("Orders PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
