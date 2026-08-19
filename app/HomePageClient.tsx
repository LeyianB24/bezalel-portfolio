/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroProductMockup from "@/components/HeroProductMockup";
import TechArsenal from "@/components/TechArsenal";

export interface PortfolioTeaserItem {
  id: string;
  name: string;
  clientName: string;
  clientLogoUrl?: string | null;
  category?: string;
  description: string;
  image: string;
  liveUrl?: string | null;
  techTags: string[];
}

interface HomePageClientProps {
  portfolioProjects: PortfolioTeaserItem[];
}

const heroImages = [
  "/BG_images/business-people-meeting-high-tech-it-office_236854-48620.avif",
  "/BG_images/group-african-american-business-people-working-office-together_1086199-10130.jpg",
  "/BG_images/AdobeStock_292953404-scaled.jpeg",
  "/BG_images/team-collaborates-digitally-stockcake.jpg",
];

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

export default function HomePageClient({ portfolioProjects }: HomePageClientProps) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Header */}
      <Header />

      <main>
        {/* 2. Hero — Split Layout with Background Slideshow & Product Proof */}
        <section
          id="home"
          className="relative min-h-[92svh] overflow-hidden bg-primary text-white pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center"
        >
          {/* Ken Burns Background Slideshow */}
          <AnimatePresence initial={false}>
            <motion.img
              key={heroImages[activeImage]}
              src={heroImages[activeImage]}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.0 }}
              animate={{ opacity: 0.22, scale: 1.06 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            />
          </AnimatePresence>

          {/* Technical Engineering Grid Overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #C9A24B 1px, transparent 1px), linear-gradient(to bottom, #C9A24B 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Deep Navy Scrim Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 75% 25%, rgba(201, 162, 75, 0.12) 0%, rgba(5, 13, 23, 0.88) 55%, rgba(5, 13, 23, 0.98) 100%)",
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              {/* Hero Left: Plain Language Headline + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/35 bg-[#C9A24B]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-accent-light backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]" />
                  Global Delivery · HQ Nairobi, Kenya · Senior Engineering Partner
                </div>

                <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl text-white">
                  Software and infrastructure for organisations that cannot afford downtime.
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
                  Bezalel Technologies architects dependable, mission-critical systems for companies, startups, and institutions worldwide: bespoke web portals, cloud systems, mobile apps, IT infrastructure, and payment integrations.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/projects/request"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 text-sm font-bold text-accent-foreground shadow-md transition-colors hover:bg-accent-light"
                  >
                    Start a project
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="https://wa.me/254796157265"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10 hover:border-white/40"
                  >
                    Talk on WhatsApp
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-xs text-white/70">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C9A24B]" />
                    Fixed-milestone quotations
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C9A24B]" />
                    Full source code ownership
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C9A24B]" />
                    Worldwide remote delivery & SLAs
                  </span>
                </div>
              </motion.div>

              {/* Hero Right: Real Product Panel Proof */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
                className="w-full"
              >
                <HeroProductMockup />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. Stats Strip */}
        <section className="border-b border-border bg-card px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/80 bg-background/50 p-5 shadow-xs"
                >
                  <p className="font-display text-3xl font-black text-foreground sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-bold text-accent-dark dark:text-accent-light">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Industries Served — Plain Tag Grid */}
        <section className="border-b border-border bg-background px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <span className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Sectors Served:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {industries.map((ind, idx) => (
                  <span
                    key={ind}
                    className="inline-flex items-center text-xs font-medium text-foreground/85"
                  >
                    <span className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold">
                      {ind}
                    </span>
                    {idx < industries.length - 1 && (
                      <span className="mx-2 hidden text-muted-foreground/40 sm:inline">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Services (4 Focused Cards with Subtle Image Textures) */}
        <section id="services" className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Our Services
              </p>
              <h2 className="font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Practical engineering scoped for the way your organization operates.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {services.map(({ title, description, proof, icon: Icon, bgImage }) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8 flex flex-col justify-between"
                >
                  {/* Subtle Background Image on Hover */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-500 group-hover:opacity-[0.06] dark:group-hover:opacity-[0.12] pointer-events-none"
                    style={{ backgroundImage: `url('${bgImage}')` }}
                  />

                  <div className="relative z-10">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                  <p className="relative z-10 mt-5 border-t border-border pt-4 text-xs font-semibold leading-relaxed text-foreground">
                    {proof}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Portfolio Teaser with Clickable Live Client Links (Dynamic from DB) */}
        <section id="portfolio" className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-light">
                  Selected Work
                </p>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Engineering proof across web systems, mobile apps, and infrastructure.
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-bold text-accent-light hover:text-white"
              >
                See all portfolio work
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {portfolioProjects.map((project) => (
                <article
                  key={project.id || project.name}
                  className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-black/20">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="h-full w-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-light">
                          {project.techTags[0] || "Engineering"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {project.clientLogoUrl && (
                            <img
                              src={project.clientLogoUrl}
                              alt=""
                              aria-hidden="true"
                              className="h-3.5 w-3.5 rounded-xs object-contain bg-white/10 p-0.5"
                            />
                          )}
                          <span className="text-xs text-white/60 font-medium">{project.clientName}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black tracking-tight text-white">{project.name}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-primary-foreground/75">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5 mt-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-light hover:text-white mt-3"
                      >
                        <span>View live system</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Tech Arsenal (Reinstated with restrained styling) */}
        <TechArsenal />

        {/* 8. Approach — "We listen. We understand. We build." */}
        <section id="approach" className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 border-b border-border">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: "url('/BG_images/team-collaborates-digitally-stockcake.jpg')" }}
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
              Engineering Approach
            </p>
            <h2 className="font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl text-foreground">
              We listen. We understand. We build.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              We approach engineering as senior technical partners, not ticket-takers. Before writing a line of code or terminating fiber, we map your operations, identify points of failure, and agree on clear milestone deliverables. Every system is built to run reliably in production with full source code ownership, transparent milestone delivery, and international engineering standards.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/projects/request"
                className="inline-flex items-center gap-2 text-sm font-bold text-accent-dark dark:text-accent-light hover:underline"
              >
                Submit a brief for an objective assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 9. Pricing & Itemized Scoping (Transparent Bespoke Scoping) */}
        <section className="bg-secondary/40 px-4 py-16 sm:px-6 sm:py-20 border-b border-border">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 rounded-xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent-dark dark:text-accent-light" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent-light">
                    Transparent Scoping
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  Bespoke software with itemized milestone pricing.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Because every enterprise workflow is different, we do not force your business into rigid subscription tiers. We evaluate your exact technical requirements and generate a binding, itemized quotation with clear deliverables and transparent milestones.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C9A24B]" />
                    <span>Itemized PDF quotation breakdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C9A24B]" />
                    <span>No recurring per-user software tax</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C9A24B]" />
                    <span>Clear phase-by-phase payment schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C9A24B]" />
                    <span>Complete source code and admin rights</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-lg border border-border/80 bg-background/80 p-6 text-center shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Instant Project Scoping
                </p>
                <p className="mt-2 font-display text-2xl font-black text-foreground">
                  Need a formal quotation?
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Answer a few structured technical questions to receive an official itemized PDF proposal.
                </p>
                <Link
                  href="/projects/request"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Generate quotation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Story Section — The Bezalel Craft & Standard with Engineering Showcase Image */}
        <section id="story" className="px-4 py-16 sm:px-6 sm:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="flex items-start gap-4">
                  <Quote className="h-8 w-8 text-accent-dark dark:text-accent-light shrink-0 mt-1 opacity-80" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                      Our Origin & Craft
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl text-foreground">
                      Building with skill, wisdom, and craftsmanship in all workmanship.
                    </h2>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                  <p>
                    Named after the artisan appointed in antiquity with intelligence, knowledge, and craft in all manner of workmanship (<span className="text-foreground font-semibold">Exodus 31</span>), Bezalel Technologies was founded with a foundational belief: ambitious enterprises worldwide deserve digital and physical engineering built with genuine precision.
                  </p>
                  <p>
                    We reject superficial solutions and fragile shortcuts. Whether designing a high-volume transactional web system, building mobile apps for cross-border logistics, wiring executive boardroom AV, or deploying enterprise cloud backends, we treat every system as mission-critical infrastructure.
                  </p>
                </div>

                <div className="mt-8 rounded-lg border border-border bg-card p-5">
                  <p className="text-sm italic text-foreground font-medium">
                    &ldquo;True engineering craftsmanship is not about buzzwords—it is about building systems that stay up, settle payments accurately, and serve your team without fail across borders.&rdquo;
                  </p>
                  <p className="mt-3 text-xs font-bold text-accent-dark dark:text-accent-light uppercase tracking-wider">
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
                <div className="border-t border-border bg-background/95 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent-dark dark:text-accent-light" />
                    <span className="text-xs font-bold text-foreground">
                      Engineering HQ & Worldwide Operations
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    HQ: Nairobi · Serving Globally
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Store Mention (Modest Card) */}
        <section id="store" className="border-b border-border bg-card px-4 py-10 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
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

        {/* 12. Final CTA with Atmospheric Backdrop */}
        <section id="contact" className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="relative overflow-hidden mx-auto grid max-w-7xl gap-8 rounded-xl border border-border bg-card p-6 shadow-sm md:grid-cols-[1fr_0.8fr] md:p-10">
            {/* Subtle Atmospheric Backdrop */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
              style={{ backgroundImage: "url('/BG_images/AdobeStock_292953404-scaled.jpeg')" }}
            />

            <div className="relative z-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Start a conversation
              </p>
              <h2 className="font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Tell us what needs to be built, fixed, or modernized.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Share your workflows, pain points, budget expectations, and deadlines. We assess requirements for clients worldwide and respond with a formal quotation.
              </p>
            </div>
            <div className="relative z-10 flex flex-col justify-center gap-3">
              <Link
                href="/projects/request"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-4 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
              >
                Submit a project brief
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:bezaleltech@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-4 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-accent"
              >
                Email Bezalel directly
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className="mt-2 grid gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-accent-dark dark:text-accent-light" />
                  Global Software & Infrastructure Engineering · Serving Clients Worldwide
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-dark dark:text-accent-light" />
                  All technical briefs and discussions are held in strict confidence
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
