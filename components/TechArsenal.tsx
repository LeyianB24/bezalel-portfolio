/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { memo } from "react";
import { motion, Variants } from "framer-motion";
import TechGlobe from "./TechGlobe";
import {
  // Frontend
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiRedux, SiVuedotjs, SiSvelte, SiGraphql,
  // Backend
  SiPython, SiNodedotjs, SiGo, SiRust, SiLaravel, SiNestjs, SiFsharp,
  // Database
  SiPostgresql, SiMongodb, SiRedis, SiMysql, SiSupabase,
  // Mobile
  SiAndroid, SiFlutter, SiKotlin, SiSwift,
  // DevOps
  SiDocker, SiKubernetes, SiTerraform, SiLinux, SiGooglecloud,
  // Fintech
  SiStripe, SiPaypal, SiVisa, SiMastercard, SiWise, SiCoinbase, SiPlangrid
} from "react-icons/si";

import { FaJava, FaAws } from "react-icons/fa"; 
import { BsPhone, BsTerminal } from "react-icons/bs";

// =====================
// DATA STRUCTURE
// =====================

type Tech = {
  name: string;
  icon: JSX.Element;
  color: string;
  tag?: "Core" | "New" | "Legacy";
};

type TechGroup = {
  id: string;
  command: string;
  description: string;
  stack: Tech[];
};

const techGroups: TechGroup[] = [
  {
    id: "fintech",
    command: "./init_protocol --rails=payments",
    description: "Financial Infrastructure",
    stack: [
      { name: "M-PESA", icon: <BsPhone />, color: "#4CAF50", tag: "Core" },
      { name: "Stripe", icon: <SiStripe />, color: "#635BFF", tag: "Core" },
      { name: "Visa Direct", icon: <SiVisa />, color: "#1434CB" },
      { name: "Mastercard", icon: <SiMastercard />, color: "#EB001B" },
      { name: "PayPal", icon: <SiPaypal />, color: "#00457C" },
      { name: "Wise", icon: <SiWise />, color: "#9FE870" },
      { name: "Web3 / Crypto", icon: <SiCoinbase />, color: "#0052FF" },
      { name: "Plaid", icon: <SiPlangrid />, color: "#000000" },
    ]
  },
  {
    id: "frontend",
    command: "npm run build:client --production",
    description: "Interface Engineering",
    stack: [
      { name: "Next.js", icon: <SiNextdotjs />, color: "#ffffff", tag: "Core" },
      { name: "React", icon: <SiReact />, color: "#61DAFB" },
      { name: "TypeScript", icon: <SiTypescript />, color: "#3178C6" },
      { name: "Tailwind", icon: <SiTailwindcss />, color: "#38B2AC" },
      { name: "Vue.js", icon: <SiVuedotjs />, color: "#4FC08D" },
      { name: "Redux", icon: <SiRedux />, color: "#764ABC" },
      { name: "GraphQL", icon: <SiGraphql />, color: "#E10098" },
      { name: "Svelte", icon: <SiSvelte />, color: "#FF3E00" },
    ]
  },
  {
    id: "backend",
    command: "exec /srv/bin/core_logic",
    description: "Server-Side Logic",
    stack: [
      { name: "Python", icon: <SiPython />, color: "#3776AB", tag: "Core" },
      { name: "Node.js", icon: <SiNodedotjs />, color: "#339933" },
      { name: "Go", icon: <SiGo />, color: "#00ADD8" },
      { name: "Rust", icon: <SiRust />, color: "#dea584" },
      { name: "Java", icon: <FaJava />, color: "#007396" },
      { name: "NestJS", icon: <SiNestjs />, color: "#E0234E" },
      { name: "C#", icon: <SiFsharp />, color: "#239120" },
      { name: "Laravel", icon: <SiLaravel />, color: "#FF2D20" },
    ]
  },
  {
    id: "database",
    command: "sql_query --optimize-shards",
    description: "Data Persistence",
    stack: [
      { name: "Postgres", icon: <SiPostgresql />, color: "#4169E1", tag: "Core" },
      { name: "Redis", icon: <SiRedis />, color: "#DC382D" },
      { name: "MongoDB", icon: <SiMongodb />, color: "#47A248" },
      { name: "Supabase", icon: <SiSupabase />, color: "#3ECF8E" },
      { name: "MySQL", icon: <SiMysql />, color: "#4479A1" }
    ]
  },
  {
    id: "devops",
    command: "terraform apply -auto-approve",
    description: "Infrastructure as Code",
    stack: [
      { name: "AWS", icon: <FaAws />, color: "#FF9900", tag: "Core" },
      { name: "Docker", icon: <SiDocker />, color: "#2496ED" },
      { name: "K8s", icon: <SiKubernetes />, color: "#326CE5" },
      { name: "Terraform", icon: <SiTerraform />, color: "#7B42BC" },
      { name: "Linux", icon: <SiLinux />, color: "#FCC624" },
      { name: "GCP", icon: <SiGooglecloud />, color: "#4285F4" }
    ]
  },
  {
    id: "mobile",
    command: "./gradlew assembleRelease",
    description: "Mobile Applications",
    stack: [
      { name: "Flutter", icon: <SiFlutter />, color: "#02569B" },
      { name: "React Native", icon: <SiReact />, color: "#61DAFB" },
      { name: "Kotlin", icon: <SiKotlin />, color: "#7F52FF" },
      { name: "Swift", icon: <SiSwift />, color: "#F05138" },
      { name: "Android", icon: <SiAndroid />, color: "#3DDC84" }
    ]
  }
];
// =====================
// BACKGROUND DECORATION (FIXED)
// =====================

const CodeDecoration = () => (
  <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
    <div 
      className="transform -rotate-[15deg] scale-[1.7] opacity-[0.03] dark:opacity-[0.04] blur-[1px]"
    >
      <pre className="font-mono text-3xl md:text-5xl font-black leading-tight text-foreground">
        <span className="text-macos-green">class</span> <span className="text-macos-yellow">SystemCore</span> <span className="text-macos-green">extends</span> <span className="text-macos-green">Bezalelv2</span> {"{"}
        {"\n"}
        {"  "}<span className="text-macos-green">@HighFrequency</span>
        {"\n"}
        {"  "}<span className="text-macos-green">async</span> <span className="text-macos-yellow">executeOrder</span>(payload: <span className="text-orange-400">Transaction</span>) {"{"}
        {"\n"}
        {"    "}<span className="text-macos-green">const</span> secureChannel = <span className="text-macos-green">await</span> <span className="text-macos-green">Encrypt</span>.init();
        {"\n"}
        {"    "}<span className="text-macos-green">await</span> secureChannel.transmit(payload);
        {"\n"}
        {"    "}<span className="text-macos-yellow">// Optimized for &lt; 50ms latency</span>
        {"\n"}
        {"    "}<span className="text-macos-green">return</span> <span className="text-macos-yellow">true</span>;
        {"\n"}
        {"  "}{"}"}
        {"\n"}
        {"}"}
      </pre>
    </div>
  </div>
);

// =====================
// ANIMATIONS
// =====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.95, filter: "blur(5px)" },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

// =====================
// MAIN COMPONENT
// =====================

export default function TechArsenal() {
  return (
    <section id="arsenal" className="relative min-h-screen overflow-hidden bg-background px-4 pb-32 pt-32 transition-colors duration-500">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-25 pointer-events-none dark:opacity-20">
        <TechGlobe />
      </div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent)/0.16),_transparent_24%)]" />
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay contrast-150 brightness-100 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary backdrop-blur-xl dark:bg-zinc-900/70">
              <BsTerminal className="text-xs" />
              <span>System_Capabilities</span>
            </div>

            <h2 className="text-5xl font-black leading-[0.9] tracking-tighter text-foreground md:text-7xl">
              THE <span className="bg-gradient-to-r from-primary via-cyan-500 to-accent bg-clip-text text-transparent">ARSENAL</span>
            </h2>

            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
              We build with modern infrastructure, high-trust product systems, and the kind of precision that makes ambitious ideas feel effortless.
            </p>
          </motion.div>
        </header>

        <div className="flex flex-col gap-20">
          {techGroups.map((group) => (
            <motion.div 
              key={group.id}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="mb-8 flex flex-col justify-between gap-3 rounded-[24px] border border-white/60 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70 md:flex-row md:items-end">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
                  <code className="text-base font-mono font-medium tracking-tight text-foreground md:text-lg">
                    {group.command}
                  </code>
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  // {group.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {group.stack.map((tech) => (
                  <TechItem key={tech.name} tech={tech} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. FOOTER STATUS BAR */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex h-8 items-center justify-between border-t border-border bg-background/80 px-4 text-[10px] font-mono text-muted-foreground backdrop-blur md:text-xs">
        <div className="flex items-center gap-4">
          <div className="flex cursor-pointer items-center gap-1 transition-colors hover:text-primary"><span className="text-lg">⑂</span> main*</div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full border border-red-500 bg-transparent" /> 0 ERR</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full border border-yellow-500 bg-transparent" /> 0 WARN</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline">Ln 842, Col 12</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="flex items-center gap-1 font-bold text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> ONLINE
          </span>
        </div>
      </div>
    </section>
  );
}

// =====================
// INDIVIDUAL TECH CARD
// =====================

const TechItem = memo(function TechItem({ tech }: { tech: Tech }) {
  return (
    <motion.div
      variants={itemVariants}
      // Inject color variable
      style={{ "--tech-color": tech.color } as React.CSSProperties}
      className="group relative flex h-32 cursor-crosshair flex-col items-center justify-center overflow-hidden rounded-[20px] border border-border/60 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:border-[var(--tech-color)] hover:bg-[var(--tech-color)]/8 hover:shadow-[0_0_30px_-8px_var(--tech-color)] dark:bg-zinc-900/70"
    >
      
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--tech-color)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--tech-color)] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* Icon */}
      <div className="relative z-10 text-4xl mb-3 text-muted-foreground grayscale group-hover:grayscale-0 group-hover:text-[var(--tech-color)] group-hover:scale-110 transition-all duration-300">
        {tech.icon}
      </div>
      
      {/* Name */}
      <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
        {tech.name}
      </span>

      {/* Tag */}
      {tech.tag && (
        <span className={`absolute top-2 right-2 text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter opacity-60
          ${tech.tag === 'Core' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-stone-500/10 text-stone-400 border border-stone-500/20' }
        `}>
          {tech.tag}
        </span>
      )}
    </motion.div>
  );
});