import { Metadata } from "next";
import prisma from "@/lib/prisma";
import InfrastructureServicesPage, { EquipmentData } from "@/components/pages/InfrastructureServicesPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IT Infrastructure & Boardroom AV | Bezalel Technologies",
  description: "Enterprise networking, structured cabling, boardroom video conferencing, CCTV surveillance, and server hardware in Nairobi, Kenya.",
};

export default async function Page() {
  let equipmentList: EquipmentData[] = [];

  try {
    const rawEquipment = await prisma.equipment.findMany({
      where: { isClientFacing: true },
      orderBy: { displayOrder: "asc" },
    });

    if (rawEquipment.length > 0) {
      equipmentList = rawEquipment.map((eq) => ({
        id: eq.id,
        name: eq.name,
        category: eq.category,
        description: eq.description,
        specs: eq.specs,
        imageUrl: eq.imageUrl,
      }));
    }
  } catch (error) {
    console.error("Infrastructure page equipment fetch error:", error);
  }

  return <InfrastructureServicesPage equipmentList={equipmentList.length > 0 ? equipmentList : undefined} />;
}
