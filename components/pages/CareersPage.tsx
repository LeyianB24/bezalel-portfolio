"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, Mail, 
  MessageCircle, Terminal, Cpu, 
  Globe, ChevronRight, X 
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

// =====================
// TYPE DEFINITION
// =====================

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryRange?: string;
  description: string;
  stack?: string[];
  requirements: string[];
};

interface CareersPageProps {
  positions: Job[];
}

function formatJobType(type: string) {
  switch (type) {
    case "FULL_TIME":
      return "Full-time";
    case "PART_TIME":
      return "Part-time";
    case "CONTRACT":
      return "Contract";
    case "REMOTE":
      return "Remote";
    case "INTERNSHIP":
      return "Internship";
    default:
      return type.replace("_", "-").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}

function getJobStack(job: Job) {
  if (job.stack && Array.isArray(job.stack) && job.stack.length > 0) {
    return job.stack;
  }
  
  const title = job.title.toLowerCase();
  const dept = job.department.toLowerCase();
  
  if (title.includes("frontend") || title.includes("react") || title.includes("ui")) {
    return ["React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion"];
  }
  if (title.includes("backend") || title.includes("node") || title.includes("systems") || title.includes("api")) {
    return ["Node.js", "PostgreSQL", "Prisma", "TypeScript", "Docker"];
  }
  if (dept.includes("design") || title.includes("designer") || title.includes("ux")) {
    return ["Figma", "Auto-Layout", "Design Tokens", "CSS/HTML"];
  }
  if (dept.includes("product") || title.includes("manager") || title.includes("owner")) {
    return ["Agile", "Product Strategy", "Roadmapping", "Metrics"];
  }
  
  return ["TypeScript", "Next.js", "PostgreSQL", "TailwindCSS"];
}

// =====================
// MAIN COMPONENT
// =====================

export default function CareersPage({ positions = [] }: CareersPageProps) {
  const [filter, setFilter] = useState<string>("All");
  const [showProcess, setShowProcess] = useState(false);

  // Extract unique departments dynamically for the tabs
  const departments = ["All", ...Array.from(new Set(positions.map(job => job.department)))];

  const filteredJobs = filter === "All" 
    ? positions 
    : positions.filter(job => job.department === filter);

  return (
    <PageLayout variant="subtle">
      <main className="min-h-screen pt-28 sm:pt-32 pb-20 relative overflow-hidden font-sans selection:bg-accent/30">
        
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-8 border-b border-white/10 pb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 text-accent mb-4 font-mono text-xs tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                System Status: Hiring
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
                JOIN THE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">VANGUARD.</span>
              </h1>
              <p className="text-slate-400 max-w-lg text-base sm:text-lg">
                We don't hide behind middle management. We build software that matters.
              </p>
            </motion.div>

            {/* Header Stats / Filters */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-start md:items-end gap-4"
            >
              <button 
                onClick={() => setShowProcess(true)}
                className="text-sm font-bold text-white underline underline-offset-4 decoration-accent hover:text-accent transition-colors"
              >
                View Hiring Protocol
              </button>
              <div className="flex flex-wrap p-1 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm gap-1 max-w-full overflow-x-auto scrollbar-hide">
                {departments.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                      filter === tab 
                        ? "bg-accent text-white shadow-lg"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* --- HIRING PROCESS MODAL --- */}
          <AnimatePresence>
            {showProcess && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                onClick={() => setShowProcess(false)}
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="bg-neutral-950 border border-white/10 p-6 sm:p-8 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">The Protocol</h3>
                    <button onClick={() => setShowProcess(false)} title="Close Modal"><X className="text-slate-500 hover:text-white" /></button>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-400 mb-6 font-sans">
                      Our process is designed to respect your time while ensuring technical excellence. We skip the generic HR screening and go straight to engineering discussions.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                       <div className="p-4 bg-white/5 rounded border border-white/10">
                          <div className="text-accent font-bold mb-1 font-mono">01. Async Code</div>
                          <p className="text-xs text-slate-400">Show us your code, not just your CV. We review GitHub/Portfolios first.</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded border border-white/10">
                          <div className="text-blue-400 font-bold mb-1 font-mono">02. System Design</div>
                          <p className="text-xs text-slate-400">Whiteboarding session. No &quot;reverse a linked list&quot; tricks. Real architectural problems.</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded border border-white/10">
                          <div className="text-green-400 font-bold mb-1 font-mono">03. The Offer</div>
                          <p className="text-xs text-slate-400">We move fast. Decisions made within 24 hours of the final interview.</p>
                       </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- JOB GRID --- */}
          <div className="grid gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {/* --- TALENT POOL CALLOUT --- */}
          {filteredJobs.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5"
            >
              <p className="text-slate-400">No open positions in this department right now.</p>
            </motion.div>
          )}

          <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
             <div>
               <h4 className="text-white font-bold mb-1">Don&apos;t see your role?</h4>
               <p className="text-slate-500 text-sm">We are always scanning for outliers.</p>
             </div>
             <a href="mailto:careers@bezalelstudio.com" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors border-b border-transparent hover:border-purple-500 pb-0.5 font-mono text-sm">
                Initiate Cold Contact <ArrowUpRight className="w-4 h-4" />
             </a>
          </div>

        </div>
      </main>
    </PageLayout>
  );
}

// =====================
// JOB CARD COMPONENT
// =====================

function JobCard({ job, index }: { job: Job, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const stack = getJobStack(job);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group relative rounded-xl border transition-all duration-300 overflow-hidden ${
        isOpen 
          ? "border-purple-500/50 bg-neutral-900 shadow-2xl shadow-purple-900/10" 
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
      }`}
    >
      {/* CARD HEADER */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row gap-6 md:items-center justify-between"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-medium tracking-wide">
            <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
              {job.department}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
               <Globe className="w-3 h-3 text-slate-500" /> {job.location}
            </span>
            <span className="text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded bg-blue-500/5">
              {formatJobType(job.type)}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors">
            {job.title}
          </h3>
        </div>

        {/* TECH STACK PREVIEW (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
           {stack.slice(0, 3).map((tech) => (
             <span key={tech} className="px-2 py-1 rounded bg-black border border-white/10 text-xs text-slate-400 font-mono">
                {tech}
             </span>
           ))}
           {stack.length > 3 && <span className="text-xs text-slate-600 font-mono">+{stack.length - 3}</span>}
           <div className={`ml-4 p-2 rounded-full transition-all duration-300 ${isOpen ? 'rotate-90 bg-white text-black' : 'bg-white/5 text-white'}`}>
             <ChevronRight className="w-5 h-5" />
           </div>
        </div>
      </div>

      {/* EXPANDABLE DETAILS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-black/20"
          >
            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
              
              {/* Left: Description & Req */}
              <div className="md:col-span-2 space-y-8">
                <div>
                   <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                      <Terminal className="w-4 h-4 text-accent" /> Mission Brief
                   </h4>
                   <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                      {job.description}
                   </p>
                </div>
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                     <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                        <Cpu className="w-4 h-4 text-accent" /> Core Requirements
                     </h4>
                     <ul className="space-y-2">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-400 leading-relaxed">
                            <span className="mt-2.5 w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                     </ul>
                  </div>
                )}
              </div>

              {/* Right: Stack & Apply */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-fit">
                <div className="mb-6">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 font-mono">Tech Stack</h4>
                   <div className="flex flex-wrap gap-2">
                      {stack.map((t) => (
                        <span key={t} className="px-2 py-1 bg-black rounded border border-white/10 text-xs text-slate-300 font-mono">
                          {t}
                        </span>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                   <Link 
                     href={`/careers/${job.id}/apply`}
                     className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/10"
                   >
                     <ArrowUpRight className="w-4 h-4" /> Apply Online
                   </Link>
                   <a 
                     href={`mailto:careers@bezalelstudio.com?subject=Application: ${job.title}`}
                     className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 text-white border border-white/10 hover:bg-white/15 font-bold rounded-lg transition-colors"
                   >
                     <Mail className="w-4 h-4" /> Apply via Email
                   </a>
                   <a 
                     href={`https://wa.me/254796157265?text=Hi,%20applying%20for%20${job.title}`}
                     target="_blank"
                     className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-bold rounded-lg hover:bg-[#25D366] hover:text-black transition-all"
                   >
                     <MessageCircle className="w-4 h-4" /> WhatsApp HR
                   </a>
                </div>
                <p className="text-[10px] text-slate-600 mt-4 text-center font-mono">
                   Typical response time: &lt; 24 hours
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
