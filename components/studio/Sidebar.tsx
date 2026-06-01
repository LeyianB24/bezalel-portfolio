"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderKanban, 
  ShoppingBag, 
  Mail, 
  Home, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X 
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpenMobile, setIsOpenMobile] = useState(false)

  const navItems = [
    { label: "Overview", href: "/studio", icon: LayoutDashboard },
    { label: "Careers", href: "/studio/careers", icon: Briefcase },
    { label: "Projects", href: "/studio/projects", icon: FolderKanban },
    { label: "Store", href: "/studio/store", icon: ShoppingBag },
    { label: "Messages", href: "/studio/messages", icon: Mail },
  ]

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleMobile = () => setIsOpenMobile(!isOpenMobile)

  return (
    <>
      {/* Mobile Header */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 md:hidden">
        <Link href="/studio" className="font-mono text-sm font-bold tracking-tight text-white">
          BEZALEL_STUDIO //
        </Link>
        <button onClick={toggleMobile} className="p-1 text-zinc-400 hover:text-white">
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
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300",
          "md:translate-x-0 md:sticky md:top-0",
          isCollapsed ? "w-16" : "w-64",
          isOpenMobile ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-4">
          <Link 
            href="/studio" 
            className={cn(
              "font-mono text-sm font-bold tracking-tight text-white transition-opacity duration-200",
              isCollapsed && "opacity-0 md:w-0 overflow-hidden"
            )}
          >
            BEZALEL_STUDIO //
          </Link>
          <button 
            onClick={toggleSidebar} 
            className="hidden p-1 text-zinc-400 hover:text-white md:block"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = item.href === "/studio" 
              ? pathname === "/studio"
              : pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpenMobile(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-emerald-600/10 text-emerald-500" 
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <Icon size={18} className="shrink-0" />
                <span className={cn(
                  "transition-all duration-200", 
                  isCollapsed && "opacity-0 md:w-0 overflow-hidden"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-800 p-2 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            <Home size={18} className="shrink-0" />
            <span className={cn(
              "transition-all duration-200", 
              isCollapsed && "opacity-0 md:w-0 overflow-hidden"
            )}>
              View Site
            </span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500/85 hover:bg-red-950/20 hover:text-red-400"
          >
            <LogOut size={18} className="shrink-0" />
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
  )
}
