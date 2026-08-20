"use client";

import { useState } from "react";
import { Plus, X, Package, ArrowLeft, Loader2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
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
  categories,
}: ProductsDashboardProps) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "10",
    images: [] as string[],
    categoryId: categories.length > 0 ? categories[0].id : "",
  });

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
    });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let targetCategoryId = formData.categoryId;
      if (!targetCategoryId) {
        const catRes = await fetch("/api/store/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "General", slug: "general" }),
        });
        const newCat = await catRes.json();
        targetCategoryId = newCat.id;
      }

      const res = await fetch("/api/store/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoryId: targetCategoryId,
          slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          stock: parseInt(formData.stock),
        }),
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
      setIsModalOpen(false);
      resetForm();
      toast.success("Product created successfully in store catalog.");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create product";
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

  return (
    <div className="space-y-8 relative">
      {/* Header */}
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
            Product Catalog &amp; Inventory
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {products.length} total SKU{products.length !== 1 ? "s" : ""} · {products.filter((p) => p.isActive).length} active for checkout
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm transition-all hover:bg-accent-light"
        >
          <Plus size={15} /> Add New Product
        </button>
      </div>

      {/* Product Grid or Designed Empty State */}
      {products.length === 0 && !isModalOpen ? (
        <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card/40 p-8">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 text-accent-dark dark:text-accent-light mb-4">
            <Package size={32} />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">No Products in Catalog</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto mb-6">
            Create software starter packages, license keys, or enterprise IT hardware items to sell directly through the Bezalel store.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light"
          >
            <Plus size={14} /> Add First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`group relative flex flex-col p-4 rounded-xl border bg-card shadow-sm transition-all duration-300 ${
                product.isActive
                  ? "border-border hover:border-accent/50 hover:shadow-md"
                  : "border-border/60 opacity-60"
              }`}
            >
              {/* Product Image */}
              <div className="w-full aspect-square bg-secondary/50 border border-border rounded-lg mb-4 flex items-center justify-center text-muted-foreground overflow-hidden">
                {product.images?.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package size={32} className="text-muted-foreground/60" />
                )}
              </div>

              <div className="space-y-1 flex-1">
                <h3 className="font-display text-sm font-bold text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {product.category?.name || "Uncategorized"}
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

              {/* Actions */}
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
          ))}
        </div>
      )}

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-accent-dark dark:text-accent-light">
                  <Package size={16} />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">
                    Add New Product
                  </h2>
                  <p className="text-xs text-muted-foreground">Add a product to your catalog</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="e.g. NextStack Pro Enterprise Kit"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent h-24 resize-none"
                  placeholder="Comprehensive summary of software features, hardware specifications, and licensing..."
                  required
                />
              </div>

              <div>
                <ImageUpload
                  label="Product Photos / Software Box Art"
                  description="Upload product images from phone camera, gallery, or computer."
                  images={formData.images}
                  onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                  multiple={true}
                  maxFiles={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Price (KES) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Compare Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="Original price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Stock Units <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>
                {categories.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
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
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  {isSubmitting ? "Saving..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
