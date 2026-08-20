import prisma from "@/lib/prisma";
import { requireAdminPermission } from "@/lib/permissions";
import AdminsDashboard from "./AdminsDashboard";

export const dynamic = "force-dynamic";

export default async function StudioAdminsPage() {
  const session = await requireAdminPermission("FULL_ACCESS");

  const rawAdmins = await prisma.user.findMany({
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

  const admins = JSON.parse(JSON.stringify(rawAdmins));

  return (
    <AdminsDashboard
      initialAdmins={admins}
      currentUserId={session.user?.id || ""}
    />
  );
}
