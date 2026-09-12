"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, Globe, ArrowRight, Database, LayoutTemplate,
  Lock, Zap, Code2, Smartphone, Terminal, ShieldCheck, Activity
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { jellyPresets } from "@/lib/jelly-springs";

const capabilities = [
  {
    title: "Operations & Admin Dashboards",
    description: "Internal tools for transactions, approvals, customer records, and real-time operational telemetry.",
    proof: "Designed for low cognitive load and fast daily operations.",
    icon: LayoutTemplate,
    accent: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    title: "Member & Customer Portals",
    description: "Self-service portals with secure authentication, statement downloads, and request workflows.",
    proof: "Built around clear access controls and data protection compliance.",
    icon: Lock,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    title: "Database & Backend Systems",
    description: "Relational database modeling with PostgreSQL, automated backups, and audited schema migrations.",
    proof: "Ensures data integrity for transactions and customer accounts.",
    icon: Database,
    accent: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "High-Availability Web Platforms",
    description: "Fast, accessible web systems deployed on resilient cloud networks with sub-second page loads worldwide.",
    proof: "Optimized for search visibility, speed, and responsive fluidity across all screen sizes.",
    icon: Globe,
    accent: "text-[#C9A24B]",
    bg: "bg-[#C9A24B]/10",
    border: "border-[#C9A24B]/20",
  },
];

const standards = [
  "Strict TypeScript typing and clean modular architecture",
  "Role-based access control and encrypted session management",
  "Automated database migrations and transactional safety",
  "Multi-region low-latency CDN and responsive performance across global networks",
];

export default function WebSystemsPage() {
  return (
    <PageLayout variant="subtle">
      <main className="min-h-screen pt-24 xs:pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-x-clip">
        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8">
          
          {/* Header & Terminal Hero Grid */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16 sm:mb-24 pb-12 sm:pb-16 border-b border-border">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={jellyPresets.soft}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Scalable Systems Architecture
              </div>
              
              <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground text-balance">
                Web Systems & Enterprise Platforms
              </h1>
              
              <p className="mt-4 sm:mt-6 max-w-2xl text-xs sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
                We design, build, and maintain custom web platforms and portals for organizations worldwide. From internal workflow tools to high-traffic customer platforms with multi-currency support, our systems are built for long-term reliability and effortless global scaling.
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/60 border border-border text-foreground">
                  <Zap className="h-3.5 w-3.5 text-accent" />
                  <span>Sub-100ms TTFB</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/60 border border-border text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>SOC2 & RBAC Ready</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/60 border border-border text-foreground">
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                  <span>Global Edge CDN</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Live Terminal Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...jellyPresets.bubble, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="rounded-xl bg-[#090D14] border border-border/80 shadow-2xl overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-3 bg-[#111722] border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="text-white/50 text-[11px] flex items-center gap-1.5">
                    <Terminal className="w-3 h-3" /> deploy.sh — production
                  </div>
                </div>
                <div className="p-4 sm:p-5 h-[280px] overflow-hidden">
                  <TypewriterEffect />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Architecture Diagram & Performance Section */}
          <div className="mb-16 sm:mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border">
              <div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light mb-1">
                  Distributed Topology
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Interactive Node Architecture
                </h2>
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-2 md:mt-0">
                LIVE TRAFFIC & PACKET ROUTING
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Architecture SVG Canvas */}
              <div className="lg:col-span-7 h-[380px] xs:h-[420px] sm:h-[460px] rounded-2xl border border-border bg-card/60 backdrop-blur-sm relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background/60 to-background/90" />
                <ArchitectureDiagram />
              </div>

              {/* Performance Metrics */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 mb-2">
                    <Activity className="h-4 w-4" />
                    <span>Lighthouse & Runtime Telemetry</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                    Speed as an architectural constant.
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                    We eliminate sluggish render cycles with static generation (SSG), incremental cache invalidation, and server components so pages load instantly on any network tier.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <MetricBar label="Core Web Vitals & Performance" value={99} color="bg-emerald-500" delay={0.1} />
                  <MetricBar label="SEO & Metadata Indexing" value={100} color="bg-blue-500" delay={0.2} />
                  <MetricBar label="Accessibility & Color Contrast" value={100} color="bg-purple-500" delay={0.3} />
                  <MetricBar label="Server Response Time (TTFB)" value={98} color="bg-[#C9A24B]" delay={0.4} />
                </div>
              </div>
            </div>
          </div>

          {/* Core Capabilities */}
          <div className="mb-16 sm:mb-24">
            <h2 className="mb-6 sm:mb-8 font-display text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              What We Deliver
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {capabilities.map(({ title, description, proof, icon: Icon, accent, bg, border }) => (
                <motion.div 
                  key={title}
                  whileHover={{ y: -4 }}
                  transition={jellyPresets.snap}
                  className={`rounded-xl border ${border} bg-card p-5 xs:p-6 sm:p-8 shadow-xs relative overflow-hidden group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${bg} ${accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      Production Ready
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <p className="mt-4 border-t border-border pt-3 text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {proof}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technical Standards */}
          <div className="mb-16 sm:mb-24 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-2 sm:mb-3 text-[10px] xs:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                  Engineering Quality
                </p>
                <h2 className="font-display text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Built to be handed over cleanly.
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Every project includes comprehensive OpenAPI documentation, environment configuration scripts, automated CI/CD pipelines, and team training so your organization remains fully empowered.
                </p>
              </div>

              <div className="space-y-3">
                {standards.map((standard) => (
                  <div key={standard} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3.5 sm:p-4">
                    <CheckCircle2 className="mt-0.5 h-4 sm:h-5 w-4 sm:w-5 shrink-0 text-accent-dark dark:text-accent-light" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conversion CTA */}
          <div className="rounded-2xl border border-border bg-primary p-8 sm:p-12 text-primary-foreground shadow-lg">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-black">
                  Planning a web system or internal portal?
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-primary-foreground/75 sm:text-base max-w-xl">
                  Share your requirements and current operations. We will analyze your architecture and reply with a realistic scoping assessment.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/projects/request"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-xs sm:text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light"
                >
                  Configure Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-white/20"
                >
                  Contact Desk
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </PageLayout>
  );
}

// ============================================
// ANIMATED SUB-COMPONENTS
// ============================================

function MetricBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground">{value}/100</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}

const allLines = [
  "> npm install @bezalel/core-systems",
  "> [wait] Resolving enterprise dependencies...",
  "> git push origin production --release",
  "> Verifying strict TypeScript schemas...",
  "> Optimizing responsive asset bundles...",
  "> Generating static pages (SSG) & routes...",
  "> Initializing distributed Edge Functions...",
  "> Deploying to global Cloud CDN (Nairobi / London / Ashburn)...",
  "> [wait] Propagating DNS & SSL certs...",
  "> Edge ping established: 12ms",
  "> SUCCESS: Production deployment healthy & active."
];

function TypewriterEffect() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedLines((prev) => {
        if (prev.length < allLines.length) {
          return [...prev, allLines[prev.length]];
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedLines]);

  return (
    <div className="space-y-1.5 font-mono text-[11px] sm:text-xs">
      {displayedLines.map((line, i) => (
        <div 
          key={i} 
          className={
            line.includes("SUCCESS") ? "text-emerald-400 font-bold" : 
            line.includes("wait") ? "text-amber-400/90" : 
            "text-slate-300"
          }
        >
          {line.replace("[wait] ", "")}
        </div>
      ))}
      <div ref={scrollRef} />
      <motion.span 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="w-1.5 h-3.5 bg-accent inline-block align-middle ml-1" 
      />
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 xs:p-6 sm:p-8">
      {/* SVG Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#C9A24B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C9A24B" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
      </svg>

      {/* Moving Packets */}
      <motion.div 
        animate={{ y: [-130, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] z-10"
      />
      <motion.div 
        animate={{ y: [130, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 1.1 }}
        className="absolute w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#a855f7] z-10"
      />
      <motion.div 
        animate={{ x: [-130, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear", delay: 0.6 }}
        className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] z-10"
      />
      <motion.div 
        animate={{ x: [0, 130], opacity: [1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        className="absolute w-2 h-2 bg-[#C9A24B] rounded-full shadow-[0_0_10px_#C9A24B] z-10"
      />

      {/* Center Core Node */}
      <motion.div 
        animate={{ boxShadow: ["0 0 15px rgba(201,162,75,0.2)", "0 0 30px rgba(201,162,75,0.45)", "0 0 15px rgba(201,162,75,0.2)"] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-card border-2 border-[#C9A24B] flex flex-col items-center justify-center text-center shadow-md"
      >
        <Code2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#C9A24B] mb-1" />
        <div className="font-bold text-xs sm:text-sm text-foreground">Core Logic</div>
        <div className="text-[9px] text-muted-foreground font-mono">NEXT.JS 16</div>
      </motion.div>

      {/* Top Node (CDN / Edge) */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-card border border-blue-500/50 flex items-center justify-center shadow-xs">
          <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
        </div>
        <span className="text-[10px] font-mono text-blue-400 mt-1 bg-blue-500/10 px-2 py-0.5 rounded">
          CDN / EDGE
        </span>
      </div>

      {/* Bottom Node (Database) */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <span className="text-[10px] font-mono text-purple-400 mb-1 bg-purple-500/10 px-2 py-0.5 rounded">
          POSTGRES / DB
        </span>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-card border border-purple-500/50 flex items-center justify-center shadow-xs">
          <Database className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
        </div>
      </div>

      {/* Left Node (Security & Auth) */}
      <div className="absolute left-[4%] sm:left-[8%] top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-card border border-emerald-500/50 flex items-center justify-center shadow-xs">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
        </div>
        <span className="text-[9px] font-mono text-emerald-400 mt-1">AUTH / RBAC</span>
      </div>

      {/* Right Node (Client / PWA) */}
      <div className="absolute right-[4%] sm:right-[8%] top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-card border border-border flex items-center justify-center shadow-xs">
          <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </div>
        <span className="text-[9px] font-mono text-muted-foreground mt-1">CLIENT APP</span>
      </div>
    </div>
  );
}
