import prisma from "@/lib/prisma";
import CareersDashboard from "./CareersDashboard";

export const revalidate = 0;

export default async function Page() {
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