"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Layers, Smartphone, Globe, Cpu, Database, Zap, Code2, Braces } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UnifiedBackground from "@/components/UnifiedBackground";

const categories = ["All", "Web Systems", "Mobile Apps", "API & Infra", "UI/UX Design"];

const projects = [
  {
    id: 1,
    title: "BezaShop Commerce Platform",
    category: "Web Systems",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    description: "A full-featured multi-vendor e-commerce platform with real-time inventory management, M-Pesa integration, and a custom admin dashboard — processing 10,000+ transactions monthly.",
    result: "↑ 340% conversion rate vs. competitor platform",
    year: "2024",
    icon: Globe,
    color: "emerald",
  },
  {
    id: 2,
    title: "NexoLogistics Mobile App",
    category: "Mobile Apps",
    tech: ["React Native", "Node.js", "MongoDB", "Google Maps"],
    description: "Real-time logistics tracking app for a Nairobi-based courier company. Features live GPS tracking, automated dispatch routing, and driver analytics.",
    result: "↓ 28% operational costs in first quarter",
    year: "2024",
    icon: Smartphone,
    color: "blue",
  },
  {
    id: 3,
    title: "DataBridge API Gateway",
    category: "API & Infra",
    tech: ["Node.js", "Redis", "Docker", "AWS Lambda"],
    description: "Enterprise API gateway handling 2M+ requests/day for a financial services client. Built with rate limiting, circuit breakers, and automated failover.",
    result: "99.97% uptime over 12 months",
    year: "2023",
    icon: Database,
    color: "navy",
  },
  {
    id: 4,
    title: "PulseHR Management Suite",
    category: "Web Systems",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "SendGrid"],
    description: "Comprehensive HR platform covering recruitment pipelines, payroll management, leave tracking, and employee performance reviews for a 500-person organization.",
    result: "Eliminated 40+ hours/week of manual HR work",
    year: "2024",
    icon: Layers,
    color: "amber",
  },
  {
    id: 5,
    title: "StreamSync Realtime Dashboard",
    category: "API & Infra",
    tech: ["WebSockets", "Redis Pub/Sub", "React", "ClickHouse"],
    description: "Live analytics streaming dashboard processing IoT sensor data from 500+ devices. Sub-100ms latency data visualization with 30-day historical querying.",
    result: "12x faster incident response time",
    year: "2023",
    icon: Cpu,
    color: "navy",
  },
  {
    id: 6,
    title: "KipaVault Design System",
    category: "UI/UX Design",
    tech: ["Figma", "React", "Storybook", "Tailwind CSS"],
    description: "End-to-end design system and component library for a FinTech startup. 120+ documented components, dark/light mode, WCAG AA compliant, and an interactive Storybook.",
    result: "Reduced design-to-dev handoff time by 60%",
    year: "2024",
    icon: Braces,
    color: "navy",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-500", iconBg: "bg-emerald-500/10" },
  blue: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-400", iconBg: "bg-blue-500/10" },
  navy: { bg: "bg-slate-800/6", border: "border-slate-700/20", text: "text-slate-300", iconBg: "bg-slate-800/10" },
  amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-400", iconBg: "bg-amber-500/10" },
  // legacy bright tones replaced by brand-safe navy variant
  // cyan and pink mapped to `navy` to avoid non-brand colors
};

const stats = [
  { label: "Projects Delivered", value: "48+" },
  { label: "Client Retention", value: "94%" },
  { label: "Avg Response Time", value: "< 2h" },
  { label: "Lines Shipped", value: "2M+" },
];

export default function PortfolioPageClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = projects.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <UnifiedBackground variant="subtle" />
      <div className="relative z-10">
        <Header />

        {/* Hero */}
        <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto relative">
          <div className="absolute inset-0 pointer-events-none person-bg person-bg--dark rounded-2xl -z-10" />
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono uppercase tracking-widest mb-6">
              <Code2 size={12} />
              Engineering Portfolio // Bezalel Technologies
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              SYSTEMS WE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/70 to-accent">
                HAVE SHIPPED
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              A curated selection of high-impact engineering work. Every project is a system built to outlast its launch — optimized for performance, maintainability, and scale.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Category Filter */}
        <section className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-y border-border/30 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => {
                const colors = colorMap[project.color];
                const Icon = project.icon;
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className={`group relative flex flex-col p-6 rounded-2xl border ${colors.border} ${colors.bg} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.iconBg} border ${colors.border} flex items-center justify-center`}>
                        <Icon size={22} className={colors.text} />
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-mono uppercase tracking-widest ${colors.text} px-2 py-0.5 rounded border ${colors.border} ${colors.bg}`}>
                          {project.category}
                        </span>
                        <div className="text-[10px] font-mono text-muted-foreground mt-1">{project.year}</div>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-black tracking-tight mb-3 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Result */}
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                      <Zap size={12} className={colors.text} />
                      <span className={`text-xs font-bold ${colors.text}`}>{project.result}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/30 bg-card/30 py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-4">Ready to Build?</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                YOUR PROJECT,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">OUR OBSESSION</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10">
                Join 48+ companies who trusted Bezalel to architect their most critical systems. Let's build something remarkable together.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/projects/request"
                  className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-xl font-bold text-sm hover:scale-105 transition-transform duration-300"
                >
                  Start a Project <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-3 border border-border/60 text-foreground px-8 py-4 rounded-xl font-bold text-sm hover:border-primary/40 transition-all"
                >
                  Contact Team
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
