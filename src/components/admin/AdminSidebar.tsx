"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Box,
  Activity,
  Home,
  Users,
  Building,
  BarChart3,
  Bell,
  ShieldAlert,
  Settings,
  ChevronRight,
  AlertCircle,
  LogOut,
  Newspaper
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/app/actions/auth"

const adminNavItems = [
  { name: "Command Center", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Disaster Requests", href: "/admin/requests", icon: FileText },
  { name: "Earthquakes", href: "/admin/earthquakes", icon: AlertCircle },
  { name: "Supply Inventory", href: "/admin/supplies", icon: Box },
  { name: "Active Incidents", href: "/admin/incidents", icon: Activity },
  { name: "Shelters & Camps", href: "/admin/shelters", icon: Home },
  { name: "Field Personnel", href: "/admin/personnel", icon: Users },
  { name: "Partner Orgs", href: "/admin/organizations", icon: Building },
  { name: "Reports & Data", href: "/admin/reports", icon: BarChart3 },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "News Verification", href: "/admin/news", icon: Newspaper },
  { name: "Community Monitor", href: "/admin/community", icon: Users },
  { name: "User Management", href: "/admin/users", icon: Users },
]

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn("hidden top-0 sticky md:flex flex-col bg-muted/40 border-r w-64 h-screen", className)}>
      <div className="flex items-center px-6 border-b h-16">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-primary text-xl tracking-tight">
          <ShieldAlert className="w-7 h-7 text-destructive" />
          <span>AntiQuake</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-4">
          <p className="mb-2 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Operations
          </p>
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
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
                  <item.icon className={cn("w-4 h-4", pathname === item.href ? "" : "group-hover:text-primary")} />
                  {item.name}
                </div>
                {pathname === item.href && <ChevronRight className="w-3 h-3" />}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <p className="mb-2 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            System
          </p>
          <nav className="space-y-1">
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-3 hover:bg-muted px-3 py-2 rounded-lg font-medium text-muted-foreground hover:text-primary text-sm transition-all"
              )}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 border-t">
        <div className="bg-destructive/10 p-3 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1 text-destructive">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-bold text-xs uppercase">Admin Mode</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            You have full access to operational data and emergency controls.
          </p>
        </div>
        <form action={signOut}>
          <button className="flex items-center gap-3 hover:bg-muted px-3 py-2 rounded-lg w-full font-medium text-muted-foreground hover:text-primary text-sm transition-all">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  )
}
