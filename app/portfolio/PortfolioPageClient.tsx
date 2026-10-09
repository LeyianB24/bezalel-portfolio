"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import PortfolioScreenshotGallery from "@/components/PortfolioScreenshotGallery";

export interface PortfolioData {
  id: string;
  name: string;
  clientName: string;
  clientLogoUrl?: string | null;
  category?: string;
  techTags: string[];
  description: string;
  result?: string;
  year?: string;
  image?: string;
  liveUrl?: string | null;
  images?: string[];
  createdAt?: string | Date;
}

const categories = ["All", "Web Systems", "Mobile Apps", "API & Infra", "Fintech & SACCO", "UI/UX Design"];

const defaultProjects: PortfolioData[] = [
  {
    id: "unigo-east-africa",
    name: "UniGo East Africa Admissions Portal",
    clientName: "UniGo East Africa",
    clientLogoUrl: "/images/portfolio/unigo/unigo-logo.png",
    category: "Web Systems",
    techTags: ["Next.js", "TypeScript", "Tailwind CSS", "Payload CMS", "PostgreSQL", "WhatsApp API"],
    description:
      "A comprehensive international university admissions and student consultation platform serving students across Kenya, Uganda, Tanzania, and Rwanda seeking higher education opportunities in Cyprus and Turkey.",
    result: "Streamlined student inquiry intake with automated course matching, scholarship guidance, and direct WhatsApp advisor routing.",
    year: "2024",
    image: "/images/portfolio/unigo/unigo-desktop.png",
    images: [
      "/images/portfolio/unigo/unigo-desktop.png",
      "/images/portfolio/unigo/unigo-hero.png",
      "/images/portfolio/unigo/unigo-fullpage.png",
    ],
    liveUrl: "https://www.unigoeastafrica.com/",
  },
  {
    id: "1",
    name: "BezaShop Global Commerce Platform",
    clientName: "BezaShop Retail & Exports",
    clientLogoUrl: "/images/logo.png",
    category: "Web Systems",
    techTags: ["Next.js", "Prisma", "PostgreSQL", "Stripe Multi-Currency", "M-Pesa"],
    description:
      "A high-availability global commerce system covering inventory synchronization across warehouses, multi-currency payment reconciliation (USD/EUR/KES), and automated invoice dispatch.",
    result: "Achieved zero checkout drop-off during peak international sales with under 80ms database query response times.",
    year: "2024",
    image: "/images/web_system.jpg",
    images: [
      "/images/web_system.jpg",
      "/images/screenshots/analytics-overview.jpg",
      "/images/screenshots/financial-transactions.jpg",
      "/images/hero_banner.jpg",
    ],
    liveUrl: "https://bezalel.website",
  },
  {
    id: "2",
    name: "NexoLogistics Cross-Border Field Ops",
    clientName: "Nexo Freight Global",
    clientLogoUrl: "/images/logo.png",
    category: "Mobile Apps",
    techTags: ["React Native", "Offline DB", "GPS Telemetry", "Location Services"],
    description:
      "Offline-capable mobile logistics and dispatch coordination suite for cross-border fleets, warehouse teams, and centralized multi-region dispatch.",
    result: "Enables continuous offline driver manifests with automatic sync once cellular connectivity is regained.",
    year: "2024",
    image: "/images/mobile_app.jpg",
    images: [
      "/images/mobile_app.jpg",
      "/images/screenshots/mobile-telemetry.jpg",
      "/images/network_infrastructure.jpg",
      "/BG_images/AdobeStock_292953404-scaled.jpeg",
    ],
    liveUrl: "https://bezalel.website",
  },
  {
    id: "3",
    name: "DataBridge Multi-Rail API Gateway",
    clientName: "Apex Financial Systems",
    clientLogoUrl: "/images/logo.png",
    category: "API & Infra",
    techTags: ["Node.js", "Redis", "Docker", "SWIFT / Daraja / Stripe", "PostgreSQL"],
    description:
      "Unified payments middleware handling automated international wire integrations, STK push retries, webhook signature verifications, and instant statement reconciliations.",
    result: "Processed over 150,000 monthly transactions with 99.98% gateway uptime and zero duplicate billing.",
    year: "2024",
    image: "/images/network_infrastructure.jpg",
    images: [
      "/images/network_infrastructure.jpg",
      "/images/screenshots/cloud-audit.jpg",
      "/images/screenshots/financial-transactions.jpg",
      "/images/products/unifi-switch-48-poe.jpg",
    ],
    liveUrl: "https://bezalel.website",
  },
  {
    id: "4",
    name: "PulseHR Global Workforce Platform",
    clientName: "Rift Holdings International",
    clientLogoUrl: "/images/logo.png",
    category: "Web Systems",
    techTags: ["Next.js", "TypeScript", "PostgreSQL", "Multi-Timezone RBAC", "Resend"],
    description:
      "Operations portal managing international employee records, cross-border contractor payouts, leave approval workflows, and digital contract signing.",
    result: "Consolidated five disparate spreadsheet systems into a single auditable self-service portal for remote teams.",
    year: "2024",
    image: "/images/hero_banner.jpg",
    images: [
      "/images/hero_banner.jpg",
      "/images/screenshots/analytics-overview.jpg",
      "/images/saas_kit.jpg",
      "/BG_images/codes people.jpg",
    ],
    liveUrl: "https://bezalel.website",
  },
  {
    id: "5",
    name: "KipaVault Financial Design System",
    clientName: "Kipa Microfinance Group",
    clientLogoUrl: "/images/logo.png",
    category: "UI/UX Design",
    techTags: ["Design Tokens", "React", "Tailwind CSS", "WCAG Accessibility"],
    description:
      "Comprehensive design system and accessible component library designed specifically for mobile-first financial self-service applications across international markets.",
    result: "Standardized 45+ UI screens, reducing front-end sprint delivery times by 40%.",
    year: "2024",
    image: "/images/saas_kit.jpg",
    images: [
      "/images/saas_kit.jpg",
      "/images/screenshots/financial-transactions.jpg",
      "/images/mobile_app.jpg",
      "/images/web_system.jpg",
    ],
    liveUrl: "https://bezalel.website",
  },
  {
    id: "compass-cartage",
    name: "Compass Cartage Cross-Border Fleet System",
    clientName: "Compass Cartage East Africa",
    clientLogoUrl: "/images/logo.png",
    category: "Mobile Apps",
    techTags: ["React Native", "TypeScript", "Offline SQLite", "Node.js", "GPS Telemetry", "IoT MQTT"],
    description:
      "Offline-first driver manifests with local SQLite persistence and automated telematics synchronization across Kenya-Uganda-Rwanda border corridors. IoT temperature sensors monitor perishable cold-chain cargo in real time across 48 refrigerated vehicles.",
    result: "40% reduction in border transit clearance delays with 100% offline manifest availability in zero-connectivity zones.",
    year: "2024",
    image: "/images/mobile_app.jpg",
    images: [
      "/images/mobile_app.jpg",
      "/images/screenshots/mobile-telemetry.jpg",
      "/images/network_infrastructure.jpg",
      "/BG_images/AdobeStock_292953404-scaled.jpeg",
    ],
    liveUrl: "https://bezalel.website",
  },
  {
    id: "osotua-farming",
    name: "Osotua Farming Cooperative ERP",
    clientName: "Osotua Farming Co-operative",
    clientLogoUrl: "/images/logo.png",
    category: "Web Systems",
    techTags: ["Next.js", "PostgreSQL", "M-Pesa B2C Daraja", "IoT Scales", "React Native", "Offline Sync"],
    description:
      "Farm-gate milk intake collection with automated IoT weight scale integration, biometric farmer manifests, offline field agent sync, and instant automated dividend disbursements via M-Pesa B2C across 1,420+ registered smallholder farmers.",
    result: "Reduced payout cycles from 14 days to under 3 minutes with zero reconciliation discrepancies.",
    year: "2024",
    image: "/images/saas_kit.jpg",
    images: [
      "/images/saas_kit.jpg",
      "/images/screenshots/analytics-overview.jpg",
      "/images/mobile_app.jpg",
      "/BG_images/AdobeStock_292953404-scaled.jpeg",
    ],
    liveUrl: "https://bezalel.website",
  },
  {
    id: "umoja-sacco",
    name: "Umoja SACCO Core Banking System",
    clientName: "Umoja SACCO",
    clientLogoUrl: "/images/logo.png",
    category: "Fintech & SACCO",
    techTags: ["Next.js", "PostgreSQL (ACID)", "M-Pesa Express", "Redis", "Docker"],
    description:
      "High-throughput transactional ledger, multi-branch member savings accounting, automated micro-loan underwriting, and real-time M-Pesa C2B/B2C reconciliation for a fully digital SACCO core banking experience.",
    result: "Achieved 42ms P99 settlement latency with automated daily reconciliation of KES 1.48M+ daily contribution flow.",
    year: "2024",
    image: "/images/web_system.jpg",
    images: [
      "/images/web_system.jpg",
      "/images/screenshots/financial-transactions.jpg",
      "/images/screenshots/analytics-overview.jpg",
      "/BG_images/codes people.jpg",
    ],
    liveUrl: "https://bezalel.website",
  },
];

const heroImages = [
  "/BG_images/codes people.jpg",
  "/BG_images/AdobeStock_292953404-scaled.jpeg",
  "/BG_images/team-collaborates-digitally-stockcake.jpg",
  "/images/web_system.jpg",
];

interface PortfolioPageClientProps {
  initialProjects?: PortfolioData[];
}

export default function PortfolioPageClient({ initialProjects = [] }: PortfolioPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    if (isHeroPaused) return;
    const interval = window.setInterval(() => {
      setActiveHeroImage((current) => (current + 1) % heroImages.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [isHeroPaused]);

  const normalizedProjects = initialProjects.length > 0
    ? initialProjects.map((p) => {
        const validImages =
          p.images && p.images.length > 0
            ? p.images
            : p.image
            ? [p.image]
            : ["/images/web_system.jpg"];
        return {
          id: p.id,
          name: p.name,
          clientName: p.clientName || "Client Project",
          clientLogoUrl: p.clientLogoUrl || "",
          category:
            p.category ||
            (p.techTags?.some((t: string) => t.toLowerCase().includes("mobile"))
              ? "Mobile Apps"
              : "Web Systems"),
          techTags: p.techTags || [],
          description: p.description,
          result:
            p.result ||
            "Delivered on schedule with comprehensive technical handover and staff training.",
          year: p.year || "2024",
          image: validImages[0],
          images: validImages,
          liveUrl: p.liveUrl || "",
        };
      })
    : defaultProjects;

  const filteredProjects = normalizedProjects.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-[calc(4.5rem+var(--sab))] md:pb-0 transition-colors duration-300">
      {/* Hero-matched ambient lighting — dark mode only */}
      <div
        className="fixed inset-0 pointer-events-none hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(201, 162, 75, 0.14) 0%, rgba(5, 13, 23, 0.0) 55%), radial-gradient(ellipse at 10% 70%, rgba(11, 32, 54, 0.5) 0%, transparent 60%)",
        }}
      />
      {/* Gold engineering grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(201, 162, 75, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201, 162, 75, 0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Header transparent />

      <main className="relative z-10">
        <section
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          className="relative overflow-hidden bg-[#050D17] text-white border-b border-white/10 pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20"
        >
          {/* Ken Burns Background Slideshow */}
          <AnimatePresence initial={false}>
            <motion.img
              key={heroImages[activeHeroImage]}
              src={heroImages[activeHeroImage]}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.0 }}
              animate={{ opacity: 0.28, scale: 1.06 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            />
          </AnimatePresence>

          {/* Subtle Technical Engineering Grid */}
          <div
            className="absolute inset-0 opacity-[0.14] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(201, 162, 75, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201, 162, 75, 0.35) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Deep Atmospheric Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(201, 162, 75, 0.16) 0%, rgba(5, 13, 23, 0.85) 50%, rgba(5, 13, 23, 0.99) 100%)",
            }}
          />

          {/* Top Scrim for Seamless Navbar Transparency & Contrast */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#050D17]/75 via-[#050D17]/35 to-transparent pointer-events-none"
          />

          <div className="relative z-10 mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#C9A24B] mb-4 shadow-xs backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B] animate-pulse" />
              Verified Engineering Deliveries · East Africa & Global
            </div>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white text-balance">
                  Systems shaped around reliability, performance, and clean handover.
                </h1>
              </div>
              <div>
                <p className="max-w-2xl text-xs sm:text-sm lg:text-base leading-relaxed text-white/80">
                  Selected production platforms across custom web systems, cross-border mobile field workflows, payment APIs, and interface architecture developed for clients worldwide. Every build is accompanied by complete documentation and source code handover.
                </p>

                {/* Slideshow Pill Indicators */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 mr-1">Case Studies</span>
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveHeroImage(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeHeroImage === idx ? "w-6 bg-[#C9A24B]" : "w-1.5 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`View slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-[53px] sm:top-[68px] z-30 border-b border-border bg-card/90 dark:bg-[#050D17]/95 px-3 xs:px-4 py-2.5 sm:px-6 sm:py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl 3xl:max-w-[1600px] gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] xs:text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors min-h-[40px] xs:min-h-[44px] flex items-center ${
                  activeCategory === category
                    ? "bg-accent text-accent-foreground shadow-xs font-bold"
                    : "border border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Projects List */}
        <section className="px-3 xs:px-4 py-10 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-7xl 3xl:max-w-[1600px] gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-accent/40"
                >
                  <div className="grid lg:grid-cols-[1.1fr_0.9fr] p-4 sm:p-6 gap-6 items-start">
                    {/* Google Play-style Screenshot Gallery */}
                    <PortfolioScreenshotGallery
                      images={project.images || [project.image || "/images/web_system.jpg"]}
                      title={project.name}
                      category={project.category}
                    />

                    <div className="flex flex-col justify-between h-full pt-1">
                      <div>
                        {/* Meta & Clickable Client Link */}
                        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground border-b border-border pb-3 mb-3 sm:mb-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            {project.clientLogoUrl && (
                              <Image
                                src={project.clientLogoUrl}
                                alt={`${project.clientName} logo`}
                                width={16}
                                height={16}
                                className="h-4 w-4 rounded-xs object-contain bg-black/10 dark:bg-white/10 p-0.5 shrink-0"
                              />
                            )}
                            <span className="font-bold text-foreground truncate">{project.clientName}</span>
                            <span>•</span>
                            <span className="font-mono shrink-0">{project.year || "2024"}</span>
                          </div>

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-accent-dark dark:text-accent-light hover:underline shrink-0"
                            >
                              <span>Visit live system</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>

                        <h2 className="font-display text-xl xs:text-2xl sm:text-3xl font-black leading-tight tracking-tight text-foreground">
                          {project.name}
                        </h2>

                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>

                        <div className="mt-4 sm:mt-5 rounded-md border border-border bg-background p-3.5 sm:p-4 text-xs sm:text-sm font-semibold leading-relaxed text-foreground">
                          {project.result}
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 flex flex-wrap gap-1.5 sm:gap-2">
                        {project.techTags.map((tech: string) => (
                          <span
                            key={tech}
                            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Scoping CTA */}
        <section className="border-t border-border bg-primary p-8 text-primary-foreground sm:p-14">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
              Have a similar system to build or modernize?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Send us a brief detailing your users and requirements. We will assess feasibility and respond with a formal quotation.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/projects/request"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light"
              >
                Start a project brief
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
