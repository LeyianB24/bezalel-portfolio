"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiHome, FiUser, FiCode, FiDollarSign, FiMail, FiCommand } from "react-icons/fi";
import { jellyPresets } from "@/lib/jelly-springs";

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    
    if (!isOpen) return;

    if (e.key === "Escape") {
      setIsOpen(false);
      setSearch("");
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            transition={jellyPresets.bubble}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
          >
            <div className="jelly-glass border border-macos-green/30 shadow-2xl overflow-hidden glass-reflection">
              <div className="flex items-center gap-3 p-4 border-b border-white/10 group">
                <FiSearch className="text-macos-green text-xl group-focus-within:scale-110 transition-transform" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 font-mono text-lg"
                />
                <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/60">
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 flex items-center gap-1">
                    <FiCommand className="w-2.5 h-2.5" /> K
                  </kbd>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
                {filteredCommands.length > 0 ? (
                  <div className="space-y-1">
                    {filteredCommands.map((cmd, index) => (
                      <motion.button
                        key={cmd.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                          selectedIndex === index 
                            ? "bg-macos-green/15 border border-macos-green/30 translate-x-1" 
                            : "bg-transparent border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 ${
                            selectedIndex === index 
                              ? "bg-macos-green text-white rotate-3 scale-110 shadow-[0_0_15px_rgba(40,200,64,0.5)]" 
                              : "bg-white/5 text-muted-foreground"
                          }`}>
                            {cmd.icon}
                          </div>
                          <div className="flex flex-col items-start">
                             <span className={`text-sm font-medium transition-colors ${
                               selectedIndex === index ? "text-macos-green" : "text-foreground"
                             }`}>
                               {cmd.name}
                             </span>
                             <span className="text-[10px] text-muted-foreground/60 font-mono">
                               {cmd.keywords.slice(0, 3).join(", ")}
                             </span>
                          </div>
                        </div>
                        
                        {selectedIndex === index && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="text-[10px] font-mono text-macos-green/80 flex items-center gap-1 relative z-10"
                          >
                             <span>Enter</span>
                             <span className="text-sm">↩</span>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl opacity-20">
                       <FiSearch />
                    </div>
                    <span className="text-sm font-mono opacity-60 italic">No matching commands found.</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 border-t border-white/5 text-[10px] font-mono text-muted-foreground/60">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 italic">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">ESC</kbd>
                    <span>Close</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-macos-green rounded-full animate-pulse" />
                  <span>Bezalel OS 2.0.4</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
