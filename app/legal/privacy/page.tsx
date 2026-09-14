import PrivacyPage from "@/components/pages/PrivacyPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and client data protection practices of Bezalel Technologies Ltd.",
  alternates: {
    canonical: "/legal/privacy",
  },
};

export default function Page() {
  return <PrivacyPage />;
}