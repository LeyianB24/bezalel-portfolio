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
      gridOpacity: 'opacity-[0.04] dark:opacity-[0.07]',
      orbs: [
        { color: 'bg-[#C9A24B]/15 dark:bg-[#C9A24B]/20', blur: 'blur-[130px]', position: 'top-[-15%] left-1/2 -translate-x-1/2', size: 'w-[70vw] h-[50vh]' },
        { color: 'bg-blue-600/10 dark:bg-blue-600/15', blur: 'blur-[120px]', position: 'bottom-[-10%] right-[-10%]', size: 'w-[50vw] h-[50vh]', delay: 'delay-700' },
        { color: 'bg-amber-500/10 dark:bg-amber-500/15', blur: 'blur-[100px]', position: 'top-[40%] left-[-10%]', size: 'w-[40vw] h-[40vh]' },
      ] as OrbConfig[]
    },
    vibrant: {
      gridOpacity: 'opacity-[0.05] dark:opacity-[0.10]',
      orbs: [
        { color: 'bg-[#C9A24B]/25', blur: 'blur-[140px]', position: 'top-[-15%] left-[10%]', size: 'w-[500px] h-[500px]' },
        { color: 'bg-blue-500/20', blur: 'blur-[120px]', position: 'bottom-[-10%] right-[10%]', size: 'w-[450px] h-[450px]', delay: 'delay-1000' },
        { color: 'bg-purple-500/15', blur: 'blur-[100px]', position: 'top-[25%] right-[15%]', size: 'w-[350px] h-[350px]', delay: 'delay-2000' },
      ] as OrbConfig[]
    },
    cyber: {
      gridOpacity: 'opacity-[0.04] dark:opacity-[0.08]',
      orbs: [
        { color: 'bg-purple-600/20', blur: 'blur-[140px]', position: 'top-[-15%] left-[15%]', size: 'w-[500px] h-[500px]' },
        { color: 'bg-indigo-600/15', blur: 'blur-[110px]', position: 'bottom-[-5%] right-[20%]', size: 'w-[420px] h-[420px]', delay: 'delay-1500' },
        { color: 'bg-[#C9A24B]/15', blur: 'blur-[95px]', position: 'top-[35%] left-[-5%]', size: 'w-[350px] h-[350px]', delay: 'delay-2500' },
      ] as OrbConfig[]
    },
    subtle: {
      gridOpacity: 'opacity-[0.03] dark:opacity-[0.05]',
      orbs: [
        { color: 'bg-[#C9A24B]/10 dark:bg-[#C9A24B]/15', blur: 'blur-[120px]', position: 'top-[-10%] left-1/2 -translate-x-1/2', size: 'w-[55vw] h-[35vh]' },
        { color: 'bg-blue-900/10 dark:bg-blue-900/20', blur: 'blur-[100px]', position: 'bottom-[-5%] right-[-5%]', size: 'w-[35vw] h-[28vh]', delay: 'delay-1000' },
      ] as OrbConfig[]
    }
  };

  const config = variants[variant];

  return (
    <>
      {/* 1. Engineering Grid */}
      {showGrid && (
        <div className={`fixed inset-0 z-0 pointer-events-none ${config.gridOpacity} bg-grid-pattern bg-grid-md mask-radial-faded`} />
      )}

      {/* 2. Noise Texture */}
      {showNoise && (
        <div 
          className="fixed inset-0 z-[1] pointer-events-none opacity-[0.025] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      )}

      {/* 3. Floating Ambient Glow Orbs */}
      {showOrbs && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {config.orbs.map((orb, index) => (
            <motion.div
              key={index}
              animate={{ 
                opacity: [0.2, 0.45, 0.2], 
                scale: [1, 1.15, 1],
              }}
              transition={{ 
                duration: 8 + index * 2, 
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut",
              }}
              className={`absolute rounded-full ${orb.position} ${orb.size} ${orb.color} ${orb.blur} mix-blend-multiply dark:mix-blend-screen ${orb.delay || ''} ${orb.opacity !== undefined ? orb.opacity : ''}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
