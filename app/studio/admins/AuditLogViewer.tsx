"use client";

import { useState, useEffect } from "react";
import { Shield, RefreshCw, Clock, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLogItem {
  id: string;
  actorId?: string | null;
  actorEmail?: string | null;
  actorName?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/studio/audit", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.entityType.toLowerCase().includes(q) ||
      (l.actorEmail && l.actorEmail.toLowerCase().includes(q)) ||
      (l.actorName && l.actorName.toLowerCase().includes(q)) ||
      (l.entityId && l.entityId.toLowerCase().includes(q))
    );
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes("CREATE") || action.includes("SENT") || action.includes("ACCEPT")) {
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    }
    if (action.includes("DELETE") || action.includes("CANCEL") || action.includes("REJECT")) {
      return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30";
    }
    if (action.includes("UPDATE") || action.includes("EDIT") || action.includes("STATUS")) {
      return "bg-accent/15 text-accent-dark dark:text-accent-light border-accent/30";
    }
    return "bg-secondary text-muted-foreground border-border";
  };

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-accent-dark dark:text-accent-light" />
          <h3 className="font-display text-base font-bold text-foreground">
            Administrative Audit Trail
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit actions, admins..."
              className="rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent outline-none"
            />
          </div>

          <button
            type="button"
            onClick={fetchLogs}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh logs"
          >
            <RefreshCw size={13} className={cn(isLoading && "animate-spin text-accent")} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            {isLoading ? "Loading audit trail telemetry..." : "No administrative audit records logged yet."}
          </div>
        ) : (
          <div className="divide-y divide-border/60 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Action</th>
                  <th className="py-2.5 px-4 font-bold">Entity</th>
                  <th className="py-2.5 px-4 font-bold">Actor</th>
                  <th className="py-2.5 px-4 font-bold">Details</th>
                  <th className="py-2.5 px-4 font-bold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                      <span className={cn("inline-block rounded-md border px-2 py-0.5 text-[10px]", getActionBadgeColor(log.action))}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-foreground">{log.entityType}</span>
                      {log.entityId && (
                        <span className="block font-mono text-[10px] text-muted-foreground truncate max-w-[120px]">
                          #{log.entityId.slice(-8)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-muted-foreground shrink-0" />
                        <div className="truncate max-w-[140px]">
                          <p className="font-semibold text-foreground truncate">{log.actorName || "Admin"}</p>
                          <p className="font-mono text-[10px] text-muted-foreground truncate">{log.actorEmail || "Console"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {log.metadata ? (
                        <pre className="font-mono text-[10px] text-muted-foreground max-w-[200px] truncate bg-background/50 rounded px-1.5 py-0.5">
                          {JSON.stringify(log.metadata)}
                        </pre>
                      ) : (
                        <span className="text-muted-foreground text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Clock size={11} className="text-muted-foreground" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
