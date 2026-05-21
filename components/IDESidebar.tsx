"use client";

import { motion } from "framer-motion";
import { 
  FiCpu, 
  FiTerminal, 
  FiSettings,
  FiLayout
} from "react-icons/fi";
import ProjectExplorer from "./ProjectExplorer";

export default function IDESidebar() {
  return (
    <div className="flex flex-col h-full w-full font-mono select-none">
      {/* Search / Top section */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
          Explorer
        </span>
        <div className="flex items-center gap-1.5 opacity-50">
          <FiLayout className="w-3 h-3 hover:text-macos-green transition-colors cursor-pointer" />
        </div>
      </div>

      {/* File Tree / Project Explorer */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden py-2 scrollbar-hide">
         <ProjectExplorer />

        <div className="px-4 mt-8">
           <div className="text-[10px] font-bold text-muted-foreground/30 px-2 py-1 mb-2 uppercase tracking-tight">
            Active Processes
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] text-macos-green/80 bg-macos-green/5 rounded-lg border border-macos-green/10 mb-2 group cursor-pointer hover:bg-macos-green/10 transition-colors">
             <span className="w-1.5 h-1.5 bg-macos-green rounded-full animate-pulse shadow-[0_0_5px_rgba(40,200,64,0.5)]" />
             <span className="font-mono">next-dev --turbo</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] text-macos-yellow/80 bg-macos-yellow/5 rounded-lg border border-macos-yellow/10 group cursor-pointer hover:bg-macos-yellow/10 transition-colors">
             <span className="w-1.5 h-1.5 bg-macos-yellow rounded-full animate-pulse shadow-[0_0_5px_rgba(255,189,46,0.5)]" />
             <span className="font-mono">tailwind-analyzer</span>
           </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto p-4 flex items-center justify-around border-t border-white/5">
        <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
          <FiTerminal className="w-4 h-4 text-muted-foreground hover:text-macos-green transition-colors cursor-pointer" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.2, rotate: -5 }} whileTap={{ scale: 0.9 }}>
          <FiCpu className="w-4 h-4 text-muted-foreground hover:text-macos-yellow transition-colors cursor-pointer" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
          <FiSettings className="w-4 h-4 text-muted-foreground hover:text-macos-red transition-colors cursor-pointer" />
        </motion.div>
      </div>
    </div>
  );
}
