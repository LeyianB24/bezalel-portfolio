import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyApiAdminPermission } from "@/lib/permissions";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("STORE");
    if (errorResponse) return errorResponse;

    const json = await request.json();
    const { id } = await params;

    const product = await prisma.product.update({
      where: { id },
      data: json,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Products PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("STORE");
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
