"use client";

import { 
  Database, ArrowRightLeft, 
  Server, ShieldCheck, ArrowRight, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

const apiFeatures = [
  {
    title: "Fintech & Payment Gateway Integration",
    description: "Robust integrations with M-Pesa Daraja, Stripe, bank transfer rails, and automated reconciliation pipelines.",
    proof: "Built with idempotency keys and error retry mechanisms to prevent double charges.",
    icon: Database,
  },
  {
    title: "REST & GraphQL API Development",
    description: "Clean, documented API services with OpenAPI specifications, versioning, and strict schema validation.",
    proof: "Enables seamless mobile and third-party integrations with zero guesswork.",
    icon: ArrowRightLeft,
  },
  {
    title: "Authentication & Security Gateways",
    description: "Role-based access control (RBAC), OAuth2 / JWT lifecycle management, rate limiting, and API key rotation.",
    proof: "Protects sensitive institutional and customer data from unauthorized access.",
    icon: ShieldCheck,
  },
  {
    title: "Legacy System Modernization",
    description: "Middleware connectors that interface legacy databases or proprietary on-premise software with modern cloud APIs.",
    proof: "Modernize operational workflows without risky rip-and-replace overhauls.",
    icon: Server,
  },
];

const apiStandards = [
  "Comprehensive OpenAPI / Swagger specification documentation",
  "Automated rate-limiting and DDoS mitigation at the network edge",
  "Centralized logging, error tracking, and latency alerting",
  "High-availability clustering with 99.9% uptime SLA capability",
];

export default function ApiServicesPage() {
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
              API Infrastructure & Systems Integration
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We design and implement secure backend systems and API layers that connect your applications, payment rails, databases, and third-party services into a unified, reliable infrastructure.
            </p>
          </div>

          {/* Core Capabilities */}
          <div className="mb-20">
            <h2 className="mb-8 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Core Capabilities
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {apiFeatures.map(({ title, description, proof, icon: Icon }) => (
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
                  Architecture Standards
                </p>
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  Reliability under real production load.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Every API is engineered with deterministic failure handling, clear HTTP error semantics, and end-to-end telemetry so issues are diagnosed in seconds.
                </p>
              </div>

              <div className="space-y-3">
                {apiStandards.map((standard) => (
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
                  Need a payment or system integration?
                </h2>
                <p className="mt-2 text-sm text-primary-foreground/75 sm:text-base">
                  Share your system specs and third-party tools. We will evaluate the integration path and provide a clear quote.
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
