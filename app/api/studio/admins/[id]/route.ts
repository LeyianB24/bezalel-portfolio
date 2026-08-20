import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyApiAdminPermission, ADMIN_PERMISSIONS_LIST } from "@/lib/permissions";
import { AdminPermission } from "@prisma/client";
import { z } from "zod";

const updateAdminSchema = z.object({
  name: z.string().min(2).optional(),
  password: z.string().min(6).optional(),
  permissions: z.array(z.string()).min(1, "At least one permission is required").optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await verifyApiAdminPermission("FULL_ACCESS");
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingAdmin || existingAdmin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin account not found" },
        { status: 404 }
      );
    }

    const dataToUpdate: Record<string, unknown> = {};

    if (parsed.data.name) {
      dataToUpdate.name = parsed.data.name;
    }

    if (parsed.data.password) {
      dataToUpdate.password = await bcrypt.hash(parsed.data.password, 12);
    }

    if (parsed.data.permissions) {
      const validPermissions = parsed.data.permissions.filter((p) =>
        ADMIN_PERMISSIONS_LIST.some((def) => def.key === p)
      ) as AdminPermission[];

      if (validPermissions.length === 0) {
        return NextResponse.json(
          { error: "Please assign at least one valid permission." },
          { status: 400 }
        );
      }

      // Safeguard: Check if we are removing FULL_ACCESS from the last super-admin
      if (
        existingAdmin.permissions.includes("FULL_ACCESS") &&
        !validPermissions.includes("FULL_ACCESS")
      ) {
        const fullAccessAdminsCount = await prisma.user.count({
          where: {
            role: "ADMIN",
            permissions: { has: "FULL_ACCESS" },
          },
        });

        if (fullAccessAdminsCount <= 1) {
          return NextResponse.json(
            { error: "Cannot remove Full Access from the only remaining Super Administrator account." },
            { status: 400 }
          );
        }
      }

      dataToUpdate.permissions = validPermissions;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        image: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating admin user:", error);
    return NextResponse.json(
      { error: "Failed to update administrator account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse, session } = await verifyApiAdminPermission("FULL_ACCESS");
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;

    // Check if target user is self
    if (session?.user?.id === id) {
      return NextResponse.json(
        { error: "You cannot delete your own active administrator account." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // Check if target is the last super-admin
    if (targetUser.permissions.includes("FULL_ACCESS")) {
      const fullAccessCount = await prisma.user.count({
        where: {
          role: "ADMIN",
          permissions: { has: "FULL_ACCESS" },
        },
      });

      if (fullAccessCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the sole remaining Super Administrator account." },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting admin account:", error);
    return NextResponse.json(
      { error: "Failed to delete administrator account" },
      { status: 500 }
    );
  }
}
