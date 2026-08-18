import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      const fallback = fallbackProducts.find((p) => p.slug === slug);
      if (fallback) {
        return {
          title: `${fallback.name} | Bezalel Store`,
          description: fallback.description.slice(0, 160),
        };
      }
      return { title: "Product | Bezalel Store" };
    }

    return {
      title: `${product.name} | Bezalel Store`,
      description: product.description.slice(0, 160),
    };
  } catch {
    return { title: "Store Item | Bezalel Store" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let cleanProduct: any = null;
  let cleanRelated: any[] = [];

  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: { category: true },
    });

    if (product) {
      cleanProduct = JSON.parse(JSON.stringify(product));

      const related = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          isActive: true,
          id: { not: product.id },
        },
        include: { category: true },
        take: 4,
      });
      cleanRelated = JSON.parse(JSON.stringify(related));
    }
  } catch (error) {
    console.error("ProductPage DB error:", error);
  }

  if (!cleanProduct) {
    const fallback = fallbackProducts.find((p) => p.slug === slug);
    if (!fallback) notFound();
    cleanProduct = fallback;
    cleanRelated = fallbackProducts.filter((p) => p.slug !== slug);
  }

  return <ProductDetailClient product={cleanProduct} related={cleanRelated} />;
}
