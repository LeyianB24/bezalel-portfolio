"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ArrowLeft, Upload, FileText, CheckCircle2, 
  Loader2, FolderKanban, DollarSign, Calendar, Info
} from "lucide-react";
import Link from "next/link";
import { ProjectCategory } from "@prisma/client";

const CATEGORIES = [
  { id: ProjectCategory.WEB_APP, label: "Web App / Platform", desc: "SaaS, custom dashboards, portal engines" },
  { id: ProjectCategory.MOBILE_APP, label: "Mobile App", desc: "iOS / Android native or cross-platform" },
  { id: ProjectCategory.SYSTEM_INTEGRATION, label: "System Integration", desc: "API networks, databases, server synchronizations" },
  { id: ProjectCategory.UI_UX_DESIGN, label: "UI / UX Design", desc: "User research, wireframing, high-fidelity prototypes" },
  { id: ProjectCategory.CONSULTING, label: "Consulting / Audit", desc: "Code audits, cloud design, performance reviews" },
  { id: ProjectCategory.OTHER, label: "Other Systems", desc: "Custom hardware logic, automation pipelines, scrapers" },
];

const TIMELINES = [
  "Under 1 Month",
  "1-3 Months",
  "3-6 Months",
  "6+ Months",
  "Flexible / Ongoing",
];

export default function RequestForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
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

      toast.success("Project brief submitted successfully!");
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-neutral-900 border border-emerald-500/20 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />
          
          <h2 className="text-3xl font-black text-white tracking-tight">
            PROJECT LOGGED.
          </h2>
          <p className="text-zinc-400 max-w-md leading-relaxed">
            Thank you, <strong className="text-white">{name}</strong>. Your project brief for <strong className="text-white">&ldquo;{title}&rdquo;</strong> has been uploaded to our engineering pipeline.
          </p>
          <p className="text-xs text-zinc-500 font-mono">
            A secure transmission logs receipt has been dispatched to {email}
          </p>

          <div className="pt-6 w-full flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-all font-mono text-sm shadow-lg shadow-emerald-900/30"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 font-mono text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      {/* Header Summary */}
      <div className="bg-neutral-950 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <div className="flex items-center gap-3 text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest mb-3">
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Technical Pipeline Kickoff</span>
        </div>
        
        <h1 className="text-3xl font-black text-white tracking-tight mb-3">
          Initiate Project Brief
        </h1>
        <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
          Provide your specifications, timeline guidelines, and assets. Our partners will analyze the code architecture and outline a comprehensive quote and proposal.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-neutral-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Contacts */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
              01 // Client Credentials
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Full Name <span className="text-emerald-500">*</span>
                </label>
                <input 
                  id="name"
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-sans text-sm"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Email Address <span className="text-emerald-500">*</span>
                </label>
                <input 
                  id="email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@company.com"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-sans text-sm"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label htmlFor="company" className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Company Name <span className="text-zinc-600">(Optional)</span>
                </label>
                <input 
                  id="company"
                  type="text" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-sans text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Project Specifications */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
              02 // Scope & Specifications
            </h3>

            {/* Project Category Selection */}
            <div className="space-y-3">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                System Category <span className="text-emerald-500">*</span>
              </label>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col text-left group
                      ${category === cat.id 
                        ? "bg-emerald-500/5 border-emerald-500" 
                        : "bg-black border-zinc-850 hover:border-zinc-700"
                      }
                    `}
                  >
                    <span className={`text-xs font-bold font-mono tracking-tight uppercase ${category === cat.id ? "text-emerald-400" : "text-zinc-300"}`}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-zinc-550 mt-1 leading-normal">
                      {cat.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Project Title <span className="text-emerald-500">*</span>
              </label>
              <input 
                id="title"
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next-Gen B2B Logistics Dashboard"
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-sans text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                System Description & Objectives <span className="text-emerald-500">*</span>
              </label>
              <textarea 
                id="description"
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the technical workflows, system user stories, integrations, or specific frameworks required."
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-sans text-sm resize-y"
              />
            </div>
          </div>

          {/* Section 3: Budget & Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
              03 // Resource Allocations
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Budget */}
              <div className="space-y-2">
                <label htmlFor="budget" className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Estimated Budget (USD)</span>
                  <span className="text-[9px] text-zinc-650 tracking-normal font-normal">Leave blank if flexible</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <DollarSign size={14} />
                  </div>
                  <input 
                    id="budget"
                    type="number" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full bg-black border border-zinc-800 rounded-lg pl-9 pr-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-sans text-sm"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <label htmlFor="timeline" className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={12} className="text-zinc-500" />
                  <span>Timeline Expectation</span>
                </label>
                <select
                  id="timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono text-xs cursor-pointer"
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

          {/* Section 4: Attachments */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
              04 // Wireframes / Specifications
            </h3>

            {/* Brief Upload */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Upload File (PDF, DOCX, ZIP, images) <span className="text-zinc-650">(Optional)</span>
              </label>
              
              <div className="relative border-2 border-dashed border-zinc-800 hover:border-emerald-500/35 rounded-xl p-6 bg-black flex flex-col items-center justify-center text-center group cursor-pointer transition-all">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {attachmentFile ? (
                  <div className="flex flex-col items-center space-y-2 text-emerald-400">
                    <FileText className="w-12 h-12" />
                    <span className="text-white font-mono text-sm max-w-xs truncate">{attachmentFile.name}</span>
                    <span className="text-xs text-zinc-550 font-mono">{(attachmentFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    <Upload className="w-12 h-12 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                    <span className="font-mono text-xs">Drag and drop or click to upload project assets</span>
                    <span className="text-[10px] text-zinc-600 font-mono">Max size: 10 MB</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-emerald-950/10 border border-emerald-950/30 rounded-xl p-4 flex gap-3 text-xs text-emerald-500/90 leading-relaxed font-mono">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>
              All submissions are processed securely. Your assets and briefs remain strictly confidential under our standard Mutual NDA guidelines.
            </span>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider shadow-lg shadow-emerald-950/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.005] active:scale-[0.995]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Securing Pipeline Link...
              </>
            ) : (
              "Submit Project Brief"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
