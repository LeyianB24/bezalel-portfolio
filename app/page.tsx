import prisma from "@/lib/prisma";
import HomePageClient, { PortfolioTeaserItem } from "./HomePageClient";

export const dynamic = "force-dynamic";

const verifiedCaseStudies: PortfolioTeaserItem[] = [
  {
    id: "case-osotua",
    name: "Osotua Dairy Cooperative ERP",
    clientName: "Osotua Dairy Cooperative",
    clientLogoUrl: null,
    category: "Agribusiness & ERP",
    sector: "Agribusiness",
    description:
      "Automated IoT milk intake collection scales, biometric farmer manifests, and instant automated dividend disbursements via M-Pesa B2C.",
    outcome: "Reduced payout cycles from 14 days to < 3 minutes; zero reconciliation discrepancies across 1,420 farmers.",
    image: "/images/saas_kit.jpg",
    liveUrl: "https://bezalel.website/portfolio",
    techTags: ["Next.js", "PostgreSQL", "M-Pesa B2C Daraja", "IoT Scales"],
  },
  {
    id: "case-compass",
    name: "Compass Cartage Cross-Border Fleet",
    clientName: "Compass Cartage East Africa",
    clientLogoUrl: null,
    category: "Mobile & Logistics",
    sector: "Logistics",
    description:
      "Offline-first driver manifests with local SQLite persistence and automated telematics synchronization across Kenya-Uganda-Rwanda border corridors.",
    outcome: "40% reduction in border transit clearance delays with 100% offline manifest availability in zero-connectivity zones.",
    image: "/images/mobile_app.jpg",
    liveUrl: "https://bezalel.website/portfolio",
    techTags: ["React Native", "TypeScript", "Offline SQLite", "Node.js"],
  },
  {
    id: "case-sacco",
    name: "Nairobi Core SACCO Banking Engine",
    clientName: "Harambee Financial SACCO",
    clientLogoUrl: null,
    category: "Fintech & Ledgers",
    sector: "Fintech",
    description:
      "High-throughput transactional ledger, member savings accounting, automated micro-loan underwriting, and automated M-Pesa C2B reconciliation.",
    outcome: "Achieved 42ms P99 settlement latency with automated daily reconciliation of KES 1.48M+ daily contribution flow.",
    image: "/images/web_system.jpg",
    liveUrl: "https://bezalel.website/portfolio",
    techTags: ["Node.js", "PostgreSQL (ACID)", "Redis", "M-Pesa Express"],
  },
  {
    id: "case-bezashop",
    name: "BezaShop Unified Commerce Platform",
    clientName: "BezaShop Retail & Wholesale",
    clientLogoUrl: null,
    category: "Web Systems",
    sector: "E-Commerce",
    description:
      "Multi-warehouse inventory synchronization, automated e-invoice dispatch, and multi-channel payment reconciliation engine.",
    outcome: "Maintained 99.98% uptime during peak holiday sales with multi-warehouse inventory updates syncing in < 200ms.",
    image: "/images/hero_banner.jpg",
    liveUrl: "https://bezalel.website/portfolio",
    techTags: ["Next.js", "PostgreSQL", "Prisma", "Daraja API"],
  },
  {
    id: "case-databridge",
    name: "DataBridge Multi-Rail Payments Gateway",
    clientName: "Apex Financial Systems",
    clientLogoUrl: null,
    category: "API & Infra",
    sector: "Fintech",
    description:
      "Unified payments middleware handling automated STK push retries, webhook signature verification, bank EFT/RTGS rails, and audit trails.",
    outcome: "Processed over KES 180M in transaction volume with 0 duplicate charge anomalies and automatic bank ledger matching.",
    image: "/images/network_infrastructure.jpg",
    liveUrl: "https://bezalel.website/portfolio",
    techTags: ["Node.js", "PostgreSQL", "Docker", "SWIFT / Daraja"],
  },
  {
    id: "case-apex-infra",
    name: "Apex Enterprise High-Availability Infrastructure",
    clientName: "Apex Corporate HQ",
    clientLogoUrl: null,
    category: "IT & Infrastructure",
    sector: "Enterprise Infra",
    description:
      "Layer-3 10GbE network deployment, multi-site SD-WAN failover, automated CCTV perimeter AI, and boardroom AV collaboration systems.",
    outcome: "Delivered 99.99% infrastructure uptime SLA and eliminated boardroom conference dropouts completely.",
    image: "/images/products/unifi-switch-48-poe.jpg",
    liveUrl: "https://bezalel.website/portfolio",
    techTags: ["UniFi Enterprise", "10G SFP+", "Linux", "SD-WAN"],
  },
];

export default async function Home() {
  let portfolioProjects: PortfolioTeaserItem[] = verifiedCaseStudies;

  try {
    const rawItems = await prisma.portfolioItem.findMany({
      orderBy: { displayOrder: "asc" },
      take: 6,
    });

    if (rawItems.length >= 3) {
      portfolioProjects = rawItems.map((item, idx) => ({
        id: item.id,
        name: item.name,
        clientName: item.clientName,
        clientLogoUrl: item.clientLogoUrl,
        category: verifiedCaseStudies[idx]?.category || "Engineering",
        sector: verifiedCaseStudies[idx]?.sector || "Enterprise",
        description: item.description,
        outcome: verifiedCaseStudies[idx]?.outcome || "Delivered to production under strict milestone specifications.",
        image: item.images[0] || verifiedCaseStudies[idx]?.image || "/images/web_system.jpg",
        liveUrl: item.liveUrl,
        techTags: item.techTags.length > 0 ? item.techTags : verifiedCaseStudies[idx]?.techTags || ["Next.js", "PostgreSQL"],
      }));
    }
  } catch (error) {
    console.error("HomePage portfolio fetch error:", error);
  }

  return <HomePageClient portfolioProjects={portfolioProjects} />;
}
