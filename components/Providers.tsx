"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { TooltipProvider } from "@radix-ui/react-tooltip"; // Assuming you use Radix/Shadcn

// --- SYSTEM BOOT EFFECT ---
const SystemBoot = () => {
  React.useEffect(() => {
    // A subtle easter egg for developers inspecting the console
    console.log(
      "%c SYSTEM ONLINE %c v4.0.2 :: SIGNAL STABLE",
      "background: #059669; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
      "color: #059669; font-family: monospace;"
    );
  }, []);
  return null;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={true} 
      disableTransitionOnChange
    >
      {/* 1. UI PRIMITIVE LAYER 
          Wraps app to ensure tooltips (Shadcn/Radix) function instantly without lag 
      */}
      <TooltipProvider delayDuration={100}>

        {/* 2. QUANTUM LOADING BAR 
            Custom bezier curve for a "mechanical" start-stop feel.
        */}
        <NextTopLoader 
          color="#059669" // Emerald-600
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false} 
          easing="cubic-bezier(0.53,0.21,0,1)" // Snappy start, smooth finish
          speed={200}
          shadow="0 0 10px #059669, 0 0 5px #059669" // Laser focus glow
          zIndex={1600}
        />

        {/* 3. INERTIAL PHYSICS ENGINE
            Optimized for a "High-Mass, Low-Friction" feel (Premium feel)
        */}
        <ReactLenis 
          root 
          options={{ 
            lerp: 0.07, // Slightly heavier than 0.08 for premium feel
            duration: 1.2, 
            smoothWheel: true,
            wheelMultiplier: 1.1, 
            touchMultiplier: 1.5, // Reduced on mobile to prevent "slip"
            infinite: false,
          }}
        >
          
          <SystemBoot />
          {children}

          {/* 4. HOLOGRAPHIC HUD NOTIFICATIONS 
              Styled to look like "System Logs" or "Tactical Alerts"
          */}
          <Toaster 
            position="bottom-right" 
            theme="dark" // Force dark mode aesthetic for notifications usually fits tech vibes better
            richColors 
            expand={false} // Stack them like logs
            gap={6}
            closeButton
            toastOptions={{
              className: "font-sans backdrop-blur-md border-l-4", // Thick left border for "Alert" feel
              style: {
                background: "rgba(10, 10, 10, 0.7)", 
                borderTop: "1px solid rgba(255,255,255,0.1)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                // The left border color is handled by the semantic classes below
                color: "var(--foreground)",
              },
              classNames: {
                title: "font-bold tracking-tight text-sm",
                description: "font-mono text-[10px] opacity-80 uppercase tracking-widest", // Tech specs style
                actionButton: "bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-sm",
                cancelButton: "bg-zinc-800 text-zinc-400 text-xs px-3 py-1 rounded-sm",
                
                // SEMANTIC STATES (The "Left Border" logic)
                error: "border-l-red-500 bg-red-950/20 text-red-200",
                success: "border-l-emerald-500 bg-emerald-950/20 text-emerald-200",
                warning: "border-l-amber-500 bg-amber-950/20 text-amber-200",
                info: "border-l-emerald-400 bg-emerald-950/10 text-emerald-100",
              },
            }}
          />
          
        </ReactLenis>
      </TooltipProvider>
    </ThemeProvider>
  );
}