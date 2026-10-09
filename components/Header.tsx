/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  MonitorUp,
  Network,
  CreditCard,
  Smartphone,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

// ─── Services dropdown data ───────────────────────────────────────────────────
const SERVICES = [
  {
    name: "Software & Web Systems",
    description: "Custom portals, dashboards & workflow automation",
    href: "/services/web-systems",
    icon: MonitorUp,
    accent: "#C9A24B",
  },
  {
    name: "IT Infrastructure & AV",
    description: "Structured cabling, networking & boardroom AV",
    href: "/services/infrastructure",
    icon: Network,
    accent: "#C9A24B",
  },
  {
    name: "Payments & API Integration",
    description: "M-Pesa Daraja, Stripe & bank transfer rails",
    href: "/services/api",
    icon: CreditCard,
    accent: "#C9A24B",
  },
  {
    name: "Mobile Systems & Field Ops",
    description: "Offline-first iOS & Android operational apps",
    href: "/services/mobile",
    icon: Smartphone,
    accent: "#C9A24B",
  },
];

// ─── Non-services nav links ───────────────────────────────────────────────────
const OTHER_NAV_LINKS = [
  { name: "Portfolio", href: "/portfolio" },
  { name: "Store", href: "/store" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHashNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsMobileMenuOpen(false);

    if (window.location.pathname === "/") {
      if (href.startsWith("/#")) {
        event.preventDefault();
        const target = document.getElementById(href.replace("/#", ""));
        if (target) {
          const y = target.getBoundingClientRect().top + window.scrollY - 88;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }
  };

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsServicesOpen(true);
  };

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setIsServicesOpen(false), 120);
  };

  const isTransparentActive = transparent && !isScrolled;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-border/80 bg-background/95 backdrop-blur-xl shadow-sm"
            : transparent
            ? "border-b-0 border-transparent bg-transparent backdrop-blur-none shadow-none"
            : "border-b border-border/40 bg-background/85 backdrop-blur-md"
        }`}
      >
        <div className="flex w-full items-center justify-between px-3 xs:px-4 sm:px-6 lg:px-8 3xl:px-12 py-2.5 sm:py-3.5 pt-[calc(0.625rem+var(--sat))] sm:pt-[calc(0.875rem+var(--sat))]">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Bezalel Technologies home"
            className="flex shrink-0 items-center gap-1.5 sm:gap-2 mr-2 sm:mr-4 lg:mr-8 transition-opacity hover:opacity-90 min-w-0"
            onClick={(event) => handleHashNavigation(event, "/#home")}
          >
            {isTransparentActive ? (
              <img
                src="/logos/bezalel-logo-horizontal-light.png"
                alt="Bezalel Technologies"
                className="h-7 xs:h-8 sm:h-10 md:h-11 lg:h-12 w-auto max-h-12 object-contain"
              />
            ) : (
              <>
                <img
                  src="/logos/bezalel-logo-horizontal-dark.png"
                  alt="Bezalel Technologies"
                  className="h-7 xs:h-8 sm:h-10 md:h-11 lg:h-12 w-auto max-h-12 object-contain dark:hidden"
                />
                <img
                  src="/logos/bezalel-logo-horizontal-light.png"
                  alt="Bezalel Technologies"
                  className="hidden h-7 xs:h-8 dark:block sm:h-10 md:h-11 lg:h-12 w-auto max-h-12 object-contain"
                />
              </>
            )}
          </Link>

          {/* ── Desktop Nav ─────────────────────────────────────────────── */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {/* Services Dropdown Trigger */}
            <div
              ref={servicesRef}
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button
                type="button"
                id="services-menu-btn"
                aria-haspopup="true"
                aria-expanded={isServicesOpen}
                onClick={() => setIsServicesOpen((o) => !o)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-300 select-none ${
                  isTransparentActive
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                Services
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    role="menu"
                    aria-labelledby="services-menu-btn"
                    className="absolute left-0 top-[calc(100%+6px)] z-50 w-[340px] rounded-2xl border border-border/80 bg-card/98 text-card-foreground p-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10"
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdown}
                  >
                    {/* Header row */}
                    <div className="mb-1 px-3 py-2 border-b border-border/60">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A24B]">
                        Our Services
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Mission-critical engineering across four domains
                      </p>
                    </div>

                    {SERVICES.map((service) => {
                      const Icon = service.icon;
                      return (
                        <Link
                          key={service.href}
                          href={service.href}
                          role="menuitem"
                          onClick={() => setIsServicesOpen(false)}
                          className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-[#C9A24B]/8 hover:border-[#C9A24B]/20"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C9A24B]/10 border border-[#C9A24B]/20 group-hover:bg-[#C9A24B]/20 transition-colors">
                            <Icon className="h-4 w-4 text-[#C9A24B]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground group-hover:text-[#C9A24B] transition-colors leading-snug">
                              {service.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                              {service.description}
                            </p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-1.5 text-muted-foreground/40 group-hover:text-[#C9A24B] group-hover:translate-x-0.5 transition-all duration-150" />
                        </Link>
                      );
                    })}

                    {/* Footer CTA */}
                    <div className="mt-1 pt-1.5 border-t border-border/60 px-3 pb-1">
                      <Link
                        href="/projects/request"
                        onClick={() => setIsServicesOpen(false)}
                        className="flex items-center justify-between rounded-lg bg-[#C9A24B]/10 border border-[#C9A24B]/25 px-3 py-2 text-xs font-bold text-[#C9A24B] hover:bg-[#C9A24B]/20 transition-colors"
                      >
                        <span>Start a project with us</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other nav links */}
            {OTHER_NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleHashNavigation(event, item.href)}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                  isTransparentActive
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle transparent={isTransparentActive} />
            <Link
              href="/projects/request"
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold shadow-sm transition-all duration-300 ${
                isTransparentActive
                  ? "bg-[#C9A24B] text-[#050D17] hover:bg-[#d8b056] shadow-[0_0_20px_rgba(201,162,75,0.25)]"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <ThemeToggle transparent={isTransparentActive} />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className={`rounded-md border p-2 transition-colors duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isTransparentActive
                  ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
                  : "border-border bg-card text-foreground"
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        {(!transparent || isScrolled) && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-accent/80"
            style={{ scaleX }}
          />
        )}
      </motion.header>

      {/* ── Mobile Menu ─────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[calc(53px+var(--sat))] sm:top-[calc(67px+var(--sat))] bottom-0 z-50 bg-background/98 px-4 pb-[calc(2rem+var(--sab))] pt-6 backdrop-blur-xl overflow-y-auto max-h-[calc(100dvh-(53px+var(--sat)))] sm:max-h-[calc(100dvh-(67px+var(--sat)))] lg:hidden border-b border-border">
          <nav className="mx-auto flex max-w-md flex-col gap-2.5" aria-label="Mobile navigation">

            {/* Services accordion */}
            <div className="rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setIsMobileServicesOpen((o) => !o)}
                className="w-full flex items-center justify-between bg-card px-4 py-3.5 text-base font-semibold text-foreground min-h-[48px]"
                aria-expanded={isMobileServicesOpen}
              >
                <span>Services</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    isMobileServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isMobileServicesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-t border-border/60"
                  >
                    <div className="flex flex-col divide-y divide-border/50 bg-background/60">
                      {SERVICES.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#C9A24B]/8"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C9A24B]/10 border border-[#C9A24B]/20">
                              <Icon className="h-4 w-4 text-[#C9A24B]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground leading-snug">
                                {service.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground leading-snug">
                                {service.description}
                              </p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 group-hover:text-[#C9A24B] transition-colors" />
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other links */}
            {OTHER_NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleHashNavigation(event, item.href)}
                className="rounded-lg border border-border bg-card px-4 py-3.5 text-base font-semibold text-foreground hover:border-accent/40 transition-colors min-h-[48px] flex items-center"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/projects/request"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors min-h-[48px]"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Quick Mobile Contact Actions */}
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2 text-xs">
              <a
                href="https://wa.me/254796157265"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-3 font-semibold text-emerald-600 dark:text-emerald-400 min-h-[44px]"
              >
                WhatsApp Desk
              </a>
              <a
                href="tel:+254796157265"
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-3 font-semibold text-foreground min-h-[44px]"
              >
                Direct Call
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
