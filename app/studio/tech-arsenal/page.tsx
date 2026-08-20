import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { requireAdminPermission } from "@/lib/permissions";
import TechArsenalDashboard, { TechItemType } from "./TechArsenalDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tech Stack & Arsenal | Bezalel Technologies",
};

export default async function StudioTechArsenalPage() {
  await requireAdminPermission("TECH_ARSENAL");
  let items: TechItemType[] = [];
  try {
    const rawItems = await prisma.techArsenalItem.findMany({
      orderBy: { displayOrder: "asc" },
    });
    items = JSON.parse(JSON.stringify(rawItems));
  } catch (err) {
    console.error("StudioTechArsenalPage fetch error:", err);
  }

  return <TechArsenalDashboard initialItems={items} />;
}
