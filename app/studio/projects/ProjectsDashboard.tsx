"use client";

import { useState } from "react";
import { 
  FolderKanban, Eye, X, Loader2, FileText, 
  Plus, Trash2, Send, Calculator, FileCheck, Layers
} from "lucide-react";
import { ProjectCategory, ProjectStatus } from "@prisma/client";
import { toast } from "sonner";

interface ProjectWithUser {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone?: string | null;
  title: string;
  description: string;
  category: ProjectCategory;
  budget: number | null;
  timeline: string | null;
  attachmentUrl: string | null;
  status: ProjectStatus;
  adminNote: string | null;
  quotedPrice: number | null;
  createdAt: Date;
  quotation?: Record<string, unknown> | null;
  user?: {
    name: string | null;
    email: string;
  } | null;
}

interface LineItemState {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

interface TimelinePhaseState {
  phaseNumber: string;
  name: string;
  description: string;
  dayRangeLabel: string;
}

interface ProjectsDashboardProps {
  initialProjects: ProjectWithUser[];
}

export default function ProjectsDashboard({ initialProjects }: ProjectsDashboardProps) {
  const [projects, setProjects] = useState<ProjectWithUser[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<ProjectWithUser | null>(null);
  
  // Status Filter
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Edit / Review State
  const [appStatus, setAppStatus] = useState<ProjectStatus>("NEW");
  const [adminNote, setAdminNote] = useState("");
  const [quotedPrice, setQuotedPrice] = useState<number | "">("");
  const [isUpdating, setIsUpdating] = useState(false);

  // ─── QUOTATION BUILDER MODAL STATE ────────────────────────────
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteProject, setQuoteProject] = useState<ProjectWithUser | null>(null);
  
  const [docType, setDocType] = useState<string>("RATE CARD");
  const [docTitle, setDocTitle] = useState<string>("");
  const [docSubtitle, setDocSubtitle] = useState<string>("PROJECT PROPOSAL, COST ESTIMATE & TIMELINE");
  const [clientLocation, setClientLocation] = useState<string>("Nairobi, Kenya");
  const [scopeSummary, setScopeSummary] = useState<string>("");
  const [tableHeading, setTableHeading] = useState<string>("Website Design & Development — Scope & Rates");
  
  const [lineItems, setLineItems] = useState<LineItemState[]>([]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxLabelOverride, setTaxLabelOverride] = useState<string>("N/A — sole proprietor rate, VAT not applicable");
  
  const [depositPercentage, setDepositPercentage] = useState<number>(50);
  const [depositNote, setDepositNote] = useState<string>("");
  const [depositBadge, setDepositBadge] = useState<string>("");
  
  const [timelineTitle, setTimelineTitle] = useState<string>("Project Timeline — Estimated 5 Weeks");
  const [timelinePhases, setTimelinePhases] = useState<TimelinePhaseState[]>([]);
  
  const [paymentTerms, setPaymentTerms] = useState<string[]>([]);
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [excludedItems, setExcludedItems] = useState<string[]>([]);
  const [closingNote, setClosingNote] = useState<string>("");
  
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [isPreviewingPdf, setIsPreviewingPdf] = useState(false);

  const openProjectDetails = (project: ProjectWithUser) => {
    setSelectedProject(project);
    setAppStatus(project.status);
    setAdminNote(project.adminNote || "");
    setQuotedPrice(project.quotedPrice ?? "");
  };

  const openQuoteBuilder = (project: ProjectWithUser) => {
    setQuoteProject(project);
    setDocType("RATE CARD");
    setDocTitle(project.title || "Website & E-commerce Platform Development");
    setDocSubtitle("PROJECT PROPOSAL, COST ESTIMATE & TIMELINE");
    setClientLocation(project.company ? `${project.company}, Nairobi, Kenya` : "Nairobi, Kenya");
    
    // Default Scope Summary
    setScopeSummary(
      `A lean, launch-ready platform engineered for ${project.name} — custom architecture, user experience, automated integrations, and complete production deployment.`
    );
    setTableHeading("Website Design & Development — Scope & Rates");

    // Line items setup
    if (project.budget && project.budget > 0) {
      const budgetVal = project.budget;
      setLineItems([
        { description: `${project.title} — Planning, UI/UX Mockups & Architecture`, qty: 1, unitPrice: Math.round(budgetVal * 0.2), amount: Math.round(budgetVal * 0.2) },
        { description: `Core Frontend & Backend Engineering`, qty: 1, unitPrice: Math.round(budgetVal * 0.5), amount: Math.round(budgetVal * 0.5) },
        { description: `M-Pesa / Payment Integrations & Order Workflows`, qty: 1, unitPrice: Math.round(budgetVal * 0.15), amount: Math.round(budgetVal * 0.15) },
        { description: `Testing, Production Deployment & Handover`, qty: 1, unitPrice: Math.round(budgetVal * 0.15), amount: Math.round(budgetVal * 0.15) },
      ]);
    } else {
      setLineItems([
        { description: "Project Planning & Requirements Analysis", qty: 1, unitPrice: 10000, amount: 10000 },
        { description: "UI/UX Design & Storefront Mockups (brand-matched, mobile-first)", qty: 1, unitPrice: 20000, amount: 20000 },
        { description: "Frontend Development — Product Catalog, Categories, Cart & Checkout", qty: 1, unitPrice: 45000, amount: 45000 },
        { description: "Backend Development — Admin Dashboard (Inventory & Order Management)", qty: 1, unitPrice: 35000, amount: 35000 },
        { description: "M-Pesa Daraja Payment Integration (STK Push, order reconciliation)", qty: 1, unitPrice: 25000, amount: 25000 },
        { description: "Order Assistant Chatbot — product Q&A, order status, WhatsApp handoff", qty: 1, unitPrice: 20000, amount: 20000 },
        { description: "Content Integration, Product Upload & Delivery-Fee Setup", qty: 1, unitPrice: 10000, amount: 10000 },
        { description: "Testing, Bug Fixes & Quality Assurance", qty: 1, unitPrice: 8000, amount: 8000 },
        { description: "Deployment & Website Configuration", qty: 1, unitPrice: 7000, amount: 7000 },
      ]);
    }

    setTaxRate(0);
    setTaxLabelOverride("N/A — sole proprietor rate, VAT not applicable");
    setDepositPercentage(50);
    setDepositNote("A 50% deposit secures your project slot and covers planning through frontend development. Work begins once this is received. The remaining balance is due on delivery.");
    setDepositBadge("50% UPFRONT · DUE BEFORE KICKOFF");

    // Timeline phases
    setTimelineTitle("Project Timeline — Estimated 5 Weeks");
    setTimelinePhases([
      {
        phaseNumber: "PHASE 01",
        name: "Planning & Design",
        description: "Requirements gathering, UI/UX mockups, and brand alignment.",
        dayRangeLabel: "Days 1–5",
      },
      {
        phaseNumber: "PHASE 02",
        name: "Development",
        description: "Frontend storefront build, admin dashboard, M-Pesa & chatbot integration.",
        dayRangeLabel: "Days 6–22",
      },
      {
        phaseNumber: "PHASE 03",
        name: "Content & QA",
        description: "Product uploads, delivery-fee setup, cross-device testing, bug fixes.",
        dayRangeLabel: "Days 23–30",
      },
      {
        phaseNumber: "PHASE 04",
        name: "Launch",
        description: `Deployment, final walkthrough, and handover to ${project.name}.`,
        dayRangeLabel: "Days 31–35",
      },
    ]);

    // Payment Terms
    setPaymentTerms([
      "50% is due upfront, before any work commences.",
      "The remaining 50% is due upon successful completion and delivery of the platform.",
      "Work begins only after receipt of the initial deposit.",
      "Payment accepted via M-Pesa Paybill/Till or bank transfer to Bezalel Technologies.",
      "Add-on features or scope changes will be quoted and billed separately upon mutual agreement.",
    ]);

    // Included deliverables
    setIncludedItems([
      "Mobile-first, responsive storefront across all devices",
      "Product catalog with categories, search/filters, and variant support",
      "M-Pesa STK Push checkout — automated payment reconciliation",
      "Order assistant chatbot for product questions, order status, and WhatsApp handoff",
      "Admin dashboard to manage products, orders, and delivery status",
      "Flat-rate delivery pricing (Nairobi vs. upcountry)",
      "1 round of revisions post-delivery, plus 14 days of post-launch support",
    ]);

    // Excluded items (can be emptied by admin to omit section)
    setExcludedItems([
      "Customer accounts / multi-vendor marketplace engine",
      "Custom mobile applications (iOS/Android native apps)",
      "Third-party ad campaign management and recurring domain/hosting fees",
    ]);

    // Closing note
    setClosingNote(
      `This rate card is an estimate based on the scope discussed. Final pricing may be adjusted if requirements change. Reach out anytime at technologiesbezalel@gmail.com.`
    );

    setIsQuoteModalOpen(true);
  };

  // Line items helpers
  const handleLineItemChange = (index: number, field: keyof LineItemState, value: string | number) => {
    const updated = [...lineItems];
    const item = { ...updated[index] };
    
    if (field === "description") {
      item.description = String(value);
    } else if (field === "qty") {
      item.qty = Math.max(1, Number(value) || 1);
      item.amount = item.qty * item.unitPrice;
    } else if (field === "unitPrice") {
      item.unitPrice = Math.max(0, Number(value) || 0);
      item.amount = item.qty * item.unitPrice;
    }
    
    updated[index] = item;
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "Additional Scope Deliverable", qty: 1, unitPrice: 15000, amount: 15000 },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length <= 1) {
      toast.error("At least one line item is required");
      return;
    }
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  // Timeline phase helpers
  const handlePhaseChange = (index: number, field: keyof TimelinePhaseState, value: string) => {
    const updated = [...timelinePhases];
    updated[index] = { ...updated[index], [field]: value };
    setTimelinePhases(updated);
  };

  const addTimelinePhase = () => {
    const nextNum = timelinePhases.length + 1;
    setTimelinePhases([
      ...timelinePhases,
      {
        phaseNumber: `PHASE ${String(nextNum).padStart(2, "0")}`,
        name: "New Milestone Phase",
        description: "Milestone deliverable details and scope.",
        dayRangeLabel: `Days ${nextNum * 7 - 6}–${nextNum * 7}`,
      },
    ]);
  };

  const removeTimelinePhase = (index: number) => {
    if (timelinePhases.length <= 1) {
      toast.error("At least one timeline phase is required");
      return;
    }
    setTimelinePhases(timelinePhases.filter((_, i) => i !== index));
  };

  // Array helpers (Terms, Included, Excluded)
  const updateArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], index: number, value: string) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], defaultValue: string) => {
    setter([...list, defaultValue]);
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], index: number) => {
    setter(list.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = lineItems.reduce((acc, item) => acc + item.amount, 0);
  const tax = taxRate > 0 ? Math.round(subtotal * taxRate * 100) / 100 : 0;
  const total = subtotal + tax;
  const amountDueToStart = Math.round(total * (depositPercentage / 100));

  // Build Quote Payload
  const buildQuotePayload = () => ({
    documentType: docType,
    title: docTitle,
    subtitle: docSubtitle,
    clientLocation,
    scopeSummary,
    tableTitle: tableHeading,
    taxLabel: taxLabelOverride,
    depositPercentage,
    depositNote,
    depositBadge,
    timelineTitle,
    timelinePhases,
    paymentTerms,
    included: includedItems,
    excluded: excludedItems.filter(item => item.trim().length > 0),
    closingNote,
    lineItems,
    taxRate,
    validUntilDays: 30,
  });

  // Preview PDF in new tab
  const handlePreviewPdf = async () => {
    if (!quoteProject) return;
    setIsPreviewingPdf(true);

    try {
      const response = await fetch(`/api/projects/${quoteProject.id}/quote/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildQuotePayload()),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate PDF preview");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("PDF preview opened in new tab");
    } catch (err) {
      console.error("Preview error:", err);
      const msg = err instanceof Error ? err.message : "Failed to preview PDF";
      toast.error(msg);
    } finally {
      setIsPreviewingPdf(false);
    }
  };

  // Generate & Dispatch Quote
  const handleGenerateAndSendQuote = async () => {
    if (!quoteProject) return;
    setIsGeneratingQuote(true);

    try {
      const response = await fetch(`/api/projects/${quoteProject.id}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildQuotePayload()),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate quotation");
      }

      const result = await response.json();

      setProjects(projects.map(p => p.id === quoteProject.id ? { 
        ...p, 
        status: "QUOTED" as ProjectStatus,
        quotedPrice: total,
      } : p));

      if (result.emailWarning) {
        toast.success(`Official ${docType} ${result.documentNumber || result.quoteNumber} created! (${result.emailWarning})`);
      } else {
        toast.success(`Official ${docType} ${result.documentNumber || result.quoteNumber} emailed to ${quoteProject.email}!`);
      }

      setIsQuoteModalOpen(false);
      setQuoteProject(null);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to generate quotation";
      toast.error(msg);
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: appStatus,
          adminNote: adminNote || null,
          quotedPrice: quotedPrice === "" ? null : Number(quotedPrice),
        }),
      });

      if (!response.ok) throw new Error("Failed to update project");
      const updated = await response.json();

      setProjects(projects.map(p => p.id === updated.id ? { ...p, ...updated } : p));
      toast.success("Project updated successfully");
      setSelectedProject(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project details");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (statusFilter === "all") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-3xl font-black text-foreground tracking-tight">Project Pipeline & Quotations</h1>
          <p className="text-muted-foreground text-sm">Review incoming client briefs, create official Rate Cards & Quotations, and dispatch PDF estimates.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border p-4 rounded-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-accent" /> Filter by Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border border-border text-foreground rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider outline-none focus:border-accent"
          >
            <option value="all">All Statuses ({projects.length})</option>
            {Object.values(ProjectStatus).map(status => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ")} ({projects.filter(p => p.status === status).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/40 text-muted-foreground border-b border-border text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Project / Client</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Quoted Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No projects found for the selected status.
                  </td>
                </tr>
              ) : (
                filteredProjects.map(project => (
                  <tr key={project.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-foreground">{project.title}</div>
                      <div className="text-muted-foreground text-xs">{project.company ? `${project.company} · ${project.name}` : project.name} ({project.email})</div>
                    </td>
                    <td className="p-4">
                      <span className="text-muted-foreground text-xs bg-secondary px-2.5 py-1 rounded font-medium">
                        {project.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        project.status === "NEW" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                        project.status === "IN_REVIEW" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" :
                        project.status === "QUOTED" ? "bg-accent/15 text-accent-dark dark:text-accent-light border border-accent/30" :
                        project.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                        project.status === "IN_PROGRESS" ? "bg-primary/10 text-primary border border-primary/20" :
                        project.status === "DELIVERED" ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" :
                        "bg-secondary text-muted-foreground border border-border"
                      }`}>
                        {project.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-foreground">
                      {project.quotedPrice !== null ? `KES ${project.quotedPrice.toLocaleString()}` : "—"}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {new Date(project.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openQuoteBuilder(project)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold bg-accent text-accent-foreground px-3 py-1.5 rounded-md hover:bg-accent-light transition-colors shadow-sm"
                          title="Generate Rate Card / PDF Quotation"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Quote PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openProjectDetails(project)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold border border-border bg-card hover:bg-secondary text-foreground px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── COMPREHENSIVE RATE CARD & QUOTATION BUILDER MODAL ──── */}
      {isQuoteModalOpen && quoteProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl max-w-4xl w-full p-6 relative shadow-2xl flex flex-col max-h-[94vh]">
            <button
              onClick={() => { setIsQuoteModalOpen(false); setQuoteProject(null); }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-dark dark:text-accent-light mb-1">
                <FileCheck className="w-4 h-4" /> Official Document Generator (Rate Card / Quotation Spec v6)
              </div>
              <h2 className="text-2xl font-black text-foreground">
                Quotation & Rate Card for {quoteProject.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Client: <strong className="text-foreground">{quoteProject.name}</strong> · Email: <strong className="text-foreground">{quoteProject.email}</strong>
              </p>
            </div>

            {/* Modal Body Form */}
            <div className="space-y-6 overflow-y-auto flex-1 pr-2">
              
              {/* 1. Header & Metadata Block */}
              <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                  1. Document Header & Identification
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Document Type Label
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-bold uppercase text-foreground focus:border-accent outline-none"
                    >
                      <option value="RATE CARD">RATE CARD</option>
                      <option value="QUOTATION">QUOTATION</option>
                      <option value="INVOICE">INVOICE</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Main Document Title
                    </label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g. Website & E-commerce Platform Development"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-accent outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={docSubtitle}
                      onChange={(e) => setDocSubtitle(e.target.value)}
                      placeholder="PROJECT PROPOSAL, COST ESTIMATE & TIMELINE"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Client Location
                    </label>
                    <input
                      type="text"
                      value={clientLocation}
                      onChange={(e) => setClientLocation(e.target.value)}
                      placeholder="e.g. Nairobi, Kenya"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Intro Paragraph (Scope Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={scopeSummary}
                    onChange={(e) => setScopeSummary(e.target.value)}
                    placeholder="Brief intro paragraph describing the scoped platform and deliverables..."
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 2. Scope Deliverables & Line Items Table */}
              <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                    2. Deliverables & Rates Table (KES)
                  </div>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Scope Item
                  </button>
                </div>

                <div className="mb-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Table Section Heading
                  </label>
                  <input
                    type="text"
                    value={tableHeading}
                    onChange={(e) => setTableHeading(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-accent outline-none"
                  />
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-md border border-border bg-background p-2.5">
                      <span className="text-xs font-mono text-muted-foreground w-6 text-center">{idx + 1}</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleLineItemChange(idx, "description", e.target.value)}
                          placeholder="Scope deliverable description..."
                          className="w-full bg-transparent text-xs font-medium text-foreground outline-none placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="w-14">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleLineItemChange(idx, "qty", e.target.value)}
                          className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-center text-foreground outline-none focus:border-accent"
                          placeholder="Qty"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(idx, "unitPrice", e.target.value)}
                          className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-right text-foreground outline-none focus:border-accent"
                          placeholder="Unit Price"
                        />
                      </div>
                      <div className="w-28 text-right font-mono text-xs font-bold text-foreground">
                        KES {item.amount.toLocaleString()}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLineItem(idx)}
                        className="text-muted-foreground hover:text-red-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotal, Tax & Total Overview */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-border mt-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Tax / VAT Text Override
                    </label>
                    <input
                      type="text"
                      value={taxLabelOverride}
                      onChange={(e) => setTaxLabelOverride(e.target.value)}
                      placeholder="e.g. N/A — sole proprietor rate, VAT not applicable"
                      className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-accent outline-none"
                    />
                  </div>
                  <div className="rounded-lg border border-border bg-background p-3 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Subtotal:</span>
                      <span className="font-mono font-bold">KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Tax:</span>
                      <span className="text-[11px]">{taxLabelOverride}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-foreground border-t border-border pt-1 mt-1">
                      <span>Total Project Cost:</span>
                      <span className="font-mono text-accent-dark dark:text-accent-light text-base">
                        KES {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Amount Due to Start Callout Box */}
              <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                  3. Amount Due to Start (Deposit Callout Box)
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Deposit Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={depositPercentage}
                      onChange={(e) => setDepositPercentage(Number(e.target.value))}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono font-bold text-foreground focus:border-accent outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Computed Amount Due to Start
                    </label>
                    <div className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-md font-mono text-sm font-bold text-accent-dark dark:text-accent-light">
                      KES {amountDueToStart.toLocaleString()} ({depositPercentage}% of KES {total.toLocaleString()})
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Deposit Explanation Note
                    </label>
                    <textarea
                      rows={2}
                      value={depositNote}
                      onChange={(e) => setDepositNote(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Callout Badge Label
                    </label>
                    <input
                      type="text"
                      value={depositBadge}
                      onChange={(e) => setDepositBadge(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Project Timeline Phases */}
              <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> 4. Project Timeline Phases
                  </div>
                  <button
                    type="button"
                    onClick={addTimelinePhase}
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Phase
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Timeline Section Title
                  </label>
                  <input
                    type="text"
                    value={timelineTitle}
                    onChange={(e) => setTimelineTitle(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-accent outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {timelinePhases.map((phase, idx) => (
                    <div key={idx} className="border border-border bg-background p-3 rounded-lg space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={phase.phaseNumber}
                          onChange={(e) => handlePhaseChange(idx, "phaseNumber", e.target.value)}
                          className="text-[11px] font-bold text-accent-dark dark:text-accent-light uppercase bg-transparent outline-none w-24"
                        />
                        <button
                          type="button"
                          onClick={() => removeTimelinePhase(idx)}
                          className="text-muted-foreground hover:text-red-500"
                          title="Remove phase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={phase.name}
                        onChange={(e) => handlePhaseChange(idx, "name", e.target.value)}
                        placeholder="Phase Name..."
                        className="w-full bg-transparent text-xs font-bold text-foreground border-b border-border pb-1 outline-none"
                      />
                      <textarea
                        rows={2}
                        value={phase.description}
                        onChange={(e) => handlePhaseChange(idx, "description", e.target.value)}
                        placeholder="Phase description..."
                        className="w-full bg-transparent text-[11px] text-muted-foreground outline-none resize-none leading-tight"
                      />
                      <input
                        type="text"
                        value={phase.dayRangeLabel}
                        onChange={(e) => handlePhaseChange(idx, "dayRangeLabel", e.target.value)}
                        placeholder="e.g. Days 1–5"
                        className="w-full bg-transparent text-[11px] font-bold text-accent-dark dark:text-accent-light outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Payment Terms */}
              <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                    5. Payment Terms Bullets
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem(setPaymentTerms, paymentTerms, "New payment term note...")}
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Term
                  </button>
                </div>

                <div className="space-y-2">
                  {paymentTerms.map((term, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">•</span>
                      <input
                        type="text"
                        value={term}
                        onChange={(e) => updateArrayItem(setPaymentTerms, paymentTerms, idx, e.target.value)}
                        className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(setPaymentTerms, paymentTerms, idx)}
                        className="text-muted-foreground hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. What's Included & Not Included */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* What's Included */}
                <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                      6A. What&apos;s Included
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayItem(setIncludedItems, includedItems, "Additional included feature...")}
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {includedItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-muted-foreground text-xs">•</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayItem(setIncludedItems, includedItems, idx, e.target.value)}
                          className="flex-1 bg-background border border-border rounded px-2.5 py-1 text-xs text-foreground outline-none focus:border-accent"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem(setIncludedItems, includedItems, idx)}
                          className="text-muted-foreground hover:text-red-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Not Included at This Budget */}
                <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                        6B. Not Included (Optional)
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        Leave empty to omit this section in PDF
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayItem(setExcludedItems, excludedItems, "Excluded feature / upgrade...")}
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {excludedItems.length === 0 ? (
                      <div className="text-xs text-muted-foreground italic py-3 text-center border border-dashed border-border rounded">
                        Section is omitted (empty).
                      </div>
                    ) : (
                      excludedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="text-muted-foreground text-xs">•</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateArrayItem(setExcludedItems, excludedItems, idx, e.target.value)}
                            className="flex-1 bg-background border border-border rounded px-2.5 py-1 text-xs text-foreground outline-none focus:border-accent"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem(setExcludedItems, excludedItems, idx)}
                            className="text-muted-foreground hover:text-red-500 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* 7. Closing Note */}
              <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                  7. Closing Note & Contact Sign-off
                </label>
                <textarea
                  rows={2}
                  value={closingNote}
                  onChange={(e) => setClosingNote(e.target.value)}
                  placeholder="Thank you note and closing contact statement..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent outline-none resize-none"
                />
              </div>

            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
              <button
                type="button"
                onClick={() => { setIsQuoteModalOpen(false); setQuoteProject(null); }}
                className="border border-border bg-card hover:bg-secondary text-foreground font-bold px-4 py-2.5 rounded-md text-xs transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isPreviewingPdf || lineItems.length === 0}
                  onClick={handlePreviewPdf}
                  className="border border-accent text-accent-dark dark:text-accent-light hover:bg-accent/10 font-bold px-4 py-2.5 rounded-md text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                  title="Preview rendered PDF in a new tab"
                >
                  {isPreviewingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Rendering Preview...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Preview PDF
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isGeneratingQuote || lineItems.length === 0}
                  onClick={handleGenerateAndSendQuote}
                  className="bg-accent hover:bg-accent-light text-accent-foreground font-bold px-5 py-2.5 rounded-md text-xs transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isGeneratingQuote ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating & Emailing PDF...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Generate & Email {docType}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PROJECT DETAILS & STATUS MODAL ───────────────────────── */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[92vh]">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-foreground mb-1">Project Brief Review</h2>
            <div className="text-muted-foreground text-xs flex items-center gap-2 mb-4 border-b border-border pb-3">
              <span>Submitted: {new Date(selectedProject.createdAt).toLocaleString()}</span>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-5 overflow-y-auto flex-1 pr-1">
              
              {/* Project Info Section */}
              <div className="bg-secondary/20 border border-border p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-bold uppercase tracking-wider">CLIENT NAME</span>
                    <span className="text-foreground font-bold">{selectedProject.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-bold uppercase tracking-wider">EMAIL</span>
                    <a href={`mailto:${selectedProject.email}`} className="text-accent-dark dark:text-accent-light hover:underline mt-0.5 block">
                      {selectedProject.email}
                    </a>
                  </div>
                  {selectedProject.company && (
                    <div>
                      <span className="text-muted-foreground block font-bold uppercase tracking-wider">COMPANY</span>
                      <span className="text-foreground">{selectedProject.company}</span>
                    </div>
                  )}
                  {selectedProject.phone && (
                    <div>
                      <span className="text-muted-foreground block font-bold uppercase tracking-wider">PHONE</span>
                      <span className="text-foreground">{selectedProject.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground block font-bold uppercase tracking-wider">TARGET BUDGET</span>
                    <span className="text-foreground">
                      {selectedProject.budget ? `KES ${selectedProject.budget.toLocaleString()}` : "Flexible / Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-bold uppercase tracking-wider">TIMELINE</span>
                    <span className="text-foreground">{selectedProject.timeline || "Not specified"}</span>
                  </div>
                  {selectedProject.attachmentUrl && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground block font-bold uppercase tracking-wider">ATTACHMENT</span>
                      <a 
                        href={selectedProject.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs text-accent-dark dark:text-accent-light bg-accent/10 border border-accent/20 px-2.5 py-1 rounded mt-1 hover:bg-accent/20"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Brief Asset
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">PROJECT TITLE</span>
                  <p className="text-foreground font-bold">{selectedProject.title}</p>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">DESCRIPTION</span>
                  <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed bg-background p-3 rounded border border-border">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* Status & Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Pipeline Status</label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:border-accent text-xs font-bold uppercase outline-none"
                  >
                    {Object.values(ProjectStatus).map(status => (
                      <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Quoted Price (KES)</label>
                  <input
                    type="number"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 250000"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent text-sm font-mono outline-none"
                  />
                </div>
              </div>

              {/* Admin Note */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Internal Notes (Admin Only)</label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Record scope details, calls, or internal estimates..."
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent text-sm outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="border border-border bg-card hover:bg-secondary text-foreground font-bold px-4 py-2.5 rounded-md text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-2.5 rounded-md text-xs transition-colors flex items-center gap-1.5"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Status Update
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
