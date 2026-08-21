"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  FolderKanban,
  Mail,
  ShoppingBag,
  Briefcase,
  RefreshCw,
  ExternalLink,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StudioNotificationItem } from "@/app/api/studio/notifications/route";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NotificationCenter() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PROJECT" | "MESSAGE" | "ORDER" | "CAREER">("ALL");
  const [notifications, setNotifications] = useState<StudioNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [summary, setSummary] = useState({
    projectsUnread: 0,
    messagesUnread: 0,
    ordersUnread: 0,
    applicationsUnread: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    try {
      const res = await fetch("/api/studio/notifications", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      if (!quiet) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Auto-poll every 45 seconds
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Mark single item as read
  const handleMarkItemRead = async (item: StudioNotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isUnread: false } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await fetch("/api/studio/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "MARK_ITEM_READ",
          id: item.id,
          type: item.type,
        }),
      });
    } catch {
      toast.error("Failed to update notification status");
      fetchNotifications(true);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
      setUnreadCount(0);
      setSummary({
        projectsUnread: 0,
        messagesUnread: 0,
        ordersUnread: 0,
        applicationsUnread: 0,
      });

      await fetch("/api/studio/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_ALL_MESSAGES_READ" }),
      });
      toast.success("All messages marked as read");
    } catch {
      toast.error("Could not complete action");
      fetchNotifications(true);
    }
  };

  const handleItemClick = (item: StudioNotificationItem) => {
    if (item.isUnread) {
      handleMarkItemRead(item, { stopPropagation: () => {} } as any);
    }
    setIsOpen(false);
    router.push(item.actionUrl);
  };

  const filteredItems = notifications.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.type === activeFilter;
  });

  const getCategoryIcon = (type: StudioNotificationItem["type"]) => {
    switch (type) {
      case "PROJECT":
        return <FolderKanban size={15} className="text-[#C9A24B]" />;
      case "MESSAGE":
        return <Mail size={15} className="text-blue-500 dark:text-blue-400" />;
      case "ORDER":
        return <ShoppingBag size={15} className="text-emerald-500" />;
      case "CAREER":
        return <Briefcase size={15} className="text-purple-500 dark:text-purple-400" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/80 text-foreground backdrop-blur-md shadow-2xs transition-all hover:border-accent/40 hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-accent",
          isOpen && "border-accent bg-secondary ring-1 ring-accent"
        )}
        aria-label="Open notifications"
        title="Inbound Signals & Notifications"
      >
        <Bell size={16} className={cn(unreadCount > 0 && "text-accent-dark dark:text-accent-light")} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] font-black text-accent-foreground shadow-xs animate-in zoom-in-50">
            {unreadCount > 99 ? "99+" : unreadCount}
            <span className="absolute -inset-0.5 rounded-full bg-accent opacity-40 animate-ping" />
          </span>
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-11 z-50 w-[92vw] max-w-[420px] rounded-xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-secondary/30">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/20 text-accent-dark dark:text-accent-light">
                  <Bell size={13} />
                </div>
                <div>
                  <span className="font-display text-xs font-black uppercase tracking-wider text-foreground block">
                    Operational Signals
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {unreadCount} unread / {notifications.length} logged
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fetchNotifications()}
                  disabled={isLoading}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
                  title="Refresh signals"
                >
                  <RefreshCw size={13} className={cn(isLoading && "animate-spin text-accent")} />
                </button>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck size={12} className="text-accent" />
                    <span>Clear</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 border-b border-border/80 px-2 py-1.5 bg-background/50 overflow-x-auto scrollbar-hide text-[11px] font-mono font-bold">
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className={cn(
                  "rounded-md px-2.5 py-1 transition-all shrink-0",
                  activeFilter === "ALL"
                    ? "bg-accent text-accent-foreground font-black shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("PROJECT")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 transition-all shrink-0",
                  activeFilter === "PROJECT"
                    ? "bg-accent text-accent-foreground font-black shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                Projects {summary.projectsUnread > 0 && <span className="rounded-full bg-red-500 px-1 text-[8px] text-white">{summary.projectsUnread}</span>}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("MESSAGE")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 transition-all shrink-0",
                  activeFilter === "MESSAGE"
                    ? "bg-accent text-accent-foreground font-black shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                Messages {summary.messagesUnread > 0 && <span className="rounded-full bg-blue-500 px-1 text-[8px] text-white">{summary.messagesUnread}</span>}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("ORDER")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 transition-all shrink-0",
                  activeFilter === "ORDER"
                    ? "bg-accent text-accent-foreground font-black shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                Orders {summary.ordersUnread > 0 && <span className="rounded-full bg-emerald-500 px-1 text-[8px] text-white">{summary.ordersUnread}</span>}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("CAREER")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 transition-all shrink-0",
                  activeFilter === "CAREER"
                    ? "bg-accent text-accent-foreground font-black shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                Careers
              </button>
            </div>

            {/* Notification Items List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60 p-1">
              {filteredItems.length === 0 ? (
                <div className="py-10 text-center px-4">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <SlidersHorizontal size={18} />
                  </div>
                  <p className="text-xs font-bold text-foreground">No inbound signals in this stream</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    System telemetry is nominal. All incoming requests have been handled.
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "group relative flex cursor-pointer items-start gap-3 rounded-lg p-2.5 transition-all",
                      item.isUnread
                        ? "bg-accent/5 hover:bg-accent/10 border-l-2 border-accent"
                        : "hover:bg-secondary/60 opacity-80 hover:opacity-100"
                    )}
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/80 bg-background shadow-2xs">
                      {getCategoryIcon(item.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={cn("truncate text-xs font-bold", item.isUnread ? "text-foreground font-extrabold" : "text-foreground/90")}>
                          {item.title}
                        </p>
                        <span className="font-mono text-[9px] text-muted-foreground shrink-0">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>

                      <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                        {item.subtitle}
                      </p>

                      {item.details && (
                        <p className="truncate text-[10px] font-mono text-accent-dark dark:text-accent-light/90 mt-1">
                          {item.details}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.isUnread && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkItemRead(item, e)}
                          className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                          title="Mark as read"
                        >
                          <Check size={13} />
                        </button>
                      )}
                      <ExternalLink size={12} className="text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Quick Links */}
            <div className="border-t border-border bg-secondary/30 p-2.5 flex items-center justify-between text-[11px]">
              <span className="font-mono text-[10px] text-muted-foreground">
                Live Admin Console Telemetry
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/studio/projects"
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-accent-dark dark:text-accent-light hover:underline"
                >
                  Projects &rarr;
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/studio/messages"
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-accent-dark dark:text-accent-light hover:underline"
                >
                  Inbox &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
