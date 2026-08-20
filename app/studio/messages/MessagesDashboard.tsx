"use client";

import { useState } from "react";
import { MessageSquare, Eye, X, Loader2, Mail, Trash2, CheckCircle2, Clock } from "lucide-react";
import { MessageStatus } from "@prisma/client";
import { toast } from "sonner";

interface MessageWithUser {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: Date | string;
}

interface MessagesDashboardProps {
  initialMessages: MessageWithUser[];
}

export default function MessagesDashboard({ initialMessages }: MessagesDashboardProps) {
  const [messages, setMessages] = useState<MessageWithUser[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithUser | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [appStatus, setAppStatus] = useState<MessageStatus>("UNREAD");
  const [isUpdating, setIsUpdating] = useState(false);

  const openMessageDetails = (message: MessageWithUser) => {
    setSelectedMessage(message);
    setAppStatus(message.status);

    // Auto-mark as READ if it was UNREAD
    if (message.status === "UNREAD") {
      handleUpdateStatus(message.id, "READ", true);
    }
  };

  const handleUpdateStatus = async (id: string, status: MessageStatus, silent = false) => {
    if (!silent) setIsUpdating(true);
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      const updated = await response.json();

      setMessages((msgs) => msgs.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
      if (!silent) {
        toast.success("Message status updated successfully");
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
      if (!silent) toast.error("Failed to update message status");
    } finally {
      if (!silent) setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry permanently?")) return;

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setMessages((msgs) => msgs.filter((m) => m.id !== id));
      toast.success("Inquiry removed from inbox");
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  const handleUpdateMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;
    handleUpdateStatus(selectedMessage.id, appStatus);
  };

  const filteredMessages = messages.filter((m) => {
    if (statusFilter === "all") return true;
    return m.status === statusFilter;
  });

  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            <span>Studio Ops</span>
            <span>/</span>
            <span className="text-accent-dark dark:text-accent-light font-extrabold">Inbound Communications</span>
          </div>
          <h1 className="font-display text-3xl font-black text-foreground tracking-tight sm:text-4xl">
            Client Inquiries &amp; Messages
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {messages.length} total message{messages.length !== 1 ? "s" : ""} · {unreadCount} unread inquiry{unreadCount !== 1 ? "ies" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Inquiries ({messages.length})</option>
            <option value="UNREAD">Unread ({unreadCount})</option>
            <option value="READ">Read</option>
            <option value="REPLIED">Replied</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* 2. Messages Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="border-b border-border bg-secondary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-accent-dark dark:text-accent-light" />
            <h2 className="font-display text-base font-bold text-foreground">Inbound Inquiries</h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground font-semibold">
            {filteredMessages.length} displayed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3.5">Client / Sender</th>
                <th className="px-6 py-3.5">Subject</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Received Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-muted-foreground text-xs">
                    <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground mb-3">
                      <Mail size={20} />
                    </div>
                    No inquiries found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-secondary/20 transition-colors ${
                      msg.status === "UNREAD" ? "bg-accent/5 font-medium" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {msg.status === "UNREAD" && (
                          <span className="h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" />
                        )}
                        <span className="font-bold text-foreground">{msg.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-foreground font-medium">
                      {msg.subject}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          msg.status === "UNREAD"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : msg.status === "READ"
                            ? "bg-secondary text-muted-foreground border border-border"
                            : msg.status === "REPLIED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-secondary/60 text-muted-foreground/80 border border-border/50"
                        }`}
                      >
                        {msg.status === "REPLIED" && <CheckCircle2 size={11} />}
                        {msg.status === "UNREAD" && <Clock size={11} />}
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openMessageDetails(msg)}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground hover:border-accent/50 hover:bg-secondary transition-all"
                        >
                          <Eye size={13} className="text-accent-dark dark:text-accent-light" /> View
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="rounded p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. View Inquiry Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[90vh]">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-accent-dark dark:text-accent-light">
                <Mail size={16} />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-foreground">Inquiry Details</h2>
                <span className="font-mono text-xs text-muted-foreground">
                  Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateMessageSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 mt-4">
              <div className="bg-secondary/40 border border-border p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">CLIENT NAME</span>
                    <span className="text-foreground text-sm font-bold">{selectedMessage.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">CONTACT EMAIL</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-accent-dark dark:text-accent-light text-sm font-bold hover:underline flex items-center gap-1.5 mt-0.5"
                    >
                      <Mail size={13} /> {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block mb-1">
                    SUBJECT
                  </span>
                  <p className="text-foreground font-bold text-sm">{selectedMessage.subject}</p>
                </div>

                <div className="border-t border-border pt-3">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block mb-1">
                    MESSAGE CONTENT
                  </span>
                  <p className="text-foreground/90 text-sm whitespace-pre-wrap leading-relaxed bg-background/80 p-4 rounded-md border border-border">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Update Inquiry Status
                </label>
                <select
                  value={appStatus}
                  onChange={(e) => setAppStatus(e.target.value as MessageStatus)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent font-bold uppercase"
                >
                  {Object.values(MessageStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm hover:bg-accent-light disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
