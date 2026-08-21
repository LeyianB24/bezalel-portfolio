import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyApiAdminPermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  const { errorResponse } = await verifyApiAdminPermission("FULL_ACCESS");
  if (errorResponse) return errorResponse;

  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error retrieving audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit log trail" },
      { status: 500 }
    );
  }
}
