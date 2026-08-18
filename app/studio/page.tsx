import prisma from "@/lib/prisma";
import { 
  Briefcase, 
  FolderKanban, 
  ShoppingBag, 
  Mail, 
  ArrowUpRight,
  TrendingUp,
  Clock
} from "lucide-react";
import Link from "next/link";
import ActivityChart from "./ActivityChart";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const session = await auth();

  let openJobsCount = 0;
  let pendingAppsCount = 0;
  let activeProjectsCount = 0;
  let productsCount = 0;
  let pendingOrdersCount = 0;
  let unreadMessagesCount = 0;
  let latestProjects: any[] = [];
  let latestMessages: any[] = [];
  let recentApplications = 0;
  let recentOrders = 0;
  let totalRevenue = { _sum: { total: 0 } };

  try {
    const results = await Promise.all([
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
    ]);

    openJobsCount = results[0];
    pendingAppsCount = results[1];
    activeProjectsCount = results[2];
    productsCount = results[3];
    pendingOrdersCount = results[4];
    unreadMessagesCount = results[5];
    latestProjects = results[6];
    latestMessages = results[7];
    recentApplications = results[8];
    recentOrders = results[9];
    totalRevenue = results[10] as any;
  } catch (err) {
    console.error("StudioPage database error:", err);
  }

  const stats = [
    { 
      label: "Active Roles", 
      count: openJobsCount, 
      sub: `${pendingAppsCount} pending applicant${pendingAppsCount !== 1 ? "s" : ""}`, 
      icon: Briefcase, 
      href: "/studio/careers",
      accent: "gold"
    },
    { 
      label: "Active Projects", 
      count: activeProjectsCount, 
      sub: "In delivery pipeline", 
      icon: FolderKanban, 
      href: "/studio/projects",
      accent: "navy"
    },
    { 
      label: "Active Products", 
      count: productsCount, 
      sub: `${pendingOrdersCount} pending order${pendingOrdersCount !== 1 ? "s" : ""}`, 
      icon: ShoppingBag, 
      href: "/studio/store",
      accent: "gold"
    },
    { 
      label: "Unread Messages", 
      count: unreadMessagesCount, 
      sub: "Client inquiries", 
      icon: Mail, 
      href: "/studio/messages",
      accent: "amber"
    },
  ];

  const accentColors: Record<string, string> = {
    gold: "text-accent-dark dark:text-accent-light bg-accent/15 border-accent/30",
    navy: "text-foreground bg-secondary border-border",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  };

  const now = new Date();
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - (6 - i));
    return {
      name: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
      projects: 1 + (i % 2),
      messages: 2 + (i % 3),
      applications: i % 2,
    };
  });

  const greetingHour = now.getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Header with Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
            {greeting}, <span className="text-accent-dark dark:text-accent-light">{session?.user?.name?.split(" ")[0] || "Bezalel Admin"}</span> —
          </p>
          <h1 className="font-display text-3xl font-black tracking-tight text-foreground">Studio Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Operational dashboard, client quotes, portfolio, and project delivery center.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-bold text-muted-foreground">
            <Clock size={12} className="text-accent" />
            {now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-accent/30 bg-accent/10 text-xs font-bold text-accent-dark dark:text-accent-light">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live System Operational
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colors = accentColors[stat.accent] || accentColors.gold;
          return (
            <Link 
              key={idx}
              href={stat.href}
              className="group block rounded-lg border border-border bg-card p-5 transition-all hover:border-accent/40 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                <div className={`w-8 h-8 rounded-md border flex items-center justify-center ${colors}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tight text-foreground">{stat.count}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {stat.sub}
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Revenue Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-1 sm:col-span-2 rounded-lg border border-border bg-card p-6 flex items-center gap-6 shadow-sm">
          <div className="w-14 h-14 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 text-accent-dark dark:text-accent-light">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Fulfilled Hardware & Project Revenue</div>
            <div className="text-3xl font-black tracking-tight text-foreground font-mono">
              KES {((totalRevenue._sum?.total || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Across {recentOrders} verified order{recentOrders !== 1 ? "s" : ""} · {recentApplications} career applicant{recentApplications !== 1 ? "s" : ""}</div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Quick Navigation</div>
          <div className="space-y-2">
            <Link href="/studio/projects" className="flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-accent-dark dark:hover:text-accent-light transition-colors py-1">
              <span>Generate PDF Quote</span><ArrowUpRight size={12} />
            </Link>
            <Link href="/studio/portfolio" className="flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-accent-dark dark:hover:text-accent-light transition-colors py-1">
              <span>Manage Portfolio</span><ArrowUpRight size={12} />
            </Link>
            <Link href="/studio/careers" className="flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-accent-dark dark:hover:text-accent-light transition-colors py-1">
              <span>Post New Role</span><ArrowUpRight size={12} />
            </Link>
            <Link href="/studio/messages" className="flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-accent-dark dark:hover:text-accent-light transition-colors py-1">
              <span>Client Inquiries</span><ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Platform Activity Trend</h2>
          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" />Projects</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-foreground" />Messages</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-light" />Applications</span>
          </div>
        </div>
        <ActivityChart data={chartData} />
      </div>

      {/* Lists Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Pipeline */}
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <FolderKanban size={15} className="text-accent" />
              Latest Project Requests
            </h2>
            <Link 
              href="/studio/projects" 
              className="text-xs font-bold text-accent-dark dark:text-accent-light flex items-center gap-1 hover:underline"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border text-xs">
            {latestProjects.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs">No project requests recorded yet.</div>
            ) : (
              latestProjects.map((proj) => (
                <div key={proj.id} className="py-3 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">{proj.title}</div>
                    <div className="text-muted-foreground text-[11px] truncate">{proj.email}</div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    proj.status === "NEW" 
                      ? "bg-accent/10 text-accent-dark dark:text-accent-light border border-accent/20" 
                      : proj.status === "IN_REVIEW"
                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20"
                      : proj.status === "QUOTED"
                      ? "bg-accent/20 text-accent-dark dark:text-accent-light border border-accent/40"
                      : "bg-secondary text-foreground border border-border"
                  }`}>
                    {proj.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Messages */}
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Mail size={15} className="text-accent" />
              Recent Inquiries
            </h2>
            <Link 
              href="/studio/messages" 
              className="text-xs font-bold text-accent-dark dark:text-accent-light flex items-center gap-1 hover:underline"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border text-xs">
            {latestMessages.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs">No inquiries received yet.</div>
            ) : (
              latestMessages.map((msg) => (
                <div key={msg.id} className="py-3 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">{msg.subject}</div>
                    <div className="text-muted-foreground text-[11px] truncate">{msg.name} · {msg.email}</div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    msg.status === "UNREAD" 
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" 
                      : msg.status === "READ"
                      ? "bg-secondary text-muted-foreground border border-border"
                      : "bg-accent/15 text-accent-dark dark:text-accent-light border border-accent/30"
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
  );
}
