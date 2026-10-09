import prisma from "@/lib/prisma";
import CareersPage from "@/components/pages/CareersPage";
import { Metadata } from "next";
import { JobType } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers & Open Roles | Bezalel Technologies",
  description: "Explore engineering and digital infrastructure roles at Bezalel Technologies (Remote Worldwide & Nairobi Hybrid).",
};

interface PositionItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string[];
}

export default async function Page() {
  let positions: PositionItem[] = [];

  try {
    const jobs = await prisma.job.findMany({
      where: {
        isOpen: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    positions = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
    }));
  } catch (error) {
    console.error("CareersPage DB fetch error:", error);
    // positions stays [] — CareersPage renders the empty-state UI
  }

  return <CareersPage positions={positions} />;
}
