"use client";

import { 
  CheckCircle2, Globe, ArrowRight, Database, LayoutTemplate,
  Lock
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

const capabilities = [
  {
    title: "Operations & Admin Dashboards",
    description: "Internal tools for transactions, approvals, customer records, and reporting.",
    proof: "Designed for low cognitive load and fast daily operations.",
    icon: LayoutTemplate,
  },
  {
    title: "Member & Customer Portals",
    description: "Self-service portals with secure authentication, statement downloads, and request workflows.",
    proof: "Built around clear access controls and data protection compliance.",
    icon: Lock,
  },
  {
    title: "Database & Backend Systems",
    description: "Relational database modeling with PostgreSQL, automated backups, and audited schema migrations.",
    proof: "Ensures data integrity for transactions and customer accounts.",
    icon: Database,
  },
  {
    title: "High-Availability Web Platforms",
    description: "Fast, accessible web systems deployed on resilient cloud networks with sub-second page loads.",
    proof: "Optimized for search visibility, speed, and mobile responsiveness.",
    icon: Globe,
  },
];

const standards = [
  "Strict TypeScript typing and clean modular architecture",
  "Role-based access control and encrypted session management",
  "Automated database migrations and transactional safety",
  "Multi-region low-latency CDN and responsive performance across global networks",
];

export default function WebSystemsPage() {
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
              Web Systems & Enterprise Platforms
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We design, build, and maintain custom web platforms and portals for organizations worldwide. From internal workflow tools to high-traffic customer platforms with multi-currency support, our systems are built for long-term reliability and effortless global scaling.
            </p>
          </div>

          {/* Core Capabilities */}
          <div className="mb-20">
            <h2 className="mb-8 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              What We Deliver
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {capabilities.map(({ title, description, proof, icon: Icon }) => (
                <div key={title} className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <p className="mt-5 border-t border-border pt-4 text-sm font-semibold text-foreground">
                    {proof}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Standards */}
          <div className="mb-20 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                  Engineering Quality
                </p>
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  Built to be handed over cleanly.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Every project includes comprehensive documentation, environment configuration scripts, and admin training so your team remains in control.
                </p>
              </div>

              <div className="space-y-3">
                {standards.map((standard) => (
                  <div key={standard} className="flex items-start gap-3 rounded-md border border-border bg-background p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark dark:text-accent-light" />
                    <span className="text-sm font-medium text-foreground">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-border bg-primary p-8 text-primary-foreground sm:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-black sm:text-3xl">
                  Planning a web system or internal portal?
                </h2>
                <p className="mt-2 text-sm text-primary-foreground/75 sm:text-base">
                  Share your requirements and current process. We will reply with a realistic scoping assessment.
                </p>
              </div>
              <Link
                href="/projects/request"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light"
              >
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
