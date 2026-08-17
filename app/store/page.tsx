import prisma from "@/lib/prisma";
import StorePageClient from "./StorePageClient";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Digital Store | Bezalel Technologies",
  description: "Browse Bezalel Technologies' digital products, templates, and focused support packages.",
};

export default async function StorePage() {
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

  const cleanProducts = JSON.parse(JSON.stringify(products));
  const cleanCategories = JSON.parse(JSON.stringify(categories));

  return <StorePageClient products={cleanProducts} categories={cleanCategories} />;
}
