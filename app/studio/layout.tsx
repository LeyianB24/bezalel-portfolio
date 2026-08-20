import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/studio/Sidebar";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/?error=Unauthorized");
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground md:flex-row antialiased">
      {/* Subtle Ambient Background Gradient Scrim */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(201, 162, 75, 0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(11, 32, 54, 0.25) 0%, transparent 60%)",
        }}
      />

      <Sidebar
        user={{
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
          permissions: session.user?.permissions,
        }}
      />

      <main className="relative z-10 flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto max-h-screen">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
