"use client";

import { useState } from "react";
import {
  Cpu,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { TechCategory } from "@prisma/client";

export interface TechItemType {
  id: string;
  name: string;
  category: TechCategory;
  iconKey: string | null;
  description: string | null;
  isCore: boolean;
  displayOrder: number;
  createdAt: Date | string;
}

interface TechArsenalDashboardProps {
  initialItems: TechItemType[];
}

const CATEGORY_LABELS: Record<TechCategory, string> = {
  CORE_SYSTEMS: "Web & Enterprise Systems",
  INFRA_CLOUD: "Cloud & DevOps",
  PAYMENTS_DATABASE: "Payments, APIs & Database",
  HARDWARE_AV: "IT Hardware, Networking & AV",
  MOBILE_DEVICES: "Mobile Applications",
};

export default function TechArsenalDashboard({ initialItems }: TechArsenalDashboardProps) {
  const [items, setItems] = useState<TechItemType[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TechItemType | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TechCategory>(TechCategory.CORE_SYSTEMS);
  const [iconKey, setIconKey] = useState("");
  const [description, setDescription] = useState("");
  const [isCore, setIsCore] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const openCreateModal = () => {
    setEditingItem(null);
    setName("");
    setCategory(TechCategory.CORE_SYSTEMS);
    setIconKey("SiNextdotjs");
    setDescription("");
    setIsCore(true);
    setDisplayOrder(items.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TechItemType) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setIconKey(item.iconKey || "");
    setDescription(item.description || "");
    setIsCore(item.isCore);
    setDisplayOrder(item.displayOrder);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a tool/technology name.");
      return;
    }

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      category,
      iconKey: iconKey.trim() || null,
      description: description.trim() || null,
      isCore,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/tech-arsenal/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update tool");
        const updated = await res.json();
        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? updated : item)));
        toast.success("Tech stack item updated.");
      } else {
        const res = await fetch("/api/tech-arsenal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create tool");
        const created = await res.json();
        setItems((prev) => [...prev, created]);
        toast.success("Tech item added to arsenal.");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving tech item.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;

    try {
      const res = await fetch(`/api/tech-arsenal/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete tech item");
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Tech item removed.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="font-display text-2xl font-black text-foreground">
            Technology Arsenal Stack
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage supported software frameworks, cloud tools, databases, and enterprise hardware brands.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light"
        >
          <Plus size={16} />
          Add Tool / Tech
        </button>
      </div>

      {/* Grid by Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
          const categoryItems = items.filter((i) => i.category === catKey);
          return (
            <div key={catKey} className="rounded-lg border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="font-display text-sm font-bold text-foreground">{catLabel}</h3>
                <span className="text-xs font-mono text-muted-foreground">({categoryItems.length})</span>
              </div>

              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md border border-border bg-background p-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-xs text-foreground">{item.name}</span>
                      {item.isCore && (
                        <span className="inline-flex items-center gap-1 rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent-dark dark:text-accent-light">
                          <Star size={9} /> Core
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        title="Edit tool"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="rounded p-1 text-red-500 hover:bg-red-500/10"
                        title="Delete tool"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {categoryItems.length === 0 && (
                  <p className="text-xs text-muted-foreground py-2 text-center">No tools in this category.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h2 className="font-display text-lg font-black text-foreground">
                {editingItem ? "Edit Tech Stack Item" : "Add Tech Stack Item"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Technology / Tool Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js, PostgreSQL, Docker, Ubiquiti"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TechCategory)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-hidden"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Icon Identifier
                  </label>
                  <input
                    type="text"
                    value={iconKey}
                    onChange={(e) => setIconKey(e.target.value)}
                    placeholder="SiNextdotjs, Database, Network"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCore}
                    onChange={(e) => setIsCore(e.target.checked)}
                    className="rounded border-border"
                  />
                  Mark as Core Competency
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
