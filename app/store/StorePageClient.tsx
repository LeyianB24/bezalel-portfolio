"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Filter, Package, Star, Zap, Shield, ArrowRight, Tag, X } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UnifiedBackground from "@/components/UnifiedBackground";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  category: { id: string; name: string; slug: string };
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

const CURRENCY = "KES";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative flex flex-col rounded-xl border border-border/40 bg-card overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
    >
      {/* Image Placeholder / Category Badge */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary/60 to-secondary/20 flex items-center justify-center overflow-hidden">
        {product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
            <Package size={48} strokeWidth={1} />
            <span className="text-xs font-mono uppercase tracking-widest">{product.category.name}</span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-destructive text-white text-[10px] font-bold uppercase tracking-widest rounded">
            -{discount}%
          </div>
        )}

        <div className="absolute top-3 right-3 px-2 py-1 bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-mono text-muted-foreground rounded">
          {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary/70 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">
            {product.category.name}
          </span>
        </div>

        <h3 className="font-bold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-xs leading-relaxed flex-1 line-clamp-3">
          {product.description}
        </p>

        <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-foreground font-mono">
                {CURRENCY} {product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-xs font-mono text-muted-foreground line-through">
                  {CURRENCY} {product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/store/${product.slug}`}
            className="group/btn flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold px-4 py-2 rounded-lg transition-all duration-300 border border-primary/20 hover:border-primary"
          >
            View <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function StorePageClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || p.category.slug === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const features = [
    { icon: Zap, label: "Instant Delivery", desc: "All digital products delivered immediately after payment" },
    { icon: Shield, label: "Secure Checkout", desc: "M-Pesa, Stripe & other payment methods supported" },
    { icon: Star, label: "Premium Quality", desc: "Hand-crafted by Bezalel's engineering team" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <UnifiedBackground variant="subtle" />
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono uppercase tracking-widest mb-6">
              <Tag size={12} />
              Digital Store // Bezalel Technologies
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
              CRAFT YOUR
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent">
                DIGITAL EDGE
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Premium SaaS tools, templates, and consulting packages engineered by Bezalel Technologies. 
              Built to deploy fast and scale infinitely.
            </p>
          </motion.div>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <f.icon size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-foreground">{f.label}</div>
                  <div className="text-xs text-muted-foreground max-w-[180px]">{f.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Filter & Search Bar */}
        <section className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-y border-border/30 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border/60 bg-card/60 text-foreground placeholder:text-muted-foreground text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
              <Filter size={14} className="text-muted-foreground shrink-0" />
              {[{ id: "all", name: "All", slug: "all" }, ...categories].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <Package size={64} className="mx-auto text-muted-foreground/20 mb-4" strokeWidth={1} />
              <h2 className="text-xl font-bold text-muted-foreground mb-2">No products found</h2>
              <p className="text-sm text-muted-foreground/60">
                {searchQuery ? `No results for "${searchQuery}"` : "Check back soon — new products coming."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="mt-4 text-primary text-sm hover:underline"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-muted-foreground font-mono">
                  <span className="text-foreground font-bold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/30 bg-card/30 py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={28} className="text-primary" />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground mb-8">
              Can't find exactly what you need? Tell us about your project and we'll engineer a custom solution.
            </p>
            <Link
              href="/projects/request"
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-xl font-bold text-sm hover:scale-105 transition-transform duration-300"
            >
              Request Custom Build <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
