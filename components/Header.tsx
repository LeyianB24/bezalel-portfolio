/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { Menu, X, ArrowRight, Hexagon, Command, Terminal, ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

// =====================
// DATA & UTILS
// =====================

const NAV_LINKS = [
  { name: "Services", href: "#services", label: "Capabilities" },
  { name: "Methodology", href: "#about", label: "Logic Core" },
  { name: "Arsenal", href: "#arsenal", label: "Tech Stack" },
  { name: "Pricing", href: "#pricing", label: "Investment" },
];

// Character set for the decryption effect
const CHARS = "-_~=\\/[]{}!@#$%^&*+?";

// =====================
// SUB-COMPONENT: DECRYPT TEXT
// =====================
const DecryptText = ({ text, active }: { text: string, active: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    if (active) {
      interval = setInterval(() => {
        setDisplayText(prev => 
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) return text[index];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3; 
      }, 30);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayText(text);
    }

    return () => clearInterval(interval);
  }, [active, text]);

  return <span className="font-mono">{displayText}</span>;
};

// =====================
// MAIN HEADER
// =====================

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // --- Scroll Progress (The "Loading Bar") ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- Intelligent Active Section Detection ---
  useEffect(() => {
    const handleScroll = () => {
      // 1. Detect Scroll Position for floating effect
      setIsScrolled(window.scrollY > 50);

      // 2. Detect Active Section
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = "";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Active if it occupies the middle of the screen
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = "#" + section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Body Lock for Mobile ---
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for floating header
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(href);
    }
  };

  return (
    <>
      {/* Floating Header Container */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div 
            className={`relative w-full transition-all duration-500 flex justify-between items-center ${
            isScrolled 
                ? "max-w-5xl mx-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/5 px-6 py-3" 
                : "max-w-7xl px-6 bg-transparent border-transparent py-2"
            }`}
        >
          
          {/* --- LEFT: BRAND --- */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group z-50 relative" 
            onClick={(e) => handleScrollToSection(e, "#home")}
          >
            <div className="relative flex items-center justify-center">
              <Hexagon 
                strokeWidth={1.5} 
                className={`transition-all duration-700 ease-in-out text-foreground group-hover:rotate-180 group-hover:text-emerald-600 ${isScrolled ? "w-8 h-8" : "w-10 h-10"}`} 
              />
              <div className="absolute w-1.5 h-1.5 bg-foreground rounded-full group-hover:scale-0 transition-transform duration-500" />
              <Terminal className="absolute w-4 h-4 text-emerald-600 scale-0 group-hover:scale-100 transition-transform duration-500" />
            </div>
            
            <div className="flex flex-col">
                <span className={`font-black tracking-tighter text-foreground transition-all duration-300 ${isScrolled ? "text-lg" : "text-xl"}`}>
                    BEZALEL
                </span>
                 <span className={`text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1 ${isScrolled ? "hidden" : "block"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                </span>
            </div>
          </Link>

          {/* --- CENTER: DECRYPTING NAV (Desktop) --- */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/30 rounded-full p-1.5 border border-border/40 backdrop-blur-sm">
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.href;
              const isHovered = hoveredPath === item.href;
              
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={(e) => handleScrollToSection(e, item.href)}
                  onMouseEnter={() => setHoveredPath(item.href)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={`relative px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-full z-10 ${
                    isActive ? "text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Active Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-foreground rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Hover Ghost Pill */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="nav-ghost"
                      className="absolute inset-0 bg-secondary rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <div className="flex flex-col items-center">
                    <span>
                         {/* If active or hovered, show the "Label" (Logic Core), else show Name (Methodology) for a cool switch effect? 
                             Or just use the Decrypt on the name. Let's do Decrypt on Name. */}
                         <DecryptText text={item.name} active={isHovered || isActive} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Command Trigger (Visual Only) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/50 bg-secondary/20 text-xs font-mono text-muted-foreground">
                <Command className="w-3 h-3" />
                <span>K</span>
            </div>

            <ThemeToggle />

            {/* CTA Button */}
            <Link 
              href="#contact" 
              onClick={(e) => handleScrollToSection(e, "#contact")}
              className="group relative px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg overflow-hidden shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <span className="relative z-10 flex items-center gap-2">
                Init Project <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-secondary transition-colors relative z-50 text-foreground"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* --- PROGRESS LINE (Attached to bottom of floating nav) --- */}
          <motion.div 
            className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-emerald-600 to-transparent opacity-50"
            style={{ scaleX }}
          />
        </div>
      </motion.nav>

      {/* =====================
          MOBILE SYSTEM MENU 
      ===================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl flex flex-col pt-32 pb-10 px-6 md:hidden overflow-y-auto"
          >
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="flex-1 flex flex-col justify-between relative z-10">
                <nav className="flex flex-col gap-6">
                    <div className="text-xs font-mono text-emerald-500 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> SYSTEM_NAVIGATION
                    </div>
                    {NAV_LINKS.map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link
                                href={item.href}
                                onClick={(e) => handleScrollToSection(e, item.href)}
                                className={`group flex items-center justify-between text-4xl font-black tracking-tighter py-4 border-b border-border/30 ${
                                    activeSection === item.href ? "text-foreground" : "text-muted-foreground"
                                }`}
                            >
                                <span className="group-hover:text-emerald-500 transition-colors">{item.name}</span>
                                <span className="text-xs font-mono font-normal text-muted-foreground group-hover:text-emerald-500">0{i+1}</span>
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <Link 
                        href="#contact"
                        onClick={(e) => handleScrollToSection(e, "#contact")}
                        className="flex items-center justify-center w-full py-5 bg-foreground text-background font-bold text-lg rounded-xl shadow-xl active:scale-95 transition-all"
                    >
                        Initialize Sequence <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    
                    <div className="mt-8 grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Status</div>
                            <div className="text-green-500 font-bold flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Operational
                            </div>
                         </div>
                         <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Latency</div>
                            <div className="text-cyan-500 font-bold">24ms</div>
                         </div>
                    </div>
                </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}