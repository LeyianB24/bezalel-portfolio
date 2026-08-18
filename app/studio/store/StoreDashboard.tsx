"use client";

import { useState } from "react";
import { PackageSearch, DollarSign, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function StoreDashboard({ 
  initialOrders,
  productsCount
}: { 
  initialOrders: any[];
  productsCount: number;
}) {
  const [orders, setOrders] = useState(initialOrders);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/store/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      const updated = await res.json();
      setOrders(orders.map(o => o.id === updated.id ? updated : o));
      toast.success(`Order marked as ${status.replace("_", " ")}`);
    } catch {
      toast.error("Failed to update order");
    }
  };

  const revenue = orders.reduce((acc, order) => acc + (order.status !== "CANCELLED" && order.status !== "REFUNDED" ? order.total : 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-3xl font-black text-foreground tracking-tight">Store & Hardware Orders</h1>
          <p className="text-sm text-muted-foreground">Manage IT hardware products, catalog inventory, and customer fulfillments.</p>
        </div>
        <Link 
          href="/studio/store/products"
          className="bg-accent hover:bg-accent-light text-accent-foreground px-4 py-2.5 rounded-md text-xs font-bold shadow-sm transition-colors"
        >
          Manage Product Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <PackageSearch className="w-5 h-5 text-accent-dark dark:text-accent-light" />
          </div>
          <div className="text-3xl font-black text-foreground">{orders.length}</div>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-accent-dark dark:text-accent-light" />
          </div>
          <div className="text-3xl font-black text-foreground font-mono">KES {revenue.toLocaleString()}</div>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Active Products</span>
            <Package className="w-5 h-5 text-accent-dark dark:text-accent-light" />
          </div>
          <div className="text-3xl font-black text-foreground">{productsCount}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wider">Customer Orders</h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No orders have been placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 text-muted-foreground font-bold text-xs uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total Amount</th>
                  <th className="px-6 py-3 font-medium">Payment Status</th>
                  <th className="px-6 py-3 font-medium text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{order.name}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">KES {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.status === "PENDING" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20" :
                        order.status === "PAID" ? "bg-accent/15 text-accent-dark dark:text-accent-light border border-accent/30" :
                        order.status === "SHIPPED" || order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                        "bg-secondary text-muted-foreground border border-border"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-background border border-border text-foreground rounded px-2.5 py-1 text-xs font-bold uppercase outline-none focus:border-accent"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAYMENT_PENDING">Payment Pending</option>
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
          </div>
        )}
      </div>
    </div>
  );
}
