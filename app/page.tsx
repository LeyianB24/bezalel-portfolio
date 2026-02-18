"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

// Components
import MenuBar from "@/components/MenuBar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechArsenal from "@/components/TechArsenal";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import CursorTrail from "@/components/CursorTrail";
import UnifiedBackground from "@/components/UnifiedBackground";
import { jellyPresets } from "@/lib/jelly-springs";

export default function Home() {
  // --- 1. Scroll Progress Bar Logic ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- 2. Scroll-to-Top Logic ---
  const [showTopBtn, setShowTopBtn] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 1 screen height
      if (window.scrollY > window.innerHeight) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Removed hardcoded selection colors (Globals.css handles the Cyan selection now)
    <div className="min-h-screen bg-background text-foreground relative transition-colors duration-500 font-sans overflow-x-hidden">
      
      {/* --- 1. GLOBAL SCROLL LASER (macOS Green Glow) --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-[100] shadow-[0_0_15px_hsl(var(--macos-green)/0.7)]"
        style={{ scaleX }}
      />

      {/* --- 2. UNIFIED BACKGROUND SYSTEM --- */}
      <UnifiedBackground variant="default" />

      {/* --- 5. PAGE CONTENT --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col"
      >
        <MenuBar />
        
        <main className="flex-grow">
          <section id="home"><Hero /></section>
          <section id="about"><About /></section>
          <section id="arsenal"><TechArsenal /></section>
          <section id="pricing"><Pricing /></section>
          <section id="contact"><Contact /></section>
        </main>
        
        <Footer />
      </motion.div>

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
            {/* Swapping arrow for a more technical looking up-arrow or keeping sleek arrow */}
            <FiArrowUp className="text-xl group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}