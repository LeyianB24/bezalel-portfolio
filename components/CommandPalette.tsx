"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiHome, FiUser, FiCode, FiDollarSign, FiMail, FiCommand } from "react-icons/fi";

interface Command {
  id: string;
  name: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const commands: Command[] = [
    {
      id: "home",
      name: "Go to Home",
      icon: <FiHome />,
      action: () => scrollToSection("home"),
      keywords: ["home", "hero", "top"],
    },
    {
      id: "about",
      name: "Go to About",
      icon: <FiUser />,
      action: () => scrollToSection("about"),
      keywords: ["about", "methodology", "process"],
    },
    {
      id: "arsenal",
      name: "Go to Tech Arsenal",
      icon: <FiCode />,
      action: () => scrollToSection("arsenal"),
      keywords: ["tech", "arsenal", "stack", "technologies"],
    },
    {
      id: "pricing",
      name: "Go to Pricing",
      icon: <FiDollarSign />,
      action: () => scrollToSection("pricing"),
      keywords: ["pricing", "plans", "cost"],
    },
    {
      id: "contact",
      name: "Go to Contact",
      icon: <FiMail />,
      action: () => scrollToSection("contact"),
      keywords: ["contact", "email", "message"],
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
      setSearch("");
    }
  };

  const filteredCommands = commands.filter((cmd) =>
    cmd.keywords.some((keyword) => keyword.toLowerCase().includes(search.toLowerCase())) ||
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearch("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
          >
            <div className="glass-ultra rounded-2xl border border-macos-green/20 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border/50">
                <FiSearch className="text-macos-green text-xl" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands..."
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-mono"
                />
                <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                  <kbd className="px-2 py-1 bg-background/50 rounded border border-border">
                    <FiCommand className="inline w-3 h-3" />K
                  </kbd>
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, index) => (
                    <motion.button
                      key={cmd.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={cmd.action}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-macos-green/10 hover:border-macos-green/30 border border-transparent transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-background/50 text-macos-green group-hover:bg-macos-green group-hover:text-white transition-all">
                        {cmd.icon}
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-macos-green transition-colors">
                        {cmd.name}
                      </span>
                    </motion.button>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No commands found
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-3 border-t border-border/50 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-background/50 rounded border border-border">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-background/50 rounded border border-border">ESC</kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
