"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client error to monitoring
    console.error("Root Application Error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-foreground antialiased selection:bg-accent/30">
      {/* Background ambient lighting */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top, rgba(201, 162, 75, 0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(11, 32, 54, 0.25) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-md w-full rounded-2xl border border-border bg-card/90 p-8 text-center shadow-2xl backdrop-blur-xl">
        {/* Brand Mark */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 shadow-inner">
          <AlertTriangle size={28} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent-dark dark:text-accent-light font-bold">
              SYSTEM TELEMETRY
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="font-mono text-[10px] uppercase text-red-500 font-bold">
              FAULT RECOVERY
            </span>
          </div>

          <h1 className="font-display text-2xl font-black tracking-tight text-foreground">
            Something went wrong
          </h1>

          <p className="text-xs text-muted-foreground leading-relaxed">
            An unexpected error occurred while executing this application state. Our engineering telemetry has logged the event.
          </p>
        </div>

        {error.digest && (
          <div className="mt-4 rounded-md border border-border/80 bg-background/60 px-3 py-1.5 font-mono text-[10px] text-muted-foreground truncate">
            Digest: {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light transition-all"
          >
            <RefreshCw size={14} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-all"
          >
            <Home size={14} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
