/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useMotionValue, useMotionTemplate, easeOut } from "framer-motion";
import { FiArrowRight, FiCpu, FiTerminal } from "react-icons/fi";

export default function Hero() {
  // --- 1. Spotlight Logic (High Performance) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // --- 2. Animations Configuration ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: "blur(8px)" },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: easeOut } 
    },
  };

  return (
    <section 
      className="relative flex flex-col items-center justify-center text-center px-4 h-screen min-h-[800px] overflow-hidden bg-background group selection:bg-emerald-500/30"
      onMouseMove={handleMouseMove}
    >
      
      {/* --- LAYER 0: HOLOGRAPHIC PROJECTION --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Holographic Data Stream"
          className="w-full h-full object-cover grayscale brightness-[0.4] contrast-[1.2] opacity-30 dark:opacity-20 mix-blend-color-dodge scale-110 motion-safe:animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_90%)]"></div>
      </div>
      
      {/* --- LAYER 1: ENGINEERING GRID (Blueprint) --- */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none">
      </div>

      {/* --- LAYER 2: CYAN LASER SPOTLIGHT --- */}
      <motion.div
        className="absolute inset-0 z-10 bg-[linear-gradient(to_right,hsl(var(--primary)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.2)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
        }}
      />

      {/* --- LAYER 3: AMBIENT REACTOR GLOW --- */}
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-emerald-500/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-amber-600/15 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0 animate-pulse-slow delay-700"></div>
      <div className="absolute top-[20%] right-[15%] w-[300px] h-[300px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

      {/* --- HERO CONTENT --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-20 max-w-5xl relative flex flex-col items-center"
      >
        
        {/* 1. Terminal Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md shadow-[0_0_15px_rgba(5,150,105,0.1)]">
            <FiTerminal className="text-emerald-400 text-xs" />
            <span className="text-emerald-300 text-[10px] font-mono tracking-[0.2em] uppercase">
              System Online // v2.0
            </span>
            <span className="relative flex h-1.5 w-1.5 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
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
                           bg-gradient-to-r from-foreground via-zinc-400 to-foreground 
                           dark:from-white dark:via-zinc-500 dark:to-zinc-200
                           animate-shimmer bg-[length:200%_100%]
                           drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            PERFECTION.
          </span>
        </motion.h1>
        
        {/* 3. Subtitle */}
        <motion.p 
          variants={itemVariants} 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 font-light"
        >
          We architect <span className="text-emerald-600 font-medium text-glow-subtle">scalable digital ecosystems</span> using high-performance infrastructure and military-grade precision.
        </motion.p>

        {/* 4. Action Array */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          
          <a 
            href="#contact"
            className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-lg overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(5,150,105,0.4)] active:scale-[0.98]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            <span className="relative flex items-center gap-2">
              Start Building <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </a>

          <a 
            href="#arsenal"
            className="px-8 py-4 rounded-lg border border-input bg-background/50 backdrop-blur-sm text-foreground font-medium text-lg hover:bg-accent hover:text-accent-foreground hover:border-emerald-500/50 transition-all duration-300 flex items-center gap-3 group"
          >
             <FiCpu className="text-emerald-600 group-hover:text-amber-500 transition-colors" /> 
             View Arsenal
          </a>

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
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-emerald-600 to-transparent opacity-50"></div>
      </motion.div>

    </section>
  );
}