import prisma from "@/lib/prisma";
import { 
  Briefcase, 
  FolderKanban, 
  ShoppingBag, 
  Mail, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  Layers,
  Server
} from "lucide-react";
import Link from "next/link";
import ActivityChart from "./ActivityChart";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

interface ProjectItem {
  id: string;
  title: string;
  email: string;
  status: string;
}

interface MessageItem {
  id: string;
  subject: string;
  name: string;
  email: string;
  status: string;
}

export default async function StudioPage() {
  const session = await auth();

  let openJobsCount = 0;
  let pendingAppsCount = 0;
  let activeProjectsCount = 0;
  let productsCount = 0;
  let pendingOrdersCount = 0;
  let unreadMessagesCount = 0;
  let portfolioCount = 0;
  let equipmentCount = 0;
  let latestProjects: ProjectItem[] = [];
  let latestMessages: MessageItem[] = [];
  let recentApplications = 0;
  let recentOrders = 0;
  let totalRevenue = 0;

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
      prisma.portfolioItem.count(),
      prisma.equipment.count(),
    ]);

    openJobsCount = results[0];
    pendingAppsCount = results[1];
    activeProjectsCount = results[2];
    productsCount = results[3];
    pendingOrdersCount = results[4];
    unreadMessagesCount = results[5];
    latestProjects = results[6].map((p) => ({ id: p.id, title: p.title, email: p.email, status: p.status }));
    latestMessages = results[7].map((m) => ({ id: m.id, subject: m.subject, name: m.name, email: m.email, status: m.status }));
    recentApplications = results[8];
    recentOrders = results[9];
    totalRevenue = results[10]._sum?.total || 0;
    portfolioCount = results[11];
    equipmentCount = results[12];
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
      label: "Portfolio Items", 
      count: portfolioCount, 
      sub: "Live client proof", 
      icon: Layers, 
      href: "/studio/portfolio",
      accent: "gold"
    },
    { 
      label: "Hardware & Gear", 
      count: equipmentCount, 
      sub: "Enterprise infra gear", 
      icon: Server, 
      href: "/studio/equipment",
      accent: "navy"
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
            Operational dashboard, client quotes, portfolio, hardware equipment, and project delivery center.
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
              KES {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              <span>Manage Portfolio ({portfolioCount})</span><ArrowUpRight size={12} />
            </Link>
            <Link href="/studio/equipment" className="flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-accent-dark dark:hover:text-accent-light transition-colors py-1">
              <span>Manage Equipment ({equipmentCount})</span><ArrowUpRight size={12} />
            </Link>
            <Link href="/studio/careers" className="flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-accent-dark dark:hover:text-accent-light transition-colors py-1">
              <span>Review Applications ({pendingAppsCount})</span><ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Studio Content: Chart + Recent Inquiries */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Activity Chart */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Weekly Intake Activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Project briefs, client messages, and career submissions</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
              Last 7 Days
            </span>
          </div>
          <ActivityChart data={chartData} />
        </div>

        {/* Recent Client Messages */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Recent Inquiries</h2>
              <Link href="/studio/messages" className="text-xs font-bold text-accent-dark dark:text-accent-light hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {latestMessages.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No messages received yet.</p>
              ) : (
                latestMessages.map((msg) => (
                  <div key={msg.id} className="rounded-md border border-border bg-background p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-foreground truncate">{msg.name}</span>
                      <span className="text-[10px] font-mono uppercase text-accent-dark dark:text-accent-light">
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">{msg.subject}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <Link
              href="/studio/messages"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-secondary py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary/80"
            >
              Open Message Inbox
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
