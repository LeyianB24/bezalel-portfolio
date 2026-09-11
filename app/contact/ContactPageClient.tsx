"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleMapsEmbed from "@/components/GoogleMapsEmbed";

export default function ContactPageClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("Custom Web Platform");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in your name, email, and scope details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: `[Contact Page] ${category}${company ? ` · ${company}` : ""}`,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setIsSuccess(true);
      toast.success("Inquiry received. Our engineering lead will follow up promptly.");
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. You can email us directly at bezaleltech@gmail.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 pt-24 pb-16 sm:pt-28 sm:pb-24">
        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="mb-10 sm:mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Engineering Desk & Inquiries
            </div>
            <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Speak directly with our technical team.
            </h1>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              Whether scoping a mission-critical core system, auditing distributed architecture, or deploying high-availability infrastructure across borders, our engineers are ready to assist.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] items-start">
            {/* Left Channel Details */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Direct Communication Channels
                </h2>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold text-muted-foreground">Engineering Email</p>
                      <a
                        href="mailto:bezaleltech@gmail.com"
                        className="font-semibold text-foreground hover:text-accent transition-colors"
                      >
                        bezaleltech@gmail.com
                      </a>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Guaranteed engineering response within 2 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold text-muted-foreground">Direct Line & WhatsApp</p>
                      <a
                        href="https://wa.me/254796157265"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-foreground hover:text-accent transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>+254 796 157 265</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Mon – Fri: 08:00 – 18:00 EAT (24/7 for SLA clients)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold text-muted-foreground">Headquarters & Systems Lab</p>
                      <p className="font-semibold text-foreground">Valley View Office Park</p>
                      <p className="text-xs text-muted-foreground">2nd Floor, Block 1, Parklands · Nairobi, Kenya</p>
                      <p className="text-[11px] text-[#C9A24B] font-mono mt-0.5">
                        GPS: 1.2647° S, 36.8242° E
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-5 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#C9A24B] shrink-0" />
                    <span>Strict mutual NDA & IP ownership guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#C9A24B] shrink-0" />
                    <span>Rapid milestone discovery & feasibility estimates</span>
                  </div>
                </div>
              </div>

              {/* Instant Quote Bridge Card */}
              <div className="rounded-2xl border border-[#C9A24B]/30 bg-[#C9A24B]/5 p-6 sm:p-7">
                <h3 className="font-display text-base font-bold text-foreground">
                  Need a formal itemized quotation?
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Use our interactive project builder to configure modules, integrations, timelines, and instantly generate an official itemized proposal.
                </p>
                <Link
                  href="/projects/request"
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground hover:bg-accent-light transition-colors"
                >
                  Configure & Request Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Inquiry Form */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">Inquiry Received</h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you. Your message has been routed to our lead engineers. We will analyze your requirements and reach out within 2 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">
                      Submit an Engineering Inquiry
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tell us about your project or technical challenge.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Christine Mutiso"
                        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Work Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. christine@organisation.org"
                        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Organization / Company
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Horizon SACCO"
                        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Scope Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:border-accent focus:outline-none"
                      >
                        <option value="SACCO / Core Banking Platform">SACCO / Core Banking Platform</option>
                        <option value="Agribusiness ERP & Farm-Gate Logistics">Agribusiness ERP & Farm-Gate Logistics</option>
                        <option value="Fleet Telemetry & Logistics Engine">Fleet Telemetry & Logistics Engine</option>
                        <option value="Custom Web Portal / SaaS">Custom Web Portal / SaaS</option>
                        <option value="Mobile App (iOS & Android)">Mobile App (iOS & Android)</option>
                        <option value="IT Infrastructure & Boardroom AV">IT Infrastructure & Boardroom AV</option>
                        <option value="Payment Rails & Daraja API">Payment Rails & Daraja API</option>
                        <option value="Other High-Availability Scope">Other High-Availability Scope</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Project Requirements & Pain Points <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Outline current bottlenecks, desired features, legacy data migration needs, or target rollout timeline..."
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending to Engineering...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Engineering Inquiry</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                    Bezalel Technologies maintains strict non-disclosure. All architectural specifications and details remain completely confidential.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Headquarters Location & Interactive Google Map */}
          <div className="mt-12 sm:mt-16">
            <div className="mb-4">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
                Physical Office & Lab Location
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                Valley View Office Park, Nairobi
              </h2>
            </div>
            <GoogleMapsEmbed title="Bezalel Technologies Engineering HQ & Systems Lab" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
