import prisma from "@/lib/prisma";
import CareersPage from "@/components/pages/CareersPage";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers & Open Roles | Bezalel Technologies",
  description: "Explore engineering and IT infrastructure roles at Bezalel Technologies in Nairobi, Kenya.",
};

const fallbackPositions = [
  {
    id: "job-1",
    title: "Senior Full-Stack Engineer (Next.js / Node.js)",
    department: "Engineering",
    location: "Nairobi / Hybrid",
    type: "FULL_TIME" as const,
    description: "Architect and deliver high-reliability web platforms, API integrations, and database schemas for East African institutions.",
    requirements: [
      "3+ years experience with Next.js, TypeScript, PostgreSQL, and Prisma",
      "Demonstrated experience integrating payment gateways (M-Pesa Daraja, Stripe)",
      "Strong commitment to clean architecture, code quality, and automated testing",
    ],
  },
  {
    id: "job-2",
    title: "IT Infrastructure & Network Technician",
    department: "Infrastructure",
    location: "Nairobi / On-site",
    type: "FULL_TIME" as const,
    description: "Install, configure, and maintain enterprise structured cabling, managed switches, boardroom AV, and CCTV systems.",
    requirements: [
      "Experience with Cisco/Ubiquiti/MikroTik networking equipment",
      "Familiarity with boardroom video conferencing hardware and surveillance networks",
      "Valid driver's license and field troubleshooting aptitude",
    ],
  },
];

export default async function Page() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        isOpen: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const positions = jobs.length > 0 ? jobs.map((job) => ({
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
    })) : fallbackPositions;

    return <CareersPage positions={positions} />;
  } catch (error) {
    console.error("CareersPage DB fetch error:", error);
    return <CareersPage positions={fallbackPositions} />;
  }
}
