// app/studio/process/page.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, MotionValue } from "framer-motion";
import { 
  Search, PenTool, Code2, Rocket, RefreshCw, 
  Cpu, FileJson, Server, CheckCircle2,
  Terminal, Activity
} from "lucide-react";

const steps = [
  {
    id: "01",
    phase: "INIT_SEQUENCE",
    title: "Discovery & Deconstruction",
    desc: "We don't start coding immediately. We rip apart your business logic, map out edge cases, and define the 'Unfair Advantage'.",
    icon: <Search className="w-6 h-6" />,
    inputs: ["Stakeholder Interviews", "Market Analysis", "Legacy Audit"],
    outputs: ["Technical Spec (PDF)", "User Journey Maps", "MVP Scope"],
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    id: "02",
    phase: "ARCH_DESIGN",
    title: "Blueprinting & Schematics",
    desc: "Architecture before art. We design database schemas, API contracts, and user flows to validate feasibility.",
    icon: <PenTool className="w-6 h-6" />,
    inputs: ["Feature Requirements", "Brand Guidelines"],
    outputs: ["Figma Prototypes", "DB Schema (ERD)", "API Swagger Doc"],
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    id: "03",
    phase: "CORE_FABRICATION",
    title: "The Build Cycles",
    desc: "Iterative development sprints. You get testable builds every week. We use strict typing and automated testing.",
    icon: <Code2 className="w-6 h-6" />,
    inputs: ["Approved Designs", "API Contracts"],
    outputs: ["Weekly Builds", "Unit Test Reports", "Staging Envir."],
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    id: "04",
    phase: "DEPLOYMENT",
    title: "Production Launch",
    desc: "We set up CI/CD pipelines. The system goes live on high-availability infrastructure with zero downtime strategies.",
    icon: <Rocket className="w-6 h-6" />,
    inputs: ["UAT Approval", "Domain Config"],
    outputs: ["Live Production URL", "Admin Credentials", "Source Code"],
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20"
  },
  {
    id: "05",
    phase: "MAINTENANCE",
    title: "Telemetry & Iteration",
    desc: "Software is living. We monitor performance, patch security updates, and scale resources as user base grows.",
    icon: <RefreshCw className="w-6 h-6" />,
    inputs: ["User Feedback", "Error Logs"],
    outputs: ["Monthly Health Reports", "Feature Patches", "Scale Auto-Scaling"],
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20"
  }
];

export default function ProcessPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="min-h-screen bg-black text-slate-200 selection:bg-purple-500/30 font-sans">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-40 relative" ref={containerRef}>
        
        {/* --- HEADER --- */}
        <div className="mb-32 relative z-10">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-800 bg-slate-900/50 text-xs font-mono text-purple-400 mb-6"
           >
             <Terminal className="w-3 h-3" />
             <span>EXECUTION_PROTOCOL_V2.0</span>
           </motion.div>
           
           <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6">
             HOW WE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">ENGINEER.</span>
           </h1>
           <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
             We reject chaotic creative processes. We build software using a deterministic, military-grade engineering pipeline designed for predictability and scale.
           </p>
        </div>

        <div className="flex gap-12 lg:gap-24 relative">
          
          {/* --- LEFT: THE PROGRESS BEAM --- */}
          <div className="hidden md:block w-24 flex-shrink-0 relative">
             {/* The Track */}
             <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-slate-800" />
             
             {/* The Fill Beam */}
             <motion.div 
               style={{ scaleY, originY: 0 }}
               className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
             />
          </div>

          {/* --- MIDDLE: THE STEPS --- */}
          <div className="flex-1 space-y-32 relative z-10">
            {steps.map((step, idx) => (
               <ProcessCard key={step.id} step={step} index={idx} />
            ))}
          </div>

          {/* --- RIGHT: STICKY HUD (Desktop Only) --- */}
          <div className="hidden xl:block w-80 relative">
             <div className="sticky top-32">
                <StatusMonitor scrollYProgress={scrollYProgress} />
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}

// --- SUB COMPONENTS ---

function ProcessCard({ step, index }: { step: any, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      className="group relative"
    >
       {/* Mobile Connector Line */}
       <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-slate-800 -ml-3" />

       {/* Step Number Badge */}
       <div className="absolute -left-3 md:-left-[6.5rem] top-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-slate-800 flex items-center justify-center font-mono font-bold text-slate-500 group-hover:text-white group-hover:border-slate-600 transition-colors shadow-xl z-20">
             {step.id}
          </div>
          {/* Connector Dot */}
          <div className="hidden md:block absolute left-12 top-6 w-8 h-px bg-slate-800 group-hover:bg-slate-600 transition-colors" />
       </div>

       {/* Card Content */}
       <div className="bg-[#0a0a0a] border border-slate-800 hover:border-slate-700 p-8 rounded-2xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-900/10">
          
          <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
             <div className={`p-4 rounded-xl ${step.bg} ${step.color} border ${step.border}`}>
                {step.icon}
             </div>
             <div>
                <div className={`text-xs font-mono ${step.color} mb-2 tracking-widest uppercase`}>
                   // {step.phase}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                   {step.desc}
                </p>
             </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="grid md:grid-cols-2 gap-4 pt-8 border-t border-slate-900">
             {/* Inputs */}
             <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800/50">
                <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs font-mono uppercase tracking-wider">
                   <FileJson className="w-3 h-3" /> Input Parameters
                </div>
                <ul className="space-y-2">
                   {step.inputs.map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                         <div className="w-1 h-1 rounded-full bg-slate-600" />
                         {item}
                      </li>
                   ))}
                </ul>
             </div>

             {/* Outputs */}
             <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800/50">
                <div className="flex items-center gap-2 mb-3 text-emerald-500 text-xs font-mono uppercase tracking-wider">
                   <Server className="w-3 h-3" /> System Output
                </div>
                <ul className="space-y-2">
                   {step.outputs.map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-200 font-medium">
                         <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                         {item}
                      </li>
                   ))}
                </ul>
             </div>
          </div>

       </div>
    </motion.div>
  );
}

function StatusMonitor({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
   const [pct, setPct] = useState(0);
   
   // FIX: Removed useTransform here to prevent infinite re-render loop.
   // We use useEffect to bridge the MotionValue to React State safely.
   useEffect(() => {
      const unsubscribe = scrollYProgress.on("change", (v) => {
         setPct(Math.min(100, Math.max(0, Math.round(v * 100))));
      });
      return () => unsubscribe();
   }, [scrollYProgress]);

   return (
      <div className="bg-[#050505] border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
         <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400">RUNTIME_MONITOR</span>
            <div className="flex gap-1.5">
               <div className="w-2 h-2 rounded-full bg-red-500/20" />
               <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
               <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
         </div>
         
         <div className="p-5 font-mono space-y-4">
            {/* Progress Bar */}
            <div>
               <div className="flex justify-between text-xs mb-1 text-slate-500">
                  <span>COMPLETION</span>
                  <span>{pct}%</span>
               </div>
               <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-purple-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }} 
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  />
               </div>
            </div>

            {/* Simulated System Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
               <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block mb-1">MEMORY</span>
                  <span className="text-green-400">64.2 MB</span>
               </div>
               <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block mb-1">LATENCY</span>
                  <span className="text-green-400">12ms</span>
               </div>
            </div>

            {/* Active Processes List */}
            <div className="pt-2 border-t border-slate-800">
               <p className="text-[10px] text-slate-500 mb-2">ACTIVE THREADS</p>
               <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className={`flex items-center gap-2 ${pct > 0 ? 'text-blue-400' : ''}`}>
                     <Activity className="w-3 h-3" /> Discovery
                     {pct > 0 && <span className="ml-auto">DONE</span>}
                  </li>
                  <li className={`flex items-center gap-2 ${pct > 25 ? 'text-purple-400' : ''}`}>
                     <Cpu className="w-3 h-3" /> Architecture
                     {pct > 25 && <span className="ml-auto">DONE</span>}
                  </li>
                  <li className={`flex items-center gap-2 ${pct > 50 ? 'text-amber-400' : ''}`}>
                     <Code2 className="w-3 h-3" /> Fabrication
                     {pct > 50 && <span className="ml-auto">DONE</span>}
                  </li>
                  <li className={`flex items-center gap-2 ${pct > 75 ? 'text-green-400' : ''}`}>
                     <Rocket className="w-3 h-3" /> Deployment
                     {pct > 75 && <span className="ml-auto">DONE</span>}
                  </li>
               </ul>
            </div>
         </div>
      </div>
   )
}