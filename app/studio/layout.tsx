import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Sidebar from "@/components/studio/Sidebar"

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/?error=Unauthorized")
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 md:flex-row">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
