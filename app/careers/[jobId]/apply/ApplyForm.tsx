"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ArrowLeft, Upload, FileText, CheckCircle2, 
  Loader2, Briefcase, MapPin, Clock 
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
  const router = useRouter();
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

      toast.success("Application submitted successfully!");
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
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
          <CheckCircle2 className="w-20 h-20 text-purple-400 animate-bounce" />
          
          <h2 className="text-3xl font-black text-white tracking-tight">
            TRANSMISSION SECURED.
          </h2>
          <p className="text-slate-400 max-w-md leading-relaxed">
            Thank you, <strong className="text-white">{name}</strong>. Your application for <strong className="text-white">{job.title}</strong> has been logged into our systems.
          </p>
          <p className="text-xs text-slate-500 font-mono">
            A confirmation receipt has been dispatched to your email address: {email}
          </p>

          <div className="pt-6 w-full flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/careers" 
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-all font-mono text-sm"
            >
              Return to Careers
            </Link>
            <Link 
              href="/" 
              className="px-6 py-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-lg transition-all font-mono text-sm"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
      {/* Back Button */}
      <Link 
        href="/careers" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-mono text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to open roles
      </Link>

      {/* Title / Job Detail Summary */}
      <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
        <div className="flex items-center gap-3 text-xs font-mono font-medium text-purple-400 uppercase tracking-widest mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Apply Online</span>
        </div>
        
        <h1 className="text-3xl font-black text-white tracking-tight mb-4">
          {job.title}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            {job.department}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-500" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            {job.type.replace("_", " ").toLowerCase()}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Full Name <span className="text-purple-500">*</span>
              </label>
              <input 
                id="name"
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jean Bezalel"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors font-sans"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Email Address <span className="text-purple-500">*</span>
              </label>
              <input 
                id="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. dev@bezalelstudio.com"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors font-sans"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Phone Number
            </label>
            <input 
              id="phone"
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +254 796 157 265"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors font-sans"
            />
          </div>

          {/* CV File Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              CV / Resume (PDF, DOC, DOCX) <span className="text-purple-500">*</span>
            </label>
            
            <div className="relative border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-xl p-6 bg-black flex flex-col items-center justify-center text-center group cursor-pointer transition-all">
              <input 
                type="file" 
                required
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {cvFile ? (
                <div className="flex flex-col items-center space-y-2 text-purple-400">
                  <FileText className="w-12 h-12" />
                  <span className="text-white font-mono text-sm max-w-xs truncate">{cvFile.name}</span>
                  <span className="text-xs text-slate-500 font-mono">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-slate-400 group-hover:text-white transition-colors">
                  <Upload className="w-12 h-12 text-slate-600 group-hover:text-purple-400 transition-colors" />
                  <span className="font-mono text-sm">Drag and drop or click to upload</span>
                  <span className="text-xs text-slate-600 font-mono">Max size: 5 MB</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover Note */}
          <div className="space-y-2">
            <label htmlFor="coverNote" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Cover Note / Details
            </label>
            <textarea 
              id="coverNote"
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Why are you a fit for Bezalel Studio? Share your project portfolio links, GitHub, or briefly introduce yourself."
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors font-sans resize-y"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-mono uppercase tracking-wider shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Transmission...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
