import { NextResponse } from "next/server";
import { verifyApiAdminPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { EquipmentCategory } from "@prisma/client";

const equipmentSchema = z.object({
  name: z.string().min(2, "Equipment name is required"),
  category: z.nativeEnum(EquipmentCategory),
  description: z.string().min(5, "Description is required"),
  specs: z.array(z.string()).default([]),
  imageUrl: z.string().optional().nullable(),
  isClientFacing: z.boolean().default(true),
  isSellable: z.boolean().default(false),
  productId: z.string().optional().nullable(),
  status: z.string().default("ACTIVE"),
  displayOrder: z.number().default(0),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const clientFacingOnly = searchParams.get("clientFacing") === "true";

    const where: Record<string, unknown> = {};
    if (category && Object.values(EquipmentCategory).includes(category as EquipmentCategory)) {
      where.category = category as EquipmentCategory;
    }
    if (clientFacingOnly) {
      where.isClientFacing = true;
    }

    const items = await prisma.equipment.findMany({
      where,
      orderBy: { displayOrder: "asc" },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            price: true,
            stock: true,
          },
        },
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/equipment error:", error);
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("EQUIPMENT");
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const parsed = equipmentSchema.parse(body);

    const newEquipment = await prisma.equipment.create({
      data: parsed,
    });

    return NextResponse.json(newEquipment, { status: 201 });
  } catch (error) {
    console.error("POST /api/equipment error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid equipment data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create equipment" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
