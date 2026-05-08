"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  Activity,
  Box,
  Users,
  Building,
  FileText,
  Globe,
  LogOut
} from "lucide-react";

import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Incidents", href: "/incidents", icon: Activity },
  { name: "Logistics", href: "/logistics", icon: Box },
  { name: "Personnel", href: "/personnel", icon: Users },
  { name: "Organizations", href: "/organizations", icon: Building },
  { name: "Requests", href: "/requests", icon: FileText },
  { name: "Earthquakes", href: "/earthquakes", icon: Globe },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <div className="hidden md:block bg-muted/40 border-r w-64 h-full min-h-screen">
      <div className="flex flex-col gap-2 h-full max-h-screen">
        <div className="flex items-center px-4 lg:px-6 border-b h-14 lg:h-[60px]">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <ShieldAlert className="w-6 h-6 text-destructive" />
            <span>AntiQuake</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="items-start grid mt-4 px-2 lg:px-4 font-medium text-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary transition-all",
                  pathname === item.href ? "bg-muted text-primary" : ""
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <form action={signOut}>
            <button className="flex items-center gap-3 hover:bg-muted px-3 py-2 rounded-lg w-full font-medium text-muted-foreground hover:text-primary text-sm transition-all">
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
