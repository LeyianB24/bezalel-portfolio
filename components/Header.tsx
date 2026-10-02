/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { name: "Services", href: "/#services" },
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
        <div className="flex w-full items-center justify-between px-3 xs:px-4 sm:px-6 lg:px-8 3xl:px-12 py-2.5 sm:py-3.5">
          <Link
            href="/"
            aria-label="Bezalel Technologies home"
            className="flex shrink-0 items-center gap-1.5 sm:gap-2 mr-2 sm:mr-4 lg:mr-8 transition-opacity hover:opacity-90 min-w-0"
            onClick={(event) => handleHashNavigation(event, "/#home")}
          >
            {/* Mobile Mark-only on small/compact screens (<sm) */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <img
                src="/logos/bezalel-mark-gold.svg"
                alt="Bezalel Mark"
                className="h-8 w-8 object-contain shrink-0"
              />
              <span className={`font-display text-sm xs:text-base font-black tracking-tight truncate transition-colors duration-500 ${
                isTransparentActive ? "text-white" : "text-foreground"
              }`}>
                BEZALEL
              </span>
            </div>

            {/* Full Horizontal Wordmark for sm, md, lg and up */}
            {/* When transparent+unscrolled (dark hero), always show the light logo */}
            {isTransparentActive ? (
              <img
                src="/logos/bezalel-logo-horizontal-light.png"
                alt="Bezalel Technologies"
                className="hidden h-9 sm:block sm:h-10 md:h-11 lg:h-12 w-auto max-h-12 object-contain"
              />
            ) : (
              <>
                <img
                  src="/logos/bezalel-logo-horizontal-dark.png"
                  alt="Bezalel Technologies"
                  className="hidden h-9 sm:block sm:h-10 md:h-11 lg:h-12 w-auto max-h-12 object-contain dark:hidden"
                />
                <img
                  src="/logos/bezalel-logo-horizontal-light.png"
                  alt="Bezalel Technologies"
                  className="hidden h-9 dark:sm:block dark:sm:h-10 dark:md:h-11 dark:lg:h-12 w-auto max-h-12 object-contain"
                />
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {NAV_LINKS.map((item) => (
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

        {/* Scroll Progress Bar — only visible when header is in solid/scrolled state */}
        {(!transparent || isScrolled) && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-accent/80"
            style={{ scaleX }}
          />
        )}
      </motion.header>

      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[53px] sm:top-[67px] bottom-0 z-40 bg-background/98 px-4 pb-[calc(2rem+var(--sab))] pt-6 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-53px)] sm:max-h-[calc(100vh-67px)] lg:hidden border-b border-border">
          <nav className="mx-auto flex max-w-md flex-col gap-2.5" aria-label="Mobile navigation">
            {NAV_LINKS.map((item) => (
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

            {/* Quick Direct Mobile Contact Actions */}
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
