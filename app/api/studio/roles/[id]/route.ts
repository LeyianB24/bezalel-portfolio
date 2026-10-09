import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyApiAdminPermission } from "@/lib/permissions";
import { AdminPermission } from "@prisma/client";

interface CustomAdminRoleDelegate {
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
}
const db = prisma as unknown as { customAdminRole: CustomAdminRoleDelegate };

// PATCH /api/studio/roles/[id] — update a custom admin role
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await verifyApiAdminPermission("FULL_ACCESS");
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const { name, description, permissions } = body as {
      name?: string;
      description?: string;
      permissions?: AdminPermission[];
    };

    if (permissions !== undefined && permissions.length === 0) {
      return NextResponse.json({ error: "At least one permission is required." }, { status: 400 });
    }

    const updated = await db.customAdminRole.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(permissions !== undefined && { permissions }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("[PATCH /api/studio/roles/:id]", error);
    const msg =
      (error as { code?: string })?.code === "P2002"
        ? "A role with that name already exists."
        : "Failed to update role.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/studio/roles/[id] — delete a custom admin role
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await verifyApiAdminPermission("FULL_ACCESS");
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    await db.customAdminRole.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/studio/roles/:id]", error);
    return NextResponse.json({ error: "Failed to delete role." }, { status: 500 });
  }
}
