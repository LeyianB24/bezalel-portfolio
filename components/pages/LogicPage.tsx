"use client";

import { BrainCircuit, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

const principles = [
  {
    id: "01",
    title: "First Principles & Deconstruction",
    description: "We avoid speculative frameworks and generic templates. Every system is broken down to its fundamental business logic, data models, and user constraints before building.",
    icon: BrainCircuit,
    stat: "Deterministic Architecture",
  },
  {
    id: "02",
    title: "Performance & Low-Latency Defaults",
    description: "Response speed directly impacts operational efficiency. We optimize database queries, network round-trips, and bundle payloads so workflows complete quickly.",
    icon: Zap,
    stat: "Sub-second response targets",
  },
  {
    id: "03",
    title: "Resilience & Graceful Failure Handling",
    description: "We assume third-party services and network links will occasionally fail. Systems are built with retries, idempotency, and audit trails so business records stay consistent.",
    icon: ShieldCheck,
    stat: "99.9% availability focus",
  },
];

export default function LogicPage() {
  return (
    <PageLayout variant="subtle">
      <main className="min-h-screen pt-24 xs:pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 sm:mb-16 border-b border-border pb-8 sm:pb-12 sm:mb-20">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
              Engineering Philosophy
            </p>
            <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground">
              How We Think About Systems
            </h1>
            <p className="mt-4 sm:mt-6 max-w-3xl text-sm xs:text-base leading-relaxed text-muted-foreground sm:text-lg">
              Good software is the product of disciplined reasoning. We build systems that are easy to understand, straightforward to maintain, and resilient under real daily operational demands.
            </p>
          </div>

          {/* Core Principles */}
          <div className="mb-16 sm:mb-20 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {principles.map(({ id, title, description, icon: Icon, stat }) => (
              <div
                key={id}
                className="rounded-lg border border-border bg-card p-4 xs:p-6 sm:p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="mb-5 sm:mb-6 flex items-center justify-between">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-accent-dark dark:text-accent-light">
                      Rule {id}
                    </span>
                  </div>
                  <h2 className="text-lg xs:text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {title}
                  </h2>
                  <p className="mt-3 text-xs xs:text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {description}
                  </p>
                </div>

                <div className="mt-6 border-t border-border pt-4 text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                  {stat}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-border bg-primary p-5 xs:p-6 sm:p-10 lg:p-12 text-primary-foreground">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-xl xs:text-2xl sm:text-3xl font-black">
                  Build with an engineering partner, not an agency.
                </h2>
                <p className="mt-2 text-xs xs:text-sm text-primary-foreground/75 sm:text-base">
                  Tell us about your organization&apos;s workflow needs and we will help scope the right technical path.
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
