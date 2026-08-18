"use client";

import { motion } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-md ${className}`}
    >
      {children}
    </motion.div>
  );
}

