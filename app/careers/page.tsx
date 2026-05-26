import prisma from "@/lib/prisma";
import CareersPage from "@/components/pages/CareersPage";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Careers - Join the Vanguard | Bezalel Studio",
  description: "Explore career opportunities at Bezalel Studio. We build software that matters. Join our engineering, design, and product vanguard by applying online.",
};

export default async function Page() {
  const jobs = await prisma.job.findMany({
    where: {
      isOpen: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const positions = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    type: job.type,
    description: job.description,
    requirements: job.requirements,
  }));

  return <CareersPage positions={positions} />;
}
