/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  MonitorUp,
  Network,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  Send,
  Loader2,
  Star,
  Mail,
  Phone,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroProductMockup from "@/components/HeroProductMockup";
import TechArsenal from "@/components/TechArsenal";
import DeploymentRadarMap from "@/components/DeploymentRadarMap";

export interface PortfolioTeaserItem {
  id: string;
  name: string;
  clientName: string;
  clientLogoUrl?: string | null;
  category?: string;
  sector?: string;
  description: string;
  outcome?: string;
  image: string;
  liveUrl?: string | null;
  techTags: string[];
}

interface HomePageClientProps {
  portfolioProjects: PortfolioTeaserItem[];
}

const stats = [
  {
    value: "100%",
    label: "Scope Delivery Rate",
    description: "Every engagement completed to agreed technical milestones.",
  },
  {
    value: "< 2 hrs",
    label: "SLA Response Time",
    description: "Rapid technical support across global and regional timezones.",
  },
  {
    value: "USD / KES",
    label: "Transparent Invoicing",
    description: "Itemized, fixed-price PDF quotation before work begins.",
  },
  {
    value: "4",
    label: "Core Engineering Domains",
    description: "Custom Web Systems, Mobile Apps, Cloud/AV Infra, Payment Rails.",
  },
];

const industries = [
  "Fintech & Banking",
  "Cross-Border Logistics",
  "SaaS & Tech Startups",
  "Real Estate & Managed Estates",
  "E-Commerce & Retail",
  "Public Sector & NGOs",
  "Agribusiness",
  "Global Enterprises & SMEs",
];

const services = [
  {
    title: "Software and Web Systems",
    description:
      "Custom portals, internal dashboards, and automated workflow systems built for teams that require reliable daily operations.",
    proof: "Designed for member records, service requests, reporting, approvals, and customer self-service.",
    icon: MonitorUp,
    bgImage: "/BG_images/codes people.jpg",
  },
  {
    title: "IT Infrastructure & Boardroom AV",
    description:
      "Structured cabling, managed networks, high-definition boardroom AV, CCTV surveillance, and biometric access control.",
    proof: "Engineered for corporate offices, estates, and institutions that cannot afford network interruptions.",
    icon: Network,
    bgImage: "/BG_images/business-people-meeting-high-tech-it-office_236854-48620.avif",
  },
  {
    title: "Payments & API Integration",
    description:
      "M-Pesa Daraja, Stripe, bank transfer rails, and transactional databases integrated cleanly into existing business software.",
    proof: "Eliminates manual payment matching with automated reconciliation and instant notifications.",
    icon: CreditCard,
    bgImage: "/BG_images/data.avif",
  },
  {
    title: "Audits, Support & Modernization",
    description:
      "Independent technical code audits, performance fixes, architecture documentation, and ongoing maintenance SLAs.",
    proof: "Ideal when you inherit legacy codebases or need reliable ongoing engineering support.",
    icon: Wrench,
    bgImage: "/BG_images/coporate.avif",
  },
];

const testimonials = [
  {
    quote:
      "The automated milk intake collection and farmer payout system transformed our cooperative operations. Milk intake reconciliation that previously took our accounting team 3 days at month-end is now computed instantly with zero discrepancies.",
    author: "Daniel Kiprop",
    role: "Operations & Finance Lead",
    company: "Osotua Dairy Farmers Cooperative",
    metric: "Payouts reduced from 14 days to < 3 min",
    sector: "Agribusiness",
  },
  {
    quote:
      "Field drivers operating across transit corridors with weak cellular signals can now generate verified offline manifests. Turnaround times at transit checkpoints dropped by 40% in our first quarter of operation.",
    author: "Grace Ndegwa",
    role: "Head of Fleet Operations",
    company: "Compass Cartage East Africa",
    metric: "40% faster border checkpoint turnaround",
    sector: "Logistics",
  },
  {
    quote:
      "Migrating our core ledger reconciliation to Bezalel's M-Pesa Daraja integration cut reconciliation time by 80% and gave us sub-50ms P99 transaction latencies under peak month-end contribution hours.",
    author: "Patrick Mutua",
    role: "Chief Information Officer",
    company: "Nairobi Financial SACCO",
    metric: "80% reduction in reconciliation time",
    sector: "Fintech",
  },
];

const pricingTiers = [
  {
    name: "Starter / Focused Modules",
    priceKES: "KES 150k – 350k",
    priceUSD: "~$1,200 – $2,800",
    timeline: "2–3 Weeks Delivery",
    badge: "Fast Rollout",
    description: "Ideal for single-purpose portals, payment gateways, or independent security and code audits.",
    deliverables: [
      "Custom web portal or standalone API service",
      "M-Pesa Daraja or Stripe payment rails",
      "Automated webhook verification & logging",
      "Comprehensive test coverage & documentation",
      "Full source code ownership on handover",
    ],
    ctaText: "Scope Starter Project",
    isPopular: false,
  },
  {
    name: "Growth / Full Operational Platform",
    priceKES: "KES 500k – 1.5M",
    priceUSD: "~$4,000 – $12,000",
    timeline: "6–10 Weeks Delivery",
    badge: "Most Popular",
    description: "Full-stack operations systems: multi-role ERPs, mobile dispatch apps, and real-time inventory.",
    deliverables: [
      "Custom web dashboard & field mobile apps",
      "Multi-role RBAC security & audit trails",
      "Automated ledger & inventory reconciliation",
      "Database failover & high-availability setup",
      "Staging preview builds & 30-day post-launch warranty",
    ],
    ctaText: "Start Growth Scope",
    isPopular: true,
  },
  {
    name: "Enterprise & High-Availability SLA",
    priceKES: "From KES 2.0M+",
    priceUSD: "~$15,000+ / Quoted",
    timeline: "Phased Milestone Roadmap",
    badge: "Mission Critical",
    description: "Mission-critical financial cores, distributed infrastructure, and strict enterprise uptime SLAs.",
    deliverables: [
      "Distributed core banking or logistics engine",
      "Layer-3 10GbE networking & multi-site SD-WAN",
      "Sub-50ms P99 database optimization",
      "Dedicated 24/7 incident response SLA",
      "Bilateral master service agreement (MSA)",
    ],
    ctaText: "Request Enterprise Consultation",
    isPopular: false,
  },
];

export default function HomePageClient({ portfolioProjects }: HomePageClientProps) {
  const [selectedSector, setSelectedSector] = useState<string>("All");

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactCategory, setContactCategory] = useState("Custom Web Platform");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setContactSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: `${contactCategory}${contactCompany ? ` · ${contactCompany}` : ""}`,
          message: contactMessage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setContactSuccess(true);
      toast.success("Inquiry received. Our engineering team will contact you within 2 hours.");
      setContactName("");
      setContactEmail("");
      setContactCompany("");
      setContactMessage("");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please email us directly at bezaleltech@gmail.com");
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleSectorClick = (sector: string) => {
    setSelectedSector(sector);
    const target = document.getElementById("portfolio");
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const filteredProjects = selectedSector === "All"
    ? portfolioProjects
    : portfolioProjects.filter((p) =>
        p.sector?.toLowerCase().includes(selectedSector.toLowerCase()) ||
        p.category?.toLowerCase().includes(selectedSector.toLowerCase()) ||
        p.techTags.some((t) => t.toLowerCase().includes(selectedSector.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Header */}
      <Header />

      <main>
        {/* 2. Hero — Split Layout: Dark Typography Statement + Live Multi-Sector Terminal */}
        <section
          id="home"
          className="relative min-h-[88svh] sm:min-h-[92svh] overflow-hidden bg-[#050D17] text-white pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 flex items-center"
        >
          {/* Subtle Technical Engineering Grid */}
          <div
            className="absolute inset-0 opacity-[0.14] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(201, 162, 75, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201, 162, 75, 0.35) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Deep Atmospheric Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(201, 162, 75, 0.16) 0%, rgba(5, 13, 23, 0.85) 50%, rgba(5, 13, 23, 0.99) 100%)",
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8 min-w-0 overflow-hidden">
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center w-full min-w-0">
              {/* Hero Left: Plain Language Headline + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="w-full min-w-0 max-w-full"
              >
                <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#C9A24B]/35 bg-[#C9A24B]/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-[0.06em] xs:tracking-[0.12em] sm:tracking-[0.2em] text-accent-light backdrop-blur-md max-w-full">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A24B]" />
                  <span className="truncate">Global Engineering Partner · HQ Nairobi, Kenya</span>
                </div>

                <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.12] sm:leading-[1.05] tracking-tight text-white text-balance">
                  Software and infrastructure for organisations that cannot afford downtime.
                </h1>

                <p className="mt-4 sm:mt-6 max-w-xl text-xs xs:text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-8 text-white/85">
                  Bezalel Technologies architects dependable, mission-critical systems for companies, startups, and institutions worldwide: bespoke web portals, cloud systems, mobile apps, IT infrastructure, and payment integrations.
                </p>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
                  <Link
                    href="/projects/request"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-accent-foreground shadow-md transition-colors hover:bg-accent-light text-center"
                  >
                    Start a project
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>

                  <a
                    href="https://wa.me/254796157265"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/[0.04] px-5 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-white/10 hover:border-white/40 text-center"
                  >
                    Talk on WhatsApp
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-4 sm:gap-x-6 gap-y-2 border-t border-white/15 pt-4 sm:pt-6 text-[10px] xs:text-[11px] sm:text-xs text-white/70">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#C9A24B] shrink-0" />
                    Fixed-milestone quotations
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#C9A24B] shrink-0" />
                    Full source code ownership
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#C9A24B] shrink-0" />
                    Worldwide remote delivery & SLAs
                  </span>
                </div>
              </motion.div>

              {/* Hero Right: Real Product Panel Proof */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
                className="w-full min-w-0 max-w-full"
              >
                <HeroProductMockup />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. Stats Strip */}
        <section className="border-b border-border bg-card px-3 xs:px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-7xl 3xl:max-w-[1600px]">
            <div className="grid gap-3 xs:gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/80 bg-background/50 p-3.5 xs:p-4 sm:p-5 shadow-xs"
                >
                  <p className="font-display text-2xl xs:text-3xl sm:text-4xl font-black text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs xs:text-sm font-bold text-accent-dark dark:text-accent-light">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Industries Served — Interactive Filter Tags */}
        <section className="border-b border-border bg-background px-3 xs:px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-7xl 3xl:max-w-[1600px]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <span className="shrink-0 text-[10px] xs:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Sectors Served (Filter):
              </span>
              <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
                <button
                  type="button"
                  onClick={() => handleSectorClick("All")}
                  className={`rounded-md border px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-colors ${
                    selectedSector === "All"
                      ? "border-accent bg-accent text-accent-foreground shadow-xs"
                      : "border-border bg-card text-foreground hover:border-foreground/30"
                  }`}
                >
                  All Sectors
                </button>
                {industries.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => handleSectorClick(ind)}
                    className={`rounded-md border px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-colors ${
                      selectedSector === ind
                        ? "border-accent bg-accent text-accent-foreground shadow-xs"
                        : "border-border bg-card text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Services (4 Focused Cards with Subtle Image Textures) */}
        <section id="services" className="px-3 xs:px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl 3xl:max-w-[1600px]">
            <div className="max-w-3xl">
              <p className="mb-3 text-[10px] xs:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Our Services
              </p>
              <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Practical engineering scoped for the way your organization operates.
              </h2>
            </div>

            <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
              {services.map(({ title, description, proof, icon: Icon, bgImage }) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 xs:p-6 sm:p-8 shadow-sm flex flex-col justify-between"
                >
                  {/* Subtle Background Image on Hover */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-500 group-hover:opacity-[0.06] dark:group-hover:opacity-[0.12] pointer-events-none"
                    style={{ backgroundImage: `url('${bgImage}')` }}
                  />

                  <div className="relative z-10">
                    <div className="mb-4 sm:mb-5 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg xs:text-xl font-bold tracking-tight text-foreground">{title}</h3>
                    <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                  <p className="relative z-10 mt-4 sm:mt-5 border-t border-border pt-3.5 sm:pt-4 text-xs font-semibold leading-relaxed text-foreground">
                    {proof}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5b. Client Testimonials & Verifiable Delivery */}
        <section id="testimonials" className="border-b border-border bg-card/60 px-3 xs:px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl 3xl:max-w-[1600px]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-10">
              <div>
                <p className="mb-2 text-[10px] xs:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                  Client Endorsements
                </p>
                <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  Tested under real transactional loads.
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-[#C9A24B] shrink-0" />
                <span>Verifiable enterprise deployments</span>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.author}
                  className="rounded-xl border border-border bg-background/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-[#C9A24B] mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[#C9A24B]" />
                      ))}
                      <span className="ml-2 text-[11px] font-bold text-accent-dark dark:text-accent-light uppercase tracking-wider">
                        {t.metric}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs shrink-0">
                      {t.author.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{t.author}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {t.role} · <span className="font-medium text-foreground/80">{t.company}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Portfolio Teaser with Clickable Live Client Links & Filters */}
        <section id="portfolio" className="bg-[#050D17] text-white px-3 xs:px-4 py-12 sm:px-6 sm:py-20 lg:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl 3xl:max-w-[1600px]">
            <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="mb-2 sm:mb-3 text-[10px] xs:text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24B]">
                  Engineering Portfolio
                </p>
                <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
                  Proven systems across financial cores, logistics, and infrastructure.
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C9A24B] hover:text-white shrink-0 transition-colors"
              >
                See full archive
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Filter Chips */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2">
              {["All", "SACCO / FinTech", "Agribusiness", "Logistics", "Commerce", "Infrastructure"].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSector(sec)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedSector.toLowerCase() === sec.toLowerCase()
                      ? "bg-[#C9A24B] text-black font-bold shadow-xs"
                      : "bg-white/[0.08] text-white/80 hover:bg-white/[0.14] hover:text-white border border-white/10"
                  }`}
                >
                  {sec}
                </button>
              ))}
              {selectedSector !== "All" && (
                <button
                  type="button"
                  onClick={() => setSelectedSector("All")}
                  className="text-xs text-white/60 hover:text-white underline ml-2"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {/* Projects Grid */}
            <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <article
                  key={project.id || project.name}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] hover:border-white/20 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-black/40 relative">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="h-full w-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300"
                      />
                      {project.outcome && (
                        <div className="absolute bottom-2 left-2 right-2 rounded-md bg-black/85 backdrop-blur-md px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-[#C9A24B] border border-[#C9A24B]/30 truncate">
                          {project.outcome}
                        </div>
                      )}
                    </div>
                    <div className="p-4 xs:p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A24B]">
                          {project.sector || project.category || "Engineering"}
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          {project.clientLogoUrl && (
                            <img
                              src={project.clientLogoUrl}
                              alt=""
                              aria-hidden="true"
                              className="h-3.5 w-3.5 rounded-xs object-contain bg-white/10 p-0.5 shrink-0"
                            />
                          )}
                          <span className="text-xs text-white/60 font-medium truncate">{project.clientName}</span>
                        </div>
                      </div>

                      <h3 className="text-lg xs:text-xl font-bold tracking-tight text-white">{project.name}</h3>
                      <p className="mt-2.5 sm:mt-3 text-xs leading-relaxed text-white/70">
                        {project.description}
                      </p>

                      {project.techTags && project.techTags.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {project.techTags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[10px] font-mono text-white/75"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 xs:p-5 sm:p-6 pt-0 border-t border-white/10 mt-4 flex items-center justify-between">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A24B] hover:text-white mt-3"
                      >
                        <span>View live system</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-white/40 mt-3 font-medium">Enterprise deployment</span>
                    )}

                    <Link
                      href="/projects/request"
                      className="text-xs text-white/60 hover:text-[#C9A24B] mt-3 font-medium flex items-center gap-1"
                    >
                      Scope similar
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="mt-8 text-center py-12 border border-dashed border-white/20 rounded-xl">
                <p className="text-sm text-white/70">No projects match the selected sector filter.</p>
                <button
                  type="button"
                  onClick={() => setSelectedSector("All")}
                  className="mt-3 text-xs font-bold text-[#C9A24B] hover:underline"
                >
                  Show all projects
                </button>
              </div>
            )}

            {/* Regional Client Telemetry Deployment Radar */}
            <div className="mt-14 sm:mt-18 pt-8 border-t border-white/10">
              <DeploymentRadarMap />
            </div>
          </div>
        </section>

        {/* 7. Tech Arsenal */}
        <TechArsenal />

        {/* 8. Approach — "We listen. We understand. We build." */}
        <section id="approach" className="relative overflow-hidden px-3 xs:px-4 py-12 sm:px-6 sm:py-20 lg:py-24 border-b border-border">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: "url('/BG_images/team-collaborates-digitally-stockcake.jpg')" }}
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="mb-2 sm:mb-3 text-[10px] xs:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
              Engineering Approach
            </p>
            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-foreground">
              We listen. We understand. We build.
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-8 text-muted-foreground">
              We approach engineering as senior technical partners, not ticket-takers. Before writing a line of code or terminating fiber, we map your operations, identify points of failure, and agree on clear milestone deliverables. Every system is built to run reliably in production with full source code ownership, transparent milestone delivery, and international engineering standards.
            </p>

            <div className="mt-6 sm:mt-8 flex justify-center">
              <Link
                href="/projects/request"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-accent-dark dark:text-accent-light hover:underline"
              >
                Submit a brief for an objective assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 9. Pricing & Engagement Models (Transparent 3-Tier Grid) */}
        <section id="pricing" className="bg-secondary/35 px-3 xs:px-4 py-12 sm:px-6 sm:py-20 border-b border-border">
          <div className="mx-auto max-w-7xl 3xl:max-w-[1600px]">
            <div className="max-w-3xl mb-8 sm:mb-12">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-accent-dark dark:text-accent-light shrink-0" />
                <span className="text-[10px] xs:text-xs font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent-light">
                  Transparent Engagement Model
                </span>
              </div>
              <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                Predictable milestone pricing. No recurring per-user software tax.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Clear deliverables, fixed-price phase schedules, and 100% full source code ownership upon handover.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 items-stretch">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border p-6 flex flex-col justify-between relative transition-all ${
                    tier.isPopular
                      ? "border-accent bg-card shadow-lg ring-1 ring-accent/30"
                      : "border-border bg-card/80 shadow-xs"
                  }`}
                >
                  {tier.badge && (
                    <span
                      className={`absolute -top-3 left-6 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        tier.isPopular
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-foreground border border-border"
                      }`}
                    >
                      {tier.badge}
                    </span>
                  )}

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{tier.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{tier.description}</p>

                    <div className="mt-5 pb-5 border-b border-border">
                      <p className="font-display text-2xl xs:text-3xl font-black text-foreground">
                        {tier.priceKES}
                      </p>
                      <p className="text-xs font-semibold text-accent-dark dark:text-accent-light mt-0.5">
                        {tier.priceUSD}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Timeline: <span className="font-medium text-foreground">{tier.timeline}</span>
                      </p>
                    </div>

                    <div className="mt-5 space-y-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Deliverables Include:
                      </p>
                      {tier.deliverables.map((del) => (
                        <div key={del} className="flex items-start gap-2 text-xs text-foreground/90">
                          <CheckCircle2 className="h-4 w-4 text-[#C9A24B] shrink-0 mt-0.5" />
                          <span className="leading-snug">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border">
                    <Link
                      href="/projects/request"
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors ${
                        tier.isPopular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                          : "border border-border bg-background hover:bg-muted text-foreground"
                      }`}
                    >
                      {tier.ctaText}
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom Architecture Scope</p>
                <h4 className="text-sm sm:text-base font-bold text-foreground mt-0.5">Need a detailed itemized RFP or board-ready proposal?</h4>
                <p className="text-xs text-muted-foreground mt-1">We evaluate technical specifications and issue formal itemized quotations with milestone SLAs within 24 hours.</p>
              </div>
              <Link
                href="/projects/request"
                className="shrink-0 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground hover:bg-accent-light"
              >
                Generate Itemized Quotation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 10. Story Section — The Bezalel Craft & Standard with Engineering Showcase Image */}
        <section id="story" className="px-3 xs:px-4 py-12 sm:px-6 sm:py-20 lg:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl 3xl:max-w-[1600px]">
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-accent-dark dark:text-accent-light shrink-0 mt-1 opacity-80" />
                  <div>
                    <p className="text-[10px] xs:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                      Our Origin & Craft
                    </p>
                    <h2 className="mt-1.5 sm:mt-2 font-display text-2xl xs:text-3xl sm:text-4xl font-black leading-tight tracking-tight text-foreground">
                      Building with skill, wisdom, and craftsmanship in all workmanship.
                    </h2>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4 text-xs sm:text-base leading-relaxed sm:leading-8 text-muted-foreground">
                  <p>
                    Named after the artisan appointed in antiquity with intelligence, knowledge, and craft in all manner of workmanship (<span className="text-foreground font-semibold">Exodus 31</span>), Bezalel Technologies was founded with a foundational belief: ambitious enterprises worldwide deserve digital and physical engineering built with genuine precision.
                  </p>
                  <p>
                    We reject superficial solutions and fragile shortcuts. Whether designing a high-volume transactional web system, building mobile apps for cross-border logistics, wiring executive boardroom AV, or deploying enterprise cloud backends, we treat every system as mission-critical infrastructure.
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 rounded-lg border border-border bg-card p-4 sm:p-5">
                  <p className="text-xs sm:text-sm italic text-foreground font-medium leading-relaxed">
                    &ldquo;True engineering craftsmanship is not about buzzwords—it is about building systems that stay up, settle payments accurately, and serve your team without fail across borders.&rdquo;
                  </p>
                  <p className="mt-2.5 sm:mt-3 text-[10px] xs:text-xs font-bold text-accent-dark dark:text-accent-light uppercase tracking-wider">
                    Leyian B. — Lead Engineer & Founder, Bezalel Technologies
                  </p>
                </div>
              </div>

              {/* Story Visual Card */}
              <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/BG_images/group-african-american-business-people-working-office-together_1086199-10130.jpg"
                    alt="Bezalel Technologies engineering and deployment collaboration"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="border-t border-border bg-background/95 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent-dark dark:text-accent-light shrink-0" />
                    <span className="text-xs font-bold text-foreground truncate">
                      Engineering HQ & Worldwide Operations
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground shrink-0">
                    HQ: Nairobi · Serving Globally
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Store Mention */}
        <section id="store" className="border-b border-border bg-card px-3 xs:px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto flex max-w-7xl 3xl:max-w-[1600px] flex-col gap-4 sm:gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg xs:text-xl font-bold tracking-tight text-foreground">
                  Hardware, Equipment & Technical Packages
                </h3>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                  Browse tested server hardware, networking kits, and software components in our store. Custom systems start with a project brief.
                </p>
              </div>
            </div>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light hover:underline shrink-0"
            >
              Browse the store
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* 12. Direct Inquiry & Contact Form */}
        <section id="contact" className="px-3 xs:px-4 py-12 sm:px-6 sm:py-20 lg:py-24 border-t border-border bg-background">
          <div className="relative overflow-hidden mx-auto max-w-7xl 3xl:max-w-[1600px] rounded-2xl border border-border bg-card p-5 xs:p-7 sm:p-10 shadow-sm">
            {/* Atmospheric technical grid */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
              style={{ backgroundImage: "url('/BG_images/AdobeStock_292953404-scaled.jpeg')" }}
            />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              {/* Left Details */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  Engineering Consultation
                </div>
                <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-foreground">
                  Direct inquiry to our engineering leads.
                </h2>
                <p className="mt-3.5 text-xs sm:text-base leading-relaxed text-muted-foreground">
                  Need an urgent system audit, bespoke platform scoping, or infrastructure overhaul? Send an inquiry directly or request an itemized formal proposal.
                </p>

                <div className="mt-6 space-y-3 border-y border-border py-5 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-accent shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Direct Technical Inquiries</p>
                      <a href="mailto:bezaleltech@gmail.com" className="font-semibold text-foreground hover:underline">
                        bezaleltech@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-accent shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Direct Line & WhatsApp</p>
                      <a href="https://wa.me/254796157265" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">
                        +254 796 157 265
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Engineering HQ & Systems Lab</p>
                      <p className="font-semibold text-foreground">Valley View Office Park</p>
                      <p className="text-[11px] text-muted-foreground">2nd Floor, Block 1, Parklands · Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs text-muted-foreground mb-2">Need a formal milestone quotation instead?</p>
                  <Link
                    href="/projects/request"
                    className="inline-flex items-center gap-2 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
                  >
                    Open the Step-by-Step Project Scoping Form
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Form */}
              <div className="rounded-xl border border-border/90 bg-background/95 p-5 sm:p-7 shadow-xs">
                {contactSuccess ? (
                  <div className="text-center py-8">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">Inquiry Received</h3>
                    <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      Thank you. Your message has reached our lead engineering desk. We review incoming architecture briefs and reply within 2 business hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactSuccess(false)}
                      className="mt-5 inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="font-display text-base font-bold text-foreground">Send an Engineering Brief</h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. David Kipkorir"
                          className="w-full rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Work Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. david@enterprise.co.ke"
                          className="w-full rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          value={contactCompany}
                          onChange={(e) => setContactCompany(e.target.value)}
                          placeholder="e.g. Osotua Dairy Co-op"
                          className="w-full rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Project Category
                        </label>
                        <select
                          value={contactCategory}
                          onChange={(e) => setContactCategory(e.target.value)}
                          className="w-full rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                        >
                          <option value="SACCO / Core Banking">SACCO / Core Banking</option>
                          <option value="Agribusiness ERP & Supply Chain">Agribusiness ERP & Supply Chain</option>
                          <option value="Logistics & Fleet Telemetry">Logistics & Fleet Telemetry</option>
                          <option value="Custom Web Platform">Custom Web Platform</option>
                          <option value="Mobile App (iOS & Android)">Mobile App (iOS & Android)</option>
                          <option value="IT Infrastructure & Boardroom AV">IT Infrastructure & Boardroom AV</option>
                          <option value="Other Architecture Scope">Other Architecture Scope</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Requirements / Scope Details <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Describe your current system, performance challenges, target timeline, or desired integrations..."
                        className="w-full rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-3 px-4 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {contactSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Transmitting to Engineering...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Direct Inquiry</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-muted-foreground">
                      Guaranteed non-disclosure. All intellectual property and technical diagrams remain strictly private.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
