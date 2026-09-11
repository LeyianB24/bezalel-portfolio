"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Package,
  Shield,
  ArrowRight,
  X,
  Phone,
  MapPin,
  Truck,
  ExternalLink,
  Network,
  Cable,
  Zap,
  Wifi,
  Cpu,
  Server,
  Plus,
  Minus,
  Trash2,
  Clock,
  Award,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  sku?: string;
  images: string[];
  category: { id: string; name: string; slug: string; icon?: string };
  isFeatured?: boolean;
  isBestseller?: boolean;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface CartItem {
  product: StoreProduct;
  quantity: number;
}

interface StorePageClientProps {
  products: StoreProduct[];
  categories: StoreCategory[];
}

const CATEGORY_ICONS: Record<string, typeof Network> = {
  networking: Network,
  cables: Cable,
  "power-sockets": Zap,
  routers: Wifi,
  adapters: Cpu,
  servers: Server,
};

const PROMO_SLIDES = [
  {
    tag: "Commercial Networking Deals",
    title: "10-Gigabit Enterprise Switches & Fiber SFP+",
    description: "Layer-3 managed PoE+ hardware for high-density corporate offices and data rooms.",
    badge: "Save up to 15%",
    ctaText: "Shop Networking",
    categorySlug: "networking",
    bgGradient: "from-[#091E3A] to-[#040A14]",
  },
  {
    tag: "Cables & Connectivity",
    title: "Cat6A Pure Copper & Ultra 8K HDMI 2.1 Cables",
    description: "Low-attenuation, shielded transmission cords certified for zero packet loss.",
    badge: "In Stock Now",
    ctaText: "View Cables",
    categorySlug: "cables",
    bgGradient: "from-[#1B2A4A] to-[#091322]",
  },
  {
    tag: "Power & Sockets",
    title: "Modular Sockets, Surge Extension & Rack PDUs",
    description: "Heavy-duty 16A protection units engineered for continuous institutional uptime.",
    badge: "Bulk Pricing Available",
    ctaText: "Browse Power",
    categorySlug: "power-sockets",
    bgGradient: "from-[#112D27] to-[#05110E]",
  },
];

export default function StorePageClient({ products, categories }: StorePageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState<"all" | "featured" | "bestseller">("all");

  // Rotating carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category.slug.toLowerCase() === selectedCategory.toLowerCase() ||
        product.category.name.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesView =
        viewFilter === "all" ||
        (viewFilter === "featured" && product.isFeatured) ||
        (viewFilter === "bestseller" && product.isBestseller);

      return matchesCategory && matchesSearch && matchesView;
    });
  }, [products, selectedCategory, searchQuery, viewFilter]);

  // Cart operations
  const addToCart = (product: StoreProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`Added "${product.name.slice(0, 30)}..." to your cart.`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Buy on WhatsApp link helper
  const getWhatsAppProductLink = (product: StoreProduct) => {
    const text = `Hello Bezalel Store, I would like to order: ${product.name} (KSh ${product.price.toLocaleString()}). Please confirm stock and delivery to my location.`;
    return `https://wa.me/254796157265?text=${encodeURIComponent(text)}`;
  };

  // Order Cart on WhatsApp
  const handleCheckoutCartWhatsApp = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map((item) => `• ${item.product.name} x${item.quantity} (KSh ${(item.product.price * item.quantity).toLocaleString()})`)
      .join("\n");
    const message = `Hello Bezalel Technologies Store, I want to complete this order:\n\n${itemsList}\n\n*Total: KSh ${cartTotal.toLocaleString()}*\n\nPlease confirm delivery fee and M-Pesa Till number.`;
    window.open(`https://wa.me/254796157265?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* 1. Top Bar */}
      <aside aria-label="Store contact and delivery information" className="w-full bg-[#050D17] text-white/90 text-[11px] border-b border-white/10 px-3 xs:px-4 sm:px-6 lg:px-8 py-2">
        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left truncate">
            <MapPin className="h-3.5 w-3.5 text-[#C9A24B] shrink-0" />
            <span className="truncate">
              Valley View Office Park, 2nd Floor, Parklands, Nairobi · Fast Dispatch Countrywide
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <a
              href="tel:+254796157265"
              className="hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <Phone className="h-3 w-3 text-[#C9A24B]" />
              <span>+254 796 157 265</span>
            </a>
            <span className="text-white/30">|</span>
            <a
              href="https://wa.me/254796157265?text=Hello%20Bezalel%20Store%2C%20I%20have%20an%20inquiry%20about%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A24B] hover:text-white inline-flex items-center gap-1 font-semibold transition-colors"
            >
              <FaWhatsapp className="h-3.5 w-3.5" />
              <span>WhatsApp Order Line</span>
            </a>
          </div>
        </div>
      </aside>

      {/* 2. Main Header & Sticky Store Nav */}
      <Header />

      <main className="flex-1 pt-20 sm:pt-24 pb-16">
        {/* Store Sub-Header: Search & Cart Trigger */}
        <section aria-label="Store search and category filters" className="border-b border-border bg-card/80 backdrop-blur-md sticky top-[60px] sm:top-[70px] z-30 px-3 xs:px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
          <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search switches, HDMI cables, routers, sockets, adapters..."
                className="w-full pl-10 pr-9 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Buttons & Cart Drawer Button */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-3">
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setViewFilter("all")}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    viewFilter === "all"
                      ? "bg-card text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Items
                </button>
                <button
                  type="button"
                  onClick={() => setViewFilter("bestseller")}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    viewFilter === "bestseller"
                      ? "bg-card text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Bestsellers
                </button>
              </div>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="rounded-full bg-accent text-accent-foreground px-1.5 py-0.2 text-[10px] font-black">
                  {totalCartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Horizontal Category Nav Pills */}
          <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] mt-3 pt-2 border-t border-border/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 px-3.5 py-1.5 rounded-full border transition-all ${
                selectedCategory === "all"
                  ? "bg-accent text-accent-foreground font-bold border-accent shadow-xs"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/30"
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] || Package;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all ${
                    isSelected
                      ? "bg-accent text-accent-foreground font-bold border-accent shadow-xs"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 mt-6">
          {/* 3. Hero Promo Banner Carousel */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`bg-gradient-to-r ${PROMO_SLIDES[activeSlide].bgGradient} text-white p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden`}
              >
                {/* Visual Grid Accents */}
                <div
                  className="absolute inset-0 opacity-[0.08] pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />

                <div className="relative z-10 max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#C9A24B]/20 border border-[#C9A24B]/40 px-3 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#C9A24B] mb-3">
                    <span>{PROMO_SLIDES[activeSlide].tag}</span>
                    <span className="h-1 w-1 rounded-full bg-[#C9A24B]" />
                    <span>{PROMO_SLIDES[activeSlide].badge}</span>
                  </div>
                  <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                    {PROMO_SLIDES[activeSlide].title}
                  </h2>
                  <p className="mt-2.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                    {PROMO_SLIDES[activeSlide].description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(PROMO_SLIDES[activeSlide].categorySlug)}
                      className="inline-flex items-center gap-2 rounded-md bg-[#C9A24B] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#d8b056] transition-colors shadow-sm"
                    >
                      {PROMO_SLIDES[activeSlide].ctaText}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href="https://wa.me/254796157265?text=Hello%20Bezalel%20Store%2C%20I%20want%20to%20inquire%20about%20your%20promotional%20bundles"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      <FaWhatsapp className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Indicators */}
                <div className="relative z-10 flex md:flex-col gap-2">
                  {PROMO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        activeSlide === idx ? "w-8 bg-[#C9A24B]" : "w-2 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 4. Category Tile Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent-light">
                  Browse by Category
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-black text-foreground">
                  Electronics Accessories & Networking
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.slug] || Package;
                const isSelected = selectedCategory === cat.slug;
                const count = products.filter((p) => p.category.slug === cat.slug).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`rounded-xl border p-4 text-center transition-all flex flex-col items-center justify-center gap-2 group ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border bg-card hover:border-accent/40 shadow-xs"
                    }`}
                  >
                    <div
                      className={`h-11 w-11 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-foreground line-clamp-1">{cat.name}</span>
                    <span className="text-[10px] text-muted-foreground">{count} items</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Product Grid (Featured & Bestsellers) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent-light">
                  Product Catalog
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-black text-foreground">
                  {selectedCategory === "all"
                    ? "All Accessories & Equipment"
                    : categories.find((c) => c.slug === selectedCategory)?.name || "Selected Category"}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Showing {filteredProducts.length} verified products
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const discount = product.comparePrice
                  ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="group rounded-xl border border-border bg-card overflow-hidden shadow-xs hover:border-accent/50 transition-all flex flex-col justify-between"
                  >
                    {/* Image & Badges */}
                    <div className="relative aspect-[4/3] bg-muted/40 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="h-10 w-10 opacity-40" />
                        </div>
                      )}

                      {discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 rounded bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase shadow-xs">
                          Save {discount}%
                        </span>
                      )}

                      <span className="absolute top-2.5 right-2.5 rounded bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 text-[10px] font-medium border border-white/10">
                        {product.stock > 0 ? `Stock: ${product.stock}` : "Out of stock"}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                            {product.category.name}
                          </span>
                          {product.sku && (
                            <span className="text-[10px] font-mono text-muted-foreground truncate">
                              {product.sku}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-foreground text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2 mt-1">
                          {product.name}
                        </h4>

                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing & Order Actions */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-display text-lg font-black text-foreground">
                            KSh {product.price.toLocaleString()}
                          </span>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <span className="text-xs text-muted-foreground line-through">
                              KSh {product.comparePrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Dual Actions: Add to Cart + Buy on WhatsApp */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background hover:bg-muted py-2 px-2 text-xs font-semibold text-foreground transition-colors"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Add to Cart</span>
                          </button>

                          <a
                            href={getWhatsAppProductLink(product)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 py-2 px-2 text-xs font-bold text-white transition-colors text-center shadow-xs"
                          >
                            <FaWhatsapp className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-14 border border-dashed border-border rounded-xl">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <h4 className="text-sm font-bold text-foreground">No products found</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search query or reset the category filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setViewFilter("all");
                  }}
                  className="mt-4 text-xs font-bold text-accent hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* 6. Promotional Banners (Deals & Solutions) */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/40 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                  Enterprise Bundle
                </span>
                <h4 className="font-display text-base font-bold text-foreground mt-1">
                  Office Networking & Server Room Package
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Includes 24-Port 10G PoE Switch, 2x AX3000 Access Points, and 8-way PDU with surge protection.
                </p>
              </div>
              <Link
                href="/projects/request"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
              >
                Request Custom Package <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/40 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                  Commercial Fitouts
                </span>
                <h4 className="font-display text-base font-bold text-foreground mt-1">
                  Bulk Cable & Sockets for Contractors
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Wholesale cartons of Cat6A copper patch cords, HDMI 2.1 leads, and dual USB-C wall sockets.
                </p>
              </div>
              <a
                href="https://wa.me/254796157265?text=Hello%20Bezalel%20Store%2C%20I%20need%20a%20bulk%20quote%20for%20an%20office%20fitout"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Inquire Wholesale Rates <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/40 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                  Boardroom AV
                </span>
                <h4 className="font-display text-base font-bold text-foreground mt-1">
                  Crestron & Zoom Room Installations
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Turnkey hardware installation, acoustic beamforming calibration, and ongoing maintenance SLA.
                </p>
              </div>
              <Link
                href="/services/infrastructure"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-accent-dark dark:text-accent-light hover:underline"
              >
                Explore AV Services <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 7. Trust Badges Section */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                Why Buy Equipment From Bezalel Technologies
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Engineered for continuous commercial operation with guaranteed local support in Kenya.
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">1-Year Official Warranty</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Full replacement warranty on switches, adapters, and server components.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">100% Genuine Certified</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Original manufacturer equipment with verified serials and documentation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Same-Day Dispatch</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Same-day courier within Nairobi, 24–48 hours to all major towns across Kenya.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">VAT Invoicing & Fitouts</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Official tax invoices, ETR receipts, and contractor wholesale pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 8. Slide-Over Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            />

            {/* Slide Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col justify-between shadow-2xl p-5 sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-accent" />
                    <h3 className="font-display text-base font-bold text-foreground">
                      Shopping Cart ({totalCartCount})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm font-bold text-foreground">Your cart is empty</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add networking hardware or accessories to begin.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="rounded-lg border border-border bg-background p-3 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] text-accent font-semibold mt-0.5">
                            KSh {item.product.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-border rounded">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1 text-muted-foreground hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-600 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Subtotal</span>
                    <span className="font-display text-lg font-black text-foreground">
                      KSh {cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[10px] text-muted-foreground">
                    Delivery calculated at checkout. Countrywide courier dispatch from Nairobi HQ.
                  </p>

                  <button
                    type="button"
                    onClick={handleCheckoutCartWhatsApp}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    <span>Order Cart on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toast.success("Order request generated. Our dispatch desk will contact you.");
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary/90 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm transition-colors"
                  >
                    <span>Checkout with M-Pesa</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
