"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Home,
  BookOpen,
  Bell,
  User,
  ShieldAlert,
  ChevronRight,
  Heart
} from "lucide-react"
import { cn } from "@/lib/utils"

const userNavItems = [
  { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { name: "New Request", href: "/user/create-request", icon: FilePlus },
  { name: "My Requests", href: "/user/requests", icon: FileText },
  { name: "Shelters", href: "/user/shelters", icon: Home },
  { name: "Emergency Resources", href: "/user/resources", icon: BookOpen },
  { name: "Notifications", href: "/user/notifications", icon: Bell },
  { name: "Profile", href: "/user/profile", icon: User },
]

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r bg-muted/40 md:flex flex-col w-64 h-screen sticky top-0">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/user/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <ShieldAlert className="h-7 w-7 text-primary" />
          <span>NDC <span className="text-muted-foreground font-medium">Relief</span></span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="mb-4">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {userNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between group rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </div>
                {pathname === item.href && <ChevronRight className="h-3 w-3" />}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Heart className="h-4 w-4" />
            <span className="text-xs font-bold">Need Help?</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Emergency? Call 999 immediately. For relief requests, use the form above.
          </p>
        </div>
      </div>
    </aside>
  )
}
