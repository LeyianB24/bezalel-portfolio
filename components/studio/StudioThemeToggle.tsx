"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

interface StudioThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function StudioThemeToggle({
  className,
  showLabel = false,
}: StudioThemeToggleProps) {
  const { setTheme, theme, systemTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-9 items-center justify-center rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-muted-foreground",
          className
        )}
      >
        <div className="h-4 w-4 rounded-full bg-muted/40 animate-pulse" />
        {showLabel && <span className="ml-2 text-xs font-mono">THEME</span>}
      </div>
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={toggleTheme}
      className={cn(
        "group relative flex items-center justify-center gap-2 rounded-lg border border-border bg-card/80 px-2.5 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md shadow-2xs transition-all hover:border-accent/40 hover:bg-secondary/80 focus:outline-none focus:ring-1 focus:ring-accent",
        className
      )}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative flex h-4 w-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ y: -10, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 10, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center text-accent-dark dark:text-accent-light"
            >
              <Moon size={15} className="fill-accent/20" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: 10, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center text-amber-600 dark:text-accent-light"
            >
              <Sun size={15} className="fill-amber-500/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-muted-foreground group-hover:text-foreground">
          {isDark ? "Dark Ops" : "Light Mode"}
        </span>
      )}
    </motion.button>
  );
}
