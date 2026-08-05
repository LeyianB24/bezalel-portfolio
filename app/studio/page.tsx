import prisma from "@/lib/prisma"
import { 
  Briefcase, 
  FolderKanban, 
  ShoppingBag, 
  Mail, 
  ArrowUpRight,
  TrendingUp,
  Clock
} from "lucide-react"
import Link from "next/link"
import ActivityChart from "./ActivityChart"
import { auth } from "@/auth"

export const revalidate = 0

export default async function StudioPage() {
  const session = await auth()

  const [
    openJobsCount,
    pendingAppsCount,
    activeProjectsCount,
    productsCount,
    pendingOrdersCount,
    unreadMessagesCount,
    latestProjects,
    latestMessages,
    recentApplications,
    recentOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.job.count({ where: { isOpen: true } }),
    prisma.jobApplication.count({ where: { status: "PENDING" } }),
    prisma.projectRequest.count({ 
      where: { 
        status: { 
          notIn: ["DELIVERED", "CANCELLED"] 
        } 
      } 
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.projectRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.jobApplication.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ["CANCELLED", "REFUNDED"] } }
    }),
  ])

  const stats = [
    { 
      label: "Active Jobs", 
      count: openJobsCount, 
      sub: `${pendingAppsCount} pending app${pendingAppsCount !== 1 ? "s" : ""}`, 
      icon: Briefcase, 
      href: "/studio/careers",
      accent: "emerald"
    },
    { 
      label: "Active Projects", 
      count: activeProjectsCount, 
      sub: "In pipeline", 
      icon: FolderKanban, 
      href: "/studio/projects",
      accent: "blue"
    },
    { 
      label: "Products", 
      count: productsCount, 
      sub: `${pendingOrdersCount} pending order${pendingOrdersCount !== 1 ? "s" : ""}`, 
      icon: ShoppingBag, 
      href: "/studio/store",
      accent: "navy"
    },
    { 
      label: "Unread Messages", 
      count: unreadMessagesCount, 
      sub: "Action required", 
      icon: Mail, 
      href: "/studio/messages",
      accent: "amber"
    },
  ]

  const accentColors: Record<string, string> = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    navy: "text-slate-300 bg-slate-800/10 border-slate-700/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  }

  // Real chart: aggregate last 7 days from DB
  const now = new Date()
  const chartData = await Promise.all(
    Array.from({ length: 7 }).map(async (_, i) => {
      const dayStart = new Date(now)
      dayStart.setDate(now.getDate() - (6 - i))
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(dayStart)
      dayEnd.setHours(23, 59, 59, 999)

      const [projects, messages, jobs] = await Promise.all([
        prisma.projectRequest.count({ where: { createdAt: { gte: dayStart, lte: dayEnd } } }),
        prisma.contactMessage.count({ where: { createdAt: { gte: dayStart, lte: dayEnd } } }),
        prisma.jobApplication.count({ where: { createdAt: { gte: dayStart, lte: dayEnd } } }),
      ])

      return {
        name: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
        projects,
        messages,
        applications: jobs,
      }
    })
  )

  const greetingHour = now.getHours()
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="space-y-8">
      {/* Header with Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500 font-mono mb-1">
            {greeting}, <span className="text-emerald-400">{session?.user?.name?.split(" ")[0] || "Admin"}</span> —
          </p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-white">Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Bezalel Studio control center.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs font-mono text-zinc-400">
            <Clock size={12} className="text-emerald-500" />
            {now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Online
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          const colors = accentColors[stat.accent]
          return (
            <Link 
              key={idx}
              href={stat.href}
              className="group block rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 transition-all hover:bg-zinc-900/60 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${colors}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold tracking-tight text-white">{stat.count}</span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  {stat.sub}
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Revenue Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-1 sm:col-span-2 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-emerald-950/20 p-5 flex items-center gap-6">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <TrendingUp size={24} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1">Gross Revenue (All Time)</div>
            <div className="text-3xl font-black tracking-tight text-white">
              KES {((totalRevenue._sum.total || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">From {recentOrders} order{recentOrders !== 1 ? "s" : ""} · {recentApplications} total applicant{recentApplications !== 1 ? "s" : ""}</div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">Quick Actions</div>
          <div className="space-y-2">
            <Link href="/studio/careers" className="flex items-center justify-between text-xs text-zinc-300 hover:text-emerald-400 transition-colors py-1">
              <span>Post New Job</span><ArrowUpRight size={12} />
            </Link>
            <Link href="/studio/store/products" className="flex items-center justify-between text-xs text-zinc-300 hover:text-emerald-400 transition-colors py-1">
              <span>Add Product</span><ArrowUpRight size={12} />
            </Link>
            <Link href="/studio/messages" className="flex items-center justify-between text-xs text-zinc-300 hover:text-emerald-400 transition-colors py-1">
              <span>Read Messages</span><ArrowUpRight size={12} />
            </Link>
            <Link href="/studio/projects" className="flex items-center justify-between text-xs text-zinc-300 hover:text-emerald-400 transition-colors py-1">
              <span>Review Projects</span><ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Platform Activity (Last 7 Days)</h2>
          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Projects</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" />Messages</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" />Applications</span>
          </div>
        </div>
        <ActivityChart data={chartData} />
      </div>

      {/* Lists Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Pipeline */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-white">
              <FolderKanban size={16} className="text-blue-400" />
              Latest Project Requests
            </h2>
            <Link 
              href="/studio/projects" 
              className="text-xs text-zinc-500 flex items-center gap-1 hover:text-white transition-colors"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/50 font-mono text-xs">
            {latestProjects.length === 0 ? (
              <div className="py-8 text-center text-zinc-600 text-xs">No project requests yet.</div>
            ) : (
              latestProjects.map((proj) => (
                <div key={proj.id} className="py-3 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-200 truncate">{proj.title}</div>
                    <div className="text-zinc-600 text-[10px] truncate">{proj.email}</div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                    proj.status === "NEW" 
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                      : proj.status === "IN_REVIEW"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : proj.status === "QUOTED"
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {proj.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Messages */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-white">
              <Mail size={16} className="text-amber-400" />
              Recent Messages
            </h2>
            <Link 
              href="/studio/messages" 
              className="text-xs text-zinc-500 flex items-center gap-1 hover:text-white transition-colors"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/50 font-mono text-xs">
            {latestMessages.length === 0 ? (
              <div className="py-8 text-center text-zinc-600 text-xs">No messages yet.</div>
            ) : (
              latestMessages.map((msg) => (
                <div key={msg.id} className="py-3 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-200 truncate">{msg.subject}</div>
                    <div className="text-zinc-600 text-[10px] truncate">{msg.name} · {msg.email}</div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                    msg.status === "UNREAD" 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse" 
                      : msg.status === "READ"
                      ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {msg.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
