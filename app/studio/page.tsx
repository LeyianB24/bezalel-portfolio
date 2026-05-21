import prisma from "@/lib/prisma"
import { 
  Briefcase, 
  FolderKanban, 
  ShoppingBag, 
  Mail, 
  ArrowUpRight 
} from "lucide-react"
import Link from "next/link"

export const revalidate = 0 // Disable caching to fetch live data

export default async function StudioPage() {
  const [
    openJobsCount,
    pendingAppsCount,
    activeProjectsCount,
    productsCount,
    pendingOrdersCount,
    unreadMessagesCount,
    latestProjects,
    latestMessages,
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
    prisma.product.count(),
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
  ])

  const stats = [
    { label: "Active Jobs", count: openJobsCount, sub: `${pendingAppsCount} pending apps`, icon: Briefcase, href: "/studio/careers" },
    { label: "Active Projects", count: activeProjectsCount, sub: "Pipeline in review", icon: FolderKanban, href: "/studio/projects" },
    { label: "Products", count: productsCount, sub: `${pendingOrdersCount} pending orders`, icon: ShoppingBag, href: "/studio/store" },
    { label: "Unread Messages", count: unreadMessagesCount, sub: "Action required", icon: Mail, href: "/studio/messages" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Control center for Bezalel Studio platform resources.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Link 
              key={idx}
              href={stat.href}
              className="block rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">{stat.label}</span>
                <Icon className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold tracking-tight text-white">{stat.count}</span>
                <span className="text-xs text-zinc-500">{stat.sub}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Lists Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Pipeline */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <FolderKanban size={18} className="text-emerald-500" />
              Latest Project Requests
            </h2>
            <Link 
              href="/studio/projects" 
              className="text-xs text-emerald-500 flex items-center gap-1 hover:underline"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-zinc-800 font-mono text-xs">
            {latestProjects.length === 0 ? (
              <div className="py-4 text-center text-zinc-500">No project requests submitted.</div>
            ) : (
              latestProjects.map((proj) => (
                <div key={proj.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-zinc-200">{proj.title}</div>
                    <div className="text-zinc-500 text-[10px]">{proj.email}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                    proj.status === "NEW" 
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                      : proj.status === "IN_REVIEW"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {proj.status.replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Messages */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <Mail size={18} className="text-emerald-500" />
              Recent Messages
            </h2>
            <Link 
              href="/studio/messages" 
              className="text-xs text-emerald-500 flex items-center gap-1 hover:underline"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-zinc-800 font-mono text-xs">
            {latestMessages.length === 0 ? (
              <div className="py-4 text-center text-zinc-500">No contact messages.</div>
            ) : (
              latestMessages.map((msg) => (
                <div key={msg.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-zinc-200">{msg.subject}</div>
                    <div className="text-zinc-500 text-[10px]">{msg.name} ({msg.email})</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                    msg.status === "UNREAD" 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                      : "bg-zinc-800 text-zinc-400"
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
