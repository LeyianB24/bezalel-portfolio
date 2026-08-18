"use client";

import { motion } from "framer-motion";

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function InteractiveCard({
  title,
  description,
  icon,
  delay = 0,
  className = "",
}: InteractiveCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className={`group rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-md ${className}`}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors group-hover:bg-primary/90">
        {icon}
      </div>

      <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-accent-dark dark:group-hover:text-accent-light">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
}

