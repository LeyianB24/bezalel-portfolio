"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiChevronRight, 
  FiFolder, 
  FiFile, 
  FiCode,
  FiHash,
  FiSettings
} from "react-icons/fi";
import { SiReact, SiTypescript } from "react-icons/si";
import { jellyPresets } from "@/lib/jelly-springs";

interface FileItem {
  name: string;
  type: "file" | "folder";
  icon?: React.ReactNode;
  children?: FileItem[];
  id: string;
}

const PROJECT_TREE: FileItem[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "components",
        name: "components",
        type: "folder",
        children: [
          { id: "hero", name: "Hero.tsx", type: "file", icon: <SiReact className="text-[#61DAFB]" /> },
          { id: "sidebar", name: "Sidebar.tsx", type: "file", icon: <SiReact className="text-[#61DAFB]" /> },
          { id: "globe", name: "TechGlobe.tsx", type: "file", icon: <SiReact className="text-[#61DAFB]" /> },
        ]
      },
      {
        id: "lib",
        name: "lib",
        type: "folder",
        children: [
          { id: "physics", name: "jelly-physics.ts", type: "file", icon: <SiTypescript className="text-[#3178C6]" /> },
          { id: "utils", name: "utils.ts", type: "file", icon: <SiTypescript className="text-[#3178C6]" /> },
        ]
      },
      { id: "globals", name: "globals.css", type: "file", icon: <FiHash className="text-accent" /> },
    ]
  },
  { id: "pkg", name: "package.json", type: "file", icon: <FiCode className="text-accent-light" /> },
  { id: "config", name: "next.config.js", type: "file", icon: <FiSettings className="text-muted-foreground" /> },
];

export default function ProjectExplorer() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["src", "components"]));

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  return (
    <div className="flex flex-col h-full w-full font-mono select-none py-2">
      <div className="text-[10px] font-bold text-muted-foreground/40 px-4 py-2 uppercase tracking-tighter">
        Project Explorer
      </div>
      <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide px-2">
        {PROJECT_TREE.map(item => (
          <FileEntry 
            key={item.id} 
            item={item} 
            level={0} 
            expanded={expanded} 
            onToggle={toggleExpand} 
          />
        ))}
      </div>
    </div>
  );
}

function FileEntry({ 
  item, 
  level, 
  expanded, 
  onToggle 
}: { 
  item: FileItem; 
  level: number; 
  expanded: Set<string>; 
  onToggle: (id: string) => void;
}) {
  const isExpanded = expanded.has(item.id);
  const isFolder = item.type === "folder";

  return (
    <div className="mb-[1px]">
      <motion.div
        whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
        whileTap={{ scale: 0.98 }}
        transition={jellyPresets.snap}
        onClick={() => isFolder && onToggle(item.id)}
        className={`flex items-center gap-2 py-1.5 px-3 rounded-lg cursor-pointer transition-colors group
          ${isFolder ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        style={{ paddingLeft: `${(level * 16) + 12}px` }}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {isFolder ? (
            <motion.span
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <FiChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-foreground/60" />
            </motion.span>
          ) : null}
        </div>
        
        <span className="text-sm transition-transform group-hover:scale-110">
          {item.icon ? item.icon : isFolder ? <FiFolder className="text-accent-light fill-accent-light/20" /> : <FiFile className="text-muted-foreground/60" />}
        </span>

        <span className="text-[11px] truncate tracking-tight">{item.name}</span>
        
        {!isFolder && (
           <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_5px_rgba(215,172,78,0.5)]" />
        )}
      </motion.div>

      <AnimatePresence>
        {isFolder && isExpanded && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={jellyPresets.wave}
            className="overflow-hidden"
          >
            {item.children.map(child => (
              <FileEntry 
                key={child.id} 
                item={child} 
                level={level + 1} 
                expanded={expanded} 
                onToggle={onToggle} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
