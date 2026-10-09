"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserCheck,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Edit3,
  Trash2,
  X,
  Loader2,
  Key,
  Users,
  Lock,
  Check,
  Tag,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPermission } from "@prisma/client";
import { ADMIN_PERMISSIONS_LIST } from "@/lib/permissions";
import AuditLogViewer from "./AuditLogViewer";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AdminUserType {
  id: string;
  email: string;
  name: string | null;
  role: string;
  permissions: AdminPermission[];
  image?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CustomRoleType {
  id: string;
  name: string;
  description: string | null;
  permissions: AdminPermission[];
  createdAt: string | Date;
}

interface AdminsDashboardProps {
  initialAdmins: AdminUserType[];
  currentUserId: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PERM_COLORS: Record<string, string> = {
  FULL_ACCESS:          "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400",
  PROJECTS_QUOTATIONS:  "bg-blue-500/10  border-blue-500/30  text-blue-600  dark:text-blue-400",
  PORTFOLIO:            "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400",
  EQUIPMENT:            "bg-cyan-500/10  border-cyan-500/30  text-cyan-600  dark:text-cyan-400",
  TECH_ARSENAL:         "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  STORE:                "bg-pink-500/10  border-pink-500/30  text-pink-600  dark:text-pink-400",
  CAREERS:              "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
  MESSAGES:             "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
};

function PermChip({ perm }: { perm: AdminPermission }) {
  const def = ADMIN_PERMISSIONS_LIST.find((p) => p.key === perm);
  const color = PERM_COLORS[perm] || "bg-secondary border-border text-foreground";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${color}`}>
      {def?.label.split(" ")[0] || perm}
    </span>
  );
}

function AdminInitials({ name, email }: { name: string | null; email: string }) {
  const initials = (name || email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-gradient-to-br from-accent/25 to-accent/10 text-sm font-black text-accent-dark dark:text-accent-light shadow-sm">
      {initials}
    </div>
  );
}

// ─── Permission Picker ───────────────────────────────────────────────────────

interface PermPickerProps {
  value: AdminPermission[];
  onChange: (v: AdminPermission[]) => void;
}
function PermissionPicker({ value, onChange }: PermPickerProps) {
  const toggle = (permKey: AdminPermission) => {
    if (permKey === "FULL_ACCESS") {
      onChange(value.includes("FULL_ACCESS") ? ["PORTFOLIO", "CAREERS"] : ["FULL_ACCESS"]);
      return;
    }
    if (value.includes("FULL_ACCESS")) {
      onChange([permKey]);
      return;
    }
    if (value.includes(permKey)) {
      if (value.length === 1) {
        toast.error("At least one permission is required.");
        return;
      }
      onChange(value.filter((p) => p !== permKey));
    } else {
      onChange([...value, permKey]);
    }
  };

  return (
    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5">
      {ADMIN_PERMISSIONS_LIST.map((perm) => {
        const isChecked = value.includes("FULL_ACCESS") || value.includes(perm.key);
        const color = PERM_COLORS[perm.key] || "";
        return (
          <label
            key={perm.key}
            onClick={() => toggle(perm.key)}
            className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all select-none ${
              isChecked
                ? "border-accent/50 bg-accent/8"
                : "border-border bg-background hover:bg-secondary/40"
            }`}
          >
            <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${isChecked ? "border-accent bg-accent" : "border-border bg-background"}`}>
              {isChecked && <Check size={10} className="text-accent-foreground" />}
            </div>
            <div className="text-xs min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-foreground">{perm.label}</span>
                {perm.key === "FULL_ACCESS" && (
                  <span className={`rounded-full border px-1.5 py-0 text-[9px] font-bold ${color}`}>
                    Super-Admin
                  </span>
                )}
              </div>
              <div className="text-muted-foreground text-[11px] leading-relaxed mt-0.5">
                {perm.description}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}

// ─── Tab Labels ──────────────────────────────────────────────────────────────

type Tab = "admins" | "roles" | "audit";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "admins", label: "Administrators", icon: Users },
  { id: "roles",  label: "Role Templates",  icon: Tag },
  { id: "audit",  label: "Audit Trail",     icon: Layers },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminsDashboard({
  initialAdmins,
  currentUserId,
}: AdminsDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("admins");

  // ── Admins state ──
  const [admins, setAdmins] = useState<AdminUserType[]>(initialAdmins);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserType | null>(null);

  // Create admin form
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [newPerms, setNewPerms] = useState<AdminPermission[]>(["PORTFOLIO", "CAREERS"]);
  const [useRoleTemplate, setUseRoleTemplate] = useState(false);
  const [selectedRoleId, setSelectedRoleId]   = useState<string>("");

  // Edit admin form
  const [editPerms, setEditPerms]   = useState<AdminPermission[]>([]);
  const [editName, setEditName]     = useState("");
  const [editPass, setEditPass]     = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Roles state ──
  const [roles, setRoles] = useState<CustomRoleType[]>([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRoleType | null>(null);

  // Create / edit role form
  const [roleName, setRoleName]       = useState("");
  const [roleDesc, setRoleDesc]       = useState("");
  const [rolePerms, setRolePerms]     = useState<AdminPermission[]>(["PORTFOLIO", "CAREERS"]);
  const [isRoleSubmitting, setIsRoleSubmitting] = useState(false);

  // ── Load roles ──
  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("/api/studio/roles");
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (err) {
      console.error("Failed to load roles", err);
    } finally {
      setRolesLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // ── Role template selection ──
  useEffect(() => {
    if (useRoleTemplate && selectedRoleId) {
      const role = roles.find((r) => r.id === selectedRoleId);
      if (role) setNewPerms(role.permissions);
    }
  }, [useRoleTemplate, selectedRoleId, roles]);

  // ── Stats ──
  const superAdminsCount = admins.filter(
    (a) => a.permissions.includes("FULL_ACCESS") || a.permissions.length === 0
  ).length;
  const scopedAdminsCount = admins.length - superAdminsCount;

  // ────────────────────────────────────────────────────────────────
  // Admin CRUD
  // ────────────────────────────────────────────────────────────────

  const openCreateAdmin = () => {
    setNewEmail(""); setNewName(""); setNewPass("");
    setNewPerms(["PORTFOLIO", "CAREERS"]);
    setUseRoleTemplate(false); setSelectedRoleId("");
    setIsCreateAdminOpen(true);
  };

  const openEditAdmin = (admin: AdminUserType) => {
    setEditingAdmin(admin);
    setEditName(admin.name || "");
    setEditPass("");
    setEditPerms(admin.permissions || []);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newPass.trim()) {
      toast.error("Email and password are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/studio/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          name: newName.trim() || newEmail.split("@")[0],
          password: newPass.trim(),
          permissions: newPerms,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create administrator");
      setAdmins((prev) => [...prev, data]);
      setIsCreateAdminOpen(false);
      toast.success(`Administrator account created for ${data.email}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setIsSubmitting(true);
    try {
      const payload: { name: string; permissions: AdminPermission[]; password?: string } = {
        name: editName.trim(),
        permissions: editPerms,
      };
      if (editPass.trim()) payload.password = editPass.trim();

      const res = await fetch(`/api/studio/admins/${editingAdmin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update administrator");
      setAdmins((prev) => prev.map((a) => (a.id === data.id ? { ...a, ...data } : a)));
      setEditingAdmin(null);
      toast.success("Administrator permissions updated.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminUserType) => {
    if (admin.id === currentUserId) {
      toast.error("You cannot delete your own account.");
      return;
    }
    if (!confirm(`Remove administrator access for "${admin.name || admin.email}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/studio/admins/${admin.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete administrator");
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      toast.success(`Removed admin: ${admin.email}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete admin");
    }
  };

  // ────────────────────────────────────────────────────────────────
  // Role Template CRUD
  // ────────────────────────────────────────────────────────────────

  const openCreateRole = () => {
    setRoleName(""); setRoleDesc("");
    setRolePerms(["PORTFOLIO", "CAREERS"]);
    setEditingRole(null);
    setIsCreateRoleOpen(true);
  };

  const openEditRole = (role: CustomRoleType) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description || "");
    setRolePerms(role.permissions);
    setIsCreateRoleOpen(true);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error("Role name is required.");
      return;
    }
    setIsRoleSubmitting(true);
    try {
      const url    = editingRole ? `/api/studio/roles/${editingRole.id}` : "/api/studio/roles";
      const method = editingRole ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roleName.trim(), description: roleDesc.trim(), permissions: rolePerms }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save role");
      if (editingRole) {
        setRoles((prev) => prev.map((r) => (r.id === data.id ? data : r)));
        toast.success(`Role "${data.name}" updated.`);
      } else {
        setRoles((prev) => [...prev, data]);
        toast.success(`Role "${data.name}" created.`);
      }
      setIsCreateRoleOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save role");
    } finally {
      setIsRoleSubmitting(false);
    }
  };

  const handleDeleteRole = async (role: CustomRoleType) => {
    if (!confirm(`Delete the "${role.name}" role template? This does not affect existing admins.`)) return;
    try {
      const res = await fetch(`/api/studio/roles/${role.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete role");
      }
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      toast.success(`Role "${role.name}" deleted.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete role");
    }
  };

  // ────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
            <Shield size={11} />
            Studio Ops / Role-Based Access Control
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Admin Team &amp; Permissions
          </h1>
          <p className="mt-1 text-xs text-muted-foreground max-w-xl">
            Delegate distinct operational consoles with granular permission templates. The main admin controls all role definitions.
          </p>
        </div>
        {activeTab === "admins" && (
          <button
            onClick={openCreateAdmin}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm transition-all hover:bg-accent-light shrink-0"
          >
            <Plus size={14} />
            New Administrator
          </button>
        )}
        {activeTab === "roles" && (
          <button
            onClick={openCreateRole}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm transition-all hover:bg-accent-light shrink-0"
          >
            <Plus size={14} />
            New Role Template
          </button>
        )}
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          {
            label: "Administrators",
            value: admins.length,
            icon: Users,
            color: "text-accent-dark dark:text-accent-light",
            bg: "bg-accent/10 border-accent/30",
          },
          {
            label: "Super-Admins",
            value: superAdminsCount,
            icon: ShieldAlert,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/30",
          },
          {
            label: "Scoped Admins",
            value: scopedAdminsCount,
            icon: ShieldCheck,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/30",
          },
          {
            label: "Role Templates",
            value: roles.length,
            icon: Tag,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-500/10 border-violet-500/30",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${s.bg} ${s.color}`}>
                  <Icon size={15} />
                </div>
              </div>
              <div className={`font-display text-3xl font-black ${s.color}`}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-0 border-b border-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
                active
                  ? "border-accent text-accent-dark dark:text-accent-light"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB: Administrators                                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === "admins" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="border-b border-border bg-secondary/20 px-5 py-3.5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">Registered Studio Administrators</h2>
              <p className="text-[11px] text-muted-foreground">
                Each admin only accesses their assigned module console.
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{admins.length} total</span>
          </div>

          {admins.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No administrators configured yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {admins.map((admin) => {
                const isSelf   = admin.id === currentUserId;
                const isSuper  = admin.permissions.includes("FULL_ACCESS") || admin.permissions.length === 0;
                return (
                  <div key={admin.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-secondary/10 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <AdminInitials name={admin.name} email={admin.email} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-foreground truncate">{admin.name || "Administrator"}</span>
                          {isSelf && (
                            <span className="rounded-full bg-accent/20 border border-accent/40 px-1.5 py-0 text-[9px] font-mono font-bold text-accent-dark dark:text-accent-light">
                              YOU
                            </span>
                          )}
                          {isSuper && (
                            <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                              SUPER-ADMIN
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground truncate">{admin.email}</div>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {isSuper ? (
                            <PermChip perm="FULL_ACCESS" />
                          ) : (
                            admin.permissions.map((p) => <PermChip key={p} perm={p} />)
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto shrink-0">
                      <span className="font-mono text-[10px] text-muted-foreground hidden lg:block">
                        {new Date(admin.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <button
                        onClick={() => openEditAdmin(admin)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent/50 hover:bg-secondary transition-all"
                      >
                        <Edit3 size={12} className="text-accent-dark dark:text-accent-light" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin)}
                        disabled={isSelf}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={isSelf ? "You cannot delete your own account" : "Revoke Access"}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB: Role Templates                                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          {!rolesLoaded ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading role templates…</span>
            </div>
          ) : roles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <Tag size={32} className="mx-auto mb-3 text-muted-foreground/30" />
              <h3 className="text-sm font-bold text-foreground mb-1">No role templates yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Create reusable named roles (e.g. &ldquo;Content Manager&rdquo;, &ldquo;HR Lead&rdquo;) with a fixed permission set. Assign them when onboarding new admins.
              </p>
              <button
                onClick={openCreateRole}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-foreground hover:bg-accent-light transition-colors"
              >
                <Plus size={13} />
                Create First Role
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => openEditRole(role)}
                  onDelete={() => handleDeleteRole(role)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB: Audit Trail                                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === "audit" && (
        <div>
          <AuditLogViewer />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MODAL: Create Administrator                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      {isCreateAdminOpen && (
        <Modal
          title="Create New Administrator"
          subtitle="Provision credentials with granular console access"
          icon={<UserCheck size={16} />}
          onClose={() => setIsCreateAdminOpen(false)}
        >
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Email Address" required>
                <input
                  type="email" required value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="engineer@bezalel.website"
                  className="input-field"
                />
              </FormField>
              <FormField label="Full Name" required>
                <input
                  type="text" required value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Alex Mutua"
                  className="input-field"
                />
              </FormField>
            </div>

            <FormField label="Initial Password" required>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="password" required minLength={6} value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="input-field pl-9"
                />
              </div>
            </FormField>

            {/* Role template or manual picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Console Permissions
                </label>
                {roles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseRoleTemplate((v) => !v)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-dark dark:text-accent-light hover:underline"
                  >
                    <Sparkles size={11} />
                    {useRoleTemplate ? "Set manually" : "Use role template"}
                  </button>
                )}
              </div>

              {useRoleTemplate && roles.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">— Select a role template —</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  {selectedRoleId && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {newPerms.map((p) => <PermChip key={p} perm={p} />)}
                    </div>
                  )}
                </div>
              ) : (
                <PermissionPicker value={newPerms} onChange={setNewPerms} />
              )}
            </div>

            <ModalFooter
              onCancel={() => setIsCreateAdminOpen(false)}
              isSubmitting={isSubmitting}
              submitLabel="Create Administrator"
              submitIcon={<Shield size={13} />}
            />
          </form>
        </Modal>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MODAL: Edit Administrator                                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      {editingAdmin && (
        <Modal
          title={`Edit: ${editingAdmin.name || editingAdmin.email}`}
          subtitle={editingAdmin.email}
          icon={<Edit3 size={16} />}
          onClose={() => setEditingAdmin(null)}
        >
          <form onSubmit={handleUpdateAdmin} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Display Name" required>
                <input
                  type="text" required value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-field"
                />
              </FormField>
              <FormField label="Reset Password">
                <input
                  type="password" minLength={6} value={editPass}
                  onChange={(e) => setEditPass(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="input-field"
                />
              </FormField>
            </div>

            <FormField label="Console Permissions">
              <PermissionPicker value={editPerms} onChange={setEditPerms} />
            </FormField>

            <ModalFooter
              onCancel={() => setEditingAdmin(null)}
              isSubmitting={isSubmitting}
              submitLabel="Save Changes"
              submitIcon={<Lock size={13} />}
            />
          </form>
        </Modal>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MODAL: Create / Edit Role Template                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      {isCreateRoleOpen && (
        <Modal
          title={editingRole ? `Edit Role: ${editingRole.name}` : "Create Role Template"}
          subtitle={editingRole ? "Update this role's name and permissions" : "Define a reusable permission set for your admin team"}
          icon={<Tag size={16} />}
          onClose={() => { setIsCreateRoleOpen(false); setEditingRole(null); }}
        >
          <form onSubmit={handleSaveRole} className="space-y-4">
            <FormField label="Role Name" required>
              <input
                type="text" required value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Content Manager"
                className="input-field"
              />
            </FormField>

            <FormField label="Description (optional)">
              <input
                type="text" value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                placeholder="Brief description of this role's scope"
                className="input-field"
              />
            </FormField>

            <FormField label="Console Permissions">
              <PermissionPicker value={rolePerms} onChange={setRolePerms} />
            </FormField>

            <ModalFooter
              onCancel={() => { setIsCreateRoleOpen(false); setEditingRole(null); }}
              isSubmitting={isRoleSubmitting}
              submitLabel={editingRole ? "Save Role" : "Create Role"}
              submitIcon={<Tag size={13} />}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RoleCard({
  role,
  onEdit,
  onDelete,
}: {
  role: CustomRoleType;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm hover:border-accent/30 transition-colors overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/25 text-violet-600 dark:text-violet-400">
              <Shield size={15} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground leading-tight">{role.name}</h3>
              <p className="text-[10px] text-muted-foreground font-mono">
                {new Date(role.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={onEdit}
              className="rounded-md border border-border bg-background p-1.5 text-muted-foreground hover:text-foreground hover:border-accent/40 transition-all"
              title="Edit role"
            >
              <Edit3 size={12} />
            </button>
            <button
              onClick={onDelete}
              className="rounded-md border border-red-500/20 bg-red-500/5 p-1.5 text-red-500 hover:bg-red-500/10 transition-all"
              title="Delete role"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {role.description && (
          <p className="text-[11px] text-muted-foreground mb-2.5 leading-relaxed">{role.description}</p>
        )}

        <div className="flex flex-wrap gap-1">
          {role.permissions.slice(0, expanded ? undefined : 3).map((p) => (
            <PermChip key={p} perm={p} />
          ))}
          {!expanded && role.permissions.length > 3 && (
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-0.5 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground hover:text-foreground"
            >
              +{role.permissions.length - 3} more
              <ChevronDown size={9} />
            </button>
          )}
          {expanded && role.permissions.length > 3 && (
            <button
              onClick={() => setExpanded(false)}
              className="inline-flex items-center gap-0.5 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground hover:text-foreground"
            >
              Show less
              <ChevronUp size={9} />
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-border/60 bg-secondary/20 px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-mono">{role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(role.name).then(() => toast.success("Role name copied"));
          }}
          className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <Copy size={9} /> Copy name
        </button>
      </div>
    </div>
  );
}

function Modal({
  title,
  subtitle,
  icon,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-accent-dark dark:text-accent-light">
              {icon}
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground">{title}</h3>
              <p className="text-[11px] font-mono text-muted-foreground truncate max-w-sm">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function ModalFooter({
  onCancel,
  isSubmitting,
  submitLabel,
  submitIcon,
}: {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  submitIcon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : submitIcon}
        {submitLabel}
      </button>
    </div>
  );
}

// ─── CSS helper (added inline to globals via Tailwind @layer not needed) ──────
// The `input-field` class is defined in globals.css; ensure it exists.
// If it doesn't exist yet it's equivalent to:
// "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground
//  placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
