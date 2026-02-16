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

      {/* --- 2. ENGINEERING GRID (The Blueprint Look) --- */}
      {/* Uses the bg-grid-pattern defined in tailwind.config.ts */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.08] bg-grid-pattern bg-grid-md mask-radial-faded"></div>

      {/* --- 3. NOISE TEXTURE (Cinematic Grain) --- */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* --- 4. COLD FUSION AMBIENT BACKGROUND --- */}
      {/* Swapped Purple/Indigo for Cyan/Blue/Zinc */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Center: The Core Light */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-macos-green/10 dark:bg-macos-green/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
        
        {/* Bottom Right: Deep Data Stream */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-amber-600/5 dark:bg-amber-800/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse-slow delay-700"></div>
        
        {/* Middle Left: Subtle Structural Highlight */}
        <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vh] bg-zinc-400/10 dark:bg-zinc-800/20 blur-[90px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
      </div>

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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full 
                       glass-card 
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