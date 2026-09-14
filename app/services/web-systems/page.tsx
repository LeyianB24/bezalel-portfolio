import WebSystemsPage from "@/components/pages/WebSystemsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Systems & Enterprise Platforms",
  description:
    "Mission-critical web platforms, custom ERPs, and distributed cloud applications engineered for maximum performance, security, and scale.",
  alternates: {
    canonical: "/services/web-systems",
  },
};

export default function Page() {
  return <WebSystemsPage />;
}