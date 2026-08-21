/* eslint-disable @next/next/no-img-element */
"use client";

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
  ExternalLink,
  ShieldCheck,
  Layers,
  Server,
  Cpu,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminPermission } from "@prisma/client";
import { hasPermission } from "@/lib/permissions";
import StudioThemeToggle from "./StudioThemeToggle";
import { useStudio } from "./StudioContext";

export interface SidebarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  permissions?: AdminPermission[] | null;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  permission?: AdminPermission;
}

export default function Sidebar({ user }: { user?: SidebarUser }) {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isOpenMobile, closeMobile } = useStudio();

  const allNavItems: NavItem[] = [
    { label: "Overview", href: "/studio", icon: LayoutDashboard },
    { label: "Projects & Quotes", href: "/studio/projects", icon: FolderKanban, permission: "PROJECTS_QUOTATIONS" },
    { label: "Portfolio Items", href: "/studio/portfolio", icon: Layers, permission: "PORTFOLIO" },
    { label: "Hardware Equipment", href: "/studio/equipment", icon: Server, permission: "EQUIPMENT" },
    { label: "Tech Arsenal", href: "/studio/tech-arsenal", icon: Cpu, permission: "TECH_ARSENAL" },
    { label: "Store & Orders", href: "/studio/store", icon: ShoppingBag, permission: "STORE" },
    { label: "Career Postings", href: "/studio/careers", icon: Briefcase, permission: "CAREERS" },
    { label: "Message Inbox", href: "/studio/messages", icon: Mail, permission: "MESSAGES" },
    { label: "Admin Team", href: "/studio/admins", icon: UserCheck, permission: "FULL_ACCESS" },
  ];

  const navItems = allNavItems.filter((item) =>
    item.permission ? hasPermission(user?.permissions, item.permission) : true
  );

  const isSuperAdmin =
    user?.permissions?.includes("FULL_ACCESS") ||
    !user?.permissions ||
    user.permissions.length === 0;

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
      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Shell — Positioned strictly below the top navbar */}
      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40 flex h-[calc(100vh-4rem)] flex-col border-r border-border bg-card/95 backdrop-blur-xl shadow-xs transition-all duration-300",
          "md:sticky md:top-16 md:z-30 md:translate-x-0",
          isCollapsed ? "md:w-16" : "md:w-64",
          isOpenMobile ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Top Control Edge: Collapse/Expand Toggle & Section Label (No logo) */}
        <div
          className={cn(
            "flex h-12 items-center border-b border-border transition-colors",
            isCollapsed ? "justify-center px-2" : "justify-between px-3.5"
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                Console Nav
              </span>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar (w-64)" : "Collapse sidebar (w-16)"}
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
                  <img
                    src={user.image}
                    alt={user.name || "Admin"}
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
                  <span className="truncate">
                    {isSuperAdmin
                      ? "Super Administrator"
                      : `Console Admin (${user?.permissions?.length || 0})`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex justify-center border-b border-border py-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md border border-accent/40 bg-accent/15 text-xs font-black text-accent-dark dark:text-accent-light"
              title={user?.name || "Admin Profile"}
            >
              {initials}
            </div>
          </div>
        )}

        {/* Navigation Items (Independent internal scroll) */}
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
                onClick={closeMobile}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold tracking-wide transition-all duration-200",
                  isActive
                    ? "bg-accent/15 text-accent-dark dark:text-accent-light border border-accent/35 font-extrabold shadow-xs"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  size={16}
                  className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    isActive && "text-accent-dark dark:text-accent-light"
                  )}
                />
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

        {/* Action Footers: Theme Toggle, Live Site, Sign Out */}
        <div className="border-t border-border p-2 space-y-1">
          {!isCollapsed && (
            <div className="px-1 py-1">
              <StudioThemeToggle className="w-full justify-between px-3 py-2" showLabel={true} />
            </div>
          )}

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
