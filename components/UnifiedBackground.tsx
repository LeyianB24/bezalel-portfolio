"use client";

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
  showOrbs = false,
}: UnifiedBackgroundProps) {
  
  // Background variant configurations
  const variants = {
    default: {
      gridOpacity: 'opacity-[0.03] dark:opacity-[0.05]',
      orbs: [
        { color: 'bg-[rgba(3,41,78,0.10)]', blur: 'blur-[140px]', position: 'top-[-15%] left-1/2 -translate-x-1/2', size: 'w-[70vw] h-[50vh]' },
        { color: 'bg-[rgba(212,175,55,0.05)]', blur: 'blur-[120px]', position: 'bottom-[-10%] right-[-10%]', size: 'w-[50vw] h-[50vh]', delay: 'delay-700' },
      ] as OrbConfig[]
    },
    vibrant: {
      gridOpacity: 'opacity-[0.04] dark:opacity-[0.08]',
      orbs: [
        { color: 'bg-[rgba(3,41,78,0.12)]', blur: 'blur-[150px]', position: 'top-[-15%] left-[10%]', size: 'w-[500px] h-[500px]' },
        { color: 'bg-[rgba(212,175,55,0.06)]', blur: 'blur-[130px]', position: 'bottom-[-10%] right-[10%]', size: 'w-[400px] h-[400px]', delay: 'delay-1000' },
      ] as OrbConfig[]
    },
    cyber: {
      gridOpacity: 'opacity-[0.02] dark:opacity-[0.03]',
      orbs: [
        { color: 'bg-[rgba(11,32,54,0.08)]', blur: 'blur-[140px]', position: 'top-[-15%] left-[15%]', size: 'w-[500px] h-[500px]' },
        { color: 'bg-[rgba(201,162,75,0.04)]', blur: 'blur-[120px]', position: 'bottom-[-5%] right-[20%]', size: 'w-[400px] h-[400px]', delay: 'delay-1500' },
      ] as OrbConfig[]
    },
    subtle: {
      gridOpacity: 'opacity-[0.02] dark:opacity-[0.03]',
      orbs: [
        { color: 'bg-slate-400/5', blur: 'blur-[120px]', position: 'top-[-10%] left-1/2 -translate-x-1/2', size: 'w-[55vw] h-[35vh]' },
        { color: 'bg-zinc-400/3', blur: 'blur-[100px]', position: 'bottom-[-5%] right-[-5%]', size: 'w-[35vw] h-[28vh]', delay: 'delay-1000' },
      ] as OrbConfig[]
    }
  };

  const config = variants[variant];

  return (
    <>
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)),hsl(var(--background))_55%,hsl(var(--card)))]" />
      </div>
      {showGrid && (
        <div className={`fixed inset-0 z-0 pointer-events-none ${config.gridOpacity} bg-grid-pattern bg-grid-md mask-radial-faded`}></div>
      )}

      {showNoise && (
        <div 
          className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
      )}

      {showOrbs && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {config.orbs.map((orb, index) => (
            <div
              key={index}
              className={`absolute rounded-full ${orb.position} ${orb.size} ${orb.color} ${orb.blur} ${orb.opacity !== undefined ? orb.opacity : ''}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
