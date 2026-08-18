import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const portfolioSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  clientName: z.string().min(2, "Client name is required"),
  clientLogoUrl: z.string().optional().nullable(),
  description: z.string().min(5, "Description is required"),
  techTags: z.array(z.string()).default([]),
  liveUrl: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

export async function GET() {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = portfolioSchema.parse(body);

    const newItem = await prisma.portfolioItem.create({
      data: parsed,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid portfolio data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
