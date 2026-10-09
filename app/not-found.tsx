/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#050D17] px-4 py-16 text-white antialiased selection:bg-accent/30">
      {/* Hero-matched ambient lighting */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(201, 162, 75, 0.14) 0%, rgba(5, 13, 23, 0.0) 55%), radial-gradient(ellipse at 20% 80%, rgba(11, 32, 54, 0.5) 0%, transparent 60%)",
        }}
      />
      {/* Gold engineering grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(201, 162, 75, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201, 162, 75, 0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-lg w-full rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl">
        {/* Brand Mark */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15 p-3 shadow-inner">
          <img
            src="/logos/bezalel-mark-gold.svg"
            alt="Bezalel Technologies"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/30 bg-[#C9A24B]/10 px-3 py-1 font-mono text-[10px] uppercase font-bold text-[#E8CD84]">
            <span>404: RESOURCE_NOT_FOUND</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
            Page Not Located
          </h1>

          <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm mx-auto">
            The route or endpoint you requested is unavailable or has been relocated within our architecture.
          </p>
        </div>

        {/* Quick Nav Links */}
          <div className="mt-8 grid grid-cols-2 gap-2.5 text-xs">
          <Link
            href="/services/web-systems"
            className="rounded-lg border border-white/10 bg-white/5 p-2.5 font-bold text-white/70 hover:border-[#C9A24B]/40 hover:bg-white/10 hover:text-white transition-all"
          >
            Web Systems &rarr;
          </Link>
          <Link
            href="/portfolio"
            className="rounded-lg border border-white/10 bg-white/5 p-2.5 font-bold text-white/70 hover:border-[#C9A24B]/40 hover:bg-white/10 hover:text-white transition-all"
          >
            Portfolio &rarr;
          </Link>
          <Link
            href="/store"
            className="rounded-lg border border-white/10 bg-white/5 p-2.5 font-bold text-white/70 hover:border-[#C9A24B]/40 hover:bg-white/10 hover:text-white transition-all"
          >
            Store &rarr;
          </Link>
          <Link
            href="/careers"
            className="rounded-lg border border-white/10 bg-white/5 p-2.5 font-bold text-white/70 hover:border-[#C9A24B]/40 hover:bg-white/10 hover:text-white transition-all"
          >
            Careers &rarr;
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light transition-all"
          >
            <Home size={14} />
            Return to Homepage
          </Link>
          <Link
            href="/projects/request"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15 transition-all"
          >
            <Compass size={14} />
            Request a Project
          </Link>
        </div>
      </div>
    </div>
  );
}
