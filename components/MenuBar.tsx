"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import MacOSWindowControls from "./MacOSWindowControls";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { jellyPresets } from "@/lib/jelly-springs";
import { FiChevronDown } from "react-icons/fi";

// Navigation structure
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

// Home page sections (only show on home page)
const homeSections = [
  { href: "#about", label: "About" },
  { href: "#arsenal", label: "Arsenal" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export default function MenuBar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <motion.div
      initial={{ y: -50, opacity: 0, scaleY: 0.8 }}
      animate={{ y: 0, opacity: 1, scaleY: 1 }}
      transition={jellyPresets.soft}
      className="fixed top-0 left-0 right-0 z-50 h-11 jelly-glass border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Left: Window Controls */}
        <div className="flex items-center gap-4">
          <MacOSWindowControls
            onClose={() => console.log("Close")}
            onMinimize={() => console.log("Minimize")}
            onMaximize={() => console.log("Maximize")}
          />
          
          {/* App Title with jelly hover */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={jellyPresets.bouncy}
          >
            <Link href="/" className="flex items-center gap-2 ml-2">
              <span className="font-mono text-sm font-bold text-foreground">
                Bezalel<span className="text-macos-green">.tech</span>
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Center: Navigation with dropdowns */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Home page sections (only on home) */}
          {isHomePage && homeSections.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-macos-green 
                         transition-colors duration-200 font-medium"
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={jellyPresets.snap}
            >
              {link.label}
            </motion.a>
          ))}

          {/* Dropdown menus (always visible) */}
          {navigation.map((item) => (
            <DropdownMenu key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        {/* Right: Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  );
}

// Dropdown Menu Component
function DropdownMenu({ item, pathname }: { item: typeof navigation[0], pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = item.children?.some(child => pathname.startsWith(child.href));

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        className={`text-sm font-medium flex items-center gap-1 transition-colors duration-200 ${
          isActive ? 'text-macos-green' : 'text-muted-foreground hover:text-macos-green'
        }`}
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.95 }}
        transition={jellyPresets.snap}
      >
        {item.label}
        <FiChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
            transition={jellyPresets.bubble}
            className="absolute top-full left-0 mt-2 min-w-[180px] jelly-glass border border-border/50 rounded-[14px] overflow-hidden shadow-lg"
          >
            {item.children?.map((child, index) => (
              <motion.div
                key={child.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={child.href}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    pathname === child.href 
                      ? 'text-macos-green bg-macos-green/10' 
                      : 'text-muted-foreground hover:text-macos-green hover:bg-accent/50'
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
