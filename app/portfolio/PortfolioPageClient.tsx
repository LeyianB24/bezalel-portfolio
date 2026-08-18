/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface PortfolioData {
  id: string;
  name: string;
  clientName: string;
  clientLogoUrl?: string | null;
  category?: string;
  techTags: string[];
  description: string;
  result?: string;
  year?: string;
  image?: string;
  liveUrl?: string | null;
  images?: string[];
  createdAt?: string | Date;
}

const categories = ["All", "Web Systems", "Mobile Apps", "API & Infra", "UI/UX Design"];

const defaultProjects: PortfolioData[] = [
  {
    id: "1",
    name: "BezaShop Commerce Platform",
    clientName: "BezaShop Retail",
    clientLogoUrl: "/images/logo.png",
    category: "Web Systems",
    techTags: ["Next.js", "Prisma", "PostgreSQL", "Stripe", "M-Pesa"],
    description:
      "A high-availability commerce system covering inventory synchronization, multi-channel payment reconciliation, and automated admin invoicing.",
    result: "Achieved zero checkout dropping during flash sales with under 80ms database query response times.",
    year: "2024",
    image: "/images/web_system.png",
    liveUrl: "https://bezalel.website",
  },
  {
    id: "2",
    name: "NexoLogistics Field Ops",
    clientName: "Nexo Freight East Africa",
    clientLogoUrl: "/images/logo.png",
    category: "Mobile Apps",
    techTags: ["React Native", "Offline DB", "M-Pesa Daraja", "Location Services"],
    description:
      "Offline-capable mobile logistics and dispatch coordination suite for drivers, warehouse teams, and central dispatch in Kenya.",
    result: "Enables continuous offline driver manifests with automatic sync once 3G/4G connectivity is regained.",
    year: "2024",
    image: "/images/mobile_app.png",
    liveUrl: "https://bezalel.website",
  },
  {
    id: "3",
    name: "DataBridge Multi-Rail API Gateway",
    clientName: "Apex Financial Systems",
    clientLogoUrl: "/images/logo.png",
    category: "API & Infra",
    techTags: ["Node.js", "Redis", "Docker", "M-Pesa IPN", "PostgreSQL"],
    description:
      "Unified payments middleware handling automated STK push retries, webhook signature verifications, and instant bank statement reconciliations.",
    result: "Processed over 50,000 monthly transactions with 99.98% gateway uptime and zero duplicate billing.",
    year: "2023",
    image: "/images/hero_banner.png",
    liveUrl: "https://bezalel.website",
  },
  {
    id: "4",
    name: "PulseHR Enterprise Management",
    clientName: "Rift Holdings Ltd",
    clientLogoUrl: "/images/logo.png",
    category: "Web Systems",
    techTags: ["Next.js", "TypeScript", "PostgreSQL", "RBAC", "Resend"],
    description:
      "Operations portal managing employee records, leave approval workflows, payroll tax computation, and digital contract signing.",
    result: "Consolidated five manual spreadsheet processes into a single auditable self-service portal.",
    year: "2024",
    image: "/images/web_system.png",
    liveUrl: "https://bezalel.website",
  },
  {
    id: "5",
    name: "KipaVault Financial Interface System",
    clientName: "Kipa Microfinance",
    clientLogoUrl: "/images/logo.png",
    category: "UI/UX Design",
    techTags: ["Design Tokens", "React", "Tailwind CSS", "Accessibility"],
    description:
      "Comprehensive design system and accessible component library designed specifically for mobile-first financial self-service applications.",
    result: "Standardized 45+ UI screens, reducing front-end sprint delivery times by 40%.",
    year: "2024",
    image: "/images/saas_kit.png",
    liveUrl: "https://bezalel.website",
  },
];

interface PortfolioPageClientProps {
  initialProjects?: PortfolioData[];
}

export default function PortfolioPageClient({ initialProjects = [] }: PortfolioPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const normalizedProjects = initialProjects.length > 0
    ? initialProjects.map((p) => ({
        id: p.id,
        name: p.name,
        clientName: p.clientName || "Client Project",
        clientLogoUrl: p.clientLogoUrl || "",
        category: p.category || (p.techTags?.some((t: string) => t.toLowerCase().includes("mobile")) ? "Mobile Apps" : "Web Systems"),
        techTags: p.techTags || [],
        description: p.description,
        result: p.result || "Delivered on schedule with comprehensive technical handover and staff training.",
        year: p.year || "2024",
        image: (p.images && p.images[0]) || p.image || "/images/web_system.png",
        liveUrl: p.liveUrl || "",
      }))
    : defaultProjects;

  const filteredProjects = normalizedProjects.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <section className="border-b border-border px-4 pb-14 pt-32 sm:px-6 sm:pb-18 sm:pt-40">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
              Engineering Portfolio
            </p>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <h1 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Systems shaped around reliability, performance, and clean handover.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Selected production platforms across custom web systems, mobile field workflows, payment APIs, and interface architecture. Every build is accompanied by complete documentation and source code handover.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-20 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Projects List */}
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent/40"
                >
                  <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="relative min-h-[260px] overflow-hidden lg:min-h-[360px] bg-secondary/30">
                      <img 
                        src={project.image} 
                        alt={project.name} 
                        className="h-full w-full object-cover" 
                      />
                      <div className="absolute left-4 top-4 rounded-md bg-background/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light backdrop-blur border border-border">
                        {project.category}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-6 sm:p-8">
                      <div>
                        {/* Meta & Clickable Client Link */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-b border-border pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{project.clientName}</span>
                            <span>•</span>
                            <span className="font-mono">{project.year}</span>
                          </div>

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-bold text-accent-dark dark:text-accent-light hover:underline"
                            >
                              <span>Visit live system</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>

                        <h2 className="font-display text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">
                          {project.name}
                        </h2>

                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {project.description}
                        </p>

                        <div className="mt-5 rounded-md border border-border bg-background p-4 text-sm font-semibold leading-relaxed text-foreground">
                          {project.result}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-2">
                        {project.techTags.map((tech: string) => (
                          <span
                            key={tech}
                            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Scoping CTA */}
        <section className="border-t border-border bg-primary p-8 text-primary-foreground sm:p-14">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
              Have a similar system to build or modernize?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Send us a brief detailing your users and requirements. We will assess feasibility and respond with a formal quotation.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/projects/request"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light"
              >
                Start a project brief
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
