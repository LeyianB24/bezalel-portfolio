"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, Server, Video, ShieldCheck, Cpu, 
  CheckCircle2, ArrowRight, Activity
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { jellyPresets } from "@/lib/jelly-springs";

const heroImages = [
  "/BG_images/coporate.avif",
  "/BG_images/business-people-meeting-high-tech-it-office_236854-48620.avif",
  "/BG_images/istockphoto-1293816416-170667a.jpg",
];

interface EquipmentData {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: string[];
}

const fallbackEquipment: EquipmentData[] = [
  {
    id: "unifi-switch",
    name: "Ubiquiti UniFi Pro Max 48 PoE",
    category: "MANAGED_SWITCH",
    description: "Layer 3 switch with 10G SFP+ uplinks, 2.5GbE PoE++ ports, and Etherlighting port telemetry.",
    specs: ["48 GbE/2.5GbE PoE Ports", "4x 10G SFP+ Uplinks", "720W PoE Availability", "Direct-Attach Fiber"],
  },
  {
    id: "unifi-ap",
    name: "UniFi U7 Pro Enterprise AP",
    category: "WIRELESS_ACCESS",
    description: "Tri-band WiFi 7 access point with 6GHz spectrum, 2.5GbE uplink, and 9.3Gbps aggregate over-the-air throughput.",
    specs: ["Tri-Band WiFi 7 Support", "2.5GbE PoE+ Uplink", "500+ Concurrent Devices", "Zero-Handoff Roaming"],
  },
  {
    id: "logitech-rally",
    name: "Logitech Rally Bar Video System",
    category: "BOARDROOM_AV",
    description: "All-in-one 4K motorized PTZ video bar with adaptive beamforming mic array and AI optical framing.",
    specs: ["Cinema-Quality 4K Optical PTZ", "RightSight 2 Auto-Framing", "15ft Mic Pickup Radius", "Teams/Zoom Native"],
  },
];

const infraFeatures = [
  {
    title: "Structured Cabling & Fiber Core",
    description: "Cat6A shielded copper runs, multimode & singlemode OM3/OM4 fiber backbones, patch panel dressing, and Fluke certification.",
    proof: "Guaranteed 10Gbps inter-rack backbone bandwidth with zero packet crosstalk.",
    icon: Network,
    accent: "text-accent-dark dark:text-accent-light",
    bg: "bg-accent/10",
    border: "border-accent/25",
  },
  {
    title: "Executive Boardroom AV & Video Systems",
    description: "Crestron, Logitech, and Polycom Zoom Rooms / Microsoft Teams setups with acoustic ceiling microphones and multi-screen matrix routing.",
    proof: "One-touch meeting start with zero wireless connectivity confusion.",
    icon: Video,
    accent: "text-[#C9A24B]",
    bg: "bg-[#C9A24B]/10",
    border: "border-[#C9A24B]/25",
  },
  {
    title: "CCTV Surveillance & Perimeter Security",
    description: "4K IP surveillance cameras, AI perimeter detection, continuous cloud & local NVR recording, and remote live monitor streaming.",
    proof: "Engineered for estates, warehouses, and commercial office complexes.",
    icon: ShieldCheck,
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
  },
  {
    title: "Biometric Access Control & Turnstiles",
    description: "Time-attendance facial recognition, RFID barriers, and automated visitor pass management integrated with backend payroll.",
    proof: "Eliminates unauthorized access with sub-second biometric scans.",
    icon: Cpu,
    accent: "text-accent-dark dark:text-accent-light",
    bg: "bg-accent/10",
    border: "border-accent/25",
  },
];

const infraStandards = [
  "Layer 3 VLAN segmentation for guest, staff, VoIP, and CCTV traffic",
  "Redundant dual-ISP failover with automated BGP/load balancing",
  "Clean server rack cable management with documented port maps",
  "Dedicated 24/7 technical on-call SLAs with remote management worldwide and on-site field support",
];

export default function InfrastructureServicesPage({
  equipmentList = fallbackEquipment,
}: {
  equipmentList?: EquipmentData[];
}) {
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
            animate={{ opacity: 0.2, scale: 1.06 }}
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
              "radial-gradient(ellipse at 70% 10%, rgba(201,162,75,0.14) 0%, rgba(5,13,23,0.82) 55%, rgba(5,13,23,0.99) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={jellyPresets.soft}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#E8CD84] mb-4 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B] animate-pulse" />
                Physical & Digital Infrastructure
              </div>

              <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white text-balance">
                IT Infrastructure & Boardroom AV
              </h1>

              <p className="mt-4 sm:mt-6 text-xs sm:text-base lg:text-lg leading-relaxed text-white/80 max-w-2xl">
                We engineer, cable, and deploy high-reliability network infrastructure, executive boardroom video collaboration systems, CCTV surveillance, and server hardware for businesses and institutions — with remote management worldwide and dedicated on-site field deployments.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white shadow-xs backdrop-blur-sm">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-medium">24/7 SLA Guarantee</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white shadow-xs backdrop-blur-sm">
                  <Network className="h-3.5 w-3.5 text-[#C9A24B]" />
                  <span className="font-medium">10G SFP+ Fiber Core</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white shadow-xs backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C9A24B]" />
                  <span className="font-medium">Fluke-Certified Runs</span>
                </div>
              </div>
            </motion.div>

            {/* Server Rack Telemetry Visualizer */}
            <div className="lg:col-span-5">
              <RackTelemetryMonitor />
            </div>
          </div>
        </div>
      </section>

      <main className="pb-16 sm:pb-24 overflow-x-clip">
        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">

          {/* 4 Feature Cards */}
          <div className="mb-16 sm:mb-24">
            <h2 className="mb-6 sm:mb-8 font-display text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Core Deployments
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {infraFeatures.map(({ title, description, proof, icon: Icon, accent, bg, border }) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -4 }}
                  transition={jellyPresets.snap}
                  className={`flex flex-col justify-between rounded-xl border ${border} bg-card p-5 xs:p-6 sm:p-8 shadow-xs relative group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${bg} ${accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold">
                        Field Certified
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{title}</h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                  <p className="mt-4 border-t border-border pt-3 text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]" />
                    {proof}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Supported Hardware & Equipment Showcase */}
          <div className="mb-16 sm:mb-24 rounded-2xl border border-border bg-card p-5 xs:p-6 sm:p-8 md:p-10 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8 pb-5 border-b border-border">
              <div>
                <p className="text-[10px] xs:text-xs font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent-light">
                  Hardware Standards
                </p>
                <h2 className="font-display text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
                  Enterprise Equipment We Deploy & Support
                </h2>
              </div>
              <Link
                href="/store"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline shrink-0"
              >
                Browse Hardware Store <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {equipmentList.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  transition={jellyPresets.snap}
                  className="flex flex-col justify-between rounded-xl border border-border bg-background/80 p-5 shadow-2xs"
                >
                  <div>
                    <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                      {item.category.replace("_", " ")}
                    </span>
                    <h3 className="font-display text-base font-bold text-foreground mt-2.5">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {item.specs && item.specs.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border space-y-1.5">
                      {item.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-foreground/90 font-medium">
                          <CheckCircle2 size={12} className="text-[#C9A24B] shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Infrastructure Delivery Standards */}
          <div className="mb-16 sm:mb-24 grid gap-8 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xs md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-2 sm:mb-3 text-[10px] xs:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Engineering Governance
              </p>
              <h2 className="font-display text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Infrastructure built to run 24/7 without intervention.
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                We do not cut corners with unmanaged switches, tangled patch panels, or unsupported consumer hardware. Every installation is documented with full network diagrams and VLAN maps.
              </p>
            </div>
            <ul className="space-y-3">
              {infraStandards.map((standard) => (
                <li key={standard} className="flex items-start gap-3 rounded-lg border border-border bg-background/80 p-3.5 text-xs font-semibold text-foreground shadow-xs">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24B]" />
                  <span>{standard}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Conversion CTA */}
          <div className="rounded-2xl border border-border bg-primary p-8 sm:p-12 text-primary-foreground shadow-xl relative overflow-hidden">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                  Ready to deploy structured cabling or boardroom AV?
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-white/80 sm:text-base max-w-xl">
                  Share your floor plan, office capacity, or rack specifications. Our field engineering team will provide a comprehensive deployment blueprint.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/projects/request"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-xs sm:text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light shadow-md"
                >
                  Configure Hardware
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-white/20"
                >
                  Contact Field Desk
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
// RACK TELEMETRY MONITOR COMPONENT
// ============================================

function RackTelemetryMonitor() {
  const [portActivity, setPortActivity] = useState<boolean[]>([
    true, true, true, false, true, true, false, true,
    true, true, true, true, false, true, true, true,
    true, false, true, true, true, true, true, true,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPortActivity((prev) =>
        prev.map((active) => (Math.random() > 0.15 ? active : !active))
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl overflow-hidden bg-[#07111D] border border-[#C9A24B]/35 shadow-2xl p-4 sm:p-5 font-mono text-xs ring-1 ring-black/10 dark:ring-white/10">
      {/* Rack Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#C9A24B]/20 text-[11px] text-white/70">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-[#C9A24B]" />
          <span className="font-bold text-white tracking-wider">42U CORE RACK · NAIROBI LAB</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>99.99% ONLINE</span>
        </div>
      </div>

      {/* Switch 1: 24-Port 10G Managed Switch */}
      <div className="p-3 rounded-lg bg-[#0B1A2C] border border-[#C9A24B]/20 mb-3 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-white/80">
          <span className="font-semibold">U12: UNIFI 24-PORT POE+ SWITCH</span>
          <span className="text-emerald-400 font-bold">10G SFP+ ACTIVE</span>
        </div>
        {/* 24 Port Grid */}
        <div className="grid grid-cols-12 gap-1.5 py-1">
          {portActivity.map((active, idx) => (
            <div
              key={idx}
              className={`h-3 rounded-xs flex items-center justify-center transition-colors ${
                active ? "bg-emerald-500/30 border border-emerald-400/80" : "bg-black/60 border border-white/10"
              }`}
            >
              <div
                className={`w-1 h-1 rounded-full ${
                  active ? "bg-emerald-400 animate-ping" : "bg-white/20"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Switch 2: Core Firewall Gateway */}
      <div className="p-3 rounded-lg bg-[#0B1A2C] border border-[#C9A24B]/20 mb-3 flex items-center justify-between text-[10px]">
        <div>
          <div className="text-white font-bold">U10: DUAL-WAN FIREWALL &amp; BGP</div>
          <div className="text-white/60 text-[9px] mt-0.5">ISP1: Safaricom Fiber (1Gbps) · ISP2: Liquid Backup</div>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 font-bold">FAILOVER READY</div>
          <div className="text-[9px] text-[#E8CD84]">Ping: 3.2ms</div>
        </div>
      </div>

      {/* Environmental & Load Gauges */}
      <div className="grid grid-cols-3 gap-2 text-[10px]">
        <div className="p-2 rounded bg-black/40 border border-[#C9A24B]/20">
          <div className="text-white/60 font-medium">TEMP</div>
          <div className="text-sm font-bold text-white mt-0.5">21.4°C</div>
        </div>
        <div className="p-2 rounded bg-black/40 border border-[#C9A24B]/20">
          <div className="text-white/60 font-medium">POE LOAD</div>
          <div className="text-sm font-bold text-[#E8CD84] mt-0.5">184W / 400W</div>
        </div>
        <div className="p-2 rounded bg-black/40 border border-[#C9A24B]/20">
          <div className="text-white/60 font-medium">THROUGHPUT</div>
          <div className="text-sm font-bold text-[#C9A24B] mt-0.5">8.4 Gbps</div>
        </div>
      </div>
    </div>
  );
}
