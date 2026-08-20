"use client";

import { useState } from "react";
import { PackageSearch, DollarSign, Package, ShoppingBag, Eye, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface OrderItemType {
  id: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    images?: string[];
  };
}

interface StoreOrder {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  shippingAddress?: unknown;
  total: number;
  status: string;
  paymentMethod?: string;
  paymentRef?: string | null;
  items?: OrderItemType[];
  createdAt?: string | Date;
}

export default function StoreDashboard({
  initialOrders,
  productsCount,
}: {
  initialOrders: StoreOrder[];
  productsCount: number;
}) {
  const [orders, setOrders] = useState<StoreOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/store/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setOrders(orders.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)));
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: updated.status } : null));
      }
      toast.success(`Order marked as ${status.replace("_", " ")}`);
    } catch {
      toast.error("Failed to update order");
    }
  };

  const revenue = orders.reduce(
    (acc, order) =>
      acc + (order.status !== "CANCELLED" && order.status !== "REFUNDED" ? order.total : 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            <span>Studio Ops</span>
            <span>/</span>
            <span className="text-accent-dark dark:text-accent-light font-extrabold">E-Commerce Hub</span>
          </div>
          <h1 className="font-display text-3xl font-black text-foreground tracking-tight sm:text-4xl">
            Store &amp; Order Fulfillment
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Monitor customer hardware purchases, software starter license orders, and M-Pesa settlements.
          </p>
        </div>
        <Link
          href="/studio/store/products"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-accent-foreground px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <Package size={15} /> Manage Catalog ({productsCount} SKUs)
        </Link>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Total Placed Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 text-accent-dark dark:text-accent-light">
              <PackageSearch className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display text-3xl font-black text-foreground">{orders.length}</div>
          <p className="mt-1 text-xs text-muted-foreground">Across digital &amp; physical products</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Settled Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary text-primary-foreground">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display text-3xl font-black text-foreground font-mono">
            KES {revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Excludes cancelled &amp; refunded orders</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Active Store SKUs
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 text-accent-dark dark:text-accent-light">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display text-3xl font-black text-foreground">{productsCount}</div>
          <p className="mt-1 text-xs text-muted-foreground">Ready for customer purchase</p>
        </div>
      </div>

      {/* 3. Customer Orders Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/30">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-accent-dark dark:text-accent-light" />
            <h2 className="font-display text-base font-bold text-foreground">Customer Orders Pipeline</h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground font-semibold">
            {orders.length} orders logged
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-xs p-8">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground mb-3">
              <ShoppingBag size={20} />
            </div>
            No customer orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 text-muted-foreground font-bold text-xs uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Fulfillment Status</th>
                  <th className="px-6 py-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      <div className="font-bold text-foreground">#{order.id.slice(-8).toUpperCase()}</div>
                      {order.createdAt && (
                        <div className="text-[10px]">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{order.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-foreground">
                      KES {order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          order.status === "PENDING"
                            ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20"
                            : order.status === "PAID"
                            ? "bg-accent/15 text-accent-dark dark:text-accent-light border border-accent/30"
                            : order.status === "SHIPPED" || order.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-secondary text-muted-foreground border border-border"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-background border border-border text-foreground rounded px-2.5 py-1.5 text-xs font-bold uppercase outline-none focus:border-accent focus:ring-1 focus:ring-accent"
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
                      </div>
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
