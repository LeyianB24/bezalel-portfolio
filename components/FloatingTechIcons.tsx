"use client";

import { motion } from "framer-motion";

export default function FloatingTechIcons() {
  const icons = [
    { id: 1, x: "10%", y: "20%", delay: 0, symbol: "{ }" },
    { id: 2, x: "80%", y: "15%", delay: 0.5, symbol: "</>" },
    { id: 3, x: "15%", y: "70%", delay: 1, symbol: "λ" },
    { id: 4, x: "85%", y: "75%", delay: 1.5, symbol: "∞" },
    { id: 5, x: "50%", y: "40%", delay: 2, symbol: "⚡" },
    { id: 6, x: "30%", y: "50%", delay: 2.5, symbol: "◆" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute text-4xl font-mono text-macos-green opacity-10"
          style={{ left: icon.x, top: icon.y }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8,
            delay: icon.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon.symbol}
        </motion.div>
      ))}
    </div>
  );
}
