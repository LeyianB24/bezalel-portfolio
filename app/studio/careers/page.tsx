import prisma from "@/lib/prisma";
import { requireAdminPermission } from "@/lib/permissions";
import CareersDashboard from "./CareersDashboard";

export const revalidate = 0;

export default async function Page() {
  await requireAdminPermission("CAREERS");

  const [jobs, applications] = await Promise.all([
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    }),
    prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            title: true,
            department: true,
          },
        },
      },
    }),
  ]);

  return (
    <CareersDashboard 
      initialJobs={jobs} 
      initialApplications={applications} 
    />
  );
}