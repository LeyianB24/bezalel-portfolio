import prisma from "@/lib/prisma"
import { requireAdminPermission } from "@/lib/permissions"
import ProductsDashboard from "./ProductsDashboard"

export const revalidate = 0

export default async function ProductsPage() {
  await requireAdminPermission("STORE");

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" }
    })
  ])

  // Need plain objects to pass to client component
  const cleanProducts = JSON.parse(JSON.stringify(products))
  const cleanCategories = JSON.parse(JSON.stringify(categories))

  return <ProductsDashboard initialProducts={cleanProducts} categories={cleanCategories} />
}
