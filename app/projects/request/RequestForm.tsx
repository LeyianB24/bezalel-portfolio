"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  ArrowLeft, Upload, FileText, CheckCircle2, 
  Loader2, ArrowRight, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { ProjectCategory } from "@prisma/client";

const CATEGORIES = [
  { id: ProjectCategory.WEB_APP, label: "Web Platform / System", desc: "Custom portals, internal operations tools, dashboards" },
  { id: ProjectCategory.MOBILE_APP, label: "Mobile Application", desc: "iOS / Android apps, field tools, customer apps" },
  { id: ProjectCategory.SYSTEM_INTEGRATION, label: "System Integration", desc: "M-Pesa, Stripe, bank APIs, database pipelines" },
  { id: ProjectCategory.UI_UX_DESIGN, label: "UI / Interface Design", desc: "Design systems, wireframes, functional prototypes" },
  { id: ProjectCategory.CONSULTING, label: "Audit & Systems Support", desc: "Code audits, architecture reviews, ongoing support" },
  { id: ProjectCategory.OTHER, label: "Other Technical Project", desc: "Hardware setups, AV configurations, custom workflows" },
];

const TIMELINES = [
  "Under 1 Month (Urgent)",
  "1–3 Months (Standard)",
  "3–6 Months",
  "6+ Months",
  "Flexible / Phased Rollout",
];

export default function RequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>(ProjectCategory.WEB_APP);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState(TIMELINES[1]);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Limit to 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      setAttachmentFile(file);
      toast.success(`Selected file: ${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !title || !description || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("timeline", timeline);
    if (phone) formData.append("phone", phone);
    if (company) formData.append("company", company);
    if (budget) formData.append("budget", budget);
    if (attachmentFile) formData.append("attachment", attachmentFile);

    try {
      const response = await fetch("/api/projects/request", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit project brief");
      }

      toast.success("Project brief submitted successfully.");
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-accent-dark dark:text-accent-light">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          
          <h1 className="font-display text-3xl font-black text-foreground">
            Project Brief Received
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Thank you, <strong className="text-foreground">{name}</strong>. Your project brief for <strong className="text-foreground">&ldquo;{title}&rdquo;</strong> has been logged.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            A confirmation receipt has been sent to {email}. A technical partner will review the brief and respond with an estimate or scoping questions within 24–48 hours.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-xs font-bold text-accent-foreground shadow-sm transition-colors hover:bg-accent-light"
            >
              Return to homepage
            </Link>
            <a 
              href="https://wa.me/254796157265"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-xs font-bold text-foreground transition-colors hover:border-accent"
            >
              Follow up on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link 
        href="/" 
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to homepage
      </Link>

      {/* Header Summary */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
          Project Inquiry
        </p>
        <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Start a Project Brief
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Tell us what you are building, the current operational problem, your budget range, and timeline expectations. We will respond with practical feedback and an itemized quotation.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Contact Info */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              01 // Contact Information
            </h2>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Your Name <span className="text-accent-dark dark:text-accent-light">*</span>
                </label>
                <input 
                  id="name"
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Mwangi"
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Work Email <span className="text-accent-dark dark:text-accent-light">*</span>
                </label>
                <input 
                  id="email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. david@company.co.ke"
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Company / Organization
                </label>
                <input 
                  id="company"
                  type="text" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex SACCO Ltd"
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Phone Number
                </label>
                <input 
                  id="phone"
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +254 700 000 000"
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Category & Scope */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              02 // Project Scope
            </h2>

            <div className="mb-6 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Project Category <span className="text-accent-dark dark:text-accent-light">*</span>
              </label>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      category === cat.id
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border bg-background hover:border-accent/40"
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {cat.label}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {cat.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Project Title / Summary <span className="text-accent-dark dark:text-accent-light">*</span>
                </label>
                <input 
                  id="title"
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Member loan approval and repayment portal"
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Detailed Description of Problem & Needs <span className="text-accent-dark dark:text-accent-light">*</span>
                </label>
                <textarea 
                  id="description"
                  rows={5}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe who will use the system, the current pain points, existing tools being replaced or connected, and key functionality needed."
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Budget & Timeline */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              03 // Resources & Timeline
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="budget" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Target Budget (USD, EUR, GBP, or KES)
                </label>
                <input 
                  id="budget"
                  type="text" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $5,000 or KES 350,000"
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="text-[11px] text-muted-foreground">Leave blank if you prefer an estimate based on scope.</span>
              </div>

              <div className="space-y-2">
                <label htmlFor="timeline" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Target Delivery Timeline
                </label>
                <select
                  id="timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {TIMELINES.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Document Attachment */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              04 // Attachments (Optional)
            </h2>

            <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-6 text-center transition-colors hover:border-accent">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              {attachmentFile ? (
                <div className="flex flex-col items-center space-y-2 text-accent-dark dark:text-accent-light">
                  <FileText className="h-10 w-10" />
                  <span className="text-sm font-bold text-foreground">{attachmentFile.name}</span>
                  <span className="text-xs text-muted-foreground">{(attachmentFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                  <Upload className="h-10 w-10 text-muted-foreground/60" />
                  <span className="text-sm font-medium text-foreground">Upload brief, wireframes, or specs</span>
                  <span className="text-xs">PDF, DOCX, ZIP, or images up to 10 MB</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-border bg-background p-4 text-xs text-muted-foreground">
            <ShieldCheck className="h-5 w-5 shrink-0 text-accent-dark dark:text-accent-light" />
            <span>
              All briefs, documents, and technical discussions are treated under strict confidentiality.
            </span>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 text-sm font-bold text-accent-foreground shadow-sm transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting brief...
              </>
            ) : (
              <>
                Submit project brief
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
