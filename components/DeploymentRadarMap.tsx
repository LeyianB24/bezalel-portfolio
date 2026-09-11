"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Activity,
  Server,
  Truck,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface DeploymentSite {
  id: string;
  name: string;
  region: string;
  client: string;
  category: string;
  system: string;
  coordsLabel: string;
  topPct: number;
  leftPct: number;
  metrics: {
    primary: string;
    secondary: string;
    status: string;
  };
  techTags: string[];
  description: string;
  icon: typeof Server;
}

const DEPLOYMENT_SITES: DeploymentSite[] = [
  {
    id: "nairobi",
    name: "Nairobi Financial Core",
    region: "Nairobi County",
    client: "Harambee SACCO & Apex Gateway",
    category: "Fintech & Core Banking",
    system: "Distributed Ledger & Daraja Rails",
    coordsLabel: "1.2647° S, 36.8242° E",
    topPct: 58,
    leftPct: 48,
    metrics: {
      primary: "KES 1.48M Daily Volume",
      secondary: "42ms P99 Latency · 99.98% SLA",
      status: "Operational",
    },
    techTags: ["Next.js", "PostgreSQL", "M-Pesa Daraja", "Redis", "Docker"],
    description:
      "High-throughput transactional core handling real-time member loan disbursements, savings ledger balancing, and automated inter-branch reconciliation.",
    icon: Server,
  },
  {
    id: "rift-valley",
    name: "Rift Valley Dairy & Agri-ERP Hub",
    region: "Naivasha / Nakuru Basin",
    client: "Osotua Dairy Farmers Co-op",
    category: "Agribusiness & Farm-Gate",
    system: "Milk Collection & Instant Payouts",
    coordsLabel: "0.7172° S, 36.4310° E",
    topPct: 45,
    leftPct: 41,
    metrics: {
      primary: "18,420 L Daily Telemetry",
      secondary: "1,420+ Farmers · < 3 min Payouts",
      status: "Operational",
    },
    techTags: ["React Native", "Offline SQLite", "PostgreSQL", "M-Pesa Bulk"],
    description:
      "Farm-gate milk collection weighbridge integration with Bluetooth scales, offline intake logging, and automated batch payment disbursement directly to smallholders.",
    icon: Activity,
  },
  {
    id: "mombasa-corridor",
    name: "Northern Logistics Transit Corridor",
    region: "Mombasa – Nairobi Highway",
    client: "Compass Cartage Cold-Chain",
    category: "Logistics & IoT Fleet",
    system: "Refrigerated Fleet Telemetry & Manifests",
    coordsLabel: "4.0435° S, 39.6682° E",
    topPct: 76,
    leftPct: 68,
    metrics: {
      primary: "48 Refrigerated Vehicles",
      secondary: "40% Faster Border Turnaround",
      status: "Operational",
    },
    techTags: ["IoT MQTT", "GPS Geofence", "Offline Manifests", "AWS ECS"],
    description:
      "IoT sensor telemetry for cross-border transit, monitoring perishable temperature stability and generating tamper-evident digital manifests even without cellular connectivity.",
    icon: Truck,
  },
  {
    id: "western-hub",
    name: "Western Agricultural Aggregation Hub",
    region: "Eldoret / Uasin Gishu",
    client: "Grain & Dairy Intake Depots",
    category: "Supply Chain & ERP",
    system: "Grain Weighbridge & Inventory Sync",
    coordsLabel: "0.5143° N, 35.2698° E",
    topPct: 35,
    leftPct: 33,
    metrics: {
      primary: "6 Processing Depots",
      secondary: "Zero Discrepancy Reconciliation",
      status: "Operational",
    },
    techTags: ["Next.js", "Edge Sync", "Prisma", "PostgreSQL"],
    description:
      "Multi-depot intake synchronization aggregating produce volume, batch grading, and automated warehouse receipt ledgering with headquarter ERP integration.",
    icon: Layers,
  },
];

export default function DeploymentRadarMap() {
  const [activeSite, setActiveSite] = useState<DeploymentSite>(DEPLOYMENT_SITES[0]);

  return (
    <div className="rounded-2xl border border-border bg-[#050D17] text-white p-5 sm:p-8 lg:p-10 shadow-xl overflow-hidden relative">
      {/* Background Technical Grid */}
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(201, 162, 75, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201, 162, 75, 0.35) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/35 bg-[#C9A24B]/10 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#C9A24B] mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B] animate-ping" />
            Live Deployment Radar
          </div>
          <h3 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Real systems running in production.
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-white/70 max-w-2xl">
            Explore verified enterprise software, telemetry hubs, and infrastructure deployed by Bezalel Technologies across key commercial corridors.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs text-white/60">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Active telemetry
          </span>
          <span>·</span>
          <span>4 Verified Hubs</span>
        </div>
      </div>

      {/* Main Grid: Radar Map View + Live Telemetry Inspector */}
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
        {/* Left: Interactive Regional Topology / Radar Visualizer */}
        <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-xl border border-white/15 bg-black/40 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
          {/* Circular Radar Sweep Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="h-[280px] w-[280px] sm:h-[380px] sm:w-[380px] rounded-full border border-[#C9A24B]/40" />
            <div className="absolute h-[180px] w-[180px] sm:h-[240px] sm:w-[240px] rounded-full border border-white/20" />
            <div className="absolute h-[80px] w-[80px] sm:h-[120px] sm:w-[120px] rounded-full border border-[#C9A24B]/60" />
          </div>

          {/* East Africa Topographical Outline Representation */}
          <div className="relative w-full h-full">
            {/* SVG Regional Coordinate Map of Kenya */}
            <svg
              viewBox="0 0 400 320"
              className="w-full h-full opacity-35 stroke-[#C9A24B]/50 fill-transparent stroke-[1.2] pointer-events-none"
            >
              {/* Generalized Kenya Border Vector */}
              <polygon points="120,40 190,30 250,55 310,110 330,190 290,260 210,290 140,240 100,190 90,120 120,40" />
              {/* Rift Valley / Major Corridors */}
              <path
                d="M150,50 Q165,160 175,270"
                strokeDasharray="4 4"
                className="stroke-white/30"
              />
              <path
                d="M175,200 Q230,230 290,260"
                strokeDasharray="4 4"
                className="stroke-[#C9A24B]/40"
              />
            </svg>

            {/* Interactive Pins */}
            {DEPLOYMENT_SITES.map((site) => {
              const isSelected = activeSite.id === site.id;
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => setActiveSite(site)}
                  style={{ top: `${site.topPct}%`, left: `${site.leftPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 cursor-pointer"
                  title={`${site.name} · ${site.client}`}
                >
                  {/* Ping Animation on Active */}
                  <span
                    className={`absolute -inset-2 rounded-full transition-all duration-300 ${
                      isSelected
                        ? "bg-[#C9A24B]/35 animate-ping"
                        : "group-hover:bg-white/20"
                    }`}
                  />
                  {/* Node Dot */}
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-all shadow-md ${
                      isSelected
                        ? "h-8 w-8 bg-[#C9A24B] text-black ring-4 ring-[#C9A24B]/30 scale-110"
                        : "h-6 w-6 bg-white/15 text-white border border-white/40 hover:bg-white/30"
                    }`}
                  >
                    <MapPin className={`h-3.5 w-3.5 ${isSelected ? "stroke-[2.5]" : ""}`} />
                  </div>

                  {/* Pin Pill Label */}
                  <span
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-bold tracking-tight transition-colors shadow-xs ${
                      isSelected
                        ? "bg-[#C9A24B] text-black"
                        : "bg-black/80 text-white/80 border border-white/20 group-hover:text-white"
                    }`}
                  >
                    {site.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Left Topology Badge */}
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md rounded border border-white/10 px-2.5 py-1 text-[10px] text-white/60 font-mono">
            Kenya Tech & Transit Corridors
          </div>
        </div>

        {/* Right: Selected Site Live Inspector Card */}
        <div className="rounded-xl border border-white/15 bg-white/[0.04] p-5 sm:p-7 backdrop-blur-md relative flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSite.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Status Header */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A24B]">
                  {activeSite.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {activeSite.metrics.status}
                </span>
              </div>

              {/* Title & Organization */}
              <div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {activeSite.name}
                </h4>
                <p className="text-xs text-white/60 mt-0.5">
                  Client: <span className="text-white font-medium">{activeSite.client}</span> · {activeSite.region}
                </p>
                <p className="text-[11px] font-mono text-[#C9A24B]/90 mt-1">
                  GPS: {activeSite.coordsLabel}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {activeSite.description}
              </p>

              {/* Metrics Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-[10px] uppercase font-bold text-white/50">Primary Telemetry</p>
                  <p className="text-xs sm:text-sm font-bold text-[#C9A24B] mt-1">
                    {activeSite.metrics.primary}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-[10px] uppercase font-bold text-white/50">Service Level</p>
                  <p className="text-xs sm:text-sm font-bold text-white mt-1">
                    {activeSite.metrics.secondary}
                  </p>
                </div>
              </div>

              {/* Tech Arsenal Tags */}
              <div className="pt-1">
                <p className="text-[10px] uppercase font-bold text-white/50 mb-1.5">Architecture Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeSite.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-white/[0.08] border border-white/15 px-2 py-0.5 text-[10px] font-mono text-white/85"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/projects/request"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A24B] hover:text-white transition-colors"
                >
                  <span>Scope system like this</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-[11px] text-white/40">Verified deployment</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
