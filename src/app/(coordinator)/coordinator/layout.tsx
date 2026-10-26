import { CoordinatorSidebar } from "@/components/coordinator/CoordinatorSidebar"
import { Header } from "@/components/shared/Header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const role = user.user_metadata?.app_role || profile?.role || user.user_metadata?.role

  if (role !== "request_coordinator" && role !== "coordinator" && role !== "admin") {
    redirect("/user/dashboard")
  }

  // Get pending count for live sidebar indicator
  const { count: pendingCount } = await supabase
    .from("disaster_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const userProfile = {
    full_name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Coordinator",
    role: role,
    avatar_url: profile?.avatar_url,
  }

  return (
    <div className="flex min-h-screen w-full">
      <CoordinatorSidebar pendingCount={pendingCount || 0} />
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          user={userProfile}
          sidebarTrigger={
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <CoordinatorSidebar
                  pendingCount={pendingCount || 0}
                  className="flex border-none h-full"
                />
              </SheetContent>
            </Sheet>
          }
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
