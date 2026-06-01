import prisma from "@/lib/prisma";
import ProjectsDashboard from "./ProjectsDashboard";

export const revalidate = 0;

export default async function Page() {
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
