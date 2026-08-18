/* eslint-disable @next/next/no-img-element */
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:border-accent/40 shadow-sm transition-all"
    >
      {/* Image / Category Badge */}
      <div className="relative aspect-[4/3] bg-secondary/20 flex items-center justify-center overflow-hidden">
        {product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
            <Package size={40} strokeWidth={1} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{product.category.name}</span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider rounded shadow">
            Save {discount}%
          </div>
        )}

        <div className="absolute top-3 right-3 px-2 py-0.5 bg-background/90 backdrop-blur-sm border border-border text-[10px] font-bold text-muted-foreground rounded">
          {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
            {product.category.name}
          </span>
        </div>

        <h3 className="font-bold text-foreground text-base leading-snug mb-2 group-hover:text-accent-dark dark:group-hover:text-accent-light transition-colors">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-xs leading-relaxed flex-1 line-clamp-3">
          {product.description}
        </p>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg sm:text-xl font-bold text-accent-dark dark:text-accent-light font-mono">
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
            className="flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-accent-light transition-colors shrink-0 shadow-sm"
          >
            Details <ArrowRight size={12} />
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
    { icon: Zap, label: "Verified Hardware", desc: "Tested enterprise networking, servers, and components" },
    { icon: Shield, label: "Direct Checkout", desc: "Instant M-Pesa, card, or Cash on Delivery with invoice dispatch" },
    { icon: Star, label: "Nairobi Dispatch", desc: "Prompt same-day/next-day dispatch across Kenya" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <UnifiedBackground variant="subtle" />
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/10 text-accent-dark dark:text-accent-light text-xs font-bold uppercase tracking-wider mb-6">
              <Tag size={12} />
              Hardware & IT Store
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              Hardware, Equipment & Technical Packages
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Browse enterprise networking hardware, server components, development kits, and operational packages. For custom software engineering, start a project brief.
            </p>
          </motion.div>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10"
          >
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-4 sm:px-5 py-3 rounded-lg border border-border bg-card shadow-sm">
                <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <f.icon size={15} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-foreground">{f.label}</div>
                  <div className="text-[11px] text-muted-foreground max-w-[160px]">{f.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Filter & Search Bar */}
        <section className="sticky top-16 sm:top-20 z-30 bg-background/90 backdrop-blur-xl border-y border-border py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, hardware, models..."
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:border-accent outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
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
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors shrink-0 ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground hover:border-accent"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package size={56} className="mx-auto text-muted-foreground/30 mb-4" strokeWidth={1} />
              <h2 className="text-xl font-bold text-foreground mb-2">No products found</h2>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? `No matches found for "${searchQuery}"` : "New hardware inventory being indexed."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="mt-4 text-accent-dark dark:text-accent-light text-sm font-bold hover:underline"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  Showing <span className="text-foreground">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""}
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
        <section className="border-t border-border bg-primary p-8 text-primary-foreground sm:p-14 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-6 text-accent-light">
              <ShoppingCart size={24} />
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight mb-4">
              Need a Custom Infrastructure Deployment?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-sm leading-relaxed">
              We design, supply, configure, and maintain end-to-end IT infrastructure for offices, SACCOs, estates, and enterprise facilities.
            </p>
            <Link
              href="/projects/request"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3.5 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-accent-light transition-colors shadow-sm"
            >
              Request Custom Build <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
