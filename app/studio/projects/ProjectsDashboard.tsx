"use client";

import { useState } from "react";
import { FolderKanban, Eye, X, Loader2, FileText, Check, Clock, Edit3, MessageSquare } from "lucide-react";
import { ProjectCategory, ProjectStatus } from "@prisma/client";
import { toast } from "sonner";

interface ProjectWithUser {
  id: string;
  name: string;
  email: string;
  company: string | null;
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
  user: {
    name: string | null;
    email: string;
  } | null;
}

interface ProjectsDashboardProps {
  initialProjects: ProjectWithUser[];
}

export default function ProjectsDashboard({ initialProjects }: ProjectsDashboardProps) {
  const [projects, setProjects] = useState<ProjectWithUser[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<ProjectWithUser | null>(null);
  
  // Status Filter
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Edit State
  const [appStatus, setAppStatus] = useState<ProjectStatus>("NEW");
  const [adminNote, setAdminNote] = useState("");
  const [quotedPrice, setQuotedPrice] = useState<number | "">("");
  const [isUpdating, setIsUpdating] = useState(false);

  const openProjectDetails = (project: ProjectWithUser) => {
    setSelectedProject(project);
    setAppStatus(project.status);
    setAdminNote(project.adminNote || "");
    setQuotedPrice(project.quotedPrice ?? "");
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Project Pipeline</h1>
          <p className="text-zinc-400 text-sm">Manage incoming client briefs and active project lifecycles.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
        <span className="text-zinc-400 text-sm font-mono flex items-center gap-2">
          <FolderKanban className="w-4 h-4" /> Filter by Status:
        </span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black border border-zinc-850 text-zinc-300 rounded px-3 py-1.5 text-sm outline-none focus:border-emerald-600 font-mono"
        >
          <option value="all">All Projects</option>
          {Object.values(ProjectStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Projects List */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/20">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-mono text-xs uppercase">
              <th className="p-4">Project / Client</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  No projects found.
                </td>
              </tr>
            ) : (
              filteredProjects.map(project => (
                <tr key={project.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{project.title}</div>
                    <div className="text-zinc-400 text-xs font-mono">{project.company ? `${project.company} (${project.name})` : project.name}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-zinc-300 text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded">
                      {project.category.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                      project.status === "NEW" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      project.status === "IN_REVIEW" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      project.status === "QUOTED" ? "bg-accent/10 text-accent border border-accent/20" :
                      project.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      project.status === "IN_PROGRESS" ? "bg-slate-800/10 text-slate-300 border border-slate-700/20" :
                      project.status === "DELIVERED" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      "bg-zinc-800 text-zinc-500 border border-zinc-700"
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-zinc-400 text-xs">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openProjectDetails(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono bg-zinc-850 hover:bg-zinc-800 text-white px-2.5 py-1.5 rounded transition-all border border-zinc-800"
                    >
                      <Eye className="w-3.5 h-3.5" /> Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PROJECT REVIEW MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[95vh]">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-2">Project Brief Details</h2>
            <div className="text-zinc-400 text-xs font-mono flex items-center gap-2 mb-4 border-b border-zinc-850 pb-4">
              <span>Submitted: {new Date(selectedProject.createdAt).toLocaleString()}</span>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-5 overflow-y-auto flex-1 pr-1">
              
              {/* Project Info Section */}
              <div className="bg-black/40 border border-zinc-850 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block">CLIENT NAME</span>
                    <span className="text-white text-sm font-bold">{selectedProject.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">EMAIL</span>
                    <a href={`mailto:${selectedProject.email}`} className="text-emerald-400 text-sm hover:underline mt-0.5 block">
                      {selectedProject.email}
                    </a>
                  </div>
                  {selectedProject.company && (
                    <div>
                      <span className="text-zinc-500 block">COMPANY</span>
                      <span className="text-white text-sm">{selectedProject.company}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-zinc-500 block">BUDGET ESTIMATE</span>
                    <span className="text-white text-sm">
                      {selectedProject.budget ? `$${selectedProject.budget.toLocaleString()}` : "Flexible / Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">TIMELINE</span>
                    <span className="text-white text-sm">{selectedProject.timeline || "Not specified"}</span>
                  </div>
                  {selectedProject.attachmentUrl && (
                    <div>
                      <span className="text-zinc-500 block">ATTACHMENT</span>
                      <a 
                        href={selectedProject.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-1 rounded mt-1 hover:bg-emerald-950/40"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Asset
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-850 pt-3 mt-3">
                  <span className="text-xs font-mono text-zinc-500 block mb-1">PROJECT TITLE</span>
                  <p className="text-white font-bold">{selectedProject.title}</p>
                </div>

                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-1">DESCRIPTION</span>
                  <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed bg-zinc-950/50 p-3 rounded border border-zinc-850">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* Status & Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">Pipeline Status</label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-650 font-mono text-sm"
                  >
                    {Object.values(ProjectStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">Quoted Price (USD)</label>
                  <input
                    type="number"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 5000"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-650 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Admin Note */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-zinc-400 uppercase">Internal Notes (Visible only to Admin)</label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Record scope details, calls, or internal estimates..."
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-650 text-sm"
                />
              </div>

              <div className="flex gap-3 justify-end border-t border-zinc-850 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="bg-zinc-850 hover:bg-zinc-800 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-1.5"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
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
