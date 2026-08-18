"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem={true} 
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={100}>
          {/* Top Loader in Brand Gold */}
          <NextTopLoader 
            color="#C9A24B"
            initialPosition={0.08}
            crawlSpeed={200}
            height={2.5}
            crawl={true}
            showSpinner={false} 
            easing="cubic-bezier(0.53,0.21,0,1)"
            speed={200}
            shadow="0 0 10px #C9A24B, 0 0 5px #C9A24B"
            zIndex={1600}
          />

          <ReactLenis 
            root 
            options={{ 
              lerp: 0.07,
              duration: 1.2, 
              smoothWheel: true,
              wheelMultiplier: 1.1, 
              touchMultiplier: 1.5,
              infinite: false,
            }}
          >
            {children as any}

            <Toaster 
              position="bottom-right" 
              richColors 
              expand={false}
              gap={6}
              closeButton
              toastOptions={{
                className: "font-sans backdrop-blur-md border-l-4",
                style: {
                  background: "rgba(11, 32, 54, 0.92)", 
                  borderTop: "1px solid rgba(201, 162, 75, 0.2)",
                  borderRight: "1px solid rgba(201, 162, 75, 0.2)",
                  borderBottom: "1px solid rgba(201, 162, 75, 0.2)",
                  color: "#FAF6EC",
                },
                classNames: {
                  title: "font-bold tracking-tight text-sm",
                  description: "text-xs opacity-80",
                  actionButton: "bg-accent text-accent-foreground font-bold text-xs px-3 py-1 rounded-sm",
                  cancelButton: "bg-secondary text-muted-foreground text-xs px-3 py-1 rounded-sm",
                  error: "border-l-red-500 text-red-100",
                  success: "border-l-accent text-accent-light",
                  warning: "border-l-amber-500 text-amber-100",
                  info: "border-l-accent-light text-accent-light",
                },
              }}
            />
          </ReactLenis>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}