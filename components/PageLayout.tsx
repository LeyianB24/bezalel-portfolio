"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import Header from "./Header";
import UnifiedBackground from "./UnifiedBackground";
import Footer from "./Footer";
import CommandPalette from "./CommandPalette";
import CursorTrail from "./CursorTrail";

interface PageLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'vibrant' | 'cyber';
  showScrollProgress?: boolean;
  showScrollToTop?: boolean;
  showFooter?: boolean;
  showCommandPalette?: boolean;
  showCursorTrail?: boolean;
  showHeader?: boolean;
  className?: string;
  title?: string;
}

export default function PageLayout({
  children,
  variant = 'subtle',
  showScrollProgress = true,
  showScrollToTop = true,
  showFooter = true,
  showCommandPalette = true,
  showCursorTrail = true,
  showHeader = true,
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
      setShowTopBtn(window.scrollY > window.innerHeight);
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
            className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-[110] shadow-[0_0_15px_rgba(215,172,78,0.7)]"
            style={{ scaleX }}
        />
      )}

      {/* --- UNIFIED BACKGROUND SYSTEM --- */}
      <UnifiedBackground variant={variant} />

      {/* --- PREMIUM OPEN LAYOUT --- */}
      {showHeader && <Header />}
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 pt-20 min-h-screen"
      >
        {children}
        {showFooter && <Footer />}
      </motion.main>

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
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-50 p-4 rounded-full 
                       premium-card 
                       border border-accent/30 text-primary
                       shadow-lg hover:shadow-[0_0_24px_rgba(201,162,75,0.4)] 
                       hover:border-accent hover:bg-accent hover:text-accent-foreground
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
