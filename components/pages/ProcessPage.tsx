"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

const steps = [
  {
    id: "01",
    title: "Discovery & Scope Definition",
    description: "We clarify the core business problem, user workflows, security constraints, and system boundaries before writing any code.",
    inputs: ["Stakeholder requirements", "Existing workflows / pain points", "Budget range & target timeline"],
    outputs: ["Itemized scope document", "System architecture plan", "Fixed-price or phased milestone estimate"],
  },
  {
    id: "02",
    title: "Architecture & Interface Design",
    description: "We structure the database schema, API contracts, security permissions, and responsive user interfaces for stakeholder review.",
    inputs: ["Scope document", "Brand assets", "Data models"],
    outputs: ["Interactive UI prototypes", "Database schema specification", "API contract definitions"],
  },
  {
    id: "03",
    title: "Milestone-Driven Development",
    description: "Development is executed in visible milestones with staging previews. Automated tests and strict typing ensure regression-free builds.",
    inputs: ["Approved prototypes", "API specs", "Integration credentials"],
    outputs: ["Weekly working staging builds", "Automated test coverage", "Progress reports"],
  },
  {
    id: "04",
    title: "Deployment & Quality Assurance",
    description: "End-to-end testing, security audits, database migration checks, and seamless production launch on high-availability cloud infrastructure.",
    inputs: ["User acceptance testing", "Domain & DNS configuration", "Production keys"],
    outputs: ["Production deployment", "Admin access & credentials", "Complete source code handover"],
  },
  {
    id: "05",
    title: "Documentation & Ongoing Support",
    description: "We supply clear technical documentation, staff onboarding materials, and a direct channel for maintenance, monitoring, and updates.",
    inputs: ["Operational feedback", "System telemetry"],
    outputs: ["Comprehensive system manual", "Uptime & performance monitoring", "Agreed maintenance SLA"],
  },
];

export default function ProcessPage() {
  return (
    <PageLayout variant="subtle">
      <main className="min-h-screen pt-24 xs:pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 sm:mb-16 border-b border-border pb-8 sm:pb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
              Engineering Delivery
            </p>
            <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground">
              How We Deliver Projects
            </h1>
            <p className="mt-4 sm:mt-6 max-w-3xl text-sm xs:text-base leading-relaxed text-muted-foreground sm:text-lg">
              We structure our engineering work around predictable milestones, transparent communication, and accountable delivery. You always know what is being built, when it will be delivered, and how much it will cost.
            </p>
          </div>

          {/* Steps List */}
          <div className="mb-16 sm:mb-20 space-y-6 sm:space-y-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className="rounded-lg border border-border bg-card p-4 xs:p-6 sm:p-8 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-md border border-accent/40 bg-accent/10 font-mono text-xs sm:text-sm font-black text-accent-dark dark:text-accent-light">
                      {step.id}
                    </span>
                    <h2 className="text-lg xs:text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {step.title}
                    </h2>
                  </div>
                </div>

                <p className="mt-3 sm:mt-4 text-xs xs:text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.description}
                </p>

                <div className="mt-6 grid gap-4 border-t border-border pt-6 md:grid-cols-2">
                  <div className="rounded-md border border-border bg-background p-3 xs:p-4">
                    <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Inputs & Prerequisites
                    </div>
                    <ul className="space-y-2">
                      {step.inputs.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-foreground/80 sm:text-sm">
                          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-dark dark:bg-accent-light" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-md border border-border bg-background p-3 xs:p-4">
                    <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                      Deliverables & Outcomes
                    </div>
                    <ul className="space-y-2">
                      {step.outputs.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs font-medium text-foreground sm:text-sm">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-dark dark:text-accent-light" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-border bg-primary p-5 xs:p-6 sm:p-10 lg:p-12 text-primary-foreground">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-xl xs:text-2xl sm:text-3xl font-black">
                  Ready to discuss your project?
                </h2>
                <p className="mt-2 text-xs xs:text-sm text-primary-foreground/75 sm:text-base">
                  Submit a brief to start Step 1. We will review your goals and schedule a scoping conversation.
                </p>
              </div>
              <Link
                href="/projects/request"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light"
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
