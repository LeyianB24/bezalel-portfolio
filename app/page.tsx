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
  MonitorUp,
  Network,
  ShieldCheck,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const heroImages = [
  "/BG_images/business-people-meeting-high-tech-it-office_236854-48620.avif",
  "/BG_images/group-african-american-business-people-working-office-together_1086199-10130.jpg",
  "/BG_images/AdobeStock_292953404-scaled.jpeg",
  "/BG_images/team-collaborates-digitally-stockcake.jpg",
];

const proofItems = [
  "Boardroom AV and collaboration systems for institutional teams",
  "Member and payment workflows for SACCO-style operations",
  "CCTV and technology governance support for managed estates",
  "Web systems, admin dashboards, and business reporting tools",
];

const services = [
  {
    title: "Software and Web Systems",
    description:
      "Custom portals, internal dashboards, and automated workflow systems built for teams that require reliable daily operations.",
    proof: "Designed for member records, service requests, reporting, approvals, and customer self-service.",
    icon: MonitorUp,
  },
  {
    title: "IT Infrastructure & Boardroom AV",
    description:
      "Structured cabling, managed networks, high-definition boardroom AV, CCTV surveillance, and biometric access control.",
    proof: "Engineered for corporate offices, estates, and institutions that cannot afford network interruptions.",
    icon: Network,
  },
  {
    title: "Payments & API Integration",
    description:
      "M-Pesa Daraja, Stripe, bank transfer rails, and transactional databases integrated cleanly into existing business software.",
    proof: "Eliminates manual payment matching with automated reconciliation and instant notifications.",
    icon: CreditCard,
  },
  {
    title: "Audits, Support & System Modernization",
    description:
      "Independent technical code audits, performance fixes, architecture documentation, and ongoing maintenance SLAs.",
    proof: "Ideal when you inherit legacy codebases or need reliable ongoing engineering support.",
    icon: Wrench,
  },
];

const portfolioTeasers = [
  {
    title: "BezaShop Commerce Platform",
    clientName: "BezaShop Retail",
    category: "Web Systems",
    description:
      "Inventory synchronization, multi-channel payment reconciliation, and automated invoice dispatch with sub-80ms response times.",
    image: "/images/web_system.png",
    liveUrl: "https://bezalel.website",
  },
  {
    title: "NexoLogistics Field Ops Suite",
    clientName: "Nexo Freight EA",
    category: "Mobile Apps",
    description:
      "Offline-capable mobile dispatch and driver manifests with instant synchronization upon network reconnection.",
    image: "/images/mobile_app.png",
    liveUrl: "https://bezalel.website",
  },
  {
    title: "DataBridge Multi-Rail Gateway",
    clientName: "Apex Financial Systems",
    category: "API & Infra",
    description:
      "Unified payments middleware handling automated STK push retries, webhook signature verifications, and bank integrations.",
    image: "/images/hero_banner.png",
    liveUrl: "https://bezalel.website",
  },
];

const processSteps = [
  {
    title: "Share the problem",
    description: "Submit a project brief with your workflow goals, timeline expectations, budget range, and current pain points.",
  },
  {
    title: "Receive an itemized quote",
    description: "We review the technical requirements and send an official PDF quotation with transparent milestone pricing.",
  },
  {
    title: "Build with regular checkpoints",
    description: "Engineering is executed in staged milestones with staging previews so you test features before launch day.",
  },
  {
    title: "Handover and operational support",
    description: "You receive full source code access, admin documentation, staff onboarding, and ongoing technical support.",
  },
];

export default function Home() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Section 2: Hero with Ken Burns Slideshow & Locked Scrim */}
        <section id="home" className="relative min-h-[92svh] overflow-hidden bg-primary text-white">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroImages[activeImage]}
              src={heroImages[activeImage]}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.0 }}
              animate={{ opacity: 1, scale: 1.08 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          
          {/* Locked Navy-to-Black Gradient Scrim */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(5,13,23,0.55) 0%, rgba(5,13,23,0.75) 60%, rgba(5,13,23,0.92) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 lg:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.24em] text-accent-light backdrop-blur">
                Software & IT Infrastructure Engineering
              </p>
              <h1 className="font-display text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Software and infrastructure for organisations that cannot afford downtime.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Bezalel Technologies builds dependable systems for Kenyan SMEs, SACCOs, estates, and institutions: custom web systems, IT infrastructure, boardroom AV, and payment integrations.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/projects/request"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light shadow-sm"
                >
                  Start a project brief
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/254796157265"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Talk on WhatsApp
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 3: Credibility Strip */}
        <section className="border-b border-border bg-background px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
            {proofItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark dark:text-accent-light" />
                <p className="text-xs font-semibold leading-relaxed text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Services */}
        <section id="services" className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Our Services
              </p>
              <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Practical engineering scoped for the way your organization operates.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {services.map(({ title, description, proof, icon: Icon }) => (
                <article key={title} className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                  <p className="mt-5 border-t border-border pt-4 text-xs font-semibold leading-relaxed text-foreground">
                    {proof}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Portfolio Teaser with Clickable Live Client Links */}
        <section id="portfolio" className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-light">
                  Selected Work
                </p>
                <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
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
              {portfolioTeasers.map((project) => (
                <article key={project.title} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-black/20">
                      <img src={project.image} alt={project.title} className="h-full w-full object-cover opacity-85" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-light">{project.category}</span>
                        <span className="text-xs text-white/60 font-medium">{project.clientName}</span>
                      </div>
                      <h3 className="text-xl font-black tracking-tight text-white">{project.title}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-primary-foreground/75">{project.description}</p>
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

        {/* Section 6: Process */}
        <section id="process" className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                  Our Process
                </p>
                <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  A predictable path from first brief to technical handover.
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  We structure projects around explicit milestones, transparent communications, and accountable engineering delivery.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {processSteps.map((step, index) => (
                  <article key={step.title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md border border-accent/35 bg-accent/10 text-sm font-black text-accent-dark dark:text-accent-light">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Store Mention */}
        <section id="store" className="border-y border-border bg-card px-4 py-10 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Hardware, Equipment & Technical Packages</h2>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                  Browse tested server hardware, networking kits, and software components in our store. Custom systems start with a project brief.
                </p>
              </div>
            </div>
            <Link 
              href="/store" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light hover:underline"
            >
              Browse the store
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Section 8: Final CTA */}
        <section id="contact" className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-border bg-card p-6 shadow-sm md:grid-cols-[1fr_0.8fr] md:p-10">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Start a conversation
              </p>
              <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Tell us what needs to be built, fixed, or modernized.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Share your workflows, pain points, budget expectations, and deadlines. We will assess requirements and respond with a formal quotation.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3">
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
                  Based in Nairobi, Kenya · Serving East African Enterprises
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
