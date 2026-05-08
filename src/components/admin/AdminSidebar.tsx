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
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const adminNavItems = [
  { name: "Command Center", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Disaster Requests", href: "/admin/requests", icon: FileText },
  { name: "Supply Inventory", href: "/admin/supplies", icon: Box },
  { name: "Active Incidents", href: "/admin/incidents", icon: Activity },
  { name: "Shelters & Camps", href: "/admin/shelters", icon: Home },
  { name: "Field Personnel", href: "/admin/personnel", icon: Users },
  { name: "Partner Orgs", href: "/admin/organizations", icon: Building },
  { name: "Reports & Data", href: "/admin/reports", icon: BarChart3 },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "User Management", href: "/admin/users", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r bg-muted/40 md:flex flex-col w-64 h-screen sticky top-0">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <ShieldAlert className="h-7 w-7 text-destructive" />
          <span>NDC <span className="text-muted-foreground font-medium">Relief</span></span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="mb-4">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Operations
          </p>
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
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
                  <item.icon className={cn("h-4 w-4", pathname === item.href ? "" : "group-hover:text-primary")} />
                  {item.name}
                </div>
                {pathname === item.href && <ChevronRight className="h-3 w-3" />}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            System
          </p>
          <nav className="space-y-1">
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-all"
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/20">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Admin Mode</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            You have full access to operational data and emergency controls.
          </p>
        </div>
      </div>
    </aside>
  )
}
