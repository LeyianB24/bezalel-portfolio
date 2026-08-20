"use client";

import { useState } from "react";
import {
  Server,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Layers,
  ShoppingBag,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { EquipmentCategory } from "@prisma/client";
import ImageUpload from "@/components/studio/ImageUpload";

export interface EquipmentItemType {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  specs: string[];
  imageUrl: string | null;
  isClientFacing: boolean;
  isSellable: boolean;
  productId: string | null;
  status: string;
  displayOrder: number;
  createdAt: Date | string;
  product?: {
    id: string;
    slug: string;
    price: number;
    stock: number;
  } | null;
}

interface EquipmentDashboardProps {
  initialItems: EquipmentItemType[];
}

const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  NETWORKING: "Networking & Switching",
  AV_CONFERENCING: "Boardroom AV & Conferencing",
  SECURITY_CCTV: "CCTV Surveillance & NVR",
  SERVERS_STORAGE: "Servers & Storage NAS",
  ACCESS_CONTROL: "Biometric Access Control",
  OTHER: "Other Hardware",
};

export default function EquipmentDashboard({ initialItems }: EquipmentDashboardProps) {
  const [items, setItems] = useState<EquipmentItemType[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItemType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<EquipmentCategory>(EquipmentCategory.NETWORKING);
  const [description, setDescription] = useState("");
  const [specsInput, setSpecsInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isClientFacing, setIsClientFacing] = useState(true);
  const [isSellable, setIsSellable] = useState(false);
  const [status, setStatus] = useState("ACTIVE");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const openCreateModal = () => {
    setEditingItem(null);
    setName("");
    setCategory(EquipmentCategory.NETWORKING);
    setDescription("");
    setSpecsInput("Gigabit Ethernet, Layer 3 Routing, 24-Port PoE+");
    setImageUrl("/BG_images/codes people.jpg");
    setIsClientFacing(true);
    setIsSellable(false);
    setStatus("ACTIVE");
    setDisplayOrder(items.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: EquipmentItemType) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description);
    setSpecsInput(item.specs.join(", "));
    setImageUrl(item.imageUrl || "");
    setIsClientFacing(item.isClientFacing);
    setIsSellable(item.isSellable);
    setStatus(item.status);
    setDisplayOrder(item.displayOrder);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error("Please fill in the equipment name and description.");
      return;
    }

    setIsSaving(true);
    const specs = specsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      category,
      description: description.trim(),
      specs,
      imageUrl: imageUrl.trim() || null,
      isClientFacing,
      isSellable,
      status,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/equipment/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update equipment");
        const updated = await res.json();
        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? updated : item)));
        toast.success("Equipment item updated successfully.");
      } else {
        const res = await fetch("/api/equipment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create equipment");
        const created = await res.json();
        setItems((prev) => [...prev, created]);
        toast.success("New equipment created successfully.");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving equipment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;

    try {
      const res = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete equipment");
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Equipment deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete equipment.");
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "ALL") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="font-display text-2xl font-black text-foreground">
            Hardware & Infrastructure Equipment
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage enterprise networking, CCTV, boardroom AV, and server gear deployed or sold by Bezalel.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light"
        >
          <Plus size={16} />
          Add Equipment
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            selectedCategory === "ALL"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({items.length})
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const count = items.filter((i) => i.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedCategory === key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Equipment List Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                  {CATEGORY_LABELS[item.category] || item.category}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Order: {item.displayOrder}
                </span>
              </div>

              <h3 className="font-display text-base font-black text-foreground">
                {item.name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {item.description}
              </p>

              {item.specs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.specs.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="rounded border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] text-foreground font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                  {item.specs.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{item.specs.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-border pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px]">
                {item.isClientFacing && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 size={12} /> Client Deployable
                  </span>
                )}
                {item.isSellable && (
                  <span className="inline-flex items-center gap-1 text-accent-dark dark:text-accent-light font-semibold">
                    <ShoppingBag size={12} /> Store Listed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(item)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title="Edit Equipment"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="rounded p-1.5 text-red-500 hover:bg-red-500/10"
                  title="Delete Equipment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            <Server className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-semibold">No equipment found in this category.</p>
            <button
              onClick={openCreateModal}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
            >
              <Plus size={14} /> Add new hardware
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h2 className="font-display text-lg font-black text-foreground">
                {editingItem ? "Edit Equipment" : "Add New Equipment"}
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
                  Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. UniFi Enterprise 24-Port 10G PoE Switch"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-hidden"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical summary of capabilities, architecture role, and institutional durability..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Specifications (comma-separated)
                </label>
                <input
                  type="text"
                  value={specsInput}
                  onChange={(e) => setSpecsInput(e.target.value)}
                  placeholder="24x 2.5GbE PoE+, 2x 10G SFP+, Layer 3 Switching"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-hidden"
                />
              </div>

              <div>
                <ImageUpload
                  label="Hardware Photo / Architecture Diagram"
                  description="Upload equipment photo from device camera or photo library."
                  images={imageUrl ? [imageUrl] : []}
                  onChange={(urls) => setImageUrl(urls[0] || "")}
                  multiple={false}
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isClientFacing}
                    onChange={(e) => setIsClientFacing(e.target.checked)}
                    className="rounded border-border"
                  />
                  Client-Facing (Show on Services/Infra)
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSellable}
                    onChange={(e) => setIsSellable(e.target.checked)}
                    className="rounded border-border"
                  />
                  Sellable in Hardware Store
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
