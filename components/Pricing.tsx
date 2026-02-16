"use client";

import { useState, MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { FiCheck, FiCpu, FiServer, FiArrowRight, FiGlobe, FiDatabase, FiLayers } from "react-icons/fi";

// =====================
// TYPES
// =====================

type PricingTier = {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  rates: { core: string; scale: string };
  timelines: { core: string; scale: string };
  capacity: { core: number; scale: number }; 
  features: string[];
  highlight: boolean;
};

const plans: PricingTier[] = [
  {
    id: "01",
    name: "The Blueprint",
    icon: <FiGlobe />,
    description: "High-velocity digital presence. Optimized for conversion and brand authority.",
    rates: { core: "KES 45,000", scale: "KES 85,000" },
    timelines: { core: "2 Weeks", scale: "4 Weeks" },
    capacity: { core: 30, scale: 60 },
    features: ["Responsive Mobile-First Design", "CMS Integration (Sanity.io)", "SEO & Analytics Setup", "WhatsApp Conversion Rails", "Social Graph Integration"],
    highlight: false
  },
  {
    id: "02",
    name: "The System",
    icon: <FiCpu />,
    description: "Dynamic applications with custom logic, user flows, and database architecture.",
    rates: { core: "KES 150,000", scale: "KES 350,000" },
    timelines: { core: "6 Weeks", scale: "12 Weeks" },
    capacity: { core: 50, scale: 90 },
    features: ["Next.js Full-Stack Architecture", "M-PESA / Stripe Payments", "Auth & User Profiles", "Admin Dashboard", "Transactional Notifications"],
    highlight: true
  },
  {
    id: "03",
    name: "The Enterprise",
    icon: <FiServer />,
    description: "Mission-critical infrastructure designed for massive concurrency and security.",
    rates: { core: "KES 800k+", scale: "Custom" },
    timelines: { core: "6 Months", scale: "Ongoing" },
    capacity: { core: 80, scale: 100 },
    features: ["Microservices Architecture", "Kubernetes Clustering", "Pentesting & Security Audit", "Load Balancing", "24/7 SLA Support"],
    highlight: false
  }
];

export default function PricingArsenal() {
  const [isFullScale, setIsFullScale] = useState(false);

  return (
    <section className="relative py-32 px-4 bg-background overflow-hidden font-sans min-h-screen">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-macos-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-macos-green"></span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-macos-yellow">
              System Configuration
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6">
            CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-macos-green via-macos-green to-macos-yellow">ENGINE</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl text-lg mb-12 leading-relaxed">
            From rapid MVPs to scalable ecosystems. We engineer solutions that grow with your capital.
          </p>
          
          <ToggleSwitch isFullScale={isFullScale} onToggle={setIsFullScale} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <SpotlightCard 
              key={plan.id} 
              plan={plan} 
              isFullScale={isFullScale} 
              index={i} 
            />
          ))}
        </div>

        <div className="mt-16 text-center border-t border-border pt-8">
          <p className="text-xs text-muted-foreground font-mono">
            {`// Prices are estimates in KES based on typical complexity. Final technical assessment required.`}
          </p>
        </div>
      </div>
    </section>
  );
}

function ToggleSwitch({ isFullScale, onToggle }: { isFullScale: boolean, onToggle: (val: boolean) => void }) {
  return (
    <div className="relative p-1.5 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-white/10 rounded-full flex items-center cursor-pointer w-[300px] shadow-inner">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`absolute top-1.5 bottom-1.5 w-[142px] rounded-full shadow-lg z-0
          ${isFullScale 
            ? 'left-[150px] bg-gradient-to-r from-macos-green to-macos-green' 
            : 'left-1.5 bg-white dark:bg-stone-800'
          }`}
      />
      
      <button
        onClick={() => onToggle(false)}
        className={`relative z-10 flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2
          ${!isFullScale ? 'text-stone-900 dark:text-white' : 'text-stone-500'}`}
      >
        <FiDatabase className="mb-0.5" /> Core
      </button>
      
      <button
        onClick={() => onToggle(true)}
        className={`relative z-10 flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2
          ${isFullScale ? 'text-white' : 'text-stone-500'}`}
      >
        <FiLayers className="mb-0.5" /> Full Scale
      </button>
    </div>
  );
}

function SpotlightCard({ plan, isFullScale, index }: { plan: PricingTier, isFullScale: boolean, index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col h-full rounded-2xl border transition-all duration-300 overflow-hidden
        ${plan.highlight 
          ? "bg-macos-green/10 border-macos-yellow/30 shadow-[0_0_40px_-10px_hsl(var(--macos-yellow)/0.15)]" 
          : "bg-emerald-50/50 dark:bg-stone-900/20 border-border hover:border-stone-300 dark:hover:border-stone-700"
        }
      `}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(40, 200, 64, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      
      <div className="relative z-10 p-8 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-xl ${plan.highlight ? "bg-macos-yellow text-stone-950" : "bg-macos-green/10 text-macos-green"}`}>
            {plan.icon}
          </div>
          <span className="text-[10px] font-mono text-stone-400">ID: {plan.id}</span>
        </div>

        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mb-8 line-clamp-2">{plan.description}</p>

        <div className="mb-8 p-4 rounded-xl bg-stone-500/5 border border-stone-500/10">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-tighter">Current Build</span>
            <span className="text-xs font-bold text-macos-green">{isFullScale ? "Scale-Ready" : "Core Engine"}</span>
          </div>
          <div className="text-3xl font-black tracking-tighter">
            {isFullScale ? plan.rates.scale : plan.rates.core}
          </div>
          <div className="mt-4 space-y-2">
             <div className="flex justify-between text-[10px] font-mono uppercase">
               <span>Capacity Gauge</span>
               <span>{isFullScale ? plan.capacity.scale : plan.capacity.core}%</span>
             </div>
             <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${isFullScale ? plan.capacity.scale : plan.capacity.core}%` }}
                  className="h-full bg-gradient-to-r from-macos-green to-macos-yellow"
                />
             </div>
          </div>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
              <FiCheck className="text-macos-green shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <a 
          href={`?plan=${encodeURIComponent(plan.name)}#contact`}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn
            ${plan.highlight 
              ? "bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg shadow-amber-500/25" 
              : "border border-stone-200 dark:border-stone-700 hover:border-macos-green/50 hover:bg-macos-green/5"
            }
          `}
        >
          Initialize Project
          <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
}