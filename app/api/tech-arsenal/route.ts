import { NextResponse } from "next/server";
import { verifyApiAdminPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { TechCategory } from "@prisma/client";

const techSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.nativeEnum(TechCategory),
  iconKey: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isCore: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

export async function GET() {
  try {
    const items = await prisma.techArsenalItem.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/tech-arsenal error:", error);
    return NextResponse.json({ error: "Failed to fetch tech items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("TECH_ARSENAL");
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const parsed = techSchema.parse(body);

    const newItem = await prisma.techArsenalItem.create({
      data: parsed,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("POST /api/tech-arsenal error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create tech item" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
