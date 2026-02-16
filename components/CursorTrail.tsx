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

      setTrail((prev) => [...prev.slice(-8), newPoint]);
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
    "hsl(var(--macos-green))",
    "hsl(var(--macos-yellow))",
    "hsl(var(--macos-red))",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: point.x,
              top: point.y,
              backgroundColor: colors[index % colors.length],
              boxShadow: `0 0 10px ${colors[index % colors.length]}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
