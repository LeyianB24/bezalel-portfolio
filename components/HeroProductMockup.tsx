"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Activity,
  Layers,
  CreditCard,
  ShieldCheck,
  Building2,
  Server,
} from "lucide-react";

type MockupTab = "sacco" | "estate" | "payments";

export default function HeroProductMockup() {
  const [activeTab, setActiveTab] = useState<MockupTab>("sacco");

  return (
    <div className="relative mx-auto w-full max-w-2xl rounded-xl border border-white/15 bg-[#050D17]/95 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
      {/* Window Titlebar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 hidden text-[11px] font-mono text-white/50 sm:inline-block">
            app.bezalel.website/{activeTab}-engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live in Production
          </span>
        </div>
      </div>

      {/* Domain Switcher */}
      <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => setActiveTab("sacco")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-all ${
            activeTab === "sacco"
              ? "bg-[#C9A24B] text-[#050D17] shadow-sm font-bold"
              : "text-white/70 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span className="truncate">SACCO Portal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("estate")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-all ${
            activeTab === "estate"
              ? "bg-[#C9A24B] text-[#050D17] shadow-sm font-bold"
              : "text-white/70 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span className="truncate">Estate & AV Infra</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-all ${
            activeTab === "payments"
              ? "bg-[#C9A24B] text-[#050D17] shadow-sm font-bold"
              : "text-white/70 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span className="truncate">Daraja Rails</span>
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="mt-3 min-h-[300px] rounded-lg border border-white/10 bg-[#0B2036]/60 p-4 sm:p-5">
        <AnimatePresence mode="wait">
          {activeTab === "sacco" && (
            <motion.div
              key="sacco"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Harambee SACCO Core Operations</h4>
                  <p className="text-xs text-[#8FA0B3]">Member ledger, dividend distributions & instant STK push</p>
                </div>
                <span className="text-[11px] font-mono text-[#E8CD84]">v2.4.2-prod</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA0B3]">Daily Volume</p>
                  <p className="mt-1 text-sm font-black text-white sm:text-base">KES 1.48M</p>
                  <span className="text-[10px] text-emerald-400">99.98% settled</span>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA0B3]">Active Members</p>
                  <p className="mt-1 text-sm font-black text-white sm:text-base">4,820</p>
                  <span className="text-[10px] text-[#E8CD84]">+142 this week</span>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA0B3]">API Latency</p>
                  <p className="mt-1 text-sm font-black text-white sm:text-base">42ms</p>
                  <span className="text-[10px] text-emerald-400">P99 &lt; 78ms</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8FA0B3]">Recent Ledger Events</p>
                <div className="divide-y divide-white/5 rounded-md border border-white/10 bg-black/30 text-xs">
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white/90">MBR-4092 Repayment</span>
                    </div>
                    <span className="font-semibold text-white">KES 25,000</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white/90">MBR-1831 Share Purchase</span>
                    </div>
                    <span className="font-semibold text-white">KES 10,000</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-[#E8CD84] shrink-0" />
                      <span className="font-mono text-white/90">Monthly Dividend Auto-Reconcile</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">Synced</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "estate" && (
            <motion.div
              key="estate"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Commercial Estate & Boardroom Infra</h4>
                  <p className="text-xs text-[#8FA0B3]">CCTV mesh, biometric turnstiles & Crestron AV automation</p>
                </div>
                <span className="text-[11px] font-mono text-[#E8CD84]">Node-NBO-01</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA0B3]">CCTV Feeds</p>
                  <p className="mt-1 text-sm font-black text-white sm:text-base">32 / 32</p>
                  <span className="text-[10px] text-emerald-400">100% Online</span>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA0B3]">Turnstile Access</p>
                  <p className="mt-1 text-sm font-black text-white sm:text-base">1,240</p>
                  <span className="text-[10px] text-white/70">Scans today</span>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA0B3]">Boardroom AV</p>
                  <p className="mt-1 text-sm font-black text-white sm:text-base">Ready</p>
                  <span className="text-[10px] text-[#E8CD84]">Zoom Rooms Synced</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8FA0B3]">Telemetry Log</p>
                <div className="divide-y divide-white/5 rounded-md border border-white/10 bg-black/30 text-xs">
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white/90">Main Gate Biometric Barrier</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">Nominal (0.12s latency)</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <Server className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white/90">Core Switch VLAN Trunk 10G</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">0 Packet Loss</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">M-Pesa Daraja & Multi-Rail Gateway</h4>
                  <p className="text-xs text-[#8FA0B3]">Automated C2B/B2C hooks, STK push retries & signature checks</p>
                </div>
                <span className="text-[11px] font-mono text-[#E8CD84]">Middleware v3</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA0B3]">STK Push Success</p>
                  <p className="mt-1 text-sm font-black text-white sm:text-base">99.98%</p>
                  <span className="text-[10px] text-emerald-400">Auto-retry on timeout</span>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA0B3]">Webhook ACK</p>
                  <p className="mt-1 text-sm font-black text-white sm:text-base">18ms</p>
                  <span className="text-[10px] text-emerald-400">Safaricom G2 verified</span>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA0B3]">Reconciliation</p>
                  <p className="mt-1 text-sm font-black text-white sm:text-base">Instant</p>
                  <span className="text-[10px] text-[#E8CD84]">Zero manual matching</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8FA0B3]">Verified Integrations</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 rounded border border-white/10 bg-black/30 p-2 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>M-Pesa Express (STK)</span>
                  </div>
                  <div className="flex items-center gap-2 rounded border border-white/10 bg-black/30 p-2 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>C2B Validation / Confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 rounded border border-white/10 bg-black/30 p-2 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>B2C Bulk Disbursals</span>
                  </div>
                  <div className="flex items-center gap-2 rounded border border-white/10 bg-black/30 p-2 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Stripe & Bank RTGS/EFT</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer proof line */}
      <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-[#8FA0B3]">
        <span>Global Engineering · HQ Nairobi, Kenya · Serving Worldwide</span>
        <span className="font-mono text-white/70">SLA: 99.9% Uptime</span>
      </div>
    </div>
  );
}
