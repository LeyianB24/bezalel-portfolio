"use client";

import { 
  Smartphone, WifiOff, Zap, ShieldCheck, 
  CheckCircle2, ArrowRight
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

const mobileFeatures = [
  {
    title: "Offline-First Mobile Workflows",
    description: "Local data persistence with automatic sync upon reconnection, designed for field operations and erratic network coverage.",
    proof: "Essential for delivery, inspection, and field-service teams across East Africa.",
    icon: WifiOff,
  },
  {
    title: "M-Pesa & Payment Integrations",
    description: "Seamless STK Push and callback processing embedded directly inside native Android and iOS experiences.",
    proof: "High-conversion checkout flows built for Kenyan mobile money users.",
    icon: Zap,
  },
  {
    title: "Cross-Platform Efficiency",
    description: "Single-codebase React Native architectures delivering native iOS and Android performance at reasonable maintenance cost.",
    proof: "Shared business logic and accelerated feature rollouts without sacrificing quality.",
    icon: Smartphone,
  },
  {
    title: "Device Security & Authentication",
    description: "Biometric login (Face ID / Fingerprint), encrypted local storage, and secure token lifecycle handling.",
    proof: "Meets institutional banking and member data privacy standards.",
    icon: ShieldCheck,
  },
];

const mobileStandards = [
  "Smooth 60fps animations and responsive gesture handling",
  "Optimized app bundle size for quick downloads",
  "Full push notification pipeline with actionable deep-linking",
  "Structured deployment to Google Play Store and Apple App Store",
];

export default function MobileServicesPage() {
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
              Mobile Applications & Field Workflows
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We engineer dependable mobile applications built around real-world usage patterns. Whether you need field agent tools, customer self-service apps, or payment integrations, our mobile solutions are engineered for stability and ease of use.
            </p>
          </div>

          {/* Core Capabilities */}
          <div className="mb-20">
            <h2 className="mb-8 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Key Capabilities
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {mobileFeatures.map(({ title, description, proof, icon: Icon }) => (
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
                  Build Quality
                </p>
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  Engineered for East African mobile conditions.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  We optimize battery consumption, memory footprint, and network requests so your app remains snappy even on entry-level devices.
                </p>
              </div>

              <div className="space-y-3">
                {mobileStandards.map((standard) => (
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
                  Have a mobile app requirement?
                </h2>
                <p className="mt-2 text-sm text-primary-foreground/75 sm:text-base">
                  Send us your brief and target user workflows. We will provide an itemized timeline and estimate.
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
