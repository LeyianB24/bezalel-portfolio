"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  ShoppingBag,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Layers,
  Server,
  Cpu,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function Sidebar({ user }: { user?: SidebarUser }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const navItems = [
    { label: "Overview", href: "/studio", icon: LayoutDashboard },
    { label: "Projects & Quotes", href: "/studio/projects", icon: FolderKanban },
    { label: "Portfolio Items", href: "/studio/portfolio", icon: Layers },
    { label: "Hardware Equipment", href: "/studio/equipment", icon: Server },
    { label: "Tech Arsenal", href: "/studio/tech-arsenal", icon: Cpu },
    { label: "Store & Orders", href: "/studio/store", icon: ShoppingBag },
    { label: "Career Postings", href: "/studio/careers", icon: Briefcase },
    { label: "Message Inbox", href: "/studio/messages", icon: Mail },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsOpenMobile(!isOpenMobile);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "BZ";

  return (
    <>
      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur-md md:hidden">
        <Link href="/studio" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-black text-xs border border-white/10">
            BZ
          </div>
          <div>
            <span className="font-display text-sm font-black tracking-wider text-foreground">
              BEZALEL
            </span>
            <span className="text-[10px] font-mono font-bold text-accent-dark dark:text-accent-light block -mt-1">
              STUDIO OPS
            </span>
          </div>
        </Link>
        <button
          onClick={toggleMobile}
          className="rounded-md border border-border bg-background p-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle mobile menu"
        >
          {isOpenMobile ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-border bg-card/95 backdrop-blur-xl transition-all duration-300 shadow-sm",
          "md:translate-x-0 md:sticky md:top-0",
          isCollapsed ? "w-16" : "w-64",
          isOpenMobile ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link
            href="/studio"
            className={cn(
              "flex items-center gap-2.5 transition-opacity duration-200",
              isCollapsed && "opacity-0 md:w-0 overflow-hidden"
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-black text-xs border border-white/10 shadow-xs">
              BZ
            </div>
            <div>
              <span className="font-display text-sm font-black tracking-wider text-foreground block leading-tight">
                BEZALEL
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light block">
                ENGINEERING OPS
              </span>
            </div>
          </Link>
          <button
            onClick={toggleSidebar}
            className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground md:block transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Admin Profile Block */}
        {!isCollapsed && (
          <div className="border-b border-border p-3">
            <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-secondary/40 p-2.5 shadow-xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/40 bg-accent/15 text-xs font-black text-accent-dark dark:text-accent-light">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || ""}
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="overflow-hidden">
                <div className="truncate text-xs font-bold text-foreground">
                  {user?.name || "Leyian B."}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ShieldCheck size={11} className="text-accent-dark dark:text-accent-light shrink-0" />
                  <span className="truncate">Lead Engineer / Admin</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex justify-center border-b border-border py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-accent/40 bg-accent/15 text-xs font-black text-accent-dark dark:text-accent-light">
              {initials}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/studio"
                ? pathname === "/studio"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpenMobile(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold tracking-wide transition-all duration-200",
                  isActive
                    ? "bg-accent/15 text-accent-dark dark:text-accent-light border border-accent/35 font-extrabold shadow-xs"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={16} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive && "text-accent-dark dark:text-accent-light")} />
                <span
                  className={cn(
                    "transition-all duration-200 truncate",
                    isCollapsed && "opacity-0 md:w-0 overflow-hidden"
                  )}
                >
                  {item.label}
                </span>
                {isActive && !isCollapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Live Node Telemetry Footer */}
        {!isCollapsed && (
          <div className="border-t border-border/80 p-3">
            <div className="rounded-md border border-border bg-background/60 p-2.5 text-[10px]">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  NeonDB PostgreSQL
                </span>
                <span className="font-mono text-emerald-400 font-bold">18ms</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground/80 font-mono">
                <span>Node: NBO-EAST-1</span>
                <span>v4.2-prod</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Footers */}
        <div className="border-t border-border p-2 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title={isCollapsed ? "View Live Site" : undefined}
          >
            <ExternalLink size={15} className="shrink-0" />
            <span
              className={cn(
                "transition-all duration-200 truncate",
                isCollapsed && "opacity-0 md:w-0 overflow-hidden"
              )}
            >
              Public Website
            </span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut size={15} className="shrink-0" />
            <span
              className={cn(
                "transition-all duration-200 truncate",
                isCollapsed && "opacity-0 md:w-0 overflow-hidden"
              )}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
