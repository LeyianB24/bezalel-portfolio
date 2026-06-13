"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, ShoppingCart, Zap, CheckCircle2, AlertCircle, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UnifiedBackground from "@/components/UnifiedBackground";
import { toast } from "sonner";

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
  const [isOrdering, setIsOrdering] = useState(false);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleOrder = async () => {
    setIsOrdering(true);
    // Redirect to project request or WhatsApp for now
    const message = `Hi! I'm interested in purchasing "${product.name}" (KES ${product.price.toLocaleString()}) x${quantity}. Please assist.`;
    const whatsappUrl = `https://wa.me/254796157265?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Redirecting to WhatsApp to complete your order...");
    setIsOrdering(false);
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
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-10">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/store" className="hover:text-primary transition-colors">Store</Link>
            <span>/</span>
            <Link href={`/store?category=${product.category.slug}`} className="hover:text-primary transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-2xl border border-border/40 bg-gradient-to-br from-secondary/60 to-secondary/20 overflow-hidden flex items-center justify-center"
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
                  <span className="text-sm font-mono uppercase tracking-widest">{product.category.name}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-destructive text-white text-xs font-bold uppercase tracking-wider rounded-lg">
                  Save {discount}%
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Category & SKU */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono uppercase tracking-widest">
                  <Tag size={10} />
                  {product.category.name}
                </span>
                {product.sku && (
                  <span className="text-[10px] font-mono text-muted-foreground">SKU: {product.sku}</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-black font-mono text-foreground">
                  {CURRENCY} {product.price.toLocaleString()}
                </span>
                {product.comparePrice && (
                  <span className="text-lg font-mono text-muted-foreground line-through">
                    {CURRENCY} {product.comparePrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border/40">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle2 size={16} className="text-primary" />
                    <span className="text-sm text-primary font-medium">
                      In Stock ({product.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-destructive" />
                    <span className="text-sm text-destructive font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Key Features */}
              {features.length > 0 && (
                <div className="mb-8 space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Key Features</h3>
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={11} className="text-primary" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature}.</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Qty:</span>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      −
                    </button>
                    <span className="px-5 py-2 font-mono text-foreground border-x border-border">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Total: <strong className="text-foreground font-mono">{CURRENCY} {(product.price * quantity).toLocaleString()}</strong>
                  </span>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-4">
                <button
                  onClick={handleOrder}
                  disabled={product.stock === 0 || isOrdering}
                  className="flex-1 flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                >
                  <ShoppingCart size={16} />
                  {product.stock === 0 ? "Out of Stock" : "Order via WhatsApp"}
                </button>
                <Link
                  href="/projects/request"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 text-sm font-medium transition-all"
                >
                  <Zap size={14} />
                  Custom
                </Link>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Secure order processing via WhatsApp. M-Pesa & card accepted.
              </p>
            </motion.div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black tracking-tight">Related Products</h2>
                <Link href="/store" className="flex items-center gap-1 text-sm text-primary hover:underline">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/store/${p.slug}`}
                    className="group rounded-xl border border-border/40 bg-card overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-400"
                  >
                    <div className="aspect-[4/3] bg-secondary/20 flex items-center justify-center">
                      {p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Package size={32} className="text-muted-foreground/30" strokeWidth={1} />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                      <span className="font-mono text-primary text-sm">{CURRENCY} {p.price.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back Link */}
          <div className="mt-12">
            <Link href="/store" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> Back to Store
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
