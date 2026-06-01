"use client"

import { useState } from "react"
import { Plus, X, Package, ArrowLeft, Loader2 } from "lucide-react"
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

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "10",
    categoryId: categories.length > 0 ? categories[0].id : ""
  })

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Please fill required fields")
      return
    }

    setIsSubmitting(true)
    try {
      // Create category on the fly if none exist
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
        })
      })

      if (!res.ok) throw new Error("Failed to create product")

      const newProduct = await res.json()
      // Attach the mock category so it renders correctly locally
      newProduct.category = categories.find(c => c.id === targetCategoryId) || { name: "General" }
      setProducts([newProduct, ...products])
      setIsModalOpen(false)
      toast.success("Product created successfully")
      
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "10",
        categoryId: targetCategoryId
      })
    } catch (error) {
      toast.error("Failed to create product")
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
          <p className="text-sm text-zinc-400">Manage your e-commerce catalog.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> New Product
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map(product => (
          <div key={product.id} className={`p-4 rounded-lg border bg-zinc-900/50 transition-colors ${
            product.isActive ? "border-zinc-800 hover:border-emerald-500/50" : "border-zinc-800/50 opacity-60"
          }`}>
            <div className="w-full aspect-square bg-zinc-800 rounded-md mb-4 flex items-center justify-center text-zinc-600">
              <Package size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-white truncate">{product.name}</h3>
              <p className="text-xs text-zinc-500 truncate">{product.category?.name || "Uncategorized"}</p>
              <div className="flex justify-between items-end pt-2">
                <span className="font-mono text-sm text-emerald-400">${product.price.toFixed(2)}</span>
                <span className="text-[10px] text-zinc-500">Stock: {product.stock}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between">
              <button 
                onClick={() => toggleProductStatus(product.id, product.isActive)}
                className={`text-xs ${product.isActive ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`}
              >
                {product.isActive ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !isModalOpen && (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-lg">
          <p className="text-zinc-500">No products found. Add your first product to get started.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold text-white">Create New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 h-24"
                  required
                />
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                  <select 
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500"
                    required
                  >
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded font-medium flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
