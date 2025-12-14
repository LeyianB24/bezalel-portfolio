"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX, FiArrowRight, FiMessageSquare } from "react-icons/fi";

// 1. Added "Contact" to navigation links
const navLinks = [
  { name: "Services", href: "#services" },
  { name: "Arsenal", href: "#arsenal" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" }, 
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  // Smooth scroll handler for anchor links
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? "py-3 bg-[#02040a]/80 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]" 
            : "py-6 bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
          
          {/* --- BRAND --- */}
          <Link href="/" className="flex items-center gap-3 group z-50 relative">
            <div className={`relative transition-all duration-500 bg-white/5 rounded-lg border border-white/10 overflow-hidden ${isScrolled ? "w-10 h-10 p-1" : "w-12 h-12 p-1.5"}`}>
               {/* Logo Image */}
              <Image 
                src="/logo.png" 
                alt="Bezalel Logo" 
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            
            <div className="leading-tight">
              <span className="block text-xl font-black tracking-tighter text-white">BEZALEL</span>
              <span className={`block font-mono tracking-[0.2em] uppercase transition-colors duration-300 ${isScrolled ? "text-[0px] h-0 opacity-0" : "text-[10px] text-purple-500 h-auto opacity-100"}`}>
                Technologies
              </span>
            </div>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-sm">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={(e) => handleScrollToSection(e, item.href)}
                  className="relative px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* CTA Button - Scrolls to Footer/Contact */}
            <Link 
              href="#contact" 
              onClick={(e) => handleScrollToSection(e, "#contact")}
              className="group relative px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
              <span className="relative z-10 flex items-center gap-2">
                Start Project 
                <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors relative"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <FiX />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <FiMenu />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#02040a]/95 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
          >
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>

            <div className="flex flex-col gap-8 text-center relative z-10 w-full px-6">
              {navLinks.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleScrollToSection(e, item.href)}
                    className="block text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-600 hover:to-purple-500 transition-all active:scale-95"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 w-full"
              >
                <Link 
                  href="#contact"
                  onClick={(e) => handleScrollToSection(e, "#contact")}
                  className="flex items-center justify-center gap-3 w-full py-5 bg-purple-600 text-white font-bold rounded-xl text-xl shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:bg-purple-700 transition-colors"
                >
                  <FiMessageSquare /> Let's Talk
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}