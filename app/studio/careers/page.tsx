"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, MapPin, ArrowUpRight, Mail, 
  MessageCircle, Code2, Terminal, Cpu, 
  Globe, Layout, Database, ChevronRight, X 
} from "lucide-react";

// =====================
// ENHANCED DATA STRUCTURE
// =====================

type Job = {
  id: string;
  title: string;
  department: "Engineering" | "Design" | "Product";
  location: string;
  type: string;
  salaryRange?: string; // Future-proofing
  description: string;
  stack: string[]; // Visual tags
  requirements: string[];
};

const openPositions: Job[] = [
  {
    id: "fe-01",
    title: "Senior Frontend Architect",
    department: "Engineering",
    location: "Remote (EMEA)",
    type: "Full-time",
    salaryRange: "$60k - $90k",
    description: "Own the client-side architecture. We need someone who understands the React reconciliation process deeper than the documentation.",
    stack: ["React", "Next.js 14", "TypeScript", "Zustand", "Tailwind"],
    requirements: [
      "5+ years exp. with React ecosystem",
      "Deep understanding of browser rendering & performance",
      "Ability to architect scalable design systems"
    ]
  },
  {
    id: "be-01",
    title: "Backend Systems Engineer",
    department: "Engineering",
    location: "Nairobi HQ / Hybrid",
    type: "Full-time",
    description: "Build the engine room. Design scalable microservices and ensure our APIs are robust enough for bank-grade integrations.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis"],
    requirements: [
      "Proficiency in Python or Node.js",
      "Experience designing RESTful & GraphQL APIs",
      "Understanding of distributed systems (RabbitMQ/Kafka)"
    ]
  },
  {
    id: "ui-01",
    title: "Technical UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Contract",
    description: "Bridge the gap between aesthetic beauty and technical feasibility. Create design systems that engineers love to implement.",
    stack: ["Figma", "Auto-Layout", "Design Tokens", "CSS/HTML"],
    requirements: [
      "Portfolio showcasing complex web apps",
      "Mastery of Figma variables & component props",
      "Basic understanding of frontend constraints"
    ]
  }
];

// =====================
// MAIN COMPONENT
// =====================

export default function CareersPage() {
  const [filter, setFilter] = useState<string>("All");
  const [showProcess, setShowProcess] = useState(false);

  const filteredJobs = filter === "All" 
    ? openPositions 
    : openPositions.filter(job => job.department === filter);

  return (
    <main className="min-h-screen bg-neutral-950 text-slate-200 pt-32 pb-20 relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-white/10 pb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-purple-400 mb-4 font-mono text-xs tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              System Status: Hiring
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
              JOIN THE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">VANGUARD.</span>
            </h1>
            <p className="text-slate-400 max-w-lg text-lg">
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
              className="text-sm font-bold text-white underline underline-offset-4 decoration-purple-500 hover:text-purple-400 transition-colors"
            >
              View Hiring Protocol
            </button>
            <div className="flex p-1 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              {["All", "Engineering", "Design"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === tab 
                      ? "bg-purple-600 text-white shadow-lg" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- HIRING PROCESS MODAL (VISUALIZATION) --- */}
        <AnimatePresence>
          {showProcess && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setShowProcess(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-neutral-900 border border-white/10 p-8 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">The Protocol</h3>
                  <button onClick={() => setShowProcess(false)}><X className="text-slate-500 hover:text-white" /></button>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-400 mb-6">
                    Our process is designed to respect your time while ensuring technical excellence. We skip the generic HR screening and go straight to engineering discussions.
                  </p>
                  
                  {/* DIAGRAM TRIGGER */}
                  <div className="my-8 p-4 bg-black/30 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center text-center">
                     
                     <p className="text-xs text-slate-500 mt-2 font-mono">Figure 1.1: Standard Execution Pipeline</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-8">
                     <div className="p-4 bg-white/5 rounded border border-white/10">
                        <div className="text-purple-400 font-bold mb-1">01. Async Code</div>
                        <p className="text-xs text-slate-400">Show us your code, not just your CV. We review GitHub/Portfolios first.</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded border border-white/10">
                        <div className="text-blue-400 font-bold mb-1">02. System Design</div>
                        <p className="text-xs text-slate-400">Whiteboarding session. No "reverse a linked list" tricks. Real problems.</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded border border-white/10">
                        <div className="text-green-400 font-bold mb-1">03. The Offer</div>
                        <p className="text-xs text-slate-400">We move fast. Decisions made within 24 hours of final interview.</p>
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- JOB GRID --- */}
        <div className="grid gap-6">
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
             <h4 className="text-white font-bold mb-1">Don't see your role?</h4>
             <p className="text-slate-500 text-sm">We are always scanning for outliers.</p>
           </div>
           <a href="mailto:careers@bezalel.com" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors border-b border-transparent hover:border-purple-500 pb-0.5">
              Initiate Cold Contact <ArrowUpRight className="w-4 h-4" />
           </a>
        </div>

      </div>
    </main>
  );
}

// =====================
// JOB CARD COMPONENT
// =====================

function JobCard({ job, index }: { job: Job, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="flex items-center gap-3 text-xs font-mono font-medium tracking-wide">
            <span className={`px-2 py-0.5 rounded ${
              job.department === 'Engineering' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'
            }`}>
              {job.department}
            </span>
            <span className="text-slate-500 flex items-center gap-1">
               <Globe className="w-3 h-3" /> {job.location}
            </span>
            {job.salaryRange && (
               <span className="text-emerald-400 hidden sm:inline-block">
                 {job.salaryRange}
               </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
            {job.title}
          </h3>
        </div>

        {/* TECH STACK PREVIEW (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
           {job.stack.slice(0, 3).map((tech) => (
             <span key={tech} className="px-2 py-1 rounded bg-black border border-white/10 text-xs text-slate-400 font-mono">
                {tech}
             </span>
           ))}
           {job.stack.length > 3 && <span className="text-xs text-slate-600">+{job.stack.length - 3}</span>}
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
                   <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-purple-500" /> Mission Brief
                   </h4>
                   <p className="text-slate-400 leading-relaxed text-lg">
                      {job.description}
                   </p>
                </div>
                <div>
                   <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-500" /> Core Requirements
                   </h4>
                   <ul className="space-y-2">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-400">
                          <span className="mt-2 w-1 h-1 bg-purple-500 rounded-full" />
                          {req}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>

              {/* Right: Stack & Apply */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-fit">
                <div className="mb-6">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tech Stack</h4>
                   <div className="flex flex-wrap gap-2">
                      {job.stack.map((t) => (
                        <span key={t} className="px-2 py-1 bg-black rounded border border-white/10 text-xs text-slate-300">
                          {t}
                        </span>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                   <a 
                     href={`mailto:careers@bezalel.com?subject=Application: ${job.title}`}
                     className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors"
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
                <p className="text-[10px] text-slate-600 mt-4 text-center">
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