import { Metadata } from "next";
import prisma from "@/lib/prisma";
import EquipmentDashboard, { EquipmentItemType } from "./EquipmentDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Equipment & Hardware Management | Bezalel Technologies",
};

export default async function StudioEquipmentPage() {
  let items: EquipmentItemType[] = [];
  try {
    const rawItems = await prisma.equipment.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            price: true,
            stock: true,
          },
        },
      },
    });

    items = JSON.parse(JSON.stringify(rawItems));
  } catch (err) {
    console.error("StudioEquipmentPage fetch error:", err);
  }

  return <EquipmentDashboard initialItems={items} />;
}
