import { NextResponse } from "next/server";
import { verifyApiAdminPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { z } from "zod";

const portfolioUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  clientName: z.string().min(2).optional(),
  clientLogoUrl: z.string().optional().nullable(),
  description: z.string().min(5).optional(),
  techTags: z.array(z.string()).optional(),
  liveUrl: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("GET /api/portfolio/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio item" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("PORTFOLIO");
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const parsed = portfolioUpdateSchema.parse(body);

    const updated = await prisma.portfolioItem.update({
      where: { id },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/portfolio/[id] error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid portfolio data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("PORTFOLIO");
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await prisma.portfolioItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/portfolio/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
