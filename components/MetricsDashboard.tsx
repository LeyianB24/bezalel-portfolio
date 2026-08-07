"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiCode, FiUsers, FiClock, FiTrendingUp } from "react-icons/fi";
import CountUp from "react-countup";
import { jellyPresets } from "@/lib/jelly-springs";

interface Metric {
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
}

export default function MetricsDashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics: Metric[] = [
    {
      label: "Projects Delivered",
      value: 50,
      suffix: "+",
      icon: <FiCode className="w-5 h-5" />,
      color: "#28C840", // Green
    },
    {
      label: "Happy Clients",
      value: 30,
      suffix: "+",
      icon: <FiUsers className="w-5 h-5" />,
      color: "#FFBD2E", // Yellow
    },
    {
      label: "Hours Coded",
      value: 12500,
      suffix: "+",
      icon: <FiClock className="w-5 h-5" />,
      color: "#28C840",
    },
    {
      label: "Client Growth",
      value: 98,
      suffix: "%",
      icon: <FiTrendingUp className="w-5 h-5" />,
      color: "#FFBD2E",
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ 
            delay: index * 0.1, 
            ...jellyPresets.bouncy 
          }}
          className="jelly-glass p-4 sm:p-6 border border-white/10 hover:border-accent/40 transition-colors group relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div 
            className="absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 transition-opacity group-hover:opacity-20"
            style={{ backgroundColor: metric.color }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 mb-4 sm:mb-6 rounded-xl flex items-center justify-center transition-all duration-500 bg-white/5 border border-white/10 group-hover:rotate-6 group-hover:scale-110 shadow-lg"
              style={{ color: metric.color }}
            >
              {metric.icon}
            </div>

            {/* Value */}
            <div className="mb-1 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-foreground font-mono tracking-tighter">
                {isInView ? (
                  <CountUp 
                    end={metric.value} 
                    duration={2.5} 
                    separator="," 
                    useEasing={true}
                  />
                ) : "0"}
              </span>
              <span className="text-lg sm:text-xl font-bold text-muted-foreground/50">{metric.suffix}</span>
            </div>

            {/* Label */}
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted-foreground/60 group-hover:text-foreground transition-colors">
              {metric.label}
            </p>

            {/* Premium Progress Bar */}
            <div className="mt-4 sm:mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: metric.color,
                  boxShadow: `0 0 10px ${metric.color}60`
                }}
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : { width: 0 }}
                transition={{ 
                  delay: index * 0.1 + 0.5, 
                  duration: 2, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              />
            </div>
          </div>
          
          {/* Glass Reflection Hook */}
          <div className="glass-reflection absolute inset-0 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}
