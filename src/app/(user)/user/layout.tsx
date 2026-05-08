import { UserSidebar } from "@/components/user/UserSidebar"
import { Header } from "@/components/shared/Header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default async function UserLayout({
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

  if (profile?.role === "admin") {
    redirect("/admin/dashboard")
  }

  return (
    <div className="flex min-h-screen w-full">
      <UserSidebar />
      <div className="flex flex-col flex-1">
        <Header 
          user={profile} 
          sidebarTrigger={
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <UserSidebar className="flex border-none h-full" />
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
