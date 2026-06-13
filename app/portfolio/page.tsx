import PortfolioPageClient from "./PortfolioPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Bezalel Technologies",
  description: "Explore the engineering portfolio of Bezalel Technologies — custom web systems, mobile apps, API infrastructure, and enterprise integrations built to scale.",
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
