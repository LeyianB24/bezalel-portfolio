/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Terminal, ShieldCheck, Activity } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import StudioThemeToggle from "./StudioThemeToggle";
import { AdminPermission } from "@prisma/client";

interface StudioHeaderUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  permissions?: AdminPermission[] | null;
}

export default function StudioHeader({ user }: { user?: StudioHeaderUser }) {
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "BZ";

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/85 px-4 backdrop-blur-xl transition-colors sm:px-6 md:px-8 shadow-xs">
      {/* Left Brand Identity & Breadcrumbs */}
      <div className="flex items-center gap-3 md:gap-4">
        <Link
          href="/studio"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
          title="Bezalel Executive Studio Console"
        >
          {/* Bezalel Gold Mark */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 p-1.5 shadow-2xs group-hover:border-accent/60 transition-all">
            <img
              src="/logos/bezalel-mark-gold.svg"
              alt="Bezalel Technologies Mark"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="hidden sm:block">
            {/* Theme-aware Horizontal Wordmark */}
            <div className="flex items-center">
              <img
                src="/logos/bezalel-logo-horizontal-dark.png"
                alt="Bezalel Technologies"
                className="h-7 w-auto object-contain dark:hidden"
              />
              <img
                src="/logos/bezalel-logo-horizontal-light.png"
                alt="Bezalel Technologies"
                className="hidden h-7 w-auto object-contain dark:block"
              />
            </div>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <span className="text-[9px] font-mono font-bold tracking-widest text-accent-dark dark:text-accent-light uppercase">
                ADMIN TERMINAL
              </span>
              <span className="text-muted-foreground text-[9px]">•</span>
              <span className="text-[9px] font-mono text-muted-foreground uppercase">
                V4.2 PROD
              </span>
            </div>
          </div>
        </Link>

        {/* Live Status Badge (Desktop only) */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>NODE: NBO-OPS-1 (ONLINE)</span>
        </div>
      </div>

      {/* Right Controls: Clock, Notifications, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Digital Telemetry Clock */}
        {timeString && (
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1 font-mono text-xs font-bold text-muted-foreground">
            <Activity size={13} className="text-accent-dark dark:text-accent-light" />
            <span>UTC+3 {timeString}</span>
          </div>
        )}

        {/* Public Website Shortcut */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          title="Open Public Website"
        >
          <ExternalLink size={13} />
          <span className="hidden lg:inline">Live Site</span>
        </Link>

        {/* Real-Time Notification Center */}
        <NotificationCenter />

        {/* Working Theme Toggle */}
        <StudioThemeToggle showLabel={false} />

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2 border-l border-border pl-2 sm:pl-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-xs font-black text-accent-dark dark:text-accent-light shadow-2xs">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "Admin"}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold leading-tight text-foreground truncate max-w-[110px]">
              {user?.name || "Operator"}
            </div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground">
              <ShieldCheck size={10} className="text-accent-dark dark:text-accent-light shrink-0" />
              <span>ADMIN</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
