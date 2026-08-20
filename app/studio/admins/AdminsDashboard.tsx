"use client";

import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { AdminPermission } from "@prisma/client";
import { ADMIN_PERMISSIONS_LIST } from "@/lib/permissions";

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

interface AdminsDashboardProps {
  initialAdmins: AdminUserType[];
  currentUserId: string;
}

export default function AdminsDashboard({
  initialAdmins,
  currentUserId,
}: AdminsDashboardProps) {
  const [admins, setAdmins] = useState<AdminUserType[]>(initialAdmins);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserType | null>(null);

  // Form states for creating
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<AdminPermission[]>([
    "PORTFOLIO",
    "CAREERS",
  ]);

  // Form states for editing
  const [editPermissions, setEditPermissions] = useState<AdminPermission[]>([]);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEmail("");
    setName("");
    setPassword("");
    setSelectedPermissions(["PORTFOLIO", "CAREERS"]);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (admin: AdminUserType) => {
    setEditingAdmin(admin);
    setEditName(admin.name || "");
    setEditPassword("");
    setEditPermissions(admin.permissions || []);
  };

  const toggleCreatePermission = (permKey: AdminPermission) => {
    if (permKey === "FULL_ACCESS") {
      if (selectedPermissions.includes("FULL_ACCESS")) {
        setSelectedPermissions(["PORTFOLIO", "CAREERS"]);
      } else {
        setSelectedPermissions(["FULL_ACCESS"]);
      }
      return;
    }

    if (selectedPermissions.includes("FULL_ACCESS")) {
      setSelectedPermissions([permKey]);
      return;
    }

    if (selectedPermissions.includes(permKey)) {
      if (selectedPermissions.length === 1) {
        toast.error("An administrator must have at least one permission.");
        return;
      }
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permKey));
    } else {
      setSelectedPermissions([...selectedPermissions, permKey]);
    }
  };

  const toggleEditPermission = (permKey: AdminPermission) => {
    if (permKey === "FULL_ACCESS") {
      if (editPermissions.includes("FULL_ACCESS")) {
        setEditPermissions(["PORTFOLIO", "CAREERS"]);
      } else {
        setEditPermissions(["FULL_ACCESS"]);
      }
      return;
    }

    if (editPermissions.includes("FULL_ACCESS")) {
      setEditPermissions([permKey]);
      return;
    }

    if (editPermissions.includes(permKey)) {
      if (editPermissions.length === 1) {
        toast.error("An administrator must have at least one permission.");
        return;
      }
      setEditPermissions(editPermissions.filter((p) => p !== permKey));
    } else {
      setEditPermissions([...editPermissions, permKey]);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/studio/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || email.split("@")[0],
          password: password.trim(),
          permissions: selectedPermissions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create administrator");
      }

      setAdmins((prev) => [...prev, data]);
      setIsCreateModalOpen(false);
      toast.success(`Administrator account created for ${data.email}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create admin";
      toast.error(message);
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
        permissions: editPermissions,
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await fetch(`/api/studio/admins/${editingAdmin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update administrator");
      }

      setAdmins((prev) => prev.map((a) => (a.id === data.id ? { ...a, ...data } : a)));
      setEditingAdmin(null);
      toast.success("Administrator permissions updated successfully.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update admin";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminUserType) => {
    if (admin.id === currentUserId) {
      toast.error("You cannot delete your own active administrator account.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to remove administrator access for "${admin.name || admin.email}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/studio/admins/${admin.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete administrator");
      }

      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      toast.success(`Removed admin account: ${admin.email}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete admin";
      toast.error(message);
    }
  };

  const superAdminsCount = admins.filter(
    (a) => a.permissions.includes("FULL_ACCESS") || a.permissions.length === 0
  ).length;
  const scopedAdminsCount = admins.length - superAdminsCount;

  return (
    <div className="space-y-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Studio Ops</span>
            <span>/</span>
            <span className="text-accent-dark dark:text-accent-light font-extrabold">
              Role-Based Access Control
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Admin Team &amp; Permissions
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Delegate distinct operational consoles to team members without compromising full database access.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm transition-all hover:bg-accent-light"
        >
          <Plus size={15} />
          Create Admin Account
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Administrators
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 text-accent-dark dark:text-accent-light">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-black text-foreground">
            {admins.length}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Active verified operational credentials
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Super Administrators
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary text-primary-foreground">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-black text-foreground">
            {superAdminsCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Full unrestricted control across all consoles
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Function-Scoped Admins
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 text-accent-dark dark:text-accent-light">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-black text-foreground">
            {scopedAdminsCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Restricted to designated studio modules
          </p>
        </div>
      </div>

      {/* 3. Administrator Accounts List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="border-b border-border bg-secondary/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-foreground">
              Registered Studio Administrators
            </h2>
            <p className="text-xs text-muted-foreground">
              Each administrator only has access to their assigned modules in the sidebar and server APIs.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground font-semibold">
            {admins.length} accounts configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3.5">Administrator</th>
                <th className="px-6 py-3.5">Assigned Scope &amp; Consoles</th>
                <th className="px-6 py-3.5">Date Granted</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {admins.map((admin) => {
                const isSelf = admin.id === currentUserId;
                const isSuper =
                  admin.permissions.includes("FULL_ACCESS") ||
                  admin.permissions.length === 0;

                const initials = (admin.name || admin.email)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <tr
                    key={admin.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-xs font-black text-accent-dark dark:text-accent-light">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {admin.name || "Administrator"}
                            </span>
                            {isSelf && (
                              <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-accent-dark dark:text-accent-light">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {isSuper ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent-dark dark:text-accent-light">
                          <ShieldAlert size={13} />
                          Full Super-Admin Access
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {admin.permissions.map((perm) => {
                            const def = ADMIN_PERMISSIONS_LIST.find(
                              (p) => p.key === perm
                            );
                            return (
                              <span
                                key={perm}
                                className="inline-flex items-center gap-1 rounded bg-secondary/80 px-2 py-0.5 text-[11px] font-medium border border-border text-foreground"
                              >
                                <Check size={11} className="text-emerald-500" />
                                {def?.label.split(" ")[0] || perm}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {new Date(admin.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground hover:border-accent/50 hover:bg-secondary transition-all"
                        >
                          <Edit3 size={13} className="text-accent-dark dark:text-accent-light" />
                          Edit Scope
                        </button>

                        <button
                          onClick={() => handleDeleteAdmin(admin)}
                          disabled={isSelf}
                          className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title={isSelf ? "You cannot delete your own account" : "Delete Admin"}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Create Administrator Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-accent-dark dark:text-accent-light">
                  <UserCheck size={16} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Create New Administrator
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Provision credentials with granular console permissions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@bezalel.website"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mutua"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Initial Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key size={15} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Console Scope &amp; Access Tiers
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {ADMIN_PERMISSIONS_LIST.map((perm) => {
                    const isChecked =
                      selectedPermissions.includes("FULL_ACCESS") ||
                      selectedPermissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        onClick={() => toggleCreatePermission(perm.key)}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                          isChecked
                            ? "border-accent/50 bg-accent/10"
                            : "border-border bg-background hover:bg-secondary/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded border-border text-accent focus:ring-accent"
                        />
                        <div className="text-xs">
                          <div className="font-bold text-foreground">
                            {perm.label}
                          </div>
                          <div className="text-muted-foreground text-[11px] leading-relaxed">
                            {perm.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Shield size={14} />
                  )}
                  Create Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Edit Administrator Scope Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-accent-dark dark:text-accent-light">
                  <Edit3 size={16} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Edit Permissions: {editingAdmin.name || editingAdmin.email}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    {editingAdmin.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingAdmin(null)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Reset Password (Optional)
                  </label>
                  <input
                    type="password"
                    minLength={6}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Console Scope &amp; Access Tiers
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {ADMIN_PERMISSIONS_LIST.map((perm) => {
                    const isChecked =
                      editPermissions.includes("FULL_ACCESS") ||
                      editPermissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        onClick={() => toggleEditPermission(perm.key)}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                          isChecked
                            ? "border-accent/50 bg-accent/10"
                            : "border-border bg-background hover:bg-secondary/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded border-border text-accent focus:ring-accent"
                        />
                        <div className="text-xs">
                          <div className="font-bold text-foreground">
                            {perm.label}
                          </div>
                          <div className="text-muted-foreground text-[11px] leading-relaxed">
                            {perm.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )}
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
