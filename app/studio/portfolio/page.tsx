import { Metadata } from "next";
import prisma from "@/lib/prisma";
import PortfolioDashboard from "./PortfolioDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio Management | Bezalel Studio",
};

export default async function StudioPortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return <PortfolioDashboard initialItems={items} />;
}
