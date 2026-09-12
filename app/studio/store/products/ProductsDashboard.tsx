"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  X,
  Package,
  ArrowLeft,
  Loader2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  FolderPlus,
  Search,
  Check,
  Edit3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ImageUpload from "@/components/studio/ImageUpload";

interface CategoryType {
  id: string;
  name: string;
  slug: string;
}

interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  stock: number;
  sku: string | null;
  isActive: boolean;
  categoryId: string;
  category?: CategoryType | null;
}

interface ProductsDashboardProps {
  initialProducts: ProductType[];
  categories: CategoryType[];
}

export default function ProductsDashboard({
  initialProducts,
  categories: initialCategories,
}: ProductsDashboardProps) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryType[]>(initialCategories);

  // Modals & UI state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter & Search
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Product Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "10",
    images: [] as string[],
    categoryId: categories.length > 0 ? categories[0].id : "",
    sku: "",
  });

  // Inline New Category State inside Product Form
  const [showInlineNewCategory, setShowInlineNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Category Manager Modal State
  const [modalNewCatName, setModalNewCatName] = useState("");
  const [modalNewCatSlug, setModalNewCatSlug] = useState("");
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState<string>("");
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);

  // Verified Hardware & Real Product Photography Presets
  const verifiedImagePresets = [
    { name: "8K HDMI 2.1 Cable (Gold Plated)", url: "/images/products/hdmi-21-ultra-high-speed.jpg" },
    { name: "UniFi 48-Port Managed Switch", url: "/images/products/unifi-switch-48-poe.jpg" },
    { name: "MikroTik 10G Cloud Router", url: "/images/products/mikrotik-cloud-router.jpg" },
    { name: "100W GaN Fast Charger", url: "/images/products/pd-100w-gan-fast-charger.jpg" },
    { name: "Cat6A Shielded RJ45 Cable", url: "/images/products/cat6a-shielded-cable.jpg" },
    { name: "Smart Surge Extension PDU", url: "/images/products/smart-surge-pdu-extension.jpg" },
    { name: "USB-C Multiport Hub", url: "/images/products/usb-c-multiport-hub.jpg" },
    { name: "Hikvision 32Ch CCTV NVR", url: "/images/products/hikvision-32ch-nvr.jpg" },
    { name: "Wi-Fi 6 Mesh System", url: "/images/products/wifi6-mesh-router-system.jpg" },
    { name: "Developer Workstation Laptop", url: "/images/nextstack-real.jpg" },
    { name: "Mobile Banking Smartphone", url: "/images/mpesa-real.jpg" },
    { name: "UI Design Workstation", url: "/images/bezaui-real.jpg" },
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      comparePrice: "",
      stock: "10",
      images: [] as string[],
      categoryId: categories.length > 0 ? categories[0].id : "",
      sku: "",
    });
    setEditingProduct(null);
    setShowInlineNewCategory(false);
    setNewCategoryName("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: ProductType) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice ? product.comparePrice.toString() : "",
      stock: product.stock.toString(),
      images: product.images || [],
      categoryId: product.categoryId || (categories[0]?.id || ""),
      sku: product.sku || "",
    });
    setShowInlineNewCategory(false);
    setIsProductModalOpen(true);
  };

  // Quick Inline Category Creation
  const handleQuickCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreatingCategory(true);
    try {
      const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const res = await fetch("/api/store/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim(), slug }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create category");
      }

      const createdCat: CategoryType = await res.json();
      setCategories((prev) => [...prev, createdCat]);
      setFormData((prev) => ({ ...prev, categoryId: createdCat.id }));
      setShowInlineNewCategory(false);
      setNewCategoryName("");
      toast.success(`Category "${createdCat.name}" created and selected!`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create category";
      toast.error(msg);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Category Manager Modal Creation
  const handleCreateCategoryFromModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalNewCatName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsCreatingCategory(true);
    try {
      const slug = (modalNewCatSlug || modalNewCatName)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const res = await fetch("/api/store/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: modalNewCatName.trim(), slug }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create category");
      }

      const created: CategoryType = await res.json();
      setCategories((prev) => [...prev, created]);
      setModalNewCatName("");
      setModalNewCatSlug("");
      toast.success(`Category "${created.name}" added to store!`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create category";
      toast.error(msg);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;
    setDeletingCatId(catId);
    try {
      const res = await fetch(`/api/store/categories/${catId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c.id !== catId));
      toast.success(`Category "${catName}" deleted`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(msg);
    } finally {
      setDeletingCatId(null);
    }
  };

  // Rename Category
  const handleUpdateCategory = async (catId: string) => {
    if (!editingCatName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    setIsUpdatingCategory(true);
    try {
      const slug = editingCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const res = await fetch(`/api/store/categories/${catId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingCatName.trim(), slug }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update category");
      }

      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, ...updated } : c)));
      setProducts((prev) =>
        prev.map((p) =>
          p.categoryId === catId
            ? { ...p, category: { id: catId, name: updated.name, slug: updated.slug } }
            : p
        )
      );
      setEditingCatId(null);
      setEditingCatName("");
      toast.success(`Category renamed to "${updated.name}"`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update category";
      toast.error(msg);
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  // Create / Update Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || (!formData.categoryId && !newCategoryName)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let targetCategoryId = formData.categoryId;

      // If user entered an inline category name but didn't click create separately
      if (showInlineNewCategory && newCategoryName.trim()) {
        const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const catRes = await fetch("/api/store/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategoryName.trim(), slug }),
        });
        if (catRes.ok) {
          const newCat = await catRes.json();
          targetCategoryId = newCat.id;
          setCategories((prev) => [...prev, newCat]);
        }
      }

      if (!targetCategoryId && categories.length > 0) {
        targetCategoryId = categories[0].id;
      }

      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: formData.description,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock),
        images: formData.images,
        categoryId: targetCategoryId,
        sku: formData.sku || null,
      };

      if (editingProduct) {
        const res = await fetch(`/api/store/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to update product");
        }

        const updated: ProductType = await res.json();
        updated.category = categories.find((c) => c.id === targetCategoryId) || {
          id: targetCategoryId,
          name: "General",
          slug: "general",
        };

        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setIsProductModalOpen(false);
        resetForm();
        toast.success(`Product "${updated.name}" updated successfully!`);
      } else {
        const res = await fetch("/api/store/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to create product");
        }

        const newProduct: ProductType = await res.json();
        newProduct.category = categories.find((c) => c.id === targetCategoryId) || {
          id: targetCategoryId,
          name: "General",
          slug: "general",
        };

        setProducts([newProduct, ...products]);
        setIsProductModalOpen(false);
        resetForm();
        toast.success("Product successfully added to the store catalog.");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to save product";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/store/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setProducts(products.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p)));
      toast.success(currentStatus ? "Product deactivated" : "Product activated for checkout");
    } catch {
      toast.error("Failed to update product status");
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete product "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/store/products/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product removed from catalog");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = filterCategory === "all" || p.categoryId === filterCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category?.name && p.category.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [products, filterCategory, searchQuery]);

  return (
    <div className="space-y-8 relative">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/studio/store"
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Back to Store &amp; Orders
            </Link>
          </div>
          <h1 className="font-display text-3xl font-black text-foreground tracking-tight sm:text-4xl">
            Product Catalog &amp; Categories
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {products.length} total SKU{products.length !== 1 ? "s" : ""} · {categories.length} categories · {products.filter((p) => p.isActive).length} active for checkout
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted shadow-xs transition-colors"
          >
            <FolderPlus size={15} className="text-[#C9A24B]" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm transition-all hover:bg-accent-light"
          >
            <Plus size={15} /> Add New Item
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, SKU, keywords..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1 rounded-md font-semibold transition-all shrink-0 ${
              filterCategory === "all"
                ? "bg-accent text-accent-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setFilterCategory(c.id)}
                className={`px-3 py-1 rounded-md font-semibold transition-all shrink-0 ${
                  filterCategory === c.id
                    ? "bg-accent text-accent-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Product Grid */}
      {filteredProducts.length === 0 && !isProductModalOpen ? (
        <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card/40 p-8">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 text-accent-dark dark:text-accent-light mb-4">
            <Package size={32} />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">No Products Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto mb-6">
            {searchQuery || filterCategory !== "all"
              ? "No items match your active search or category filter."
              : "Add your first networking equipment, cable, socket, or electronic accessory to sell in the store."}
          </p>
          <button
            onClick={() => {
              resetForm();
              setIsProductModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light"
          >
            <Plus size={14} /> Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`group relative flex flex-col p-4 rounded-xl border bg-card shadow-sm transition-all duration-300 ${
                product.isActive
                  ? "border-border hover:border-accent/50 hover:shadow-md"
                  : "border-border/60 opacity-60"
              }`}
            >
              {/* Product Image with Multi-Image Indicator */}
              <div className="relative w-full aspect-square bg-secondary/50 border border-border rounded-lg mb-4 flex items-center justify-center text-muted-foreground overflow-hidden">
                {product.images?.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Package size={32} className="text-muted-foreground/60" />
                )}
                {product.images?.length > 1 && (
                  <span className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-xs">
                    📸 {product.images.length}
                  </span>
                )}
              </div>

              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light bg-accent/10 border border-accent/20 px-2 py-0.5 rounded inline-block mb-1">
                  {product.category?.name || "Uncategorized"}
                </span>
                <h3 className="font-display text-sm font-bold text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-end pt-2 border-t border-border mt-2">
                  <div>
                    <span className="font-mono text-sm font-black text-foreground">
                      KES {product.price.toLocaleString()}
                    </span>
                    {product.comparePrice && (
                      <span className="text-[10px] text-muted-foreground line-through ml-1 font-mono">
                        KES {product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] font-bold text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                <button
                  onClick={() => toggleProductStatus(product.id, product.isActive)}
                  className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  title={product.isActive ? "Deactivate from store" : "Activate in store"}
                >
                  {product.isActive ? (
                    <ToggleRight size={18} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={18} className="text-muted-foreground" />
                  )}
                  <span className={product.isActive ? "text-emerald-500 font-bold" : "text-muted-foreground"}>
                    {product.isActive ? "Live" : "Draft"}
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold text-accent-dark dark:text-accent-light hover:bg-accent/10 transition-colors"
                    title="Edit product details, price, or images"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="rounded p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Delete product"
                  >
                    {deletingId === product.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Add Product Modal with Dynamic Category Creation */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-accent-dark dark:text-accent-light">
                  <Package size={16} />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">
                    {editingProduct ? "Edit Product Specifications" : "Add Product / Equipment Item"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {editingProduct
                      ? `Modifying SKU, pricing, images, and category for ${editingProduct.name}`
                      : "Add to store catalog and set categories"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Product / Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                    })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="e.g. UniFi 24-Port 10G PoE Switch, 4K HDMI 2.1 Cable 5M..."
                  required
                />
              </div>

              {/* Category Picker + Dynamic Create Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInlineNewCategory(!showInlineNewCategory)}
                    className="text-xs text-[#C9A24B] hover:underline font-semibold flex items-center gap-1"
                  >
                    {showInlineNewCategory ? "Select Existing" : "+ New Category"}
                  </button>
                </div>

                {showInlineNewCategory ? (
                  <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-md border border-accent/40">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Type new category name (e.g. Cables & Converters)..."
                      className="flex-1 bg-background border border-border px-3 py-1.5 rounded text-xs text-foreground focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={isCreatingCategory || !newCategoryName.trim()}
                      onClick={handleQuickCreateCategory}
                      className="bg-accent text-accent-foreground px-3 py-1.5 rounded text-xs font-bold shrink-0 disabled:opacity-50"
                    >
                      {isCreatingCategory ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description &amp; Specifications <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent h-24 resize-none"
                  placeholder="Comprehensive technical details, ports, voltage, warranty, certifications..."
                  required
                />
              </div>

              <div>
                <ImageUpload
                  label="Product Photos (Upload from Device)"
                  description="Upload product images from phone camera, gallery, or computer."
                  images={formData.images}
                  onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                  multiple={true}
                  maxFiles={6}
                />
              </div>

              {/* Verified Real Hardware Photo Presets */}
              <div className="space-y-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>Quick Verified Real Photography Presets</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground">1-click attach</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Select authentic, high-resolution photographs to avoid cartoon/AI images:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {verifiedImagePresets.map((preset) => {
                    const isSelected = formData.images.includes(preset.url);
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              images: formData.images.filter((img) => img !== preset.url),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              images: [...formData.images, preset.url],
                            });
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                          isSelected
                            ? "border-accent bg-accent/20 text-accent-dark dark:text-accent-light font-bold"
                            : "border-border bg-background hover:bg-secondary text-foreground"
                        }`}
                      >
                        {isSelected && <Check size={11} className="text-accent" />}
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Price (KES) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono"
                    placeholder="e.g. 85000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Compare Price (Discount KES)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono"
                    placeholder="Original price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Available Stock Units <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    SKU / Serial Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. BZL-NET-001"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="rounded-md border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {isSubmitting
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product Catalog"
                    : "Add to Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Dedicated Category Manager Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex justify-between items-center bg-card">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-accent">
                  <FolderPlus size={16} />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">
                    Store Categories Manager
                  </h2>
                  <p className="text-xs text-muted-foreground">Add or organize categories</p>
                </div>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Add Category Form */}
              <form onSubmit={handleCreateCategoryFromModal} className="space-y-3 p-3.5 rounded-lg border border-border bg-background">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Add New Category</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={modalNewCatName}
                    onChange={(e) => {
                      setModalNewCatName(e.target.value);
                      setModalNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }}
                    placeholder="Category Name (e.g. Sockets & Extensions)"
                    className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                  <input
                    type="text"
                    value={modalNewCatSlug}
                    onChange={(e) => setModalNewCatSlug(e.target.value)}
                    placeholder="URL Slug (auto-generated)"
                    className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs font-mono text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreatingCategory || !modalNewCatName.trim()}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-accent py-2 px-3 text-xs font-bold text-accent-foreground hover:bg-accent-light transition-colors disabled:opacity-50"
                >
                  {isCreatingCategory ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  <span>Add Category</span>
                </button>
              </form>

              {/* Current Categories List */}
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Current Categories ({categories.length})
                </h3>
                <div className="space-y-1.5">
                  {categories.map((c) => {
                    const itemCount = products.filter((p) => p.categoryId === c.id).length;
                    const isEditingThis = editingCatId === c.id;
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2.5 rounded-md border border-border bg-background text-xs"
                      >
                        {isEditingThis ? (
                          <div className="flex-1 flex items-center gap-2 mr-2">
                            <input
                              type="text"
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              className="flex-1 rounded border border-accent bg-card px-2 py-1 text-xs text-foreground focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              disabled={isUpdatingCategory || !editingCatName.trim()}
                              onClick={() => handleUpdateCategory(c.id)}
                              className="bg-accent text-accent-foreground px-2.5 py-1 rounded text-xs font-bold shrink-0 disabled:opacity-50 flex items-center gap-1"
                            >
                              {isUpdatingCategory ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatId(null);
                                setEditingCatName("");
                              }}
                              className="text-muted-foreground hover:text-foreground p-1 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{c.name}</p>
                              <p className="text-[10px] font-mono text-muted-foreground truncate">slug: {c.slug}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                                {itemCount} item{itemCount !== 1 ? "s" : ""}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCatId(c.id);
                                  setEditingCatName(c.name);
                                }}
                                className="p-1 text-muted-foreground hover:text-accent-dark dark:hover:text-accent-light transition-colors"
                                title="Rename category"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                type="button"
                                disabled={deletingCatId === c.id || itemCount > 0}
                                onClick={() => handleDeleteCategory(c.id, c.name)}
                                className="p-1 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-30"
                                title={itemCount > 0 ? "Cannot delete category with active products" : "Delete category"}
                              >
                                {deletingCatId === c.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
