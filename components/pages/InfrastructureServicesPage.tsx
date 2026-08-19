"use client";

import {
  Network,
  ShieldCheck,
  Video,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export interface EquipmentData {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: string[];
  imageUrl?: string | null;
}

const fallbackEquipment: EquipmentData[] = [
  {
    id: "eq-1",
    name: "UniFi Enterprise 24-Port 10G PoE Managed Switch",
    category: "NETWORKING",
    description: "High-density Layer 3 enterprise networking switch with 2.5GbE PoE+ ports and 10G SFP+ uplinks for mission-critical institutional LAN.",
    specs: ["24x 2.5GbE PoE+ RJ45 Ports", "2x 10G SFP+ Uplinks", "400W Total PoE Power Budget", "Layer 3 Switching & VLAN Routing"],
  },
  {
    id: "eq-2",
    name: "Crestron Flex UC Boardroom Video System",
    category: "AV_CONFERENCING",
    description: "Native Zoom Rooms and Microsoft Teams boardroom collaboration system with beamforming microphone array and intelligent 4K auto-framing camera.",
    specs: ["Native Zoom/Teams Touch Controller", "4K Ultra-HD Intelligent Camera", "Dual Display Support (4K HDR)", "Acoustic Echo Cancellation"],
  },
  {
    id: "eq-3",
    name: "Hikvision Pro 32-Channel 4K AcuSense NVR",
    category: "SECURITY_CCTV",
    description: "AI-powered surveillance recorder with real-time perimeter protection, facial recognition, vehicle classification, and RAID-1 failover.",
    specs: ["32 Channels up to 12MP Resolution", "4x SATA Interface (up to 40TB)", "AcuSense AI Deep Learning Filter", "H.265+ Compression Engine"],
  },
];

const infraFeatures = [
  {
    title: "Structured Cabling & High-Density LAN",
    description: "Cat6A / Cat7 structured cabling, 10G fiber backbones, patch panel terminations, and organized server rack layouts.",
    proof: "Certified fluke-tested runs with zero packet loss and clean labeling.",
    icon: Network,
  },
  {
    title: "Executive Boardroom AV & Video Conferencing",
    description: "Crestron, Logitech, and Polycom Zoom Rooms / Microsoft Teams setups with acoustic ceiling microphones and multi-screen matrix routing.",
    proof: "One-touch meeting start with zero wireless connectivity confusion.",
    icon: Video,
  },
  {
    title: "CCTV Surveillance & Perimeter Security",
    description: "4K IP surveillance cameras, AI perimeter detection, continuous cloud & local NVR recording, and remote live monitor streaming.",
    proof: "Engineered for estates, warehouses, and commercial office complexes.",
    icon: ShieldCheck,
  },
  {
    title: "Biometric Access Control & Turnstiles",
    description: "Time-attendance facial recognition, RFID barriers, and automated visitor pass management integrated with backend payroll.",
    proof: "Eliminates unauthorized access with sub-second biometric scans.",
    icon: Cpu,
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
  return (
    <PageLayout variant="subtle">
      <main className="min-h-screen pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-16 border-b border-border pb-12 sm:mb-20">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
              Service Overview
            </p>
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-foreground sm:text-6xl">
              IT Infrastructure & Boardroom AV
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We engineer, cable, and deploy high-reliability network infrastructure, executive boardroom video collaboration systems, CCTV surveillance, and server hardware for businesses and institutions — with remote management worldwide and dedicated on-site field deployments.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="mb-20 grid gap-6 md:grid-cols-2">
            {infraFeatures.map(({ title, description, proof, icon: Icon }) => (
              <div
                key={title}
                className="flex flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <div>
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
                <p className="mt-5 border-t border-border pt-4 text-xs font-semibold leading-relaxed text-foreground">
                  {proof}
                </p>
              </div>
            ))}
          </div>

          {/* Supported Hardware & Equipment Showcase */}
          <div className="mb-20 rounded-xl border border-border bg-card p-8 sm:p-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8 pb-6 border-b border-border">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent-light">
                  Hardware Standards
                </p>
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl mt-1">
                  Enterprise Equipment We Deploy & Support
                </h2>
              </div>
              <Link
                href="/store"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
              >
                Browse Hardware Store <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {equipmentList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-lg border border-border bg-background p-5"
                >
                  <div>
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                      {item.category.replace("_", " ")}
                    </span>
                    <h3 className="font-display text-base font-black text-foreground mt-2">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {item.specs && item.specs.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border space-y-1">
                      {item.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-foreground/80">
                          <CheckCircle2 size={12} className="text-[#C9A24B] shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Delivery Standards */}
          <div className="mb-20 grid gap-8 rounded-lg border border-border bg-card p-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Engineering Governance
              </p>
              <h2 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                Infrastructure built to run 24/7 without intervention.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                We do not cut corners with unmanaged switches, tangled patch panels, or unsupported consumer hardware. Every installation is documented with full network diagrams and VLAN maps.
              </p>
            </div>
            <ul className="space-y-3">
              {infraStandards.map((standard) => (
                <li key={standard} className="flex items-start gap-3 rounded-md border border-border bg-background p-3.5 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark dark:text-accent-light" />
                  <span>{standard}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Strip */}
          <div className="flex flex-col items-center justify-between gap-6 rounded-lg border border-border bg-primary p-8 text-primary-foreground sm:flex-row sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-black sm:text-3xl text-white">
                Planning an office network, boardroom setup, or estate CCTV?
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/75">
                Submit an equipment and site specification brief for an itemized quotation.
              </p>
            </div>
            <Link
              href="/projects/request"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 text-sm font-bold text-accent-foreground shadow-md hover:bg-accent-light"
            >
              Request site assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
