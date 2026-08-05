"use client";

import { motion } from "framer-motion";
import ParticleField from "./ParticleField";

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

  const imageLayers = [
    {
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      className: 'left-[-6%] top-[8%] h-[28vh] w-[22vw] min-w-[220px] rotate-[-8deg] hidden lg:block',
      delay: '0s',
    },
    {
      src: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1000&q=80',
      className: 'right-[4%] top-[18%] h-[24vh] w-[18vw] min-w-[200px] rotate-[10deg] hidden md:block',
      delay: '1.2s',
    },
    {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
      className: 'bottom-[8%] left-[10%] h-[22vh] w-[20vw] min-w-[210px] rotate-[6deg] hidden sm:block',
      delay: '2s',
    },
  ];

  return (
    <>
      <ParticleField />
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {imageLayers.map((layer, index) => (
          <motion.div
            key={layer.src}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: [0.22, 0.38, 0.22], y: [0, -18, 0], rotate: [layer.className.includes('rotate-[-8deg]') ? -8 : layer.className.includes('rotate-[10deg]') ? 10 : 6, layer.className.includes('rotate-[-8deg]') ? -5 : layer.className.includes('rotate-[10deg]') ? 12 : 8, layer.className.includes('rotate-[-8deg]') ? -8 : layer.className.includes('rotate-[10deg]') ? 10 : 6] }}
            transition={{ duration: 16 + index * 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.8 }}
            className={`ambient-image-card absolute rounded-[32px] border border-white/15 ${layer.className}`}
            style={{ backgroundImage: `url(${layer.src})` }}
          />
        ))}
        <div className="ambient-orb absolute left-[10%] top-[24%] h-56 w-56 rounded-full bg-sky-500/20 blur-[120px]" />
        <div className="ambient-orb absolute bottom-[10%] right-[8%] h-64 w-64 rounded-full bg-amber-400/20 blur-[120px]" />
        <div className="ambient-orb absolute right-[25%] top-[8%] h-44 w-44 rounded-full bg-white/10 blur-[110px]" />
      </div>
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
