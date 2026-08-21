import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Sidebar from "@/components/studio/Sidebar";
import StudioNavbar from "@/components/studio/StudioNavbar";
import { StudioProvider } from "@/components/studio/StudioContext";
import { AdminPermission } from "@prisma/client";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/?error=Unauthorized");
  }

  let permissions = session.user?.permissions;
  if (!permissions || permissions.length === 0) {
    if (session.user?.id) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { permissions: true },
        });
        permissions = dbUser?.permissions?.length
          ? dbUser.permissions
          : [AdminPermission.FULL_ACCESS];
      } catch {
        permissions = [AdminPermission.FULL_ACCESS];
      }
    } else {
      permissions = [AdminPermission.FULL_ACCESS];
    }
  }

  const studioUser = {
    name: session.user?.name,
    email: session.user?.email,
    image: session.user?.image,
    permissions,
  };

  return (
    <StudioProvider>
      <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-accent/20">
        {/* Full-width Ambient Background Scrim */}
        <div
          className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-60 z-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at top right, rgba(201, 162, 75, 0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(11, 32, 54, 0.25) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* 1. Full-Width Top Studio Navbar (Sole Location for Logo & Header Controls) */}
        <StudioNavbar user={studioUser} />

        {/* 2. Main Studio Body: Sidebar and Content tucked side-by-side beneath Navbar */}
        <div className="relative z-10 flex flex-1 overflow-hidden">
          <Sidebar user={studioUser} />

          <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </StudioProvider>
  );
}
