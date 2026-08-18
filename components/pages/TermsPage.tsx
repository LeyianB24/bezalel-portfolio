"use client";

import { useState } from "react";
import { 
  Scale, FileSignature, ShieldAlert, Gavel, 
  Copyright, ScrollText 
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

const clauses = [
  {
    id: "clause-1",
    number: "01",
    title: "Acceptance of Terms",
    icon: FileSignature,
    legalText: "By accessing or using the services provided by Bezalel Technologies, you agree to be legally bound by these Terms of Service. If you do not agree to all terms, you may not access or use our services.",
    humanText: "Using our website, services, or requesting a build means you agree to these operating terms.",
  },
  {
    id: "clause-2",
    number: "02",
    title: "Scope of Services & Quotations",
    icon: ScrollText,
    legalText: "All project estimates, quotations, and proposals provided by Bezalel Technologies remain valid for thirty (30) calendar days from issuance unless otherwise specified in writing. Formal commencement of engineering requires client approval and agreed initial deposit.",
    humanText: "Quotations are valid for 30 days. Development begins once the scope and deposit terms are mutually signed off.",
  },
  {
    id: "clause-3",
    number: "03",
    title: "Intellectual Property & Handover",
    icon: Copyright,
    legalText: "Upon full settlement of all contractual payments, Bezalel Technologies assigns all custom source code, documentation, and digital assets created specifically for the client under the agreed project scope. Pre-existing proprietary modules and open-source libraries retain their respective licenses.",
    humanText: "Once your project invoices are settled in full, you own your custom code and deliverables.",
  },
  {
    id: "clause-4",
    number: "04",
    title: "Limitation of Liability",
    icon: ShieldAlert,
    isWarning: true,
    legalText: "Bezalel Technologies warrants that services will be performed in a professional manner following standard engineering practices. In no event shall Bezalel Technologies be liable for indirect, incidental, or consequential damages exceeding the total fees paid under the applicable service agreement.",
    humanText: "We engineer systems carefully, with liability bounded to the contractual scope value.",
  },
  {
    id: "clause-5",
    number: "05",
    title: "Governing Law & Jurisdiction",
    icon: Gavel,
    legalText: "These Terms of Service and any project agreements shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes shall be resolved through amicable negotiation or competent courts in Nairobi, Kenya.",
    humanText: "Agreements are governed under Kenyan commercial law in Nairobi.",
  },
];

export default function TermsPage() {
  const [activeClause, setActiveClause] = useState<string>("clause-1");
  const effectiveDate = "January 1, 2026";

  return (
    <PageLayout variant="subtle">
      <div className="pt-28 pb-24 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-16 border-b border-border pb-12">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light mb-4">
              <Scale className="h-4 w-4" />
              Legal Terms
            </div>
            <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-6xl">
              Terms of Service
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Operating rules, project agreements, intellectual property handover, and mutual obligations.
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Effective Date: {effectiveDate} · Nairobi, Kenya
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-28 rounded-lg border border-border bg-card p-5 shadow-sm">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Table of Contents
                </h2>
                <nav className="space-y-1">
                  {clauses.map((clause) => (
                    <button
                      key={clause.id}
                      type="button"
                      onClick={() => {
                        setActiveClause(clause.id);
                        document.getElementById(clause.id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium transition-colors ${
                        activeClause === clause.id
                          ? "bg-primary text-primary-foreground font-bold"
                          : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                      }`}
                    >
                      <span>{clause.number}. {clause.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="space-y-10 lg:col-span-8">
              {clauses.map(({ id, number, title, icon: Icon, legalText, humanText }) => (
                <section
                  key={id}
                  id={id}
                  className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-accent-dark dark:text-accent-light">
                        Clause {number}
                      </span>
                      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        {title}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-md border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                      {legalText}
                    </div>

                    <div className="rounded-md border border-accent/20 bg-accent/5 p-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light mb-1">
                        Plain Summary
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {humanText}
                      </p>
                    </div>
                  </div>
                </section>
              ))}

              <div className="rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
                <p>
                  Questions about our terms or custom enterprise master service agreements (MSAs) can be directed to{" "}
                  <a href="mailto:bezaleltech@gmail.com" className="font-bold text-foreground underline hover:text-accent">
                    bezaleltech@gmail.com
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
