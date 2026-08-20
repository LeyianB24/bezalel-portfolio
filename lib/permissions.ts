import { AdminPermission } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export interface PermissionDefinition {
  key: AdminPermission;
  label: string;
  description: string;
  studioPath: string;
}

export const ADMIN_PERMISSIONS_LIST: PermissionDefinition[] = [
  {
    key: "FULL_ACCESS",
    label: "Full Super-Admin Access",
    description: "Unrestricted access across all operational consoles, user management, and sensitive database configurations.",
    studioPath: "/studio",
  },
  {
    key: "PROJECTS_QUOTATIONS",
    label: "Project Inflow & Quotations",
    description: "Manage incoming client project briefs, itemize scopes, issue official PDF quotations, and track contract milestones.",
    studioPath: "/studio/projects",
  },
  {
    key: "PORTFOLIO",
    label: "Portfolio & Case Studies",
    description: "Publish, update, and showcase verified client delivery case studies, live demo links, and tech architecture tags.",
    studioPath: "/studio/portfolio",
  },
  {
    key: "EQUIPMENT",
    label: "Enterprise Hardware & AV",
    description: "Manage deployed enterprise switches, boardroom conferencing systems, surveillance hardware, and client-facing equipment inventory.",
    studioPath: "/studio/equipment",
  },
  {
    key: "TECH_ARSENAL",
    label: "Tech Arsenal & Stack",
    description: "Configure core engineering frameworks, cloud infrastructure tooling, payment protocols, and technology badges.",
    studioPath: "/studio/tech-arsenal",
  },
  {
    key: "STORE",
    label: "Store & Order Fulfillment",
    description: "Manage digital software starter kits, physical hardware distribution products, inventory pricing, and M-Pesa order fulfillment.",
    studioPath: "/studio/store",
  },
  {
    key: "CAREERS",
    label: "Careers & Recruitment",
    description: "Create engineering job postings, review candidate resumes/applications, and manage talent pipelines.",
    studioPath: "/studio/careers",
  },
  {
    key: "MESSAGES",
    label: "Client Inquiries & Messages",
    description: "Review prospective inbound customer queries, WhatsApp contact leads, and contact inbox submissions.",
    studioPath: "/studio/messages",
  },
];

/**
 * Checks if a set of user permissions satisfies the required permission.
 * Users with FULL_ACCESS are granted access to all permissions.
 * If userPermissions is undefined/null/empty (e.g. unmigrated or existing session), defaults to true.
 */
export function hasPermission(
  userPermissions?: AdminPermission[] | null,
  requiredPermission?: AdminPermission
): boolean {
  if (!requiredPermission) {
    return true;
  }

  // Default to full access if permissions not yet set or empty
  if (!userPermissions || userPermissions.length === 0) {
    return true;
  }

  // Super-admin override
  if (userPermissions.includes("FULL_ACCESS")) {
    return true;
  }

  return userPermissions.includes(requiredPermission);
}

/**
 * Server-side guard for Studio pages.
 * Redirects to /studio or /?error=Unauthorized if user lacks permission.
 */
export async function requireAdminPermission(
  requiredPermission?: AdminPermission
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/?error=Unauthorized");
  }

  const userPerms = session.user?.permissions;
  if (!hasPermission(userPerms, requiredPermission)) {
    redirect("/studio?error=InsufficientPermission");
  }

  return session;
}

/**
 * Server-side guard for API route handlers.
 * Returns null if authorized, or a 401/403 NextResponse if unauthorized.
 */
export async function verifyApiAdminPermission(
  requiredPermission?: AdminPermission
): Promise<{ errorResponse: NextResponse | null; session: any }> {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized. Admin credentials required." },
        { status: 401 }
      ),
      session: null,
    };
  }

  const userPerms = session.user?.permissions;
  if (!hasPermission(userPerms, requiredPermission)) {
    return {
      errorResponse: NextResponse.json(
        { error: "Forbidden. You do not have permission to perform this action." },
        { status: 403 }
      ),
      session,
    };
  }

  return { errorResponse: null, session };
}
