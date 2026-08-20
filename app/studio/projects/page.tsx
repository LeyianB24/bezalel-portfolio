import prisma from "@/lib/prisma";
import { requireAdminPermission } from "@/lib/permissions";
import ProjectsDashboard from "./ProjectsDashboard";

export const revalidate = 0;

export default async function Page() {
  await requireAdminPermission("PROJECTS_QUOTATIONS");

  const projects = await prisma.projectRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <ProjectsDashboard initialProjects={projects} />
  );
}
