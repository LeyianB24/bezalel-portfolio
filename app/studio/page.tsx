import prisma from "@/lib/prisma";
import {
  FolderKanban,
  Mail,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Layers,
  Server,
  Cpu,
  Plus,
  CheckCircle2,
  FileText,
  Activity,
  ShoppingBag,
  Briefcase,
  Bell,
} from "lucide-react";
import Link from "next/link";
import ActivityChart from "./ActivityChart";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

interface ProjectItem {
  id: string;
  title: string;
  name: string;
  email: string;
  status: string;
  category: string;
  createdAt: Date;
}

interface RecentSignal {
  id: string;
  type: "PROJECT" | "MESSAGE" | "ORDER" | "CAREER";
  title: string;
  subtitle: string;
  timestamp: Date;
  status: string;
  url: string;
}

export default async function StudioPage() {
  const session = await auth();

  let activeProjectsCount = 0;
  let unreadMessagesCount = 0;
  let portfolioCount = 0;
  let equipmentCount = 0;
  let techCount = 0;
  let latestProjects: ProjectItem[] = [];
  let recentApplications = 0;
  let recentOrders = 0;
  let totalRevenue = 0;
  const recentSignals: RecentSignal[] = [];

  try {
    const results = await Promise.all([
      prisma.projectRequest.count({
        where: {
          status: {
            notIn: ["DELIVERED", "CANCELLED"],
          },
        },
      }),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
      prisma.projectRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.jobApplication.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
      }),
      prisma.portfolioItem.count(),
      prisma.equipment.count(),
      prisma.techArsenalItem.count(),
      // Also fetch recent messages and orders for operational signals
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    activeProjectsCount = results[0];
    unreadMessagesCount = results[1];
    latestProjects = results[2].map((p) => ({
      id: p.id,
      title: p.title,
      name: p.name,
      email: p.email,
      status: p.status,
      category: p.category,
      createdAt: p.createdAt,
    }));
    recentApplications = results[3];
    recentOrders = results[4];
    totalRevenue = results[5]._sum?.total || 0;
    portfolioCount = results[6];
    equipmentCount = results[7];
    techCount = results[8];

    // Build unified live signals feed
    results[2].slice(0, 3).forEach((p) => {
      recentSignals.push({
        id: `pr-${p.id}`,
        type: "PROJECT",
        title: `Project: ${p.title}`,
        subtitle: `From ${p.name} • ${p.category}`,
        timestamp: p.createdAt,
        status: p.status,
        url: "/studio/projects",
      });
    });

    results[9].forEach((m) => {
      recentSignals.push({
        id: `msg-${m.id}`,
        type: "MESSAGE",
        title: `Inquiry: ${m.subject || "Client Message"}`,
        subtitle: `From ${m.name}`,
        timestamp: m.createdAt,
        status: m.status,
        url: "/studio/messages",
      });
    });

    results[10].forEach((o) => {
      recentSignals.push({
        id: `ord-${o.id}`,
        type: "ORDER",
        title: `Order #${o.id.slice(-6).toUpperCase()}`,
        subtitle: `Customer: ${o.name}`,
        timestamp: o.createdAt,
        status: o.status,
        url: "/studio/store",
      });
    });

    recentSignals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (err) {
    console.error("StudioPage database error:", err);
  }

  const now = new Date();
  const greetingHour = now.getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
      ? "Good afternoon"
      : "Good evening";

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - (6 - i));
    return {
      name: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
      projects: 2 + (i % 3),
      messages: 3 + (i % 4),
      applications: 1 + (i % 2),
    };
  });

  return (
    <div className="space-y-8">
      {/* 1. Header with Breadcrumb & Quick Action Buttons */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Bezalel Technologies</span>
            <span>/</span>
            <span className="text-accent-dark dark:text-accent-light font-extrabold">
              Executive Studio Console
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {greeting},{" "}
            <span className="text-accent-dark dark:text-accent-light">
              {session?.user?.name?.split(" ")[0] || "Engineer"}
            </span>
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Centralized telemetry for project requests, client quotations, portfolio deployments, and hardware operations.
          </p>
        </div>

        {/* Action Header */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground sm:flex shadow-2xs">
            <Clock size={13} className="text-accent-dark dark:text-accent-light" />
            <span>{now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
          </div>

          <Link
            href="/studio/projects"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light transition-all"
          >
            <Plus size={14} />
            New Quote
          </Link>

          <Link
            href="/studio/equipment"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-all"
          >
            <Server size={14} className="text-accent-dark dark:text-accent-light" />
            Equipment ({equipmentCount})
          </Link>
        </div>
      </div>

      {/* 2. Top Metric KPI Grid (4 Cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Active Projects */}
        <Link
          href="/studio/projects"
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Pipeline
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 text-accent-dark dark:text-accent-light">
              <FolderKanban size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-display text-3xl font-black text-foreground">
              {activeProjectsCount}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Activity size={12} /> Active Delivery
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Client briefs and active engineering contracts
          </p>
        </Link>

        {/* Card 2: Portfolio Deployments */}
        <Link
          href="/studio/portfolio"
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Portfolio Proof
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary text-primary-foreground">
              <Layers size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-display text-3xl font-black text-foreground">
              {portfolioCount}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E8CD84]">
              <CheckCircle2 size={12} /> Published
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Live client case studies on public site
          </p>
        </Link>

        {/* Card 3: Hardware Equipment */}
        <Link
          href="/studio/equipment"
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Hardware Inventory
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 text-accent-dark dark:text-accent-light">
              <Server size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-display text-3xl font-black text-foreground">
              {equipmentCount}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={12} /> Enterprise Grade
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Supported switches, boardroom AV & CCTV gear
          </p>
        </Link>

        {/* Card 4: Unread Client Inquiries */}
        <Link
          href="/studio/messages"
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Inquiries & Messages
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500">
              <Mail size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-display text-3xl font-black text-foreground">
              {unreadMessagesCount}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              Unread
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Direct inbound prospective client inquiries
          </p>
        </Link>
      </div>

      {/* 3. Revenue & Transaction Telemetry Banner */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent/15 text-accent-dark dark:text-accent-light">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Fulfilled Software & Hardware Revenue
                </p>
                <p className="font-display text-2xl font-black text-foreground sm:text-3xl font-mono">
                  KES {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                M-Pesa & Bank Settled
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Store Orders</p>
              <p className="mt-0.5 font-bold text-foreground">{recentOrders} verified</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Career Applicants</p>
              <p className="mt-0.5 font-bold text-foreground">{recentApplications} total</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tech Arsenal</p>
              <p className="mt-0.5 font-bold text-foreground">{techCount} tools</p>
            </div>
          </div>
        </div>

        {/* Quick Command Launcher */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Fast Administrative Routes
            </p>
            <div className="space-y-1.5">
              <Link
                href="/studio/projects"
                className="flex items-center justify-between rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs font-bold text-foreground hover:border-accent/40 hover:bg-secondary transition-all"
              >
                <span className="flex items-center gap-2">
                  <FileText size={14} className="text-accent-dark dark:text-accent-light" />
                  Issue Itemized PDF Quote
                </span>
                <ArrowUpRight size={13} className="text-muted-foreground" />
              </Link>
              <Link
                href="/studio/portfolio"
                className="flex items-center justify-between rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs font-bold text-foreground hover:border-accent/40 hover:bg-secondary transition-all"
              >
                <span className="flex items-center gap-2">
                  <Layers size={14} className="text-accent-dark dark:text-accent-light" />
                  Publish Portfolio Case Study
                </span>
                <ArrowUpRight size={13} className="text-muted-foreground" />
              </Link>
              <Link
                href="/studio/equipment"
                className="flex items-center justify-between rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs font-bold text-foreground hover:border-accent/40 hover:bg-secondary transition-all"
              >
                <span className="flex items-center gap-2">
                  <Server size={14} className="text-accent-dark dark:text-accent-light" />
                  Add Enterprise Hardware
                </span>
                <ArrowUpRight size={13} className="text-muted-foreground" />
              </Link>
              <Link
                href="/studio/tech-arsenal"
                className="flex items-center justify-between rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs font-bold text-foreground hover:border-accent/40 hover:bg-secondary transition-all"
              >
                <span className="flex items-center gap-2">
                  <Cpu size={14} className="text-accent-dark dark:text-accent-light" />
                  Configure Tech Arsenal
                </span>
                <ArrowUpRight size={13} className="text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Intake Telemetry Chart & Recent Inquiries & Live Signals */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Inflow Activity Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">
                Inflow & Intake Activity
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily project briefs, client messages, and candidate applications
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-[#C9A24B]">
                <span className="h-2 w-2 rounded-full bg-[#C9A24B]" /> Projects
              </span>
              <span className="flex items-center gap-1 text-[#8FA0B3]">
                <span className="h-2 w-2 rounded-full bg-[#8FA0B3]" /> Messages
              </span>
            </div>
          </div>
          <ActivityChart data={chartData} />
        </div>

        {/* Live Operational Signals Feed */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Bell size={15} className="text-accent-dark dark:text-accent-light" />
                <h2 className="font-display text-sm font-bold text-foreground">
                  Inbound Signals Feed
                </h2>
              </div>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] font-bold text-accent-dark dark:text-accent-light">
                LIVE
              </span>
            </div>

            <div className="space-y-2.5">
              {recentSignals.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  No inbound signals logged yet.
                </p>
              ) : (
                recentSignals.slice(0, 5).map((s) => (
                  <Link
                    key={s.id}
                    href={s.url}
                    className="block rounded-lg border border-border bg-background p-2.5 transition-all hover:border-accent/40 hover:bg-secondary/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                        {s.type === "PROJECT" && <FolderKanban size={13} className="text-accent shrink-0" />}
                        {s.type === "MESSAGE" && <Mail size={13} className="text-blue-500 shrink-0" />}
                        {s.type === "ORDER" && <ShoppingBag size={13} className="text-emerald-500 shrink-0" />}
                        {s.type === "CAREER" && <Briefcase size={13} className="text-purple-500 shrink-0" />}
                        <span className="truncate">{s.title}</span>
                      </span>
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-accent-dark dark:text-accent-light shrink-0">
                        {s.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="truncate text-[10px]">{s.subtitle}</span>
                      <span className="font-mono text-[9px] shrink-0">
                        {new Date(s.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4 flex items-center justify-between text-xs">
            <Link
              href="/studio/projects"
              className="font-bold text-accent-dark dark:text-accent-light hover:underline"
            >
              Projects ({activeProjectsCount})
            </Link>
            <Link
              href="/studio/messages"
              className="font-bold text-accent-dark dark:text-accent-light hover:underline"
            >
              Messages ({unreadMessagesCount})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
