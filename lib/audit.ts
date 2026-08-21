import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface LogAuditParams {
  actorId?: string | null;
  actorEmail?: string | null;
  actorName?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Creates an audit log entry in the database.
 * Wrapped with a try/catch so telemetry failures never disrupt core admin actions.
 */
export async function logAudit({
  actorId,
  actorEmail,
  actorName,
  action,
  entityType,
  entityId,
  metadata,
}: LogAuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actorId || null,
        actorEmail: actorEmail || null,
        actorName: actorName || null,
        action,
        entityType,
        entityId: entityId || null,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    });
  } catch (err) {
    console.error("⚠️ Failed to record audit log entry:", err);
  }
}
