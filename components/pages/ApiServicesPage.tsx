"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, ArrowRightLeft, Server, ShieldCheck, ArrowRight, CheckCircle2,
  Network, Terminal, Activity, Globe, Lock, Copy, Check
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { jellyPresets } from "@/lib/jelly-springs";

const heroImages = [
  "/BG_images/data.avif",
  "/BG_images/codes people.jpg",
  "/BG_images/istockphoto-1483547670-170667a.jpg",
];

const apiFeatures = [
  {
    title: "Global Fintech & Payment Gateway Rails",
    description: "Robust integrations with Stripe, PayPal, M-Pesa Daraja STK, bank SWIFT/ACH/SEPA transfer rails, and automated reconciliation pipelines.",
    proof: "Built with idempotency keys, signature checks, and retry mechanisms to eliminate billing errors.",
    icon: Database,
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
  },
  {
    title: "REST & GraphQL Microservices",
    description: "Clean, documented API services with OpenAPI specifications, semantic versioning, and strict TypeScript schema validation.",
    proof: "Enables seamless cross-border mobile, web, and third-party integrations with zero guesswork.",
    icon: ArrowRightLeft,
    accent: "text-accent-dark dark:text-accent-light",
    bg: "bg-accent/10",
    border: "border-accent/25",
  },
  {
    title: "Authentication & Security Gateways",
    description: "Role-based access control (RBAC), OAuth2 / JWT lifecycle management, distributed rate limiting, and automated API key rotation.",
    proof: "Protects sensitive customer, financial, and organizational data from unauthorized access.",
    icon: ShieldCheck,
    accent: "text-[#C9A24B]",
    bg: "bg-[#C9A24B]/10",
    border: "border-[#C9A24B]/25",
  },
  {
    title: "Legacy & Cloud Systems Integration",
    description: "Middleware connectors that interface on-premise databases, ERPs, or proprietary systems with modern cloud APIs.",
    proof: "Modernize operational workflows with zero risky rip-and-replace overhauls.",
    icon: Server,
    accent: "text-accent-dark dark:text-accent-light",
    bg: "bg-accent/10",
    border: "border-accent/25",
  },
];

const apiStandards = [
  "Comprehensive OpenAPI / Swagger specification documentation",
  "Automated rate-limiting and DDoS mitigation at the global edge",
  "Centralized logging, distributed tracing, and latency alerting",
  "High-availability clustering with 99.9% uptime SLA capability",
];

export default function ApiServicesPage() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((c) => (c + 1) % heroImages.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <PageLayout variant="subtle">
      {/* ── Full-bleed Hero with Ken Burns Background ── */}
      <section className="relative overflow-hidden bg-[#050D17] text-white pt-24 xs:pt-28 sm:pt-36 pb-16 sm:pb-24">
        {/* Ken Burns background */}
        <AnimatePresence initial={false}>
          <motion.img
            key={heroImages[activeImage]}
            src={heroImages[activeImage]}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 0.18, scale: 1.06 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          />
        </AnimatePresence>
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(201,162,75,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,162,75,0.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Atmospheric gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, rgba(5,13,23,0.88) 55%, rgba(5,13,23,0.99) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="mb-0 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={jellyPresets.soft}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono mb-4 shadow-xs backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold tracking-wider uppercase">Architecture Status: 99.99% Operational</span>
            </motion.div>

            <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white text-balance">
              API Infrastructure & Systems Integration
            </h1>

            <p className="mt-4 sm:mt-6 text-xs sm:text-base lg:text-lg leading-relaxed text-white/80">
              We design and implement enterprise-grade backend systems and API layers that connect applications, global payment rails, distributed databases, and third-party SaaS into unified, high-throughput digital infrastructure.
            </p>
          </div>
        </div>
      </section>

      <main className="pb-16 sm:pb-24 overflow-x-clip">
        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">

          {/* Interactive Topology & Live Traffic Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-center mb-16 sm:mb-24">
            {/* Interactive SVG Diagram */}
            <div className="lg:col-span-6 h-[340px] xs:h-[380px] sm:h-[420px] rounded-2xl border border-border bg-card relative overflow-hidden shadow-sm">
              <InteractiveArchitecture />
            </div>

            {/* Live Traffic Stream Terminal */}
            <div className="lg:col-span-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                  <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Real-Time Request Telemetry</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground font-medium">POLLING EDGE LOGS</span>
              </div>
              <LiveTrafficTerminal />
            </div>
          </div>

          {/* Core Capabilities */}
          <div className="mb-16 sm:mb-24">
            <h2 className="mb-6 sm:mb-8 font-display text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Core Capabilities
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {apiFeatures.map(({ title, description, proof, icon: Icon, accent, bg, border }) => (
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
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold">
                      Low Latency
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <p className="mt-4 border-t border-border pt-3 text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]" />
                    {proof}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Code Infrastructure Window & Standards Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-center mb-16 sm:mb-24">
            {/* Code Window */}
            <div className="lg:col-span-6">
              <IDEWindow />
            </div>

            {/* Standards Text */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light mb-1">
                  Architecture Standards
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Reliability under real production load.
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Every API is engineered with deterministic failure handling, clear HTTP error semantics, and end-to-end telemetry so issues are diagnosed in seconds.
                </p>
              </div>

              <div className="space-y-3">
                {apiStandards.map((standard) => (
                  <div key={standard} className="flex items-start gap-3 rounded-lg border border-border bg-background/80 p-3.5 text-xs font-semibold text-foreground shadow-xs">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24B]" />
                    <span>{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conversion CTA */}
          <div className="rounded-2xl border border-border bg-primary p-8 sm:p-12 text-primary-foreground shadow-xl relative overflow-hidden">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                  Need a reliable API layer or payment integration?
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-white/80 sm:text-base max-w-xl">
                  Connect with our systems architects. We analyze endpoint throughput, data serialization bottlenecks, and security compliance.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/projects/request"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-xs sm:text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light shadow-md"
                >
                  Configure Integration
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-white/20"
                >
                  Contact Lead
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
// INTERACTIVE COMPONENTS
// ============================================

function InteractiveArchitecture() {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-6 bg-gradient-to-br from-background/40 via-card to-secondary/30 dark:from-[#050D17]/80 dark:via-[#081422] dark:to-[#050D17]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      
      {/* SVG Connecting Curves */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="api-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#C9A24B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C9A24B" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="url(#api-grad)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="url(#api-grad)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="50%" y2="82%" stroke="url(#api-grad)" strokeWidth="2" strokeDasharray="4 4" />
      </svg>

      {/* Central Node: API Gateway */}
      <motion.div 
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-card border-2 border-[#C9A24B] flex flex-col items-center justify-center text-center shadow-lg"
      >
        <Network className="h-7 w-7 text-[#C9A24B] mb-1" />
        <span className="text-[11px] font-bold text-foreground">API Gateway</span>
        <span className="text-[8px] font-mono text-[#C9A24B] font-bold">KONG / FASTIFY</span>
      </motion.div>

      {/* Satellite: Auth Service */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 left-[6%] sm:left-[14%] p-3 rounded-xl bg-card border border-emerald-500/40 flex items-center gap-2.5 shadow-xs"
      >
        <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <div className="text-left">
          <div className="text-[10px] font-bold text-foreground">Auth & RBAC</div>
          <div className="text-[8px] font-mono text-muted-foreground font-semibold">JWT · OAUTH2</div>
        </div>
      </motion.div>

      {/* Satellite: Edge CDN */}
      <motion.div 
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 right-[6%] sm:right-[14%] p-3 rounded-xl bg-card border border-accent/40 flex items-center gap-2.5 shadow-xs"
      >
        <Globe className="h-4 w-4 text-accent-dark dark:text-accent-light" />
        <div className="text-left">
          <div className="text-[10px] font-bold text-foreground">Edge Router</div>
          <div className="text-[8px] font-mono text-muted-foreground font-semibold">CF WORKERS</div>
        </div>
      </motion.div>

      {/* Satellite: Primary DB / Redis */}
      <motion.div 
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 p-3 rounded-xl bg-card border border-[#C9A24B]/40 flex items-center gap-2.5 shadow-xs"
      >
        <Database className="h-4 w-4 text-[#C9A24B]" />
        <div className="text-left">
          <div className="text-[10px] font-bold text-foreground">PostgreSQL & Redis</div>
          <div className="text-[8px] font-mono text-muted-foreground font-semibold">SHARDED POOLS</div>
        </div>
      </motion.div>
    </div>
  );
}

function LiveTrafficTerminal() {
  const [logs, setLogs] = useState<string[]>([
    "09:30:12 | POST   | 200 OK | 18ms | /api/webhooks/stripe",
    "09:30:14 | POST   | 200 OK | 22ms | /api/webhooks/mpesa",
    "09:30:17 | GET    | 200 OK | 09ms | /api/portfolio",
    "09:30:19 | POST   | 201 CR | 45ms | /api/projects/request",
  ]);

  useEffect(() => {
    const endpoints = [
      { method: "POST", path: "/api/webhooks/mpesa", code: "200 OK" },
      { method: "POST", path: "/api/webhooks/stripe", code: "200 OK" },
      { method: "GET ", path: "/api/store/products", code: "200 OK" },
      { method: "POST", path: "/api/store/checkout", code: "201 CR" },
      { method: "POST", path: "/api/contact", code: "201 CR" },
      { method: "GET ", path: "/api/tech-arsenal", code: "200 OK" },
      { method: "GET ", path: "/api/studio/telemetry", code: "200 OK" },
      { method: "POST", path: "/auth/session/refresh", code: "200 OK" },
    ];

    const interval = setInterval(() => {
      const ep = endpoints[Math.floor(Math.random() * endpoints.length)];
      const ms = Math.floor(Math.random() * 35) + 8;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const newLog = `${timeStr} | ${ep.method} | ${ep.code} | ${String(ms).padStart(2, "0")}ms | ${ep.path}`;

      setLogs((prev) => [...prev.slice(-6), newLog]);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl overflow-hidden bg-[#07111D] border border-[#C9A24B]/35 shadow-xl font-mono text-[11px] sm:text-xs ring-1 ring-black/10 dark:ring-white/10">
      <div className="bg-[#0B1A2C] px-4 py-2.5 flex items-center justify-between border-b border-[#C9A24B]/20">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#C9A24B]" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="text-white/70 text-[10px] flex items-center gap-1.5 font-medium">
          <Terminal className="w-3 h-3 text-[#C9A24B]" /> tail -f gateway.access.log
        </div>
      </div>
      <div className="p-4 h-[220px] overflow-hidden flex flex-col justify-end space-y-2 bg-[#07111D]">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={log + i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 overflow-x-auto scrollbar-none"
            >
              <span className="text-[#C9A24B] font-bold">&gt;</span>
              <span className={
                log.includes("200") || log.includes("201")
                  ? "text-emerald-400 font-medium"
                  : log.includes("429")
                  ? "text-[#E8CD84] font-medium"
                  : "text-white/85"
              }>
                {log}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function IDEWindow() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText?.(
`import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/ratelimit";
import { verifyAuthToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  // 1. Edge Authentication & RBAC Gate
  const token = req.headers.get("authorization");
  const auth = await verifyAuthToken(token);
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. High-Throughput Distributed Rate Limiting
  const ip = req.ip || "127.0.0.1";
  const { success } = await rateLimiter.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  return NextResponse.next();
}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#07111D] border border-[#C9A24B]/35 shadow-xl ring-1 ring-black/10 dark:ring-white/10">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B1A2C] border-b border-[#C9A24B]/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-white/80 font-mono font-medium">edge-gateway-middleware.ts</span>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-[11px] font-mono text-white/90 hover:bg-white/20 transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-[#C9A24B]" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="p-4 sm:p-5 overflow-x-auto font-mono text-[11px] sm:text-xs leading-relaxed text-white/85 bg-[#07111D]">
        <div><span className="text-[#E8CD84]">import</span> &#123; NextRequest, NextResponse &#125; <span className="text-[#E8CD84]">from</span> <span className="text-emerald-300">&quot;next/server&quot;</span>;</div>
        <div><span className="text-[#E8CD84]">import</span> &#123; rateLimiter &#125; <span className="text-[#E8CD84]">from</span> <span className="text-emerald-300">&quot;@/lib/ratelimit&quot;</span>;</div>
        <div className="text-white/40">{"// 1. Edge Authentication & RBAC Validation"}</div>
        <div><span className="text-[#E8CD84]">export async function</span> <span className="text-[#C9A24B] font-bold">middleware</span>(req: <span className="text-white">NextRequest</span>) &#123;</div>
        <div className="pl-4"><span className="text-[#E8CD84]">const</span> token = req.headers.get(<span className="text-emerald-300">&quot;authorization&quot;</span>);</div>
        <div className="pl-4"><span className="text-[#E8CD84]">if</span> (!token) <span className="text-[#E8CD84]">return</span> NextResponse.json(&#123; error: <span className="text-emerald-300">&quot;401&quot;</span> &#125;);</div>
        <div className="text-white/40 pl-4 mt-1">{"// 2. Upstash Distributed Edge Rate Limiting"}</div>
        <div className="pl-4"><span className="text-[#E8CD84]">const</span> ip = req.ip || <span className="text-emerald-300">&quot;127.0.0.1&quot;</span>;</div>
        <div className="pl-4"><span className="text-[#E8CD84]">const</span> &#123; success &#125; = <span className="text-[#E8CD84]">await</span> rateLimiter.limit(ip);</div>
        <div className="pl-4"><span className="text-[#E8CD84]">if</span> (!success) <span className="text-[#E8CD84]">return</span> NextResponse.json(&#123; error: <span className="text-emerald-300">&quot;429&quot;</span> &#125;);</div>
        <div className="pl-4 mt-1"><span className="text-[#E8CD84]">return</span> NextResponse.next();</div>
        <div>&#125;</div>
      </div>
    </div>
  );
}
