/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Package, ShoppingCart, Zap, CheckCircle2, 
  AlertCircle, ArrowRight, Tag, X, Loader2, CreditCard, Smartphone, Truck
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UnifiedBackground from "@/components/UnifiedBackground";
import { toast } from "sonner";
import { PaymentMethod } from "@prisma/client";

const CURRENCY = "KES";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  sku?: string;
  category: { id: string; name: string; slug: string };
};

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Checkout form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("Nairobi");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MPESA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleWhatsAppOrder = () => {
    const message = `Hello Bezalel Technologies! I would like to order: "${product.name}" (KES ${product.price.toLocaleString()}) x${quantity}. Please confirm availability and delivery.`;
    const whatsappUrl = `https://wa.me/254796157265?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp with your order details...");
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !streetAddress || !city) {
      toast.error("Please fill in all required shipping details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone || null,
          shippingAddress: {
            street: streetAddress,
            city,
            country: "Kenya",
          },
          items: [
            {
              productId: product.id,
              quantity,
            },
          ],
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to process order");
      }

      const result = await response.json();

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        toast.success(result.message || "Order placed successfully!");
        setIsCheckoutOpen(false);
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to place order";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = product.description
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <UnifiedBackground variant="subtle" />
      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-6 pt-36 pb-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-10">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/store" className="hover:text-foreground transition-colors">Store</Link>
            <span>/</span>
            <Link href={`/store?category=${product.category.slug}`} className="hover:text-foreground transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground font-bold">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-lg border border-border bg-card overflow-hidden flex items-center justify-center shadow-sm"
            >
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground/30">
                  <Package size={80} strokeWidth={0.8} />
                  <span className="text-xs uppercase tracking-widest">{product.category.name}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-md shadow">
                  Save {discount}%
                </div>
              )}
            </motion.div>

            {/* Product Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/20 bg-accent/10 text-accent-dark dark:text-accent-light text-xs font-bold uppercase tracking-wider">
                    <Tag size={12} />
                    {product.category.name}
                  </span>
                  {product.sku && (
                    <span className="text-xs font-mono text-muted-foreground">SKU: {product.sku}</span>
                  )}
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-black font-mono text-accent-dark dark:text-accent-light">
                    {CURRENCY} {product.price.toLocaleString()}
                  </span>
                  {product.comparePrice && (
                    <span className="text-base font-mono text-muted-foreground line-through">
                      {CURRENCY} {product.comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border">
                  {product.stock > 0 ? (
                    <>
                      <CheckCircle2 size={16} className="text-accent-dark dark:text-accent-light" />
                      <span className="text-sm font-bold text-foreground">
                        In Stock ({product.stock} units available in Nairobi warehouse)
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-red-500" />
                      <span className="text-sm text-red-500 font-bold">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
                  {product.description}
                </p>

                {/* Key Features */}
                {features.length > 0 && (
                  <div className="mb-8 space-y-2.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specifications</h2>
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={10} className="text-accent-dark dark:text-accent-light" />
                        </div>
                        <span className="text-xs text-foreground">{feature}.</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity:</span>
                    <div className="flex items-center border border-border rounded-md overflow-hidden bg-card">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 font-mono text-sm font-bold text-foreground border-x border-border">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Subtotal: <strong className="text-foreground font-mono font-bold">{CURRENCY} {(product.price * quantity).toLocaleString()}</strong>
                    </span>
                  </div>
                )}

                {/* Primary Order Action */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(true)}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2.5 bg-accent text-accent-foreground py-3.5 px-6 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-accent-light disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <ShoppingCart size={15} />
                    {product.stock === 0 ? "Out of Stock" : "Checkout Now"}
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-md border border-border bg-card text-foreground hover:border-accent text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    WhatsApp Order
                  </button>
                </div>

                <p className="text-[11px] text-muted-foreground mt-3 text-center">
                  Prompt delivery across Kenya. M-Pesa, Card, and Cash on Delivery accepted.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-24 border-t border-border pt-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Related Products</h2>
                <Link href="/store" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light hover:underline">
                  View all in Store <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/store/${p.slug}`}
                    className="group rounded-lg border border-border bg-card overflow-hidden hover:border-accent/40 shadow-sm transition-all"
                  >
                    <div className="aspect-[4/3] bg-secondary/20 flex items-center justify-center overflow-hidden">
                      {p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <Package size={32} className="text-muted-foreground/30" strokeWidth={1} />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 text-foreground group-hover:text-accent-dark dark:group-hover:text-accent-light transition-colors">{p.name}</h3>
                      <span className="font-mono text-accent-dark dark:text-accent-light text-sm font-bold">{CURRENCY} {p.price.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 relative shadow-2xl flex flex-col max-h-[92vh]">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-border pb-4 mb-4">
              <h2 className="text-2xl font-black text-foreground">
                Direct Checkout
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {product.name} × {quantity} · <strong className="text-accent-dark dark:text-accent-light font-mono font-bold">KES {(product.price * quantity).toLocaleString()}</strong>
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Samuel Ochieng"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="samuel@example.com"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Phone Number (M-Pesa)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Delivery Address / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Westlands, Chiromo Rd"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Nairobi"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod(PaymentMethod.MPESA)}
                    className={`flex flex-col items-center justify-center p-3 rounded-md border text-xs font-bold transition-all ${
                      paymentMethod === PaymentMethod.MPESA
                        ? "border-accent bg-accent/15 text-accent-dark dark:text-accent-light"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mb-1" />
                    <span>M-Pesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod(PaymentMethod.STRIPE)}
                    className={`flex flex-col items-center justify-center p-3 rounded-md border text-xs font-bold transition-all ${
                      paymentMethod === PaymentMethod.STRIPE
                        ? "border-accent bg-accent/15 text-accent-dark dark:text-accent-light"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mb-1" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY)}
                    className={`flex flex-col items-center justify-center p-3 rounded-md border text-xs font-bold transition-all ${
                      paymentMethod === PaymentMethod.CASH_ON_DELIVERY
                        ? "border-accent bg-accent/15 text-accent-dark dark:text-accent-light"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Truck className="w-4 h-4 mb-1" />
                    <span>On Delivery</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-border pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="border border-border bg-card hover:bg-secondary text-foreground font-bold px-4 py-2.5 rounded-md text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent-light text-accent-foreground font-bold px-6 py-2.5 rounded-md text-xs transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order (KES {(product.price * quantity).toLocaleString()})
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
