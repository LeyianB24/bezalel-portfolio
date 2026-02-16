// app/studio/logic/page.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BrainCircuit, Zap, ShieldCheck, GitCommit, Terminal, Cpu } from "lucide-react";

// ====================
// DATA
// ====================

const LOGIC_GATES = [
  {
    id: "01",
    icon: <BrainCircuit className="w-6 h-6" />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    title: "First Principles",
    subtitle: "DECONSTRUCTION_MODE",
    desc: "We ignore templates. We strip your business problem down to its fundamental mathematical truths and rebuild it from the ground up. It’s not about what competitors do; it’s about what physics allows.",
    stat: "Depth: 100%"
  },
  {
    id: "02",
    icon: <Zap className="w-6 h-6" />,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    title: "Performance by Default",
    subtitle: "LATENCY_ELIMINATION",
    desc: "Speed is a feature. We engineer systems that load in milliseconds, creating a perception of instantaneity. We respect your user's dopamine receptors.",
    stat: "Speed: <50ms"
  },
  {
    id: "03",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    title: "Anti-Fragile Robustness",
    subtitle: "REDUNDANCY_CHECK",
    desc: "We assume failure is inevitable. Our systems are designed to be self-healing and redundant. When the unexpected happens, the system doesn't crash—it adapts.",
    stat: "Uptime: 99.99%"
  }
];

// ====================
// COMPONENT
// ====================

export default function TheLogic() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll for the connecting line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main ref={containerRef} className="min-h-[200vh] bg-background relative overflow-hidden">
      
      {/* --- BACKGROUND GRID --- */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- LEFT COLUMN: STICKY HEADER --- */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-purple-500 uppercase">
                    System Architecture
                  </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.85]">
                  THE <br/> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 animate-gradient-x">
                    LOGIC
                  </span>.
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  Software is not just code; it is <strong className="text-foreground">crystallized thought</strong>. 
                  We believe that complexity is a tax on velocity, and bad code is a liability that compounds interest daily.
                </p>

                {/* Decorative Terminal Box */}
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 font-mono text-xs text-muted-foreground">
                  <div className="flex justify-between border-b border-border/50 pb-2 mb-2">
                    <span>KERNEL_LOG</span>
                    <span>v2.0.4</span>
                  </div>
                  <div className="space-y-1 opacity-70">
                    <p>&gt; Initiating logic sequence...</p>
                    <p>&gt; Optimization protocols: ACTIVE</p>
                    <p>&gt; Complexity reduction: ENABLED</p>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: THE CIRCUIT --- */}
          <div className="lg:col-span-7 relative pl-0 lg:pl-12">
            
            {/* The Connecting Line */}
            <div className="absolute left-0 lg:left-12 top-4 bottom-0 w-px bg-border/50 hidden lg:block">
               <motion.div 
                 style={{ height: lineHeight }}
                 className="w-full bg-purple-500 origin-top shadow-[0_0_10px_rgba(168,85,247,0.5)]"
               />
            </div>

            <div className="space-y-24 lg:space-y-32">
              {LOGIC_GATES.map((gate, idx) => (
                <LogicNode key={idx} gate={gate} index={idx} />
              ))}
              
              {/* Diagram Trigger: Placing it after the architecture points */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative lg:ml-12 p-8 border border-dashed border-border rounded-xl bg-secondary/10 flex flex-col items-center text-center"
              >
                  <Cpu className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground font-mono mb-4">
                      VISUALIZING THE ARCHITECTURE
                  </p>
                  
                  

                  <p className="mt-4 text-xs text-muted-foreground max-w-md mx-auto">
                      Whether Microservices or Monolith, the pattern must match the problem.
                  </p>
              </motion.div>
            </div>

          </div>
        </div>

        {/* --- FOOTER QUOTE --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-40 text-center max-w-3xl mx-auto"
        >
          <GitCommit className="w-8 h-8 mx-auto text-purple-500 mb-6" />
          <blockquote className="text-3xl md:text-5xl font-serif italic text-foreground leading-tight">
            "Simplicity is the ultimate sophistication."
          </blockquote>
          <cite className="block mt-8 text-xs font-mono text-purple-500 uppercase tracking-widest">
            — Leonardo da Vinci
          </cite>
        </motion.div>

      </div>
    </main>
  );
}

// ====================
// SUB-COMPONENT
// ====================

function LogicNode({ gate, index }: { gate: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative lg:ml-12 group"
    >
      {/* Connector Dot (Desktop Only) */}
      <div className="absolute -left-[53px] top-10 w-3 h-3 rounded-full border-2 border-background bg-border z-10 hidden lg:block group-hover:bg-purple-500 group-hover:scale-125 transition-all duration-300" />

      <div className={`relative overflow-hidden rounded-3xl border bg-background/50 backdrop-blur-sm p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 ${gate.border}`}>
        
        {/* Hover Gradient Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent via-transparent to-${gate.color.split('-')[1]}-500/5`} />

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl ${gate.bg} ${gate.color} ring-1 ring-inset ring-black/5`}>
            {gate.icon}
          </div>
          <span className="font-mono text-4xl font-black text-secondary-foreground/20 group-hover:text-foreground/20 transition-colors">
            {gate.id}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-foreground mb-1">{gate.title}</h3>
          <p className="text-[10px] font-mono text-purple-500 uppercase tracking-wider mb-4">
            // {gate.subtitle}
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            {gate.desc}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-6 border-t border-border/50 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Terminal className="w-3 h-3" />
                <span>Sys_Check</span>
            </div>
            <div className={`${gate.color} font-bold`}>
                {gate.stat}
            </div>
        </div>

      </div>
    </motion.div>
  );
}