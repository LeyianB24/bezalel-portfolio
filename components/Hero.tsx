/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { FiArrowRight, FiCpu, FiTerminal } from "react-icons/fi";
import AnimatedCircuitBoard from "./AnimatedCircuitBoard";
import FloatingTechIcons from "./FloatingTechIcons";
import { jellyPresets } from "@/lib/jelly-springs";

export default function Hero() {
  // --- 1. Spotlight Logic (High Performance) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // --- 2. Jelly Animations Configuration ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  // Jelly drop entrance for each item
  const itemVariants = {
    hidden: { y: 40, opacity: 0, scaleY: 0.6, scaleX: 1.15 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scaleY: 1,
      scaleX: 1,
      transition: jellyPresets.soft
    },
  };

  return (
    <section 
      className="relative flex flex-col items-center justify-center text-center px-4 h-screen min-h-[800px] overflow-hidden section-hero-bg group selection:bg-[#C9A24B]/30"
      onMouseMove={handleMouseMove}
    >
      
      {/* --- LAYER 0: HOLOGRAPHIC PROJECTION --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 mix-blend-screen opacity-30 dark:opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_92%)]"></div>
        <AnimatedCircuitBoard />
        <FloatingTechIcons />
      </div>
      
      {/* --- LAYER 1: ENGINEERING GRID (Blueprint) --- */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none">
      </div>

      {/* --- LAYER 2: GOLD SPOTLIGHT --- */}
      <motion.div
        className="absolute inset-0 z-10 bg-[linear-gradient(to_right,hsl(var(--accent)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--accent)/0.2)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
        }}
      />

      {/* --- LAYER 3: JELLY BLOB ORBS (Breathing) --- */}
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-[rgba(11,32,54,0.2)] blur-[150px] jelly-blob pointer-events-none mix-blend-screen z-0 jelly-breathe"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-[rgba(201,162,75,0.15)] blur-[120px] jelly-blob pointer-events-none mix-blend-screen z-0 jelly-breathe" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[20%] right-[15%] w-[300px] h-[300px] bg-[rgba(255,255,255,0.06)] blur-[100px] jelly-blob pointer-events-none mix-blend-screen z-0 jelly-breathe" style={{ animationDelay: '2s' }}></div>

      {/* --- HERO CONTENT --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-20 max-w-5xl relative flex flex-col items-center"
      >
        
        {/* 1. Terminal Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/30 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-[0_0_25px_hsl(var(--primary)/0.12)]">
            <FiTerminal className="text-primary text-xs" />
            <span className="text-primary text-[10px] font-mono tracking-[0.2em] uppercase">
              System Online // v2.0
            </span>
            <span className="relative flex h-1.5 w-1.5 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-macos-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-macos-green"></span>
            </span>
          </div>
        </motion.div>
        
        {/* 2. Main Title (Metallic Shimmer) */}
        <motion.h1 
          variants={itemVariants} 
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-foreground mb-6 leading-[0.9] text-balance"
        >
          ENGINEERING <br />
          <span className="relative inline-block text-transparent bg-clip-text 
                           bg-gradient-to-r from-accent-light via-accent to-accent-dark
                           animate-shimmer bg-[length:200%_100%]
                           drop-shadow-[0_0_40px_rgba(201,162,75,0.18)]">
          variants={itemVariants} 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 font-light"
        >
          We architect <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">scalable digital ecosystems</span> using high-performance infrastructure and boutique-level precision.
          
          {/* Primary CTA with jelly-pulse */}
          <motion.a 
            href="#contact"
            className="group relative px-8 py-4 bg-gradient-to-r from-accent-light via-accent to-accent-dark text-ink font-bold text-lg rounded-[16px] overflow-hidden jelly-pulse shadow-[0_20px_60px_-18px_hsl(var(--accent)/0.45)]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scaleX: 1.1, scaleY: 0.88 }}
            transition={jellyPresets.bouncy}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            <span className="relative flex items-center gap-2">
              Start Building <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>

          {/* Secondary CTA with jelly hover */}
          <motion.a 
            href="#arsenal"
            className="px-8 py-4 rounded-[16px] border border-accent/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl text-foreground font-medium text-lg flex items-center gap-3 group shadow-[0_12px_40px_-18px_rgba(15,23,42,0.2)]"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={jellyPresets.bubble}
          >
             <FiCpu className="text-accent group-hover:text-accent-light transition-colors" /> 
             View Arsenal
          </motion.a>

        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 z-20 pointer-events-none"
      >
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
          Initialize
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-accent to-transparent opacity-50"></div>
      </motion.div>

    </section>
  );
}