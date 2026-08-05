"use client";

import { motion } from "framer-motion";
import { useState, MouseEvent } from "react";
import { jellyPresets } from "@/lib/jelly-springs";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98, scaleX: 1.02, scaleY: 0.96 }}
      transition={jellyPresets.bouncy}
      className={`relative overflow-hidden jelly-glass glass-reflection group ${className}`}
    >
      {/* Spotlight glow effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            600px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(215, 172, 78, 0.15),
            transparent 40%
          )`,
        }}
      />

      {/* Border glow - macOS themed */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            300px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(215, 172, 78, 0.4),
            rgba(255, 189, 46, 0.2),
            transparent 40%
          )`,
          maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Content */}
      <div className="relative z-30">{children}</div>
      
      {/* Subtle bottom shine */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
