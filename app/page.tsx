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
    title: "Software and web systems",
    description:
      "Custom websites, portals, dashboards, and workflow systems for teams that need more than a brochure site.",
    proof: "Useful for member records, service requests, reporting, approvals, and customer self-service.",
    icon: MonitorUp,
  },
  {
    title: "IT infrastructure and AV",
    description:
      "Network, boardroom, CCTV, access, and meeting-room technology planned around daily business use.",
    proof: "Built for offices, estates, institutions, and teams that cannot afford unreliable setups.",
    icon: Network,
  },
  {
    title: "Payments and data workflows",
    description:
      "M-Pesa, Stripe, notifications, forms, and database workflows connected into practical business systems.",
    proof: "Designed to reduce manual follow-up and give management cleaner operating visibility.",
    icon: CreditCard,
  },
  {
    title: "Support and systems improvement",
    description:
      "Audits, fixes, documentation, handover, and support for teams inheriting messy or incomplete systems.",
    proof: "Useful when the real problem is reliability, not another flashy rebuild.",
    icon: Wrench,
  },
];

const portfolioTeasers = [
  {
    title: "Institutional operations systems",
    category: "Software",
    description:
      "Internal tools for requests, member records, transactions, reporting, and admin oversight.",
    image: "/images/web_system.png",
  },
  {
    title: "Office and estate technology",
    category: "Infrastructure",
    description:
      "AV, CCTV, networking, documentation, and support built around accountable daily use.",
    image: "/BG_images/coporate.avif",
  },
  {
    title: "Customer-facing digital products",
    category: "Web and mobile",
    description:
      "Responsive web experiences, storefronts, forms, dashboards, and mobile-ready workflows.",
    image: "/images/mobile_app.png",
  },
];

const processSteps = [
  {
    title: "Share the problem",
    description: "You send the brief, budget range, timeline, and any existing documents or screenshots.",
  },
  {
    title: "Get a practical quote",
    description: "We clarify scope, identify risks, and send a realistic estimate instead of vague promises.",
  },
  {
    title: "Build with checkpoints",
    description: "Delivery is split into visible milestones so you can review progress before launch day.",
  },
  {
    title: "Handover and support",
    description: "You get documentation, admin access, and a support path for the people using the system.",
  },
];

export default function Home() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <section id="home" className="relative min-h-[92svh] overflow-hidden bg-primary text-white">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroImages[activeImage]}
              src={heroImages[activeImage]}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1.08 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,13,23,0.90),rgba(5,13,23,0.68)_48%,rgba(5,13,23,0.34))]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 lg:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-accent-light backdrop-blur">
                Software and IT infrastructure
              </p>
              <h1 className="font-display text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Software and infrastructure for Kenyan organisations that cannot afford downtime.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                Bezalel Technologies builds practical systems for SMEs, estates, SACCOs, and institutions: web platforms, IT infrastructure, AV, payments, and support.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/projects/request"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light"
                >
                  Start a project
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

        <section className="border-b border-border bg-background px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
            {proofItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark dark:text-accent" />
                <p className="text-sm font-semibold leading-6 text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Services
              </p>
              <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Practical technology work, scoped for the way your team actually operates.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {services.map(({ title, description, proof, icon: Icon }) => (
                <article key={title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
                  <p className="mt-5 border-t border-border pt-4 text-sm font-semibold leading-6 text-foreground">
                    {proof}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-light">
                  Work
                </p>
                <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  Proof should feel concrete before it feels impressive.
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-bold text-accent-light hover:text-accent"
              >
                See all work
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {portfolioTeasers.map((project) => (
                <article key={project.title} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={project.image} alt="" className="h-full w-full object-cover opacity-85" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light">{project.category}</p>
                    <h3 className="mt-3 text-xl font-black tracking-tight">{project.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-primary-foreground/72">{project.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                  Process
                </p>
                <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  A clear path from first brief to handover.
                </h2>
                <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                  The goal is not to make technology feel mysterious. It is to make decisions clear, costs visible, and delivery accountable.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {processSteps.map((step, index) => (
                  <article key={step.title} className="rounded-lg border border-border bg-card p-5">
                    <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md border border-accent/35 bg-accent/10 text-sm font-black text-accent-dark dark:text-accent-light">
                      {index + 1}
                    </div>
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="store" className="border-y border-border bg-card px-4 py-10 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Need something smaller first?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  The store is for quick packages, templates, and focused support. Custom business systems should still start with a project brief.
                </p>
              </div>
            </div>
            <Link href="/store" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-dark dark:hover:text-accent-light">
              Browse the store
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section id="contact" className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-border bg-card p-6 shadow-sm md:grid-cols-[1fr_0.8fr] md:p-10">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Start here
              </p>
              <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Tell us what is not working, what needs to be built, and when it matters.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                A useful first brief includes the users, the workflow, the current pain, any existing tools, the budget range, and the deadline.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <Link
                href="/projects/request"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Submit a project brief
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:bezaleltech@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-4 text-sm font-bold text-foreground transition-colors hover:border-accent"
              >
                Email Bezalel
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className="mt-2 grid gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-accent-dark dark:text-accent" />
                  Based in Nairobi, serving Kenya and East Africa
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-dark dark:text-accent" />
                  Briefs and assets are treated confidentially
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
