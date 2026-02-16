"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Exact size placeholder to prevent layout shift (CLS)
    return <div className="w-10 h-10 rounded-full border border-transparent" />;
  }

  // Determine actual theme (handling 'system' preference)
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative group flex items-center justify-center w-10 h-10 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] transition-colors duration-500 overflow-hidden"
      aria-label="Toggle Theme"
    >
      {/* --- BACKGROUND GLOW --- */}
      {/* This creates the "atmosphere" effect. 
         Amber glow for Sun, Indigo glow for Moon.
      */}
      <div className={`absolute inset-0 transition-opacity duration-500 blur-xl opacity-0 group-hover:opacity-40 ${
        isDark ? "bg-emerald-500" : "bg-amber-400"
      }`} />

      {/* --- ICONS --- */}
      {/* We use a relative container to stack them perfectly */}
      <div className="relative w-5 h-5">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ y: -20, rotate: -45, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={{ y: 20, rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon size={20} className="text-emerald-400 fill-emerald-400/20" strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: 20, rotate: 45, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={{ y: -20, rotate: -45, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun size={20} className="text-amber-500 fill-amber-500/20" strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- BORDER HIGHLIGHT --- */}
      {/* A subtle ring that shines when the theme is active */}
      <div className={`absolute inset-0 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        isDark ? "border-emerald-500/30" : "border-amber-500/30"
      }`} />

    </motion.button>
  );
}