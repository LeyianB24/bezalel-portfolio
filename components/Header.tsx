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

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 36);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
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

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? "border-border/80 bg-background/95 backdrop-blur-xl shadow-sm"
            : "border-border/40 bg-background/85 backdrop-blur-md"
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
              <span className="font-display text-sm xs:text-base font-black tracking-tight text-foreground truncate">
                BEZALEL
              </span>
            </div>

            {/* Full Horizontal Wordmark for sm, md, lg and up */}
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
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleHashNavigation(event, item.href)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link
              href="/projects/request"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-md border border-border bg-card p-1.5 sm:p-2 text-foreground"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-accent/80"
          style={{ scaleX }}
        />
      </motion.header>

      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[53px] sm:top-[67px] bottom-0 z-40 bg-background/98 px-4 pb-8 pt-6 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-53px)] sm:max-h-[calc(100vh-67px)] lg:hidden border-b border-border">
          <nav className="mx-auto flex max-w-md flex-col gap-2.5" aria-label="Mobile navigation">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleHashNavigation(event, item.href)}
                className="rounded-lg border border-border bg-card px-4 py-3.5 text-base sm:text-lg font-semibold text-foreground hover:border-accent/40 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/projects/request"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
