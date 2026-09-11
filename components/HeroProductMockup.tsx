"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Activity,
  Layers,
  CreditCard,
  Building2,
  ArrowRight,
} from "lucide-react";

type MockupTab = "sacco" | "logistics" | "agri" | "payments";

export default function HeroProductMockup() {
  const [activeTab, setActiveTab] = useState<MockupTab>("sacco");

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-white/20 bg-[#050D17]/95 p-3 sm:p-5 shadow-2xl backdrop-blur-2xl">
      {/* Window Titlebar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 sm:pb-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-1 hidden font-mono text-xs text-white/50 sm:inline-block truncate">
            telemetry.bezalel.website/{activeTab}-live
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-emerald-400 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Live Architecture Preview</span>
          </span>
        </div>
      </div>

      {/* Domain Switcher — 4-Column Grid */}
      <div className="mt-3 grid grid-cols-4 gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => setActiveTab("sacco")}
          className={`flex min-w-0 items-center justify-center gap-1 rounded-md px-1.5 py-2 text-[10px] sm:text-xs font-semibold transition-all ${
            activeTab === "sacco"
              ? "bg-[#C9A24B] text-[#050D17] shadow-sm font-bold"
              : "text-white/70 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Layers className="h-3.5 w-3.5 shrink-0 hidden xs:inline" />
          <span className="truncate">SACCO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("logistics")}
          className={`flex min-w-0 items-center justify-center gap-1 rounded-md px-1.5 py-2 text-[10px] sm:text-xs font-semibold transition-all ${
            activeTab === "logistics"
              ? "bg-[#C9A24B] text-[#050D17] shadow-sm font-bold"
              : "text-white/70 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Activity className="h-3.5 w-3.5 shrink-0 hidden xs:inline" />
          <span className="truncate">Logistics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("agri")}
          className={`flex min-w-0 items-center justify-center gap-1 rounded-md px-1.5 py-2 text-[10px] sm:text-xs font-semibold transition-all ${
            activeTab === "agri"
              ? "bg-[#C9A24B] text-[#050D17] shadow-sm font-bold"
              : "text-white/70 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Building2 className="h-3.5 w-3.5 shrink-0 hidden xs:inline" />
          <span className="truncate">Agri-ERP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`flex min-w-0 items-center justify-center gap-1 rounded-md px-1.5 py-2 text-[10px] sm:text-xs font-semibold transition-all ${
            activeTab === "payments"
              ? "bg-[#C9A24B] text-[#050D17] shadow-sm font-bold"
              : "text-white/70 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5 shrink-0 hidden xs:inline" />
          <span className="truncate">Daraja</span>
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="mt-3 min-h-[300px] rounded-lg border border-white/10 bg-[#0B2036]/70 p-3 sm:p-5">
        <AnimatePresence mode="wait">
          {activeTab === "sacco" && (
            <motion.div
              key="sacco"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">Harambee SACCO Operations</h4>
                  <p className="text-[10px] sm:text-xs text-[#8FA0B3] truncate">Member ledger, distributions & STK push</p>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#E8CD84] shrink-0">v2.4-prod</span>
              </div>

              <div className="grid grid-cols-3 gap-1 sm:gap-3">
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Daily Vol</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">KES 1.48M</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-400 block truncate">99.98% settled</span>
                </div>
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Members</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">4,820</p>
                  <span className="text-[8px] sm:text-[10px] text-[#E8CD84] block truncate">+142/wk</span>
                </div>
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Latency</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">42ms</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-400 block truncate">P99 &lt; 78ms</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8FA0B3]">Recent Ledger Events</p>
                <div className="divide-y divide-white/5 rounded-md border border-white/10 bg-black/30 text-xs">
                  <div className="flex items-center justify-between p-1.5 sm:p-2 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white/90 truncate text-[11px] sm:text-xs">MBR-4092 Repayment</span>
                    </div>
                    <span className="font-semibold text-white shrink-0 text-[11px] sm:text-xs">KES 25,000</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 sm:p-2 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white/90 truncate text-[11px] sm:text-xs">MBR-1831 Share Purchase</span>
                    </div>
                    <span className="font-semibold text-white shrink-0 text-[11px] sm:text-xs">KES 10,000</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 sm:p-2 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <Activity className="h-3.5 w-3.5 text-[#E8CD84] shrink-0" />
                      <span className="font-mono text-white/90 truncate text-[11px] sm:text-xs">Monthly Auto-Reconcile</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-emerald-400 shrink-0">Synced</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "logistics" && (
            <motion.div
              key="logistics"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">Compass Cartage Fleet Operations</h4>
                  <p className="text-[10px] sm:text-xs text-[#8FA0B3] truncate">48 vehicles · Offline manifests · Border telematics</p>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#E8CD84] shrink-0">EA-Transit</span>
              </div>

              <div className="grid grid-cols-3 gap-1 sm:gap-3">
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Fleet Active</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">48 / 48</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-400 block truncate">100% Tracking</span>
                </div>
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Clearance Delay</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">-40%</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-400 block truncate">Border Checkpoint</span>
                </div>
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Manifest Sync</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">Offline-P2P</p>
                  <span className="text-[8px] sm:text-[10px] text-[#E8CD84] block truncate">SQLite Reconciled</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8FA0B3]">Live Telemetry Feed</p>
                <div className="divide-y divide-white/5 rounded-md border border-white/10 bg-black/30 text-xs">
                  <div className="flex items-center justify-between p-1.5 sm:p-2 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white/90 truncate text-[11px] sm:text-xs">TRK-08 Mombasa-Kampala Corridor</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-emerald-400 shrink-0">Cleared Malaba</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 sm:p-2 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <Activity className="h-3.5 w-3.5 text-[#E8CD84] shrink-0" />
                      <span className="font-mono text-white/90 truncate text-[11px] sm:text-xs">TRK-14 Nairobi-Kigali Transit</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-white/70 shrink-0">Busia GPS Ping</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "agri" && (
            <motion.div
              key="agri"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">Osotua Dairy Cooperative ERP</h4>
                  <p className="text-[10px] sm:text-xs text-[#8FA0B3] truncate">IoT milk intake scales & automated M-Pesa B2C dividends</p>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#E8CD84] shrink-0">v3.2-agri</span>
              </div>

              <div className="grid grid-cols-3 gap-1 sm:gap-3">
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Morning Intake</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">18,420 L</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-400 block truncate">100% IoT Weighed</span>
                </div>
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Active Farmers</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">1,420</p>
                  <span className="text-[8px] sm:text-[10px] text-[#E8CD84] block truncate">Biometric Linked</span>
                </div>
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Payout Speed</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">&lt; 3 min</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-400 block truncate">Zero Discrepancy</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8FA0B3]">Automated Financial Actions</p>
                <div className="divide-y divide-white/5 rounded-md border border-white/10 bg-black/30 text-xs">
                  <div className="flex items-center justify-between p-1.5 sm:p-2 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white/90 truncate text-[11px] sm:text-xs">Hub-4 Chilling Intake Batch</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-emerald-400 shrink-0">4,210 L verified</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 sm:p-2 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-white/90 truncate text-[11px] sm:text-xs">B2C Morning Dividend Run</span>
                    </div>
                    <span className="font-semibold text-white shrink-0 text-[11px] sm:text-xs">KES 480,000 sent</span>
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
              className="space-y-3 sm:space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">M-Pesa Daraja Gateway</h4>
                  <p className="text-[10px] sm:text-xs text-[#8FA0B3] truncate">Automated C2B/B2C hooks & STK push</p>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-[#E8CD84] shrink-0">Rails v3</span>
              </div>

              <div className="grid grid-cols-3 gap-1 sm:gap-3">
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">STK Push</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">99.98%</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-400 block truncate">Auto-retry</span>
                </div>
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Webhook</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">18ms</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-400 block truncate">Safaricom G2</span>
                </div>
                <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-1.5 sm:p-2.5">
                  <p className="text-[8.5px] sm:text-[10px] uppercase tracking-wider text-[#8FA0B3] truncate">Reconcile</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-white truncate">Instant</p>
                  <span className="text-[8px] sm:text-[10px] text-[#E8CD84] block truncate">Zero manual</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8FA0B3]">Verified Rails</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs">
                  <div className="flex items-center gap-2 rounded border border-white/10 bg-black/30 p-1.5 sm:p-2 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs truncate">M-Pesa Express (STK)</span>
                  </div>
                  <div className="flex items-center gap-2 rounded border border-white/10 bg-black/30 p-1.5 sm:p-2 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs truncate">C2B Validation & Ack</span>
                  </div>
                  <div className="flex items-center gap-2 rounded border border-white/10 bg-black/30 p-1.5 sm:p-2 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs truncate">B2C Bulk Disbursals</span>
                  </div>
                  <div className="flex items-center gap-2 rounded border border-white/10 bg-black/30 p-1.5 sm:p-2 text-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs truncate">Stripe & Bank RTGS/EFT</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer proof line */}
      <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/10 pt-3 px-1 text-[10px] sm:text-xs text-[#8FA0B3]">
        <div className="flex items-center gap-2">
          <span>Global Delivery · HQ Nairobi</span>
          <span className="text-white/30">|</span>
          <span className="font-mono text-emerald-400">99.9% Uptime SLA</span>
        </div>
        <a
          href="#portfolio"
          className="inline-flex items-center gap-1.5 font-bold text-accent-light hover:text-white transition-colors"
        >
          <span>Explore Case Studies</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
