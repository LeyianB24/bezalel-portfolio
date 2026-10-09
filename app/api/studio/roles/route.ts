import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyApiAdminPermission } from "@/lib/permissions";
import { AdminPermission } from "@prisma/client";

interface CustomAdminRoleDelegate {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
}
const db = prisma as unknown as { customAdminRole: CustomAdminRoleDelegate };

// GET /api/studio/roles — list all custom admin roles
export async function GET() {
  const { errorResponse } = await verifyApiAdminPermission("FULL_ACCESS");
  if (errorResponse) return errorResponse;

  try {
    const roles = await db.customAdminRole.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(roles);
  } catch (error) {
    console.error("[GET /api/studio/roles]", error);
    return NextResponse.json({ error: "Failed to fetch roles." }, { status: 500 });
  }
}

// POST /api/studio/roles — create a new custom admin role
export async function POST(req: NextRequest) {
  const { errorResponse } = await verifyApiAdminPermission("FULL_ACCESS");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { name, description, permissions } = body as {
      name: string;
      description?: string;
      permissions: AdminPermission[];
    };

    if (!name?.trim()) {
      return NextResponse.json({ error: "Role name is required." }, { status: 400 });
    }
    if (!permissions || permissions.length === 0) {
      return NextResponse.json({ error: "At least one permission is required." }, { status: 400 });
    }

    const role = await db.customAdminRole.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        permissions,
      },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/studio/roles]", error);
    const msg =
      (error as { code?: string })?.code === "P2002"
        ? "A role with that name already exists."
        : "Failed to create role.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
