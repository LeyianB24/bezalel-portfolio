"use client";

import { motion } from "framer-motion";

interface UnifiedBackgroundProps {
  variant?: 'default' | 'subtle' | 'vibrant' | 'cyber';
  showGrid?: boolean;
  showNoise?: boolean;
  showOrbs?: boolean;
}

type OrbConfig = {
  color: string;
  blur: string;
  position: string;
  size: string;
  delay?: string;
  opacity?: string;
};

export default function UnifiedBackground({
  variant = 'default',
  showGrid = true,
  showNoise = true,
  showOrbs = true,
}: UnifiedBackgroundProps) {
  
  // Background variant configurations
  const variants = {
    default: {
      gridOpacity: 'opacity-[0.04] dark:opacity-[0.08]',
      orbs: [
        { color: 'bg-macos-green/10 dark:bg-macos-green/10', blur: 'blur-[120px]', position: 'top-[-20%] left-1/2 -translate-x-1/2', size: 'w-[80vw] h-[60vh]' },
        { color: 'bg-amber-600/5 dark:bg-amber-800/10', blur: 'blur-[100px]', position: 'bottom-[-10%] right-[-10%]', size: 'w-[60vw] h-[60vh]', delay: 'delay-700' },
        { color: 'bg-zinc-400/10 dark:bg-zinc-800/20', blur: 'blur-[90px]', position: 'top-[40%] left-[-10%]', size: 'w-[40vw] h-[40vh]', opacity: 'opacity-50' },
      ] as OrbConfig[]
    },
    vibrant: {
      gridOpacity: 'opacity-[0.06] dark:opacity-[0.12]',
      orbs: [
        { color: 'bg-emerald-500/20', blur: 'blur-[150px]', position: 'top-[-20%] left-[10%]', size: 'w-[600px] h-[600px]' },
        { color: 'bg-blue-500/15', blur: 'blur-[120px]', position: 'bottom-[-10%] right-[10%]', size: 'w-[500px] h-[500px]', delay: 'delay-1000' },
        { color: 'bg-cyan-400/10', blur: 'blur-[100px]', position: 'top-[20%] right-[15%]', size: 'w-[300px] h-[300px]', delay: 'delay-2000' },
      ] as OrbConfig[]
    },
    cyber: {
      gridOpacity: 'opacity-[0.05] dark:opacity-[0.10]',
      orbs: [
        { color: 'bg-purple-500/15', blur: 'blur-[140px]', position: 'top-[-15%] left-[15%]', size: 'w-[550px] h-[550px]' },
        { color: 'bg-indigo-500/12', blur: 'blur-[110px]', position: 'bottom-[-5%] right-[20%]', size: 'w-[450px] h-[450px]', delay: 'delay-1500' },
        { color: 'bg-violet-400/8', blur: 'blur-[95px]', position: 'top-[35%] left-[-5%]', size: 'w-[350px] h-[350px]', delay: 'delay-2500' },
      ] as OrbConfig[]
    },
    subtle: {
      gridOpacity: 'opacity-[0.02] dark:opacity-[0.04]',
      orbs: [
        { color: 'bg-slate-400/5', blur: 'blur-[100px]', position: 'top-[-10%] left-1/2 -translate-x-1/2', size: 'w-[60vw] h-[40vh]' },
        { color: 'bg-zinc-400/3', blur: 'blur-[80px]', position: 'bottom-[-5%] right-[-5%]', size: 'w-[40vw] h-[30vh]', delay: 'delay-1000' },
      ] as OrbConfig[]
    }
  };

  const config = variants[variant];

  return (
    <>
      {/* --- 1. ENGINEERING GRID --- */}
      {showGrid && (
        <div className={`fixed inset-0 z-0 pointer-events-none ${config.gridOpacity} bg-grid-pattern bg-grid-md mask-radial-faded`}></div>
      )}

      {/* --- 2. NOISE TEXTURE --- */}
      {showNoise && (
        <div 
          className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
      )}

      {/* --- 3. JELLY-BLOB AMBIENT ORBS --- */}
      {showOrbs && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {config.orbs.map((orb, index) => (
            <motion.div
              key={index}
              animate={{ 
                opacity: [0.1, 0.3, 0.1], 
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                duration: 8 + index * 2, 
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut",
                type: "tween"
              }}
              className={`absolute ${orb.position} ${orb.size} ${orb.color} ${orb.blur} jelly-blob mix-blend-multiply dark:mix-blend-screen animate-pulse-slow ${orb.delay || ''} ${orb.opacity !== undefined ? orb.opacity : ''}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
