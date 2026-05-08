import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Header } from "@/components/shared/Header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/user/dashboard")
  }

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <Header user={profile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
