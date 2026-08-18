"use client";

import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const privacySections = [
  {
    id: "collection",
    title: "1. Information We Collect",
    content: "We collect information directly from you when you submit a project brief, apply for a career opening, place an order, or communicate with us. This includes names, email addresses, phone numbers, company information, project specifications, and uploaded documents (CVs, technical briefs).",
  },
  {
    id: "usage",
    title: "2. How We Use Information",
    content: "We use the information you provide solely to deliver contracted services, evaluate job applications, process payments, generate project quotations, and communicate operational updates. We do not sell, rent, or trade personal data to third parties.",
  },
  {
    id: "security",
    title: "3. Data Security & Storage",
    content: "We implement industry-standard technical safeguards including AES-256 encryption at rest, TLS 1.3 encryption in transit, strict role-based access control (RBAC), and audited database environments to protect your information against unauthorized access.",
  },
  {
    id: "retention",
    title: "4. Data Retention & Deletion",
    content: "We retain project records and client information for the duration of the operational relationship and statutory accounting periods. You may request deletion or export of your personal data at any time by contacting our team.",
  },
  {
    id: "compliance",
    title: "5. Kenyan Data Protection Act Compliance",
    content: "Bezalel Technologies operates in compliance with the Kenya Data Protection Act, 2019. We process data lawfully, fairly, and transparently, respecting data subject rights regarding access, rectification, and erasure.",
  },
];

export default function PrivacyPage() {
  const lastUpdated = "January 1, 2026";

  return (
    <PageLayout variant="subtle">
      <div className="pt-28 pb-24 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-16 border-b border-border pb-12">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light mb-4">
              <ShieldCheck className="h-4 w-4" />
              Privacy & Data Protection
            </div>
            <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              How Bezalel Technologies collects, protects, and handles personal and institutional information.
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Last Updated: {lastUpdated} · Kenya Data Protection Act (2019) Aligned
            </p>
          </div>

          {/* Quick Summary Cards */}
          <div className="mb-16 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CheckCircle2 className="h-5 w-5 text-accent-light" />
              </div>
              <h3 className="font-bold text-foreground">Zero Data Selling</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                We never monetize, broker, or sell client or applicant data to third parties.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Lock className="h-5 w-5 text-accent-light" />
              </div>
              <h3 className="font-bold text-foreground">Encrypted by Default</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                All data in transit uses TLS 1.3; sensitive stored records utilize AES-256 encryption.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5 text-accent-light" />
              </div>
              <h3 className="font-bold text-foreground">Confidential Briefs</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                All project requests and architecture assets are handled under mutual confidentiality.
              </p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-8">
            {privacySections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Box */}
          <div className="mt-12 rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
            <p>
              For privacy inquiries, data deletion requests, or data protection officer contact, please email{" "}
              <a href="mailto:bezaleltech@gmail.com" className="font-bold text-foreground underline hover:text-accent">
                bezaleltech@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
