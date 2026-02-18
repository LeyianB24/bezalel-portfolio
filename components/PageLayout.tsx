"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import MenuBar from "./MenuBar";
import UnifiedBackground from "./UnifiedBackground";
import Footer from "./Footer";
import CommandPalette from "./CommandPalette";
import CursorTrail from "./CursorTrail";
import { jellyPresets } from "@/lib/jelly-springs";

interface PageLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'vibrant' | 'cyber';
  showScrollProgress?: boolean;
  showScrollToTop?: boolean;
  showFooter?: boolean;
  showCommandPalette?: boolean;
  showCursorTrail?: boolean;
  className?: string;
}

export default function PageLayout({
  children,
  variant = 'default',
  showScrollProgress = true,
  showScrollToTop = true,
  showFooter = true,
  showCommandPalette = true,
  showCursorTrail = true,
  className = '',
}: PageLayoutProps) {
  
  // --- Scroll Progress Bar Logic ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- Scroll-to-Top Logic ---
  const [showTopBtn, setShowTopBtn] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
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
    <div className={`min-h-screen bg-background text-foreground relative transition-colors duration-500 font-sans overflow-x-hidden ${className}`}>
      
      {/* --- SCROLL PROGRESS BAR --- */}
      {showScrollProgress && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-[100] shadow-[0_0_15px_hsl(var(--macos-green)/0.7)]"
          style={{ scaleX }}
        />
      )}

      {/* --- UNIFIED BACKGROUND SYSTEM --- */}
      <UnifiedBackground variant={variant} />

      {/* --- PAGE CONTENT --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col min-h-screen"
      >
        <MenuBar />
        
        <main className="flex-grow">
          {children}
        </main>

        {showFooter && <Footer />}
      </motion.div>

      {/* --- INTERACTIVE FEATURES --- */}
      {showCommandPalette && <CommandPalette />}
      {showCursorTrail && <CursorTrail />}

      {/* --- SCROLL-TO-TOP BUTTON --- */}
      {showScrollToTop && (
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
      )}

    </div>
  );
}
