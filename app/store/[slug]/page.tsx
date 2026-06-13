import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { Metadata } from "next";

export const revalidate = 60;

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) return { title: "Product Not Found | Bezalel Technologies" };

  return {
    title: `${product.name} | Bezalel Store`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { category: true },
  });

  if (!product) notFound();

  // Find related products in the same category
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    include: { category: true },
    take: 4,
  });

  const cleanProduct = JSON.parse(JSON.stringify(product));
  const cleanRelated = JSON.parse(JSON.stringify(related));

  return <ProductDetailClient product={cleanProduct} related={cleanRelated} />;
}
