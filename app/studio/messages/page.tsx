import prisma from "@/lib/prisma";
import MessagesDashboard from "./MessagesDashboard";

export const revalidate = 0;

export default async function Page() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <MessagesDashboard initialMessages={messages} />
  );
}
