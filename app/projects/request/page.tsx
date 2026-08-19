import { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import RequestForm from "./RequestForm";

export const metadata: Metadata = {
  title: "Request a Project Quote | Bezalel Studio",
  description: "Submit your project brief, timeline, and budget. Our team of engineering partners will analyze your specifications and provide a technical estimate.",
};

export default function ProjectRequestPage() {
  return (
    <PageLayout variant="cyber" title="Initiate Project">
      <main className="min-h-screen pt-32 pb-20 relative overflow-hidden font-sans selection:bg-emerald-500/30">
        {/* Background Accents */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <RequestForm />
        </div>
      </main>
    </PageLayout>
  );
}
