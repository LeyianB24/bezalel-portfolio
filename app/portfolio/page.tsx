import PortfolioPageClient from "./PortfolioPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Bezalel Technologies",
  description: "Explore selected Bezalel Technologies work across web systems, mobile workflows, API infrastructure, and interface design.",
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
