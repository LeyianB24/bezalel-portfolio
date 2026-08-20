import prisma from "@/lib/prisma";
import { requireAdminPermission } from "@/lib/permissions";
import MessagesDashboard from "./MessagesDashboard";

export const revalidate = 0;

export default async function Page() {
  await requireAdminPermission("MESSAGES");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <MessagesDashboard initialMessages={messages} />
  );
}
