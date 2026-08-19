"use client";

import { useState } from "react";
import { 
  Layers, Plus, Edit3, Trash2, ExternalLink, 
  X, Loader2, Star, Sparkles, Image as ImageIcon,
  CheckCircle2, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface PortfolioItemType {
  id: string;
  name: string;
  clientName: string;
  clientLogoUrl: string | null;
  description: string;
  techTags: string[];
  liveUrl: string | null;
  images: string[];
  featured: boolean;
  displayOrder: number;
  createdAt: Date | string;
}

interface PortfolioDashboardProps {
  initialItems: PortfolioItemType[];
}

export default function PortfolioDashboard({ initialItems }: PortfolioDashboardProps) {
  const [items, setItems] = useState<PortfolioItemType[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItemType | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientLogoUrl, setClientLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [techTagsInput, setTechTagsInput] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingLogo, setIsFetchingLogo] = useState(false);
  const [logoSource, setLogoSource] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setName("");
    setClientName("");
    setClientLogoUrl("");
    setLogoSource(null);
    setDescription("");
    setTechTagsInput("Next.js, PostgreSQL, TypeScript, M-Pesa");
    setLiveUrl("https://");
    setImagesInput("/images/web_system.png");
    setFeatured(false);
    setDisplayOrder(items.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: PortfolioItemType) => {
    setEditingItem(item);
    setName(item.name);
    setClientName(item.clientName);
    setClientLogoUrl(item.clientLogoUrl || "");
    setLogoSource(item.clientLogoUrl ? "Saved Logo" : null);
    setDescription(item.description);
    setTechTagsInput(item.techTags.join(", "));
    setLiveUrl(item.liveUrl || "");
    setImagesInput(item.images.join(", "));
    setFeatured(item.featured);
    setDisplayOrder(item.displayOrder);
    setIsModalOpen(true);
  };

  const handleAutoFetchLogo = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || liveUrl).trim();
    if (!targetUrl || targetUrl === "https://" || targetUrl === "http://") {
      toast.error("Please enter a valid website URL first.");
      return;
    }

    setIsFetchingLogo(true);
    try {
      const res = await fetch("/api/portfolio/fetch-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!res.ok) throw new Error("Failed to auto-fetch logo");
      const data = await res.json();
      if (data.logoUrl) {
        setClientLogoUrl(data.logoUrl);
        setLogoSource(data.source === "apple_touch_icon" ? "Apple Touch Icon" : data.source === "html_icon" ? "Site Favicon" : "Favicon Service");
        toast.success(`Logo auto-fetched from ${data.domain || "site"}!`);
      } else {
        toast.error("No logo or favicon detected. Please enter URL manually.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not auto-fetch logo. You can paste a logo URL manually.");
    } finally {
      setIsFetchingLogo(false);
    }
  };

  const handleLiveUrlBlur = () => {
    // Auto-fetch logo if clientLogoUrl is currently empty
    if (!clientLogoUrl && liveUrl && liveUrl.length > 8 && (liveUrl.includes(".") || liveUrl.startsWith("http"))) {
      handleAutoFetchLogo(liveUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientName || !description) {
      toast.error("Please fill in project name, client name, and description");
      return;
    }

    setIsSaving(true);
    const techTags = techTagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const images = imagesInput.split(",").map(i => i.trim()).filter(Boolean);

    const payload = {
      name,
      clientName,
      clientLogoUrl: clientLogoUrl.trim() || null,
      description,
      techTags,
      liveUrl: liveUrl.trim() || null,
      images,
      featured,
      displayOrder: Number(displayOrder) || 0,
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/portfolio/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update portfolio item");
        const updated = await res.json();
        setItems(items.map(item => item.id === updated.id ? updated : item));
        toast.success("Portfolio item updated across all pages");
      } else {
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create portfolio item");
        const created = await res.json();
        setItems([...items, created]);
        toast.success("Portfolio item added across all pages");
      }

      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save portfolio project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio project?")) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete item");
      setItems(items.filter(item => item.id !== id));
      toast.success("Portfolio item deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete portfolio project");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-3xl font-black text-foreground tracking-tight">Portfolio Management</h1>
          <p className="text-muted-foreground text-sm">One source of truth for all public portfolio displays, clickable client links, and logos.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground shadow-sm transition-colors hover:bg-accent-light"
        >
          <Plus className="h-4 w-4" /> Add Portfolio Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full rounded-lg border border-border bg-card p-12 text-center text-muted-foreground">
            <Layers className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-bold text-foreground mb-1">No portfolio projects logged yet</h3>
            <p className="text-xs">Add your first verified client deliverable to showcase on the public website.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-border pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {item.clientLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.clientLogoUrl}
                        alt={item.clientName}
                        className="h-5 w-5 rounded object-contain bg-black/10 dark:bg-white/10 p-0.5"
                      />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-accent-dark dark:text-accent-light">
                        {item.clientName.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-bold text-muted-foreground">
                      {item.clientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-muted-foreground">
                      #{item.displayOrder}
                    </span>
                    {item.featured && (
                      <span className="inline-flex items-center gap-1 rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                        <Star className="h-2.5 w-2.5 fill-current" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-foreground">
                  {item.name}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {item.description}
                </p>

                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
                  >
                    <span>{item.liveUrl}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.techTags.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="inline-flex items-center gap-1 text-xs font-bold border border-border bg-background px-3 py-1.5 rounded hover:bg-secondary text-foreground transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[92vh]">
            <button
              onClick={() => { setIsModalOpen(false); setEditingItem(null); }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-foreground mb-1">
              {editingItem ? "Edit Portfolio Project" : "Add Portfolio Project"}
            </h2>
            <p className="text-xs text-muted-foreground mb-4 border-b border-border pb-3">
              Configure project branding, clickable client URL, auto-fetched logo, and tech stack tags.
            </p>

            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. BezaShop Platform"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Apex SACCO Ltd"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-hidden"
                  />
                </div>
              </div>

              {/* Live URL with Auto-Fetch Action */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Live System URL (Clickable Client Link)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoFetchLogo()}
                    disabled={isFetchingLogo}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-dark dark:text-accent-light hover:underline disabled:opacity-50"
                  >
                    {isFetchingLogo ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    <span>Auto-Fetch Logo</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    onBlur={handleLiveUrlBlur}
                    placeholder="https://client-portal.co.ke"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-hidden pr-20"
                  />
                  {isFetchingLogo && (
                    <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] text-accent-dark dark:text-accent-light font-bold">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching...
                    </div>
                  )}
                </div>
              </div>

              {/* Client Logo Preview & Manual URL Input */}
              <div className="rounded-lg border border-border bg-background/50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Client Favicon / Logo URL
                  </label>
                  {logoSource && (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={10} /> {logoSource}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card p-1">
                    {clientLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={clientLogoUrl}
                        alt="Logo preview"
                        className="h-full w-full object-contain"
                        onError={() => {
                          setLogoSource(null);
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                    )}
                  </div>

                  <input
                    type="text"
                    value={clientLogoUrl}
                    onChange={(e) => {
                      setClientLogoUrl(e.target.value);
                      setLogoSource("Manual Input");
                    }}
                    placeholder="Auto-detected on link entry or enter /logos/client.png"
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-accent outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Project Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the system problem, architectural solution, and measurable business result..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-hidden resize-y"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={techTagsInput}
                  onChange={(e) => setTechTagsInput(e.target.value)}
                  placeholder="Next.js, PostgreSQL, TypeScript, M-Pesa"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Image URLs (comma separated)
                </label>
                <input
                  type="text"
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  placeholder="/images/web_system.png, /images/hero_banner.png"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-hidden"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 items-center pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    id="featured-toggle"
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <label htmlFor="featured-toggle" className="text-xs font-bold text-foreground cursor-pointer">
                    Feature on Homepage Showcase
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-border pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingItem(null); }}
                  className="border border-border bg-card hover:bg-secondary text-foreground font-bold px-4 py-2.5 rounded-md text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-accent hover:bg-accent-light text-accent-foreground font-bold px-5 py-2.5 rounded-md text-xs transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingItem ? "Save Changes" : "Create Portfolio Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
