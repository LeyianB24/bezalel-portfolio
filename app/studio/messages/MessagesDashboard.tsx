"use client";

import { useState } from "react";
import { MessageSquare, Eye, X, Loader2, Mail, Trash2 } from "lucide-react";
import { MessageStatus } from "@prisma/client";
import { toast } from "sonner";

interface MessageWithUser {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
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

      setMessages(msgs => msgs.map(m => m.id === updated.id ? { ...m, ...updated } : m));
      if (!silent) {
        toast.success("Message status updated");
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
    if (!confirm("Are you sure you want to delete this message permanently?")) return;
    
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");
      
      setMessages(msgs => msgs.filter(m => m.id !== id));
      toast.success("Message deleted");
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

  const filteredMessages = messages.filter(m => {
    if (statusFilter === "all") return true;
    return m.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Inbox Hub</h1>
          <p className="text-zinc-400 text-sm">Manage public inquiries and contact form submissions.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
        <span className="text-zinc-400 text-sm font-mono flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Filter by Status:
        </span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black border border-zinc-850 text-zinc-300 rounded px-3 py-1.5 text-sm outline-none focus:border-emerald-600 font-mono"
        >
          <option value="all">All Messages</option>
          {Object.values(MessageStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/20">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-mono text-xs uppercase">
              <th className="p-4">Sender</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {filteredMessages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  No messages found.
                </td>
              </tr>
            ) : (
              filteredMessages.map(msg => (
                <tr key={msg.id} className={`hover:bg-zinc-900/40 transition-colors ${msg.status === 'UNREAD' ? 'bg-zinc-900/60' : ''}`}>
                  <td className="p-4">
                    <div className={`text-white ${msg.status === 'UNREAD' ? 'font-bold' : 'font-medium'}`}>{msg.name}</div>
                    <div className="text-zinc-400 text-xs font-mono">{msg.email}</div>
                  </td>
                  <td className="p-4 max-w-xs truncate">
                    <span className="text-zinc-300">
                      {msg.subject}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                      msg.status === "UNREAD" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      msg.status === "READ" ? "bg-zinc-800 text-zinc-300 border border-zinc-700" :
                      msg.status === "REPLIED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      msg.status === "ARCHIVED" ? "bg-zinc-900 text-zinc-600 border border-zinc-800" :
                      "bg-zinc-800 text-zinc-500 border border-zinc-700"
                    }`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-zinc-400 text-xs">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openMessageDetails(msg)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono bg-zinc-850 hover:bg-zinc-800 text-white px-2.5 py-1.5 rounded transition-all border border-zinc-800"
                      >
                        <Eye className="w-3.5 h-3.5" /> Read
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col max-h-[95vh]">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-2">Message View</h2>
            <div className="text-zinc-400 text-xs font-mono flex items-center gap-2 mb-4 border-b border-zinc-850 pb-4">
              <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
            </div>

            <form onSubmit={handleUpdateMessageSubmit} className="space-y-5 overflow-y-auto flex-1 pr-1">
              
              <div className="bg-black/40 border border-zinc-850 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block">SENDER</span>
                    <span className="text-white text-sm font-bold">{selectedMessage.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">EMAIL</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-emerald-400 text-sm hover:underline flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" /> {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="border-t border-zinc-850 pt-3 mt-3">
                  <span className="text-xs font-mono text-zinc-500 block mb-1">SUBJECT</span>
                  <p className="text-white font-bold">{selectedMessage.subject}</p>
                </div>

                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-1">MESSAGE</span>
                  <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed bg-zinc-950/50 p-4 rounded border border-zinc-850">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-zinc-400 uppercase">Message Status</label>
                <select
                  value={appStatus}
                  onChange={(e) => setAppStatus(e.target.value as MessageStatus)}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-650 font-mono text-sm"
                >
                  {Object.values(MessageStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end border-t border-zinc-850 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="bg-zinc-850 hover:bg-zinc-800 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-all"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-1.5"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Status
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
