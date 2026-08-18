"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  ArrowLeft, Upload, FileText, CheckCircle2, 
  Loader2, Briefcase, MapPin, Clock, ArrowRight 
} from "lucide-react";
import Link from "next/link";

interface JobInfo {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export default function ApplyForm({ job }: { job: JobInfo }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      setCvFile(file);
      toast.success(`Selected file: ${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !cvFile) {
      toast.error("Please fill in all required fields and upload your CV.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("jobId", job.id);
    formData.append("name", name);
    formData.append("email", email);
    if (phone) formData.append("phone", phone);
    if (coverNote) formData.append("coverNote", coverNote);
    formData.append("cv", cvFile);

    try {
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit application");
      }

      toast.success("Application submitted successfully.");
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
            Application Received
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Thank you, <strong className="text-foreground">{name}</strong>. Your application for the position of <strong className="text-foreground">{job.title}</strong> has been logged.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            A confirmation receipt has been sent to {email}. Our engineering leads review each submission carefully.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link 
              href="/careers" 
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Back to careers
            </Link>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-xs font-bold text-foreground transition-colors hover:border-accent"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link 
        href="/careers" 
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to open roles
      </Link>

      {/* Role Summary */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-dark dark:text-accent-light">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Job Application</span>
        </div>
        
        <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          {job.title}
        </h1>
        
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full bg-accent-dark dark:bg-accent-light" />
            {job.department}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {job.type.replace(/_/g, " ").toLowerCase()}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Full Name <span className="text-accent-dark dark:text-accent-light">*</span>
              </label>
              <input 
                id="name"
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Kamau"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Email Address <span className="text-accent-dark dark:text-accent-light">*</span>
              </label>
              <input 
                id="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Phone Number
            </label>
            <input 
              id="phone"
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +254 796 157 265"
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* CV Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
              CV / Resume (PDF, DOC, DOCX) <span className="text-accent-dark dark:text-accent-light">*</span>
            </label>
            
            <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-6 text-center transition-colors hover:border-accent">
              <input 
                type="file" 
                required
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              {cvFile ? (
                <div className="flex flex-col items-center space-y-2 text-accent-dark dark:text-accent-light">
                  <FileText className="h-10 w-10" />
                  <span className="text-sm font-bold text-foreground">{cvFile.name}</span>
                  <span className="text-xs text-muted-foreground">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                  <Upload className="h-10 w-10 text-muted-foreground/60" />
                  <span className="text-sm font-medium text-foreground">Click to upload or drag and drop your CV</span>
                  <span className="text-xs">PDF or DOCX up to 5 MB</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover Note */}
          <div className="space-y-2">
            <label htmlFor="coverNote" className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Brief Introduction / Relevant Project Links
            </label>
            <textarea 
              id="coverNote"
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Highlight any relevant engineering experience, GitHub profiles, or production systems you have worked on."
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
            />
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
                Submitting application...
              </>
            ) : (
              <>
                Submit application
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
