"use client";

import { motion } from "framer-motion";

export default function AnimatedCircuitBoard() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06]">
      <svg
        className="h-full w-full"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          d="M100 100 L200 100 L200 200 L300 200"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent"
          initial={{ pathLength: 0.6, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M400 150 L500 150 L500 250 L600 250"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent-light"
          initial={{ pathLength: 0.5, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 7, delay: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M150 400 L250 400 L250 500 L350 500"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-muted-steel"
          initial={{ pathLength: 0.4, opacity: 0.3 }}
          animate={{ pathLength: 0.9, opacity: 0.5 }}
          transition={{ duration: 8, delay: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        
        <circle cx="200" cy="200" r="3" fill="currentColor" className="text-accent" />
        <circle cx="500" cy="250" r="3" fill="currentColor" className="text-accent-light" />
        <circle cx="250" cy="500" r="3" fill="currentColor" className="text-muted-steel" />
      </svg>
    </div>
  );
}

