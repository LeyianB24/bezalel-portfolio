import prisma from "@/lib/prisma";
import StorePageClient from "./StorePageClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hardware & IT Store | Bezalel Technologies",
  description: "Browse enterprise hardware, server equipment, and technical packages from Bezalel Technologies.",
};

const fallbackCategories = [
  { id: "cat-1", name: "Networking", slug: "networking" },
  { id: "cat-2", name: "Servers & Compute", slug: "servers" },
  { id: "cat-3", name: "Boardroom & AV", slug: "av" },
];

const fallbackProducts = [
  {
    id: "prod-1",
    name: "Enterprise Managed Gigabit Switch (24-Port PoE+)",
    slug: "enterprise-managed-gigabit-switch",
    description: "Layer 2+ managed PoE switch with 24 Gigabit Ethernet ports and 4 SFP uplink slots for office and server room deployment.",
    price: 48500,
    comparePrice: 54000,
    stock: 12,
    images: ["/images/web_system.png"],
    category: { id: "cat-1", name: "Networking", slug: "networking" },
  },
  {
    id: "prod-2",
    name: "High-Density Dual-Band WiFi 6 Access Point",
    slug: "high-density-wifi6-ap",
    description: "Ceiling-mounted enterprise AP supporting up to 500 concurrent connections with seamless roaming and PoE power.",
    price: 26000,
    comparePrice: 29500,
    stock: 25,
    images: ["/images/hero_banner.png"],
    category: { id: "cat-1", name: "Networking", slug: "networking" },
  },
  {
    id: "prod-3",
    name: "Rackmount 1U Server Chassis & Rail Kit",
    slug: "rackmount-1u-server-chassis",
    description: "Standard 19-inch 1U chassis with redundant hot-swap power bays and 4x 3.5-inch drive trays.",
    price: 38000,
    comparePrice: 42000,
    stock: 8,
    images: ["/images/mobile_app.png"],
    category: { id: "cat-2", name: "Servers & Compute", slug: "servers" },
  },
];

export default async function StorePage() {
  let cleanProducts = fallbackProducts;
  let cleanCategories = fallbackCategories;

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    if (products.length > 0) cleanProducts = JSON.parse(JSON.stringify(products));
    if (categories.length > 0) cleanCategories = JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("StorePage database fetch error:", error);
  }

  return <StorePageClient products={cleanProducts} categories={cleanCategories} />;
}
