"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FiCode, FiUsers, FiClock, FiTrendingUp } from "react-icons/fi";

interface Metric {
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
}

export default function MetricsDashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [counts, setCounts] = useState({ projects: 0, clients: 0, hours: 0, growth: 0 });

  const metrics: Metric[] = [
    {
      label: "Projects Delivered",
      value: 50,
      suffix: "+",
      icon: <FiCode className="w-full h-full" />,
      color: "hsl(var(--macos-green))",
    },
    {
      label: "Happy Clients",
      value: 30,
      suffix: "+",
      icon: <FiUsers className="w-full h-full" />,
      color: "hsl(var(--macos-yellow))",
    },
    {
      label: "Hours Coded",
      value: 10000,
      suffix: "+",
      icon: <FiClock className="w-full h-full" />,
      color: "hsl(var(--macos-green))",
    },
    {
      label: "Client Growth",
      value: 95,
      suffix: "%",
      icon: <FiTrendingUp className="w-full h-full" />,
      color: "hsl(var(--macos-yellow))",
    },
  ];

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        projects: Math.floor(metrics[0].value * progress),
        clients: Math.floor(metrics[1].value * progress),
        hours: Math.floor(metrics[2].value * progress),
        growth: Math.floor(metrics[3].value * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts({
          projects: metrics[0].value,
          clients: metrics[1].value,
          hours: metrics[2].value,
          growth: metrics[3].value,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView]);

  const getCount = (index: number) => {
    const values = [counts.projects, counts.clients, counts.hours, counts.growth];
    return values[index];
  };

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="glass-card p-6 rounded-xl border border-border hover:border-macos-green/50 transition-all duration-300 group"
        >
          {/* Icon */}
          <div
            className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: `${metric.color}20`, color: metric.color }}
          >
            {metric.icon}
          </div>

          {/* Value */}
          <div className="mb-2">
            <span className="text-4xl font-bold text-foreground font-mono">
              {getCount(index).toLocaleString()}
            </span>
            <span className="text-2xl font-bold text-muted-foreground">{metric.suffix}</span>
          </div>

          {/* Label */}
          <p className="text-sm text-muted-foreground">{metric.label}</p>

          {/* Progress Bar */}
          <motion.div
            className="mt-4 h-1 bg-background/50 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: metric.color }}
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : { width: 0 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
