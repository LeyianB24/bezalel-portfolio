"use client";

import { motion } from "framer-motion";
import { jellyPresets } from "@/lib/jelly-springs";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom smooth ease
        ...jellyPresets.wave
      }}
      className="w-full"
    >
      {/* Morphing Background Overlay during transition */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 bg-background z-[200] pointer-events-none"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
        }}
      />
      
      {children}
    </motion.div>
  );
}
