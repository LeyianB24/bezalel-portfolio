"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import MacOSWindowControls from "./MacOSWindowControls";
import IDESidebar from "./IDESidebar";
import ThemeToggle from "./ThemeToggle";
import { jellyPresets } from "@/lib/jelly-springs";

// Navigation structure (Ported from MenuBar)
const navigation = [
  { 
    label: "Services", 
    children: [
      { href: "/services/api", label: "API Integration" },
      { href: "/services/mobile", label: "Mobile Apps" },
      { href: "/services/web-systems", label: "Web Systems" }
    ]
  },
  {
    label: "Studio",
    children: [
      { href: "/studio/logic", label: "The Logic" },
      { href: "/studio/process", label: "The Process" },
      { href: "/studio/careers", label: "Careers" }
    ]
  },
  {
    label: "Legal",
    children: [
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/terms", label: "Terms of Service" }
    ]
  }
];

const homeSections = [
  { href: "#about", label: "About" },
  { href: "#arsenal", label: "Arsenal" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

interface IDEWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export default function IDEWrapper({ 
  children, 
  title = "bezalel-v2 — visual-studio-code" 
}: IDEWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={jellyPresets.soft}
        className="w-full max-w-7xl h-[85vh] flex flex-col overflow-hidden jelly-glass-dark relative border border-white/10 shadow-2xl"
      >
        {/* Title Bar (Combined MenuBar + IDE Header) */}
        <header className="h-10 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center px-4 justify-between z-50">
          <div className="flex items-center gap-6">
            <MacOSWindowControls />
            
            <nav className="hidden lg:flex items-center gap-4">
              {/* Home sections */}
              {isHomePage && homeSections.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-mono text-muted-foreground hover:text-accent uppercase tracking-wider transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Dynamic Dropdowns */}
              {navigation.map((item) => (
                <NavDropdown key={item.label} item={item} pathname={pathname} />
              ))}
            </nav>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground/60 truncate max-w-[150px] md:max-w-none uppercase tracking-[0.2em]">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-4">
             <ThemeToggle />
             <div className="hidden sm:flex px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-[9px] font-mono text-accent uppercase tracking-tighter">
                v2.0L
             </div>
          </div>
        </header>

        <div className="flex-grow flex overflow-hidden">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 bg-black/20 border-r border-white/5 backdrop-blur-sm">
            <IDESidebar />
          </aside>

          {/* Main Workspace Area */}
          <main className="flex-grow relative overflow-y-auto overflow-x-hidden bg-background/30 backdrop-blur-[2px]">
            {children}
          </main>
        </div>

        {/* Status Bar */}
        <footer className="h-6 bg-accent/10 border-t border-accent/20 flex items-center justify-between px-3 text-[10px] font-mono text-accent/80 z-20">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 px-2 py-1 transition-colors">
                <span className="text-sm">⑂</span> main*
             </div>
             <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full border border-rose-500/50" /> 0</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full border border-amber-500/50" /> 0</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="hidden sm:inline">Spaces: 2</span>
             <span className="hidden sm:inline">UTF-8</span>
             <div className="flex items-center gap-1.5 px-2 bg-accent/20 text-accent font-bold">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                STABLE
             </div>
          </div>
        </footer>

        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </motion.div>

      {/* Background Blobs for depth */}
      <div className="absolute -z-10 w-[500px] h-[500px] bg-accent/5 blur-[150px] jelly-blob animate-pulse-slow" />
    </div>
  );
}

function NavDropdown({ item, pathname }: { item: typeof navigation[0], pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = item.children?.some(child => pathname.startsWith(child.href));

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        className={`text-[11px] font-mono flex items-center gap-1 transition-colors duration-200 uppercase tracking-wider ${
          isActive ? 'text-accent' : 'text-muted-foreground hover:text-accent'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={jellyPresets.snap}
      >
        {item.label}
        <FiChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={jellyPresets.bubble}
            className="absolute top-full left-0 mt-1 min-w-[160px] jelly-glass border border-white/10 rounded-[8px] overflow-hidden shadow-2xl z-[100]"
          >
            {item.children?.map((child, index) => (
              <motion.div
                key={child.href}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={child.href}
                  className={`block px-3 py-1.5 text-[10px] font-mono transition-colors ${
                    pathname === child.href 
                      ? 'text-accent bg-accent/10' 
                      : 'text-muted-foreground hover:text-accent hover:bg-white/5'
                  }`}
                >
                  {child.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
