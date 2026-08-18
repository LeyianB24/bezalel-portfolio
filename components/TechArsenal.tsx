"use client";

import { memo } from "react";
import { motion, Variants } from "framer-motion";
import {
  // Frontend
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiVuedotjs, SiGraphql,
  // Backend
  SiPython, SiNodedotjs,
  // Database
  SiPostgresql, SiMongodb, SiRedis, SiMysql, SiSupabase,
  // DevOps & Cloud
  SiDocker, SiKubernetes, SiLinux, SiGooglecloud,
} from "react-icons/si";

import { FaAws } from "react-icons/fa"; 
import { BsPhone } from "react-icons/bs";
import { CreditCard, Layers, Database, Network } from "lucide-react";

type Tech = {
  name: string;
  icon: JSX.Element;
  tag?: "Core" | "Supported";
};

type TechGroup = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  stack: Tech[];
};

const techGroups: TechGroup[] = [
  {
    id: "fintech",
    title: "Payments & Financial Integration",
    description: "Secure, idempotent payment workflows and automated reconciliation",
    icon: <CreditCard className="h-5 w-5 text-accent" />,
    stack: [
      { name: "M-PESA (Daraja API)", icon: <BsPhone />, tag: "Core" },
      { name: "Stripe", icon: <CreditCard className="h-4 w-4" />, tag: "Core" },
      { name: "Card Gateways", icon: <CreditCard className="h-4 w-4" /> },
      { name: "Bank APIs", icon: <Layers className="h-4 w-4" /> },
    ],
  },
  {
    id: "web",
    title: "Web & Enterprise Applications",
    description: "Modern full-stack web platforms built for speed, SEO, and uptime",
    icon: <Layers className="h-5 w-5 text-accent" />,
    stack: [
      { name: "Next.js", icon: <SiNextdotjs />, tag: "Core" },
      { name: "React", icon: <SiReact />, tag: "Core" },
      { name: "TypeScript", icon: <SiTypescript />, tag: "Core" },
      { name: "Tailwind CSS", icon: <SiTailwindcss />, tag: "Core" },
      { name: "Node.js", icon: <SiNodedotjs /> },
      { name: "Python", icon: <SiPython /> },
      { name: "GraphQL", icon: <SiGraphql /> },
      { name: "Vue.js", icon: <SiVuedotjs /> },
    ],
  },
  {
    id: "database",
    title: "Data Persistence & Cache",
    description: "Relational data modeling, ACID transactions, and low-latency cache",
    icon: <Database className="h-5 w-5 text-accent" />,
    stack: [
      { name: "PostgreSQL", icon: <SiPostgresql />, tag: "Core" },
      { name: "Redis", icon: <SiRedis />, tag: "Core" },
      { name: "Supabase", icon: <SiSupabase /> },
      { name: "MySQL", icon: <SiMysql /> },
      { name: "MongoDB", icon: <SiMongodb /> },
    ],
  },
  {
    id: "infrastructure",
    title: "Cloud & Infrastructure",
    description: "Automated deployment, containerization, and managed cloud environments",
    icon: <Network className="h-5 w-5 text-accent" />,
    stack: [
      { name: "AWS", icon: <FaAws />, tag: "Core" },
      { name: "Docker", icon: <SiDocker />, tag: "Core" },
      { name: "Linux", icon: <SiLinux />, tag: "Core" },
      { name: "Google Cloud", icon: <SiGooglecloud /> },
      { name: "Kubernetes", icon: <SiKubernetes /> },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 12, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function TechArsenal() {
  return (
    <section id="arsenal" className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl sm:mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
            Technology Stack
          </p>
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Established tools, chosen for reliability and long-term maintenance.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            We build with proven software frameworks and cloud infrastructure so systems stay maintainable well beyond initial launch.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {techGroups.map((group) => (
            <motion.div 
              key={group.id}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  {group.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">{group.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {group.stack.map((tech) => (
                  <TechItem key={tech.name} tech={tech} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TechItem = memo(function TechItem({ tech }: { tech: Tech }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex flex-col items-center justify-center rounded-md border border-border bg-background/80 p-3 text-center transition-colors hover:border-accent/50 hover:bg-card"
    >
      <div className="mb-2 text-2xl text-foreground/80 transition-colors group-hover:text-accent-dark dark:group-hover:text-accent-light">
        {tech.icon}
      </div>
      <span className="text-xs font-semibold text-foreground">{tech.name}</span>
      {tech.tag && (
        <span className="mt-1 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
          {tech.tag}
        </span>
      )}
    </motion.div>
  );
});