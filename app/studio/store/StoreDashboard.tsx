"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PackageSearch, ArrowUpRight, DollarSign, Package } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function StoreDashboard({ 
  initialOrders,
  productsCount
}: { 
  initialOrders: any[]
  productsCount: number
}) {
  const [orders, setOrders] = useState(initialOrders)

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/store/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error("Failed to update status")
      
      const updated = await res.json()
      setOrders(orders.map(o => o.id === updated.id ? updated : o))
      toast.success(`Order marked as ${status.replace("_", " ")}`)
    } catch (e) {
      toast.error("Failed to update order")
    }
  }

  const revenue = orders.reduce((acc, order) => acc + (order.status !== "CANCELLED" && order.status !== "REFUNDED" ? order.total : 0), 0)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Store Module</h1>
          <p className="text-sm text-zinc-400">Manage products, inventory, and fulfill orders.</p>
        </div>
        <Link 
          href="/studio/store/products"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Manage Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 text-sm font-medium">Total Orders</span>
            <PackageSearch className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-white">{orders.length}</div>
        </div>
        <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 text-sm font-medium">Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-white">${revenue.toFixed(2)}</div>
        </div>
        <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 text-sm font-medium">Active Products</span>
            <Package className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-white">{productsCount}</div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="font-semibold text-white">Recent Orders</h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-mono text-sm">
            No orders have been placed yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/50 text-zinc-400 font-mono text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                    {order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{order.name}</div>
                    <div className="text-xs text-zinc-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 font-mono">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider ${
                      order.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500" :
                      order.status === "PAID" ? "bg-blue-500/10 text-blue-500" :
                      order.status === "SHIPPED" || order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-500" :
                      "bg-zinc-800 text-zinc-400"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-xs rounded px-2 py-1 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
