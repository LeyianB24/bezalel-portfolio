import { Metadata } from "next";
import PortfolioPageClient from "./PortfolioPageClient";

export const metadata: Metadata = {
  title: "Portfolio | Bezalel Technologies",
  description: "Explore selected Bezalel Technologies work across web systems, mobile workflows, API infrastructure, and interface design.",
};

// Portfolio projects are maintained in PortfolioPageClient's defaultProjects.
// Passing an empty array triggers the defaultProjects fallback, ensuring all
// projects are always displayed regardless of DB connectivity.
export default function PortfolioPage() {
  return <PortfolioPageClient initialProjects={[]} />;
}
