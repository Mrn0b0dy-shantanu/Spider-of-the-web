"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClockAlert,
  Activity,
  User,
  Settings,
  ShieldAlert,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/app/actions/auth"

interface CoordinatorSidebarProps {
  className?: string
  pendingCount?: number
}

const coordinatorNavItems = [
  { name: "Dashboard", href: "/coordinator/dashboard", icon: LayoutDashboard },
  { name: "Pending Requests", href: "/coordinator/pending", icon: ClockAlert, badge: true },
  { name: "Active Requests", href: "/coordinator/active", icon: Activity },
  { name: "Profile", href: "/coordinator/profile", icon: User },
  { name: "Settings", href: "/coordinator/settings", icon: Settings },
]

export function CoordinatorSidebar({ className, pendingCount }: CoordinatorSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn("hidden top-0 sticky md:flex flex-col bg-muted/40 border-r w-64 h-screen", className)}>
      <div className="flex items-center px-6 border-b h-16">
        <Link href="/coordinator/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <ShieldAlert className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <span className="leading-none">AntiQuake</span>
            <span className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">Coordinator</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div>
          <nav className="space-y-1">
            {coordinatorNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/coordinator/dashboard" && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex justify-between items-center px-3 py-2.5 rounded-lg font-medium text-sm transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && typeof pendingCount === "number" && pendingCount > 0 && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono",
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-destructive text-destructive-foreground animate-pulse"
                        )}
                      >
                        {pendingCount}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 border-t">
        

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
