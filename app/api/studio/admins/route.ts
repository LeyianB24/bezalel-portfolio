import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyApiAdminPermission, ADMIN_PERMISSIONS_LIST } from "@/lib/permissions";
import { AdminPermission } from "@prisma/client";
import { z } from "zod";

const createAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export async function GET() {
  const { errorResponse } = await verifyApiAdminPermission("FULL_ACCESS");
  if (errorResponse) return errorResponse;

  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to retrieve admin accounts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await verifyApiAdminPermission("FULL_ACCESS");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = createAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, name, password, permissions } = parsed.data;

    // Check if user with this email already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A user account with this email address already exists." },
        { status: 409 }
      );
    }

    // Validate permissions enum
    const validPermissions = permissions.filter((p) =>
      ADMIN_PERMISSIONS_LIST.some((def) => def.key === p)
    ) as AdminPermission[];

    if (validPermissions.length === 0) {
      return NextResponse.json(
        { error: "Please assign at least one valid console permission." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        password: hashedPassword,
        role: "ADMIN",
        permissions: validPermissions,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create administrator account" },
      { status: 500 }
    );
  }
}
