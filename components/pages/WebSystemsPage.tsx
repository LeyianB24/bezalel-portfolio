/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/no-unescaped-entities */
// components/pages/WebSystemsPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  CheckCircle2, Server, Globe, Cpu, Terminal, 
  Zap, ShieldCheck, Layers, ArrowRight, Database, LayoutTemplate,
  Code2, Network, Lock, Smartphone
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function WebSystemsPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <PageLayout variant="vibrant">
      <main ref={containerRef} className="min-h-screen pt-32 pb-20 overflow-x-hidden selection:bg-purple-500/30 font-sans">
        
        {/* --- BACKGROUND AMBIENCE --- */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Technical Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] mask-image-gradient-b"></div>
          
          {/* Dynamic Orbs */}
          <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" 
          />
          <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* --- SECTION 1: HERO & TERMINAL --- */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-40">
            
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono mb-6 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                SYSTEMS ARCHITECTURE
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                SCALABLE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 animate-gradient-x">
                  ECOSYSTEMS.
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed mb-8 border-l-2 border-slate-800 pl-6">
                We engineer Progressive Web Applications (PWAs) that behave like native software. Blazing fast, offline-capable, and distributed across the globe via serverless edge networks.
              </p>

              <div className="flex flex-wrap gap-4">
                <Badge icon={<Zap className="w-4 h-4 text-amber-400"/>} text="Sub-100ms Latency" />
                <Badge icon={<ShieldCheck className="w-4 h-4 text-emerald-400"/>} text="SOC2 Compliant" />
                <Badge icon={<Globe className="w-4 h-4 text-blue-400"/>} text="Global CDN" />
              </div>
            </motion.div>

            {/* Interactive Terminal Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              {/* Glow behind terminal */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative rounded-xl bg-[#0d1117] border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-slate-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <div className="ml-auto md:ml-4 text-slate-500 text-[10px] flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> zsh — deploy.sh
                  </div>
                </div>
                
                {/* Terminal Body */}
                <div className="p-6 h-[320px] overflow-hidden bg-[#0d1117]">
                  <TypewriterEffect />
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- SECTION 2: THE STACK (Interactive Cards) --- */}
          <div className="mb-40">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-800 pb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">The Tech Stack</h2>
                <p className="text-slate-400">Our preferred architecture for high-scale applications.</p>
              </div>
              <div className="hidden md:block text-xs font-mono text-purple-400">
                // HOVER TO INSPECT
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <TechCard 
                icon={<LayoutTemplate className="text-blue-500" />}
                title="Frontend Core"
                subtitle="Next.js 14 / React"
                features={["Server Side Rendering", "React Server Components", "Tailwind CSS Architecture"]}
                delay={0}
              />
              <TechCard 
                icon={<Database className="text-purple-500" />}
                title="Data Layer"
                subtitle="PostgreSQL / Supabase"
                features={["Real-time Subscriptions", "Row Level Security", "Automated Backups"]}
                delay={0.1}
              />
              <TechCard 
                icon={<Cpu className="text-emerald-500" />}
                title="Edge Functions"
                subtitle="Vercel / Cloudflare"
                features={["Global Distribution", "0ms Cold Starts", "DDoS Protection"]}
                delay={0.2}
              />
            </div>
          </div>

          {/* --- SECTION 3: PERFORMANCE DIAGRAM (CUSTOM VISUALIZATION) --- */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* The Coded Diagram */}
            <div className="relative order-2 lg:order-1 h-[500px] flex items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#030712] to-[#030712]"></div>
              <ArchitectureDiagram />
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                   <Zap className="w-5 h-5 text-green-500" />
                 </div>
                 <span className="text-sm font-mono text-green-500 font-bold tracking-widest uppercase">Performance First</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Latency is the <br/>
                <span className="text-slate-500 line-through decoration-red-500/50 decoration-2">Enemy.</span>
              </h2>
              
              <p className="text-slate-400 mb-10 leading-relaxed text-lg">
                We assume users are impatient. Our systems are engineered to load the "First Contentful Paint" in under 1 second. We use Edge caching, optimistic UI updates, and predictive pre-fetching to make the web feel instant.
              </p>
              
              <div className="space-y-8">
                <MetricBar label="Lighthouse Performance Score" value={98} color="bg-green-500" delay={0} />
                <MetricBar label="SEO Optimization" value={100} color="bg-blue-500" delay={0.2} />
                <MetricBar label="Accessibility (A11y)" value={100} color="bg-purple-500" delay={0.4} />
              </div>
            </div>

          </div>

        </div>
      </main>
    </PageLayout>
  );
}

// ============================================
// SUB COMPONENTS
// ============================================

function Badge({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-800 transition-all cursor-default shadow-lg">
      {icon}
      {text}
    </div>
  );
}

function TechCard({ icon, title, subtitle, features, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-[#0d1117] border border-slate-800 hover:border-purple-500/30 transition-colors group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[4rem] pointer-events-none" />
      
      <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 w-fit group-hover:scale-110 group-hover:border-purple-500/30 transition-all duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <p className="text-purple-400 font-mono text-xs mb-6 uppercase tracking-wider">{subtitle}</p>
      
      <ul className="space-y-3 relative z-10">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-purple-500 transition-colors" />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function MetricBar({ label, value, color, delay }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium text-slate-300 mb-2 font-mono">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay }}
          className={`h-full ${color} shadow-[0_0_10px_currentColor]`} 
        />
      </div>
    </div>
  );
}

// --- FIXED TYPEWRITER EFFECT ---
function TypewriterEffect() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const allLines = [
    "> npm install dependencies...",
    "> [wait] Resolving packages...",
    "> git push origin production",
    "> Verifying architecture...",
    "> Optimizing assets...",
    "> Building static pages (SSG)...",
    "> Generating Edge Functions...",
    "> Deploying to Global CDN...",
    "> [wait] Propagating DNS...",
    "> Connection established: 12ms",
    "> SUCCESS: Deployment Active."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedLines((prev) => {
        if (prev.length < allLines.length) {
          return [...prev, allLines[prev.length]];
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedLines]);

  return (
    <div className="space-y-2 font-mono text-xs md:text-sm">
      {displayedLines.map((line, i) => (
        <div key={i} className={`${
            line?.includes("SUCCESS") ? 'text-green-400 font-bold' : 
            line?.includes("wait") ? 'text-yellow-500/70' :
            'text-slate-400'
        }`}>
          {line?.replace("[wait] ", "")}
        </div>
      ))}
      <div ref={scrollRef} />
      <motion.div 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="w-2 h-4 bg-purple-500 inline-block align-middle ml-1" 
      />
    </div>
  );
}

// ============================================
// ARCHITECTURE DIAGRAM (SVG + FRAMER MOTION)
// ============================================

function ArchitectureDiagram() {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-10">
            {/* SVG Layer for Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(147, 51, 234, 0.1)" />
                        <stop offset="50%" stopColor="rgba(147, 51, 234, 0.5)" />
                        <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
                    </linearGradient>
                </defs>
                {/* Lines connecting center to nodes */}
                <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="6 6" />
                <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="6 6" />
                <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="6 6" />
                <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="6 6" />
            </svg>

            {/* Moving Packets */}
            <motion.div 
                animate={{ y: [-150, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] z-10"
            />
             <motion.div 
                animate={{ y: [150, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#a855f7] z-10"
            />
            <motion.div 
                animate={{ x: [-150, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
                className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] z-10"
            />
            <motion.div 
                animate={{ x: [0, 150], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] z-10"
            />

            {/* --- NODES --- */}

            {/* Center Node (CORE) */}
            <motion.div 
                animate={{ boxShadow: ["0 0 20px rgba(147,51,234,0.3)", "0 0 40px rgba(147,51,234,0.6)", "0 0 20px rgba(147,51,234,0.3)"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute z-20 w-32 h-32 rounded-full bg-slate-950 border border-purple-500 flex flex-col items-center justify-center text-center"
            >
                <Code2 className="w-8 h-8 text-purple-400 mb-2" />
                <div className="text-white font-bold text-sm">Logic Core</div>
                <div className="text-[10px] text-purple-500 font-mono">NEXT.JS</div>
            </motion.div>

            {/* Top Node (CDN) */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                 <div className="w-16 h-16 rounded-xl bg-slate-900 border border-blue-500/50 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <Globe className="w-6 h-6 text-blue-400" />
                 </div>
                 <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">CDN / EDGE</span>
            </div>

            {/* Bottom Node (DB) */}
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                 <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded mb-2">DATABASE</span>
                 <div className="w-16 h-16 rounded-xl bg-slate-900 border border-purple-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <Database className="w-6 h-6 text-purple-400" />
                 </div>
            </div>

            {/* Left Node (Security) */}
            <div className="absolute left-[5%] md:left-[10%] top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-slate-900 border border-emerald-500/50 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Lock className="w-5 h-5 text-emerald-400" />
                 </div>
                 <span className="text-[10px] font-mono text-emerald-400">AUTH</span>
            </div>

            {/* Right Node (Client) */}
            <div className="absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center mb-2">
                    <Smartphone className="w-5 h-5 text-white" />
                 </div>
                 <span className="text-[10px] font-mono text-slate-400">CLIENT</span>
            </div>
        </div>
    );
}
