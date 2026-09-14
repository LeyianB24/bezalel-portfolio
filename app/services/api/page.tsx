import ApiServicesPage from "@/components/pages/ApiServicesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Architecture & Payment Systems",
  description:
    "High-throughput transactional ledgers, M-Pesa Daraja payment gateways, banking integrations, and resilient API microservices.",
  alternates: {
    canonical: "/services/api",
  },
};

export default function Page() {
  return <ApiServicesPage />;
}