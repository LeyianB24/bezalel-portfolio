import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { EquipmentCategory } from "@prisma/client";

const equipmentUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.nativeEnum(EquipmentCategory).optional(),
  description: z.string().min(5).optional(),
  specs: z.array(z.string()).optional(),
  imageUrl: z.string().optional().nullable(),
  isClientFacing: z.boolean().optional(),
  isSellable: z.boolean().optional(),
  productId: z.string().optional().nullable(),
  status: z.string().optional(),
  displayOrder: z.number().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.equipment.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("GET /api/equipment/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = equipmentUpdateSchema.parse(body);

    const updated = await prisma.equipment.update({
      where: { id },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/equipment/[id] error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid equipment data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update equipment" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.equipment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/equipment/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete equipment" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
