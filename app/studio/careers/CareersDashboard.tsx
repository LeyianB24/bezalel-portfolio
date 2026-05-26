"use client";

import { useState } from "react";
import { 
  Briefcase, Users, Plus, Eye, Check, X, 
  ExternalLink, FileText, Filter, Calendar, 
  Loader2, ToggleLeft, ToggleRight, Building, MapPin 
} from "lucide-react";
import { JobType, AppStatus } from "@prisma/client";
import { toast } from "sonner";

interface JobWithCount {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string[];
  isOpen: boolean;
  createdAt: Date;
  _count: {
    applications: number;
  };
}

interface ApplicationWithJob {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string | null;
  cvUrl: string;
  coverNote: string | null;
  status: AppStatus;
  adminNote: string | null;
  createdAt: Date;
  job: {
    title: string;
    department: string;
  };
}

interface CareersDashboardProps {
  initialJobs: JobWithCount[];
  initialApplications: ApplicationWithJob[];
}

export default function CareersDashboard({ 
  initialJobs, 
  initialApplications 
}: CareersDashboardProps) {
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");
  
  // State
  const [jobs, setJobs] = useState<JobWithCount[]>(initialJobs);
  const [applications, setApplications] = useState<ApplicationWithJob[]>(initialApplications);
  
  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJob | null>(null);
  
  // Filters
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // New Job Form State
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDept, setNewJobDept] = useState("Engineering");
  const [newJobLoc, setNewJobLoc] = useState("Remote");
  const [newJobType, setNewJobType] = useState<JobType>("FULL_TIME");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [newJobReqs, setNewJobReqs] = useState<string[]>([""]);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  // Application Edit State
  const [appStatus, setAppStatus] = useState<AppStatus>("PENDING");
  const [appAdminNote, setAppAdminNote] = useState("");
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);

  // Helper for reqs inputs
  const handleAddReq = () => setNewJobReqs([...newJobReqs, ""]);
  const handleRemoveReq = (index: number) => {
    if (newJobReqs.length === 1) return;
    setNewJobReqs(newJobReqs.filter((_, i) => i !== index));
  };
  const handleReqChange = (index: number, val: string) => {
    const updated = [...newJobReqs];
    updated[index] = val;
    setNewJobReqs(updated);
  };

  // Toggle Job Open Status
  const handleToggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    const originalJobs = [...jobs];
    
    // Optimistic update
    setJobs(jobs.map(j => j.id === jobId ? { ...j, isOpen: !currentStatus } : j));

    try {
      const response = await fetch(`/api/careers/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      toast.success("Job status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job status");
      setJobs(originalJobs);
    }
  };

  // Create Job Submit
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobDesc || !newJobLoc) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsCreatingJob(true);
    const reqs = newJobReqs.filter(r => r.trim() !== "");

    try {
      const response = await fetch("/api/careers/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newJobTitle,
          department: newJobDept,
          location: newJobLoc,
          type: newJobType,
          description: newJobDesc,
          requirements: reqs,
          isOpen: true
        }),
      });

      if (!response.ok) throw new Error("Failed to create job");
      const created = await response.json();
      
      setJobs([{ ...created, _count: { applications: 0 } }, ...jobs]);
      toast.success("Job post created successfully!");
      
      // Reset form
      setNewJobTitle("");
      setNewJobDept("Engineering");
      setNewJobLoc("Remote");
      setNewJobType("FULL_TIME");
      setNewJobDesc("");
      setNewJobReqs([""]);
      setIsJobModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create job post.");
    } finally {
      setIsCreatingJob(false);
    }
  };

  // Update Application Submit
  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication) return;

    setIsUpdatingApp(true);
    try {
      const response = await fetch(`/api/careers/applications/${selectedApplication.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: appStatus,
          adminNote: appAdminNote || null
        }),
      });

      if (!response.ok) throw new Error("Failed to update application");
      const updated = await response.json();

      setApplications(applications.map(app => app.id === updated.id ? { ...app, status: updated.status, adminNote: updated.adminNote } : app));
      toast.success("Application details updated successfully");
      setSelectedApplication(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update application details");
    } finally {
      setIsUpdatingApp(false);
    }
  };

  // Open App Detail Modal
  const openAppDetails = (app: ApplicationWithJob) => {
    setSelectedApplication(app);
    setAppStatus(app.status);
    setAppAdminNote(app.adminNote || "");
  };

  // Filter applications list
  const filteredApplications = applications.filter(app => {
    const matchesJob = jobFilter === "all" || app.jobId === jobFilter;
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesJob && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Careers Control Center</h1>
          <p className="text-zinc-400 text-sm">Create job positions and manage submissions.</p>
        </div>

        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "jobs"
                ? "bg-emerald-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Roles ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "applications"
                ? "bg-emerald-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" /> Applicants ({applications.length})
          </button>
        </div>
      </div>

      {/* JOBS TAB */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsJobModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-4 py-2.5 rounded-lg text-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Role
            </button>
          </div>

          <div className="grid gap-4">
            {jobs.length === 0 ? (
              <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
                No job positions created yet.
              </div>
            ) : (
              jobs.map(job => (
                <div 
                  key={job.id} 
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                        {job.department}
                      </span>
                      <span className="text-zinc-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                        {job.type.replace("_", "-")}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <p className="text-zinc-400 text-xs font-mono">
                      Created on: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-zinc-800">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-zinc-400">
                        Applicants: <strong className="text-white">{job._count.applications}</strong>
                      </span>
                      
                      <button
                        onClick={() => handleToggleJobStatus(job.id, job.isOpen)}
                        title={job.isOpen ? "Close Job" : "Open Job"}
                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
                      >
                        {job.isOpen ? (
                          <>
                            <span className="text-emerald-500">Active</span>
                            <ToggleRight className="w-8 h-8 text-emerald-500" />
                          </>
                        ) : (
                          <>
                            <span className="text-zinc-500">Closed</span>
                            <ToggleLeft className="w-8 h-8 text-zinc-600" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-mono mr-2">
              <Filter className="w-4 h-4" /> Filters
            </div>

            {/* Filter by Job */}
            <div className="space-y-1">
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="bg-black border border-zinc-850 text-zinc-300 rounded px-3 py-1.5 text-sm outline-none focus:border-emerald-600 font-mono"
              >
                <option value="all">All Jobs</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="space-y-1">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black border border-zinc-850 text-zinc-300 rounded px-3 py-1.5 text-sm outline-none focus:border-emerald-600 font-mono"
              >
                <option value="all">All Statuses</option>
                {Object.values(AppStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applicants List */}
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/20">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-mono text-xs uppercase">
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Applied For</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map(app => (
                    <tr key={app.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{app.name}</div>
                        <div className="text-zinc-400 text-xs font-mono">{app.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-white">{app.job.title}</div>
                        <div className="text-zinc-500 text-xs font-mono">{app.job.department}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                          app.status === "PENDING" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                          app.status === "REVIEWED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          app.status === "SHORTLISTED" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                          app.status === "INTERVIEWED" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                          app.status === "OFFERED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          "bg-zinc-800 text-zinc-500 border border-zinc-700"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-zinc-400 text-xs">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openAppDetails(app)}
                          className="inline-flex items-center gap-1.5 text-xs font-mono bg-zinc-850 hover:bg-zinc-800 text-white px-2.5 py-1.5 rounded transition-all border border-zinc-800"
                        >
                          <Eye className="w-3.5 h-3.5" /> Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE JOB MODAL */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[90vh]">
            <button
              onClick={() => setIsJobModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Create New Job Position</h2>
            
            <form onSubmit={handleCreateJob} className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">Title *</label>
                  <input
                    type="text"
                    required
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="Senior Frontend Architect"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-650"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">Department *</label>
                  <select
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-650"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">Location *</label>
                  <input
                    type="text"
                    required
                    value={newJobLoc}
                    onChange={(e) => setNewJobLoc(e.target.value)}
                    placeholder="Remote (EMEA) or Nairobi HQ"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-650"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">Employment Type</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value as JobType)}
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-650"
                  >
                    {Object.values(JobType).map(t => (
                      <option key={t} value={t}>{t.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-zinc-400 uppercase">Description (Mission Brief) *</label>
                <textarea
                  rows={4}
                  required
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Describe the mission and what success looks like in this position..."
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-650"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-zinc-400 uppercase">Requirements</label>
                <div className="space-y-2">
                  {newJobReqs.map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleReqChange(i, e.target.value)}
                        placeholder="e.g. 5+ years experience building React sites"
                        className="flex-1 bg-black border border-zinc-800 rounded px-3 py-1.5 text-sm text-white placeholder-zinc-700 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveReq(i)}
                        className="text-zinc-500 hover:text-red-400 p-1.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddReq}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-500 hover:text-emerald-400 mt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Requirement Line
                </button>
              </div>

              <button
                type="submit"
                disabled={isCreatingJob}
                className="w-full bg-emerald-600 hover:bg-emerald-505 text-zinc-950 font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isCreatingJob ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating Role...
                  </>
                ) : (
                  "Create Job Post"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* APPLICATION REVIEW MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[95vh]">
            <button
              onClick={() => setSelectedApplication(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-2">Review Applicant</h2>
            <div className="text-zinc-400 text-xs font-mono flex items-center gap-2 mb-4 border-b border-zinc-850 pb-4">
              <span>Applied for: <strong>{selectedApplication.job.title}</strong></span>
              <span>&bull;</span>
              <span>Submitted: {new Date(selectedApplication.createdAt).toLocaleString()}</span>
            </div>

            <form onSubmit={handleUpdateApplication} className="space-y-5 overflow-y-auto flex-1 pr-1">
              
              {/* Applicant Info Section */}
              <div className="bg-black/40 border border-zinc-850 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block">NAME</span>
                    <span className="text-white text-sm font-bold">{selectedApplication.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">EMAIL</span>
                    <a href={`mailto:${selectedApplication.email}`} className="text-emerald-400 text-sm hover:underline flex items-center gap-1 mt-0.5">
                      {selectedApplication.email} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">PHONE</span>
                    <span className="text-white text-sm">{selectedApplication.phone || "Not Provided"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">CV ATTACHMENT</span>
                    <a 
                      href={selectedApplication.cvUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded mt-1 font-mono hover:bg-emerald-950/40"
                    >
                      <FileText className="w-3.5 h-3.5" /> View CV Document
                    </a>
                  </div>
                </div>

                {selectedApplication.coverNote && (
                  <div className="border-t border-zinc-850 pt-3 mt-3">
                    <span className="text-xs font-mono text-zinc-500 block mb-1">COVER NOTE / ADDITIONAL DETAILS</span>
                    <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed bg-zinc-950/50 p-3 rounded border border-zinc-850">
                      {selectedApplication.coverNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-zinc-400 uppercase">Application Status</label>
                <select
                  value={appStatus}
                  onChange={(e) => setAppStatus(e.target.value as AppStatus)}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-650 font-mono text-sm"
                >
                  {Object.values(AppStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                  Changing status sends an automatic update email to the candidate.
                </span>
              </div>

              {/* Admin Note */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-zinc-400 uppercase">Internal Reviewer Note</label>
                <textarea
                  rows={4}
                  value={appAdminNote}
                  onChange={(e) => setAppAdminNote(e.target.value)}
                  placeholder="Type candidate feedback, interview notes, or references here. Only visible to Admins..."
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-650 text-sm"
                />
              </div>

              <div className="flex gap-3 justify-end border-t border-zinc-850 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="bg-zinc-850 hover:bg-zinc-800 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingApp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-1.5"
                >
                  {isUpdatingApp && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
