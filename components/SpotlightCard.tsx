"use client";

import { motion } from "framer-motion";
import { useState, MouseEvent } from "react";

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
      className={`relative overflow-hidden ${className}`}
      style={{
        background: isHovered
          ? `radial-gradient(
              600px circle at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(40, 200, 64, 0.15),
              transparent 40%
            )`
          : "transparent",
      }}
    >
      {/* Spotlight glow effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            400px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(40, 200, 64, 0.1),
            transparent 40%
          )`,
        }}
      />

      {/* Border glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            300px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(40, 200, 64, 0.4),
            transparent 40%
          )`,
          maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
