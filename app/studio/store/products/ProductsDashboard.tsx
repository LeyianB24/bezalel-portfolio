"use client"

import { useState } from "react"
import { Plus, X, Package, ArrowLeft, Loader2, Trash2, Edit3, ToggleLeft, ToggleRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ProductsDashboard({ 
  initialProducts,
  categories
}: { 
  initialProducts: any[]
  categories: any[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "10",
    categoryId: categories.length > 0 ? categories[0].id : ""
  })

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      comparePrice: "",
      stock: "10",
      categoryId: categories.length > 0 ? categories[0].id : ""
    })
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Please fill required fields")
      return
    }

    setIsSubmitting(true)
    try {
      let targetCategoryId = formData.categoryId
      if (!targetCategoryId) {
        const catRes = await fetch("/api/store/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "General", slug: "general" })
        })
        const newCat = await catRes.json()
        targetCategoryId = newCat.id
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
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create product")
      }

      const newProduct = await res.json()
      newProduct.category = categories.find(c => c.id === targetCategoryId) || { name: "General" }
      setProducts([newProduct, ...products])
      setIsModalOpen(false)
      resetForm()
      toast.success("Product created successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/store/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (!res.ok) throw new Error("Failed to update status")
      
      setProducts(products.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p))
      toast.success(currentStatus ? "Product deactivated" : "Product activated")
    } catch (error) {
      toast.error("Failed to update product")
    }
  }

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/store/products/${id}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete")
      setProducts(products.filter(p => p.id !== id))
      toast.success("Product deleted")
    } catch (error) {
      toast.error("Failed to delete product")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/studio/store" className="text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">Product Inventory</h1>
          </div>
          <p className="text-sm text-zinc-400">
            {products.length} product{products.length !== 1 ? "s" : ""} · {products.filter(p => p.isActive).length} active
          </p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true) }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> New Product
        </button>
      </div>

      {products.length === 0 && !isModalOpen ? (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-xl">
          <Package size={48} className="mx-auto text-zinc-700 mb-4" strokeWidth={1} />
          <p className="text-zinc-500 mb-4">No products yet. Add your first product to get started.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(product => (
            <div 
              key={product.id} 
              className={`group relative flex flex-col p-4 rounded-xl border bg-zinc-900/50 transition-all duration-300 ${
                product.isActive 
                  ? "border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-900" 
                  : "border-zinc-800/50 opacity-50"
              }`}
            >
              {/* Product Image */}
              <div className="w-full aspect-square bg-zinc-800/50 rounded-lg mb-4 flex items-center justify-center text-zinc-600 overflow-hidden">
                {product.images?.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Package size={32} strokeWidth={1} />
                )}
              </div>
              
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold text-white text-sm truncate">{product.name}</h3>
                <p className="text-xs text-zinc-500 truncate">{product.category?.name || "Uncategorized"}</p>
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <span className="font-mono text-sm text-emerald-400">
                      KES {product.price.toLocaleString()}
                    </span>
                    {product.comparePrice && (
                      <span className="text-[10px] text-zinc-600 line-through ml-1 font-mono">
                        KES {product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500">×{product.stock}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
                <button 
                  onClick={() => toggleProductStatus(product.id, product.isActive)}
                  className="flex items-center gap-1 text-xs transition-colors"
                  title={product.isActive ? "Deactivate" : "Activate"}
                >
                  {product.isActive 
                    ? <ToggleRight size={18} className="text-emerald-500" />
                    : <ToggleLeft size={18} className="text-zinc-500" />
                  }
                  <span className={product.isActive ? "text-emerald-500" : "text-zinc-500"}>
                    {product.isActive ? "Live" : "Off"}
                  </span>
                </button>
                <button 
                  onClick={() => deleteProduct(product.id, product.name)}
                  disabled={deletingId === product.id}
                  className="text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Delete product"
                >
                  {deletingId === product.id 
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Trash2 size={14} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-white">Create New Product</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Add a product to your store catalog</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="e.g. NextStack Pro"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description <span className="text-red-400">*</span></label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none h-24 resize-none transition-all"
                  placeholder="Describe what this product does..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Price (KES) <span className="text-red-400">*</span></label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Compare Price</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.comparePrice}
                    onChange={e => setFormData({...formData, comparePrice: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Original price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Stock Qty <span className="text-red-400">*</span></label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
                {categories.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Category <span className="text-red-400">*</span></label>
                    <select 
                      value={formData.categoryId}
                      onChange={e => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      required
                    >
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {isSubmitting ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
