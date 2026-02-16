"use client";

import { motion } from "framer-motion";

export default function AnimatedCircuitBoard() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated Circuit Lines */}
        <motion.path
          d="M100 100 L200 100 L200 200 L300 200"
          stroke="hsl(var(--macos-green))"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        <motion.path
          d="M400 150 L500 150 L500 250 L600 250"
          stroke="hsl(var(--macos-green))"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
        />
        <motion.path
          d="M150 400 L250 400 L250 500 L350 500"
          stroke="hsl(var(--macos-yellow))"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 1 }}
        />
        
        {/* Animated Circuit Nodes */}
        <motion.circle
          cx="200"
          cy="200"
          r="4"
          fill="hsl(var(--macos-green))"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
          transition={{ duration: 1, delay: 2, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.circle
          cx="500"
          cy="250"
          r="4"
          fill="hsl(var(--macos-green))"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
          transition={{ duration: 1, delay: 2.5, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.circle
          cx="250"
          cy="500"
          r="4"
          fill="hsl(var(--macos-yellow))"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
          transition={{ duration: 1, delay: 3, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* Pulsing Rings */}
        <motion.circle
          cx="200"
          cy="200"
          r="20"
          stroke="hsl(var(--macos-green))"
          strokeWidth="1"
          fill="none"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.circle
          cx="500"
          cy="250"
          r="20"
          stroke="hsl(var(--macos-green))"
          strokeWidth="1"
          fill="none"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 2, delay: 2.5, repeat: Infinity, repeatDelay: 2 }}
        />
      </svg>
    </div>
  );
}
