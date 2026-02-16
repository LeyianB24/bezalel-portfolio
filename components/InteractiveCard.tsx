"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function InteractiveCard({ title, description, icon, delay = 0 }: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-6 rounded-xl glass-card border border-border hover:border-macos-green/50 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-macos-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 bg-macos-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className="w-12 h-12 mb-4 text-macos-green flex items-center justify-center"
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-macos-green transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
          {description}
        </p>

        {/* Animated Corner Accent */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 bg-macos-green/10 blur-2xl rounded-full"
          animate={isHovered ? { scale: 1.5, opacity: 0.3 } : { scale: 1, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Bottom Border Animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-macos-green to-macos-yellow"
        initial={{ width: 0 }}
        animate={isHovered ? { width: "100%" } : { width: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
