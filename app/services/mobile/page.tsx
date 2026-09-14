import MobileServicesPage from "@/components/pages/MobileServicesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Systems & Field Operations",
  description:
    "Offline-first mobile applications, real-time field operations, and cross-platform native engineering built for zero-connectivity environments.",
  alternates: {
    canonical: "/services/mobile",
  },
};

export default function Page() {
  return <MobileServicesPage />;
}