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
  Heart,
  LogOut,
  Map
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/app/actions/auth"

const userNavItems = [
  { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { name: "New Request", href: "/user/create-request", icon: FilePlus },
  { name: "Earthquake Map", href: "/user/earthquake-map", icon: Map },
  { name: "Shelters", href: "/user/shelters", icon: Home },
  { name: "My Requests", href: "/user/requests", icon: FileText },
  { name: "Emergency Resources", href: "/user/resources", icon: BookOpen },
  { name: "Notifications", href: "/user/notifications", icon: Bell },
  { name: "Profile", href: "/user/profile", icon: User },
]

export function UserSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn("hidden top-0 sticky md:flex flex-col bg-muted/40 border-r w-64 h-screen", className)}>
      <div className="flex items-center px-6 border-b h-16">
        <Link href="/user/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <ShieldAlert className="w-7 h-7 text-primary" />
          <span>AntiQuake</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-4">
          <p className="mb-2 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Navigation
          </p>
          <nav className="space-y-1">
            {userNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex justify-between items-center px-3 py-2 rounded-lg font-medium text-sm transition-all",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </div>
                {pathname === item.href && <ChevronRight className="w-3 h-3" />}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="bg-primary/10 p-3 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1 text-primary">
            <Heart className="w-4 h-4" />
            <span className="font-bold text-xs">Need Help?</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Emergency? Call 999 immediately. For relief requests, use the form above.
          </p>
        </div>
        <form action={signOut} className="mt-4">
          <button className="flex items-center gap-3 hover:bg-muted px-3 py-2 rounded-lg w-full font-medium text-muted-foreground hover:text-primary text-sm transition-all">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  )
}
