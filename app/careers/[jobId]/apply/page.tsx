import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PageLayout from "@/components/PageLayout";
import ApplyForm from "./ApplyForm";
import { Metadata } from "next";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  return {
    title: job ? `Apply: ${job.title} | Bezalel Studio` : "Job Application | Bezalel Studio",
    description: job 
      ? `Submit your application online for the ${job.title} (${job.department}) position at Bezalel Studio.` 
      : "Submit your job application online to Bezalel Studio.",
  };
}

export default async function Page({ params }: PageProps) {
  const { jobId } = await params;
  
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || !job.isOpen) {
    notFound();
  }

  const jobInfo = {
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    type: job.type,
  };

  return (
    <PageLayout variant="subtle" title={`Apply: ${job.title}`}>
      <main className="min-h-screen pt-32 pb-20 relative overflow-hidden font-sans selection:bg-accent/30">
        {/* Background Accents */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[rgba(3,41,78,0.12)] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <ApplyForm job={jobInfo} />
        </div>
      </main>
    </PageLayout>
  );
}
