import { NextResponse } from "next/server";
import { verifyApiAdminPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { TechCategory } from "@prisma/client";

const techUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.nativeEnum(TechCategory).optional(),
  iconKey: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isCore: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("TECH_ARSENAL");
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const parsed = techUpdateSchema.parse(body);

    const updated = await prisma.techArsenalItem.update({
      where: { id },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/tech-arsenal/[id] error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update tech item" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("TECH_ARSENAL");
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await prisma.techArsenalItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tech-arsenal/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete tech item" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
