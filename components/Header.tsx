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
  { name: "Contact", href: "/#contact" },
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

    if (href.startsWith("/#") && window.location.pathname === "/") {
      event.preventDefault();
      const target = document.getElementById(href.replace("/#", ""));
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 top-0 z-50 px-3 py-3 sm:px-5"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-lg border px-4 py-3 shadow-sm transition-all duration-300 md:px-5 ${
            isScrolled
              ? "border-border/80 bg-background/95 backdrop-blur-xl"
              : "border-white/20 bg-background/80 backdrop-blur-md"
          }`}
        >
          <Link
            href="/"
            aria-label="Bezalel Technologies home"
            className="flex shrink-0 items-center"
            onClick={(event) => handleHashNavigation(event, "/#home")}
          >
            <img
              src="/logos/bezalel-logo-horizontal-dark.png"
              alt="Bezalel Technologies"
              className="h-8 w-auto dark:hidden"
            />
            <img
              src="/logos/bezalel-logo-horizontal-light.png"
              alt="Bezalel Technologies"
              className="hidden h-8 w-auto dark:block"
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
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

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              href="/projects/request"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-md border border-border bg-card p-2 text-foreground"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <motion.div
            className="absolute bottom-0 left-6 right-6 h-px origin-left bg-accent/70"
            style={{ scaleX }}
          />
        </div>
      </motion.header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/98 px-4 pb-8 pt-24 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-md flex-col gap-2" aria-label="Mobile navigation">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleHashNavigation(event, item.href)}
                className="rounded-lg border border-border bg-card px-4 py-4 text-lg font-semibold text-foreground"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/projects/request"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-4 text-base font-bold text-primary-foreground"
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
