/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/pages/ApiServicesPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Network, Lock, Database, ArrowRightLeft, 
  Terminal, Server, ShieldCheck, Zap, Activity,
  Globe, Cpu, Code2, Copy, Check
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { jellyPresets } from "@/lib/jelly-springs";

export default function ApiServicesPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <PageLayout variant="vibrant">
      <main ref={containerRef} className="min-h-screen pt-32 pb-20 overflow-x-hidden selection:bg-accent/30">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* --- SECTION 1: HERO & METRICS --- */}
          <div className="flex flex-col items-center text-center mb-32 relative">
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={jellyPresets.soft}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/30 border border-accent/30 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(201,162,75,0.2)]"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span className="text-xs font-mono text-accent-light tracking-widest uppercase">System Status: Operational</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...jellyPresets.soft, duration: 0.8 }}
              className="text-6xl md:text-8xl font-black text-foreground mb-6 tracking-tighter leading-[0.9] relative z-20"
            >
              DIGITAL <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-light to-cream animate-gradient-x">
                 NERVOUS SYSTEM.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12"
            >
              Siloed systems are dead. We engineer the high-throughput neural pathways that allow your Fintech, CRM, and Mobile infrastructure to communicate in real-time.
            </motion.p>

            {/* --- INTERACTIVE VISUALIZER (Replaces static image) --- */}
            <div className="w-full max-w-4xl h-[400px] mb-16 relative">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10 pointer-events-none" />
               <InteractiveArchitecture />
            </div>

            {/* --- LIVE TERMINAL --- */}
            <LiveTrafficTerminal />
          </div>

          {/* --- SECTION 2: PROTOCOL SHARDS --- */}
          <div className="mb-32">
             <div className="flex items-center gap-4 mb-12">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border"></div>
                <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Protocol Capabilities
                </h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border"></div>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TechShard 
                title="REST & GraphQL" 
                subtitle="Endpoint Architecture"
                desc="Adaptive schemas designed for developer happiness and reduced bandwidth usage."
                icon={<ArrowRightLeft />} 
                delay={0}
              />
              <TechShard 
                title="Fintech Gateways" 
                subtitle="Stripe / M-Pesa"
                desc="We handle complex handshakes, IPN callbacks, and idempotent transactions securely."
                icon={<Database />} 
                delay={0.1}
              />
              <TechShard 
                title="Military Grade" 
                subtitle="OAuth2 / JWT"
                desc="Rate limiting, IP whitelisting, and rotating encryption keys to prevent abuse."
                icon={<ShieldCheck />} 
                delay={0.2}
              />
              <TechShard 
                title="Legacy Bridging" 
                subtitle="SOAP Wrapper"
                desc="We wrap ancient XML systems in modern JSON shells to modernize without rewriting."
                icon={<Server />} 
                delay={0.3}
              />
            </div>
          </div>

          {/* --- SECTION 3: CODE INFRASTRUCTURE --- */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="order-2 lg:order-1">
                <IDEWindow />
             </div>

             <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-primary/20 rounded-lg border border-accent/20">
                     <Activity className="w-6 h-6 text-accent" />
                   </div>
                   <span className="text-accent font-mono text-sm font-bold">HIGH PERFORMANCE</span>
                </div>
                
                <h3 className="text-4xl font-bold text-foreground mb-6">Built for Scale.</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Our APIs aren't just endpoints; they are logic engines. We bake in validation, caching, and error handling at the edge, ensuring your core logic stays clean and your response times stay low.
                </p>
                
                <ul className="grid grid-cols-1 gap-4">
                   <FeatureItem text="99.99% Uptime SLA Guarantee" delay={0.1} />
                   <FeatureItem text="< 50ms Global Average Latency" delay={0.2} />
                   <FeatureItem text="Automated Swagger/OpenAPI Docs" delay={0.3} />
                   <FeatureItem text="Real-time Webhook Event Streams" delay={0.4} />
                </ul>
             </div>
          </div>

        </div>
      </main>
    </PageLayout>
  );
}

// ============================================
// COMPLEX SUB-COMPONENTS
// ============================================

/* --- 1. Interactive Architecture Diagram (SVG + Motion) --- */
function InteractiveArchitecture() {
  return (
    <div className="w-full h-full bg-slate-900/20 border border-slate-800/50 rounded-3xl backdrop-blur-sm overflow-hidden relative flex items-center justify-center">
       {/* Central Hub */}
       <div className="absolute inset-0">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Connection Lines */}
            <motion.path 
              d="M 500 200 L 200 100" stroke="url(#grad1)" strokeWidth="2" fill="none" 
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path 
              d="M 500 200 L 800 100" stroke="url(#grad1)" strokeWidth="2" fill="none" 
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
            />
             <motion.path 
              d="M 500 200 L 500 350" stroke="url(#grad1)" strokeWidth="2" fill="none" 
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1, repeat: Infinity }}
            />
          </svg>
       </div>

       {/* Nodes */}
       <div className="relative z-10 w-24 h-24 bg-navy-deep border-2 border-accent rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(201,162,75,0.3)]">
          <Network className="text-accent-light w-10 h-10 animate-pulse" />
          <div className="absolute -bottom-8 text-xs font-mono text-accent font-bold">API GATEWAY</div>
       </div>

       {/* Satellites */}
       <motion.div 
         animate={{ y: [0, -10, 0] }} 
         transition={{ duration: 4, repeat: Infinity }}
         className="absolute top-10 left-[10%] md:left-[20%] p-4 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center gap-2"
       >
          <Lock className="text-muted-steel w-6 h-6" />
          <span className="text-[10px] text-slate-400 font-mono">AUTH SERVICE</span>
       </motion.div>

       <motion.div 
         animate={{ y: [0, 10, 0] }} 
         transition={{ duration: 5, repeat: Infinity }}
         className="absolute top-10 right-[10%] md:right-[20%] p-4 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center gap-2"
       >
          <Globe className="text-accent w-6 h-6" />
          <span className="text-[10px] text-slate-400 font-mono">CDN EDGE</span>
       </motion.div>

       <motion.div 
         animate={{ y: [0, -5, 0] }} 
         transition={{ duration: 3, repeat: Infinity }}
         className="absolute bottom-10 p-4 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center gap-2"
       >
          <Database className="text-accent-dark w-6 h-6" />
          <span className="text-[10px] text-slate-400 font-mono">PRIMARY DB</span>
       </motion.div>
    </div>
  )
}

/* --- 2. Enhanced Terminal --- */
function LiveTrafficTerminal() {
   const [logs, setLogs] = useState<string[]>([]);
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
     const methods = ["POST", "GET", "PUT", "DELETE"];
     const paths = ["/api/v1/checkout", "/auth/login", "/user/data", "/webhook/stripe", "/system/health"];
     const codes = [200, 201, 200, 200, 200, 200, 429, 500];

     const interval = setInterval(() => {
        const method = methods[Math.floor(Math.random() * methods.length)];
        const path = paths[Math.floor(Math.random() * paths.length)];
        const code = codes[Math.floor(Math.random() * codes.length)];
        const ms = Math.floor(Math.random() * 200) + 20;
        const time = new Date().toISOString().split('T')[1].slice(0,8);

        const log = `${time} | ${method.padEnd(6)} | ${code} | ${ms}ms | ${path}`;
        setLogs(prev => [...prev.slice(-7), log]);
     }, 800);

     return () => clearInterval(interval);
   }, []);

   return (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden bg-[#0a0a0a] border border-slate-800 shadow-2xl font-mono text-xs md:text-sm"
      >
        <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-slate-800">
           <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/50" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
             <div className="w-3 h-3 rounded-full bg-green-500/50" />
           </div>
           <div className="text-slate-500 flex items-center gap-2">
             <Terminal className="w-3 h-3" /> bash — tail -f access.log
           </div>
        </div>
        <div className="p-4 h-64 overflow-hidden relative">
           <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
           <div className="flex flex-col justify-end h-full space-y-2">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-slate-600">{">"}</span>
                    <span className={
                       log.includes("200") || log.includes("201") ? "text-accent-light" :
                       log.includes("429") ? "text-yellow-400" :
                       log.includes("500") ? "text-red-400" : "text-slate-300"
                    }>
                       {log}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>
      </motion.div>
   )
}

/* --- 3. IDE Code Window --- */
function IDEWindow() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl overflow-hidden bg-[#0d1117] border border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
    >
       <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800">
          <div className="flex items-center gap-3">
             <Code2 className="w-4 h-4 text-accent" />
             <span className="text-xs text-slate-400 font-sans">middleware.ts</span>
          </div>
          <button 
            onClick={copyCode}
            className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1"
          >
             {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
             {copied ? "Copied" : "Copy"}
          </button>
       </div>
       <div className="p-6 overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed text-slate-300">
            <div className="flex"><span className="w-6 text-slate-700 select-none">1</span><span className="text-accent">import</span> {'{'} <span className="text-accent-light">NextRequest</span>, <span className="text-accent-light">NextResponse</span> {'}'} <span className="text-accent">from</span> <span className="text-green-300">'next/server'</span>;</div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">2</span></div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">3</span><span className="text-accent">export async function</span> <span className="text-ink">middleware</span>(req: <span className="text-accent-light">NextRequest</span>) {'{'}</div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">4</span>  <span className="text-slate-500">// 1. Edge Authentication</span></div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">5</span>  <span className="text-accent">const</span> token = req.headers.<span className="text-ink">get</span>(<span className="text-green-300">'Authorization'</span>);</div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">6</span>  <span className="text-accent">if</span> (!<span className="text-ink">verifyJWT</span>(token)) <span className="text-accent">return</span> <span className="text-accent-light">NextResponse</span>.<span className="text-ink">json</span>({'{'} error: <span className="text-green-300">'401'</span> {'}'});</div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">7</span></div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">8</span>  <span className="text-slate-500">// 2. Rate Limiting (Redis)</span></div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">9</span>  <span className="text-accent">const</span> ip = req.ip || <span className="text-green-300">'127.0.0.1'</span>;</div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">10</span> <span className="text-accent">const</span> rate = <span className="text-accent">await</span> redis.<span className="text-ink">incr</span>(<span className="text-green-300">`limit:$</span>{'{'}ip{'}'}<span className="text-green-300">`</span>);</div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">11</span></div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">12</span> <span className="text-accent">return</span> <span className="text-accent-light">NextResponse</span>.<span className="text-ink">next</span>();</div>
            <div className="flex"><span className="w-6 text-slate-700 select-none">13</span>{'}'}</div>
          </pre>
       </div>
    </motion.div>
  )
}

/* --- 4. Background & Utilities --- */

function TechShard({ title, subtitle, desc, icon, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 bg-slate-900/40 border border-slate-800 rounded-xl transition-all duration-300 group hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity duration-500 text-accent`}>
         <Zap className="w-12 h-12" />
      </div>
      
      <div className={`mb-4 p-3 w-fit rounded-lg bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-300 text-accent group-hover:border-accent/50`}>
         {icon}
      </div>
      
      <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">{subtitle}</div>
      <h3 className="font-bold text-xl text-slate-100 mb-3">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function FeatureItem({ text, delay }: { text: string, delay: number }) {
   return (
      <motion.li 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex items-center gap-3 text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50 hover:border-accent/30 transition-colors"
      >
         <div className="p-1 rounded bg-accent/10 text-accent">
            <Check className="w-4 h-4" />
         </div>
         {text}
      </motion.li>
   )
}
