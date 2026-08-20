import prisma from "@/lib/prisma"
import { requireAdminPermission } from "@/lib/permissions"
import StoreDashboard from "./StoreDashboard"

export const revalidate = 0

export default async function StorePage() {
  await requireAdminPermission("STORE");

  const [orders, productsCount] = await Promise.all([
    prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count()
  ])

  // Need plain objects to pass to client component
  const cleanOrders = JSON.parse(JSON.stringify(orders))

  return <StoreDashboard initialOrders={cleanOrders} productsCount={productsCount} />
}
