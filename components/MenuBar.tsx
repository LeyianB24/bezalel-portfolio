"use client";

import { motion } from "framer-motion";
import MacOSWindowControls from "./MacOSWindowControls";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function MenuBar() {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 h-11 glass-panel border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Left: Window Controls */}
        <div className="flex items-center gap-4">
          <MacOSWindowControls
            onClose={() => console.log("Close")}
            onMinimize={() => console.log("Minimize")}
            onMaximize={() => console.log("Maximize")}
          />
          
          {/* App Title */}
          <Link href="/" className="flex items-center gap-2 ml-2">
            <span className="font-mono text-sm font-bold text-foreground">
              Bezalel<span className="text-macos-green">.tech</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "#home", label: "Home" },
            { href: "#about", label: "About" },
            { href: "#arsenal", label: "Arsenal" },
            { href: "#pricing", label: "Pricing" },
            { href: "#contact", label: "Contact" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-macos-green 
                         transition-colors duration-200 font-medium"
            >
              {link.label}
            </a>
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
