import prisma from "@/lib/prisma";
import HomePageClient, { PortfolioTeaserItem } from "./HomePageClient";

export const dynamic = "force-dynamic";

const fallbackTeasers: PortfolioTeaserItem[] = [
  {
    id: "fallback-1",
    name: "BezaShop Commerce Platform",
    clientName: "BezaShop Retail",
    category: "Web Systems",
    description:
      "Inventory synchronization, multi-channel payment reconciliation, and automated invoice dispatch with sub-80ms response times.",
    image: "/images/web_system.png",
    liveUrl: "https://bezalel.website",
    techTags: ["Next.js", "PostgreSQL", "M-Pesa Daraja"],
  },
  {
    id: "fallback-2",
    name: "NexoLogistics Field Ops Suite",
    clientName: "Nexo Freight EA",
    category: "Mobile Apps",
    description:
      "Offline-capable mobile dispatch and driver manifests with instant synchronization upon network reconnection.",
    image: "/images/mobile_app.png",
    liveUrl: "https://bezalel.website",
    techTags: ["React Native", "TypeScript", "Node.js"],
  },
  {
    id: "fallback-3",
    name: "DataBridge Multi-Rail Gateway",
    clientName: "Apex Financial Systems",
    category: "API & Infra",
    description:
      "Unified payments middleware handling automated STK push retries, webhook signature verifications, and bank integrations.",
    image: "/images/hero_banner.png",
    liveUrl: "https://bezalel.website",
    techTags: ["Node.js", "PostgreSQL", "Docker"],
  },
];

export default async function Home() {
  let portfolioProjects: PortfolioTeaserItem[] = fallbackTeasers;

  try {
    const rawItems = await prisma.portfolioItem.findMany({
      orderBy: { displayOrder: "asc" },
      take: 6,
    });

    if (rawItems.length > 0) {
      portfolioProjects = rawItems.map((item) => ({
        id: item.id,
        name: item.name,
        clientName: item.clientName,
        description: item.description,
        image: item.images[0] || "/images/web_system.png",
        liveUrl: item.liveUrl,
        techTags: item.techTags,
      }));
    }
  } catch (error) {
    console.error("HomePage portfolio fetch error:", error);
  }

  return <HomePageClient portfolioProjects={portfolioProjects} />;
}
