/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = ["All", "Web Systems", "Mobile Apps", "API & Infra", "UI/UX Design"];

const projects = [
  {
    id: 1,
    title: "BezaShop Commerce Platform",
    category: "Web Systems",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    description:
      "A commerce platform concept covering product management, inventory, payments, and admin operations.",
    result: "Built around checkout reliability, admin visibility, and repeatable product operations.",
    year: "2024",
    image: "/images/web_system.png",
    liveUrl: "",
    clientLogoUrl: "",
  },
  {
    id: 2,
    title: "NexoLogistics Mobile App",
    category: "Mobile Apps",
    tech: ["React Native", "Node.js", "MongoDB", "Maps"],
    description:
      "A mobile logistics workflow for dispatch, driver coordination, delivery status, and operational reporting.",
    result: "Focused on field visibility and faster coordination between dispatch and delivery teams.",
    year: "2024",
    image: "/images/mobile_app.png",
    liveUrl: "",
    clientLogoUrl: "",
  },
  {
    id: 3,
    title: "DataBridge API Gateway",
    category: "API & Infra",
    tech: ["Node.js", "Redis", "Docker", "Serverless"],
    description:
      "API infrastructure pattern for rate limits, integrations, monitoring, and service-to-service reliability.",
    result: "Designed for safer integrations and clearer failure handling across business systems.",
    year: "2023",
    image: "/images/hero_banner.png",
    liveUrl: "",
    clientLogoUrl: "",
  },
  {
    id: 4,
    title: "PulseHR Management Suite",
    category: "Web Systems",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Email"],
    description:
      "HR operations suite concept covering recruitment, leave, staff records, review cycles, and reporting.",
    result: "Reduced manual handoffs by centralising common HR administration workflows.",
    year: "2024",
    image: "/images/web_system.png",
    liveUrl: "",
    clientLogoUrl: "",
  },
  {
    id: 5,
    title: "StreamSync Realtime Dashboard",
    category: "API & Infra",
    tech: ["WebSockets", "Redis", "React", "Analytics"],
    description:
      "Realtime dashboard pattern for operations teams that need live status, alerts, and historical context.",
    result: "Built to make incidents easier to spot, triage, and explain to non-technical stakeholders.",
    year: "2023",
    image: "/images/saas_kit.png",
    liveUrl: "",
    clientLogoUrl: "",
  },
  {
    id: 6,
    title: "KipaVault Design System",
    category: "UI/UX Design",
    tech: ["Figma", "React", "Design Tokens", "Tailwind CSS"],
    description:
      "Component and interface standards for product teams that need consistent screens and faster handoff.",
    result: "Created reusable interface patterns for forms, dashboards, states, and responsive layouts.",
    year: "2024",
    image: "/images/hero_banner.png",
    liveUrl: "",
    clientLogoUrl: "",
  },
];

export default function PortfolioPageClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredProjects = projects.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <section className="border-b border-border px-4 pb-14 pt-32 sm:px-6 sm:pb-18 sm:pt-40">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
              Portfolio
            </p>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <h1 className="font-display text-5xl font-black leading-tight tracking-tight sm:text-6xl">
                Work shaped around reliability, operations, and handover.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Selected project patterns across software, mobile workflows, API infrastructure, and interface systems. Client logos and live-site links should be added only where publication permission exists.
              </p>
            </div>
          </div>
        </section>

        {categories.length > 3 && (
          <section className="sticky top-20 z-30 border-b border-border bg-background/92 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
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
        )}

        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
                >
                  <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="relative min-h-[260px] overflow-hidden lg:min-h-[360px]">
                      <img src={project.image} alt="" className="h-full w-full object-cover" />
                      <div className="absolute left-4 top-4 rounded-md bg-background/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary backdrop-blur">
                        {project.category}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-6 sm:p-8">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-bold uppercase tracking-[0.18em]">{project.year}</span>
                          {project.liveUrl && project.clientLogoUrl ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 font-bold text-primary hover:text-accent-dark dark:hover:text-accent-light"
                            >
                              Client site
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span>Client publication details pending</span>
                          )}
                        </div>
                        <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight">
                          {project.title}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                          {project.description}
                        </p>
                        <p className="mt-5 rounded-md border border-border bg-background p-4 text-sm font-semibold leading-6">
                          {project.result}
                        </p>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground"
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

        <section className="border-t border-border bg-card px-4 py-14 text-center sm:px-6 sm:py-18">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-4xl font-black tracking-tight">Have a similar problem?</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Send a short brief and we will help translate the operational problem into a scoped build.
            </p>
            <Link
              href="/projects/request"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
