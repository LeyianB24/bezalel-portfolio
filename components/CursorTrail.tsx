"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) return;

    let idCounter = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: idCounter++,
      };

      setTrail((prev) => [...prev.slice(-12), newPoint]); // Longer trail
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isEnabled]);

  // Auto-cleanup old trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const colors = [
    "hsl(var(--accent))",
    "hsl(var(--accent-light))",
    "hsla(var(--accent), 0.6)",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }} // Jelly-like expansion
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.175, 0.885, 0.32, 1.275] // Elastic/Jelly ease
            }}
            className="absolute w-2.5 h-2.5 rounded-full blur-[2px]"
            style={{
              left: point.x - 5,
              top: point.y - 5,
              backgroundColor: colors[index % colors.length],
              boxShadow: `0 0 15px ${colors[index % colors.length]}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
