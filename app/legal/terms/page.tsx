import TermsPage from "@/components/pages/TermsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service and engineering milestone engagement conditions of Bezalel Technologies Ltd.",
  alternates: {
    canonical: "/legal/terms",
  },
};

export default function Page() {
  return <TermsPage />;
}