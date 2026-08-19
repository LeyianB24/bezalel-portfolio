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
  Shield,
  Layers,
  Server,
  Cpu
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
    { label: "Portfolio", href: "/studio/portfolio", icon: Layers },
    { label: "Equipment", href: "/studio/equipment", icon: Server },
    { label: "Tech Stack", href: "/studio/tech-arsenal", icon: Cpu },
    { label: "Store & Orders", href: "/studio/store", icon: ShoppingBag },
    { label: "Careers", href: "/studio/careers", icon: Briefcase },
    { label: "Messages", href: "/studio/messages", icon: Mail },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsOpenMobile(!isOpenMobile);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "BZ";

  return (
    <>
      {/* Mobile Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <Link href="/studio" className="font-display text-sm font-black tracking-wider text-foreground">
          BEZALEL STUDIO //
        </Link>
        <button 
          onClick={toggleMobile} 
          className="p-1 text-muted-foreground hover:text-foreground"
          aria-label="Toggle mobile navigation menu"
        >
          {isOpenMobile ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar Shell */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-border bg-card transition-all duration-300",
          "md:translate-x-0 md:sticky md:top-0",
          isCollapsed ? "w-16" : "w-64",
          isOpenMobile ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link 
            href="/studio" 
            className={cn(
              "font-display text-sm font-black tracking-wider text-foreground transition-opacity duration-200",
              isCollapsed && "opacity-0 md:w-0 overflow-hidden"
            )}
          >
            BEZALEL STUDIO //
          </Link>
          <button 
            onClick={toggleSidebar} 
            className="hidden p-1 text-muted-foreground hover:text-foreground md:block"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Profile Block */}
        {!isCollapsed && (
          <div className="px-3 py-3 border-b border-border">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-secondary/50">
              <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent-dark dark:text-accent-light text-xs font-black shrink-0">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name || ""} className="w-full h-full rounded-lg object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-foreground truncate">{user?.name || "Tomaka Bezalel"}</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Shield size={10} className="text-accent-dark dark:text-accent-light shrink-0" />
                  <span className="truncate">Administrator</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="px-2 py-3 border-b border-border flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent-dark dark:text-accent-light text-xs font-black">
              {initials}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === "/studio" 
              ? pathname === "/studio"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpenMobile(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                  isActive 
                    ? "bg-accent/15 text-accent-dark dark:text-accent-light border border-accent/30 font-black" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={16} className="shrink-0" />
                <span className={cn(
                  "transition-all duration-200", 
                  isCollapsed && "opacity-0 md:w-0 overflow-hidden"
                )}>
                  {item.label}
                </span>
                {isActive && !isCollapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title={isCollapsed ? "View Site" : undefined}
          >
            <ExternalLink size={16} className="shrink-0" />
            <span className={cn(
              "transition-all duration-200", 
              isCollapsed && "opacity-0 md:w-0 overflow-hidden"
            )}>
              View Live Site
            </span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut size={16} className="shrink-0" />
            <span className={cn(
              "transition-all duration-200", 
              isCollapsed && "opacity-0 md:w-0 overflow-hidden"
            )}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
