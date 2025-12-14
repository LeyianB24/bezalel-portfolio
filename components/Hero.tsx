"use client";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { FiArrowRight, FiCode } from "react-icons/fi";

export default function Hero() {
  // --- 1. Mouse Tracking Logic for Spotlight Effect ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // --- 2. Staggered Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delays each child by 0.2s
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  };

  return (
    <section 
      className="relative flex flex-col items-center justify-center text-center px-4 h-screen min-h-[800px] overflow-hidden bg-[#02040a] group"
      onMouseMove={handleMouseMove}
    >
      
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* Layer 1: Base Grid (Dim) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Layer 2: Mouse Spotlight Grid (Reveals brighter grid on hover) */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
        }}
      />

      {/* Layer 3: Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>


      {/* --- HERO CONTENT --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 max-w-5xl relative"
      >
        
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 border border-purple-500/30 rounded-full bg-purple-500/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-purple-300 text-xs font-mono tracking-widest uppercase">
              System Architecture v2.0
            </span>
          </div>
        </motion.div>
        
        {/* Main Title */}
        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9]">
          ENGINEERING <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-purple-400 animate-gradient-x bg-[length:200%_auto]">
            PERFECTION.
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          We don't just write code. We architect <span className="text-white font-semibold">scalable digital ecosystems</span> using high-performance infrastructure and military-grade precision.
        </motion.p>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          
          {/* Primary Button */}
          <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            <span className="relative flex items-center gap-2">
              View Solutions <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Secondary Button */}
          <button className="px-8 py-4 border border-white/10 hover:border-white/30 hover:bg-white/5 text-slate-300 font-bold rounded-lg transition-all flex items-center gap-2">
             <FiCode className="text-purple-500" /> Our Stack
          </button>

        </motion.div>
      </motion.div>

      {/* --- SCROLL INDICATOR --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50"></div>
      </motion.div>

    </section>
  );
}