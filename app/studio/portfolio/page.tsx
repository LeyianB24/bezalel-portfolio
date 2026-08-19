import { Metadata } from "next";
import prisma from "@/lib/prisma";
import PortfolioDashboard from "./PortfolioDashboard";
import { PortfolioItemModel } from "@/types/prisma-models";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio Management | Bezalel Technologies",
};

export default async function StudioPortfolioPage() {
  let items: PortfolioItemModel[] = [];
  try {
    items = await prisma.portfolioItem.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch (err) {
    console.error("StudioPortfolioPage fetch error:", err);
  }

  return <PortfolioDashboard initialItems={items} />;
}
