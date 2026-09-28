"use client";

import React, { useState, useEffect, useSyncExternalStore, useRef } from "react";
import { 
  motion,
  AnimatePresence,
  useTransform, 
  useSpring, 
  useMotionValue 
} from "framer-motion";
import { 
  Smartphone, WifiOff, Zap, Cpu, 
  Battery, Globe2, ShieldCheck, 
  CheckCircle2, ArrowRight,
  Activity, Fingerprint
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { jellyPresets } from "@/lib/jelly-springs";

const heroImages = [
  "/BG_images/team-collaborates-digitally-stockcake.jpg",
  "/BG_images/istockphoto-2132788044-170667a.jpg",
  "/BG_images/business-people-meeting-high-tech-it-office_236854-48620.avif",
];

type Platform = "ios" | "android";

interface Theme {
  name: string;
  primary: string;
  accent: string;
  bg: string;
  border: string;
  glow: string;
  gradient: string;
  code: string;
  platform: string;
}

const mobileFeatures = [
  {
    title: "Offline-First Mobile Architecture",
    description: "Local data persistence with automatic conflict-free synchronization upon reconnection, engineered for field operations and erratic network coverage.",
    proof: "Essential for delivery dispatch, inspection, and field-service teams worldwide.",
    icon: WifiOff,
    accent: "text-accent-dark dark:text-accent-light",
    bg: "bg-accent/10",
    border: "border-accent/25",
  },
  {
    title: "Global & Regional Payment Rails",
    description: "Seamless Stripe, Apple Pay, Google Pay, and M-Pesa STK Push processing embedded directly inside native Android and iOS experiences.",
    proof: "High-conversion checkout flows supporting both international cards and local mobile money.",
    icon: Zap,
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
  },
  {
    title: "Cross-Platform Performance",
    description: "Single-codebase React Native & Flutter architectures delivering native 60fps performance on both iOS and Android at predictable cost.",
    proof: "Unified business logic and accelerated feature rollouts without sacrificing quality.",
    icon: Smartphone,
    accent: "text-[#C9A24B]",
    bg: "bg-[#C9A24B]/10",
    border: "border-[#C9A24B]/25",
  },
  {
    title: "Biometrics & Hardware Security",
    description: "Secure Enclave biometric login (Face ID & Fingerprint), AES-256 local storage, and automated token lifecycle rotation.",
    proof: "Meets international fintech and member data privacy compliance standards.",
    icon: ShieldCheck,
    accent: "text-accent-dark dark:text-accent-light",
    bg: "bg-accent/10",
    border: "border-accent/25",
  },
];

const mobileStandards = [
  "Fluid 60fps native animations and responsive gesture mechanics",
  "Optimized app binary size under 15MB for fast cellular downloads",
  "Full push notification pipeline with actionable deep-linking",
  "End-to-end publishing pipelines to Google Play Store and Apple App Store",
];

export default function MobileServicesPage() {
  const [platform, setPlatform] = useState<Platform>("ios");
  const [activeImage, setActiveImage] = useState(0);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((c) => (c + 1) % heroImages.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, []);

  const theme: Theme = {
    ios: {
      name: "iOS 18 Native",
      primary: "text-[#C9A24B]",
      accent: "text-[#E8CD84]",
      bg: "bg-[#C9A24B]",
      border: "border-[#C9A24B]/40",
      glow: "shadow-[#C9A24B]/20",
      gradient: "from-[#0B2036] via-[#132A44] to-[#0B2036]",
      code: "swift",
      platform: "ios",
    },
    android: {
      name: "Android 15 Native",
      primary: "text-emerald-500",
      accent: "text-emerald-400",
      bg: "bg-emerald-500",
      border: "border-emerald-500/40",
      glow: "shadow-emerald-500/20",
      gradient: "from-[#061E16] via-[#0D3528] to-[#061E16]",
      code: "kotlin",
      platform: "android",
    },
  }[platform];

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
              "radial-gradient(ellipse at 30% 20%, rgba(201,162,75,0.14) 0%, rgba(5,13,23,0.84) 55%, rgba(5,13,23,0.99) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#E8CD84] backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B] animate-pulse" />
                  Mobile Engineering
                </div>

                {/* Platform Switcher Pill */}
                <div className="bg-white/10 border border-white/20 p-1 rounded-full flex items-center shadow-xs backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setPlatform("ios")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      platform === "ios"
                        ? "bg-[#C9A24B] text-[#050D17] shadow-xs"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    iOS
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform("android")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      platform === "android"
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Android
                  </button>
                </div>
              </div>

              <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white text-balance">
                Mobile Applications & Field Workflows
              </h1>

              <p className="text-xs sm:text-base lg:text-lg leading-relaxed text-white/80">
                We engineer dependable mobile applications built around real-world usage patterns for international audiences and bandwidth-constrained mobile environments alike. Whether you need field logistics tools, customer apps, or multi-currency mobile checkout, our solutions are engineered for stability.
              </p>

              {/* Hardware Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 sm:p-4 rounded-xl border border-white/15 bg-white/8 shadow-xs backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-[10px] font-mono font-bold uppercase">Frame Time</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-white">16ms</div>
                  <div className="text-[10px] text-white/60 font-medium">Smooth 60fps</div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl border border-white/15 bg-white/8 shadow-xs backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[#C9A24B] mb-1">
                    <Zap className="h-4 w-4" />
                    <span className="text-[10px] font-mono font-bold uppercase">Cold Start</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-white">0.38s</div>
                  <div className="text-[10px] text-white/60 font-medium">Hermes Engine</div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl border border-white/15 bg-white/8 shadow-xs backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <Fingerprint className="h-4 w-4" />
                    <span className="text-[10px] font-mono font-bold uppercase">Auth Speed</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-white">&lt;0.2s</div>
                  <div className="text-[10px] text-white/60 font-medium">Biometric Lock</div>
                </div>
              </div>
            </div>

            {/* Right: 3D Interactive Phone Canvas */}
            <div className="lg:col-span-6 h-[540px] xs:h-[580px] sm:h-[620px] w-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C9A24B]/10 via-white/5 to-[#C9A24B]/10 rounded-3xl blur-2xl pointer-events-none" />
              {isClient && <InteractivePhone theme={theme} platform={platform} />}
            </div>
          </div>
        </div>
      </section>

      <main className="pb-16 sm:pb-24 overflow-x-clip">
        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">

          {/* Core Capabilities */}
          <div className="mb-16 sm:mb-24">
            <h2 className="mb-6 sm:mb-8 font-display text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Key Capabilities
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {mobileFeatures.map(({ title, description, proof, icon: Icon, accent, bg, border }) => (
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
                      Cross-Platform
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

          {/* Technical Standards */}
          <div className="mb-16 sm:mb-24 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-2 sm:mb-3 text-[10px] xs:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                  Build Quality
                </p>
                <h2 className="font-display text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Native ergonomics without performance compromises.
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Every mobile binary is compiled with tree-shaken dependencies, offline state reconciliation, automated crash analytics, and end-to-end device testing suites.
                </p>
              </div>

              <div className="space-y-3">
                {mobileStandards.map((standard) => (
                  <div key={standard} className="flex items-start gap-3 rounded-lg border border-border bg-background/80 p-3.5 sm:p-4 shadow-xs">
                    <CheckCircle2 className="mt-0.5 h-4 sm:h-5 w-4 sm:w-5 shrink-0 text-[#C9A24B]" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">{standard}</span>
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
                  Launching a mobile product or field solution?
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-white/80 sm:text-base max-w-xl">
                  Discuss target operating environments, offline synchronization requirements, and platform integrations with our engineering leads.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/projects/request"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-xs sm:text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light shadow-md"
                >
                  Configure App Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-white/20"
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
// 3D INTERACTIVE PHONE COMPONENT
// ============================================

function InteractivePhone({ theme, platform }: { theme: Theme; platform: Platform }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [12, -12]);
  const rotateY = useTransform(mouseX, [-300, 300], [-12, 12]);

  const smoothRotateX = useSpring(rotateX, { stiffness: 90, damping: 20 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 90, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center perspective-[1200px]" 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ 
          rotateX: smoothRotateX, 
          rotateY: smoothRotateY,
          transformStyle: "preserve-3d" 
        }}
        className="relative w-[260px] xs:w-[280px] sm:w-[300px] h-[500px] sm:h-[540px] transition-transform duration-200 ease-out"
      >  
        {/* Animated Scan Beam */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute left-[-20px] right-[-20px] h-[2px] bg-[#C9A24B] z-50 blur-[2px] opacity-75 pointer-events-none [transform:translateZ(180px)]"
        />

        {/* --- LAYER 1: BACK CHASSIS --- */}
        <PhoneLayer z={0} className="bg-[#0B1828] border border-[#C9A24B]/35 shadow-2xl">
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <div className="w-20 h-20 rounded-full border border-[#C9A24B]/30 flex items-center justify-center">
              <Zap className="h-6 w-6 text-[#C9A24B]" />
            </div>
            <div className="mt-3 font-mono text-[9px] tracking-widest text-[#E8CD84]">WIRELESS_CHARGING_COIL</div>
          </div>
        </PhoneLayer>

        {/* --- LAYER 2: LOGIC MOTHERBOARD --- */}
        <PhoneLayer z={40} className="bg-card/95 backdrop-blur-sm border border-border shadow-md">
          <div className="w-full h-full relative p-4">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#071320] border border-[#C9A24B]/40 rounded-2xl flex flex-col items-center justify-center shadow-lg">
              <Cpu className="w-9 h-9 text-[#C9A24B] animate-pulse" />
              <div className="mt-2 text-[8px] text-white font-mono font-bold">ARM64 ARCH</div>
              <div className="text-[7px] text-[#C9A24B] font-mono">HERMES 64-BIT</div>
            </div>

            <div className="absolute bottom-10 left-3 right-3 p-2.5 rounded-lg bg-secondary/80 border border-border flex items-center justify-between text-[9px] font-mono text-muted-foreground shadow-xs">
              <span className="flex items-center gap-1 font-semibold text-foreground"><Battery className="h-3 w-3 text-emerald-500" /> 4323 mAh</span>
              <span className="font-semibold text-accent-dark dark:text-accent-light">LOW POWER MODE</span>
            </div>
          </div>
        </PhoneLayer>

        {/* --- LAYER 3: GLASS UI LAYER --- */}
        <PhoneLayer z={120} className="bg-[#050D17] border border-[#C9A24B]/30 overflow-hidden ring-4 ring-black/30 shadow-2xl">
          <div className="w-full h-full flex flex-col justify-between p-4">
            
            {/* Status Bar */}
            <div className="flex justify-between items-center px-2 pt-2">
              <span className="text-[10px] font-bold text-white font-mono">9:41</span>
              <div className="h-3.5 w-16 bg-black rounded-full border border-white/20" />
              <div className="flex items-center gap-1.5 text-white text-[10px]">
                <span className="font-medium">5G</span>
                <Battery className="h-3 w-3 text-emerald-400" />
              </div>
            </div>

            {/* App UI Showcase Content */}
            <div className="space-y-3 my-auto">
              <div className={`p-4 rounded-xl bg-gradient-to-br ${theme.gradient} text-white shadow-md relative overflow-hidden border border-[#C9A24B]/30`}>
                <div className="text-[9px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
                  Active {platform === "ios" ? "Apple iOS" : "Android"} Session
                </div>
                <div className="text-lg font-bold mt-0.5 text-white">Nairobi Tech Hub</div>
                <div className="text-[10px] text-white/90 mt-1 flex items-center gap-1">
                  <Globe2 className="h-3 w-3 text-[#C9A24B]" /> Encrypted Tunnel Live
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-white/[0.07] border border-white/10 text-white">
                  <div className="text-[8px] font-mono text-white/60">THROUGHPUT</div>
                  <div className="text-xs font-bold text-emerald-400">120 Mbps</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.07] border border-white/10 text-white">
                  <div className="text-[8px] font-mono text-white/60">LATENCY</div>
                  <div className="text-xs font-bold text-[#E8CD84]">14 ms</div>
                </div>
              </div>

              {/* Biometric Toast */}
              <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5 text-white">
                <div className="h-7 w-7 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold">Biometric Verified</div>
                  <div className="text-[8px] text-white/80 font-mono">Secure Enclave Validated</div>
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-20 h-1 bg-white/30 rounded-full mx-auto mb-1" />
          </div>
        </PhoneLayer>
      </motion.div>
    </div>
  );
}

function PhoneLayer({ z, className, children }: { z: number; className?: string; children: React.ReactNode }) {
  return (
    <div 
      className={`absolute inset-0 rounded-[2.5rem] border shadow-2xl ${className}`}
      style={{ transform: `translateZ(${z}px)` }}
    >
      {children}
    </div>
  );
}
