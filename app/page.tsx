"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

// Components
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechArsenal from "@/components/TechArsenal";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import CursorTrail from "@/components/CursorTrail";
import UnifiedBackground from "@/components/UnifiedBackground";
import PageTransition from "@/components/PageTransition";

const jellyPresets = {
  bouncy: { type: "spring" as const, stiffness: 400, damping: 10 }
};

export default function Home() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative transition-colors duration-500 font-sans overflow-x-hidden">
      {/* --- 2. UNIFIED BACKGROUND SYSTEM --- */}
      <UnifiedBackground variant="default" />

      {/* --- 5. PAGE CONTENT --- */}
      <PageTransition>
        <div className="relative z-10 flex flex-col">
          <Header />
          
          <main className="flex-grow">
            <section id="home"><Hero /></section>
            <section id="about"><About /></section>
            <section id="arsenal"><TechArsenal /></section>
            <section id="pricing"><Pricing /></section>
            <section id="contact"><Contact /></section>
          </main>
          
          <Footer />
        </div>
      </PageTransition>

      {/* --- INTERACTIVE FEATURES --- */}
      <CommandPalette />
      <CursorTrail />

      {/* --- 6. HOLOGRAPHIC SCROLL-TO-TOP BUTTON --- */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scaleX: 1.2, scaleY: 0.8 }}
            transition={jellyPresets.bouncy}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full 
                       jelly-glass 
                       border border-primary/20 text-primary
                       shadow-lg hover:shadow-[0_0_20px_hsl(var(--macos-green)/0.4)] 
                       hover:border-primary hover:bg-primary hover:text-primary-foreground
                       transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <FiArrowUp className="text-xl group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}