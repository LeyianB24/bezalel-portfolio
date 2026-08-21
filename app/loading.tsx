/* eslint-disable @next/next/no-img-element */
export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground antialiased selection:bg-accent/30">
      {/* Background Glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top, rgba(201, 162, 75, 0.12) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(11, 32, 54, 0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Animated Brand Logo Mark */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-card/80 p-3 shadow-2xl backdrop-blur-xl">
          <img
            src="/logos/bezalel-mark-gold.svg"
            alt="Bezalel Technologies"
            className="h-full w-full object-contain animate-pulse"
          />
          <span className="absolute -inset-1 rounded-2xl border border-accent/20 animate-ping opacity-30" />
        </div>

        {/* Brand Typography & Status */}
        <div className="text-center">
          <p className="font-display text-sm font-black tracking-widest text-foreground">
            BEZALEL TECHNOLOGIES
          </p>
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent-dark dark:text-accent-light">
              INITIALIZING INTERFACE...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
