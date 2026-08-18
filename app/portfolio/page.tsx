import { Metadata } from "next";
import prisma from "@/lib/prisma";
import PortfolioPageClient, { PortfolioData } from "./PortfolioPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio | Bezalel Technologies",
  description: "Explore selected Bezalel Technologies work across web systems, mobile workflows, API infrastructure, and interface design.",
};

export default async function PortfolioPage() {
  let portfolioItems: PortfolioData[] = [];
  try {
    const rawItems: any[] = await (prisma as any).portfolioItem.findMany({
      orderBy: { displayOrder: "asc" },
    });
    portfolioItems = rawItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      clientName: item.clientName,
      clientLogoUrl: item.clientLogoUrl,
      description: item.description,
      techTags: item.techTags,
      liveUrl: item.liveUrl,
      images: item.images,
      createdAt: typeof item.createdAt === "string" ? item.createdAt : item.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
  }

  return <PortfolioPageClient initialProjects={portfolioItems} />;
}
