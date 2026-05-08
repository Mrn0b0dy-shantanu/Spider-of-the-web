import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ShieldAlert,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "@/app/actions/auth"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface HeaderProps {
  user?: {
    full_name: string
    role: string
    avatar_url?: string
  }
  sidebarTrigger?: React.ReactNode
}

export function Header({ user, sidebarTrigger }: HeaderProps) {
  return (
    <header className="top-0 z-40 sticky flex justify-between items-center bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur px-4 md:px-6 border-b w-full h-16">
      <div className="flex items-center gap-4">
        {sidebarTrigger}
        <div className="md:hidden flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">AntiQuake</span>
        </div>
        <div className="hidden relative md:flex items-center">
          <Search className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search operational data..."
            className="bg-background file:bg-transparent disabled:opacity-50 pr-3 pl-9 border border-input file:border-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-64 h-9 file:font-medium placeholder:text-muted-foreground text-sm file:text-sm disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="top-1.5 right-1.5 absolute bg-destructive border-2 border-background rounded-full w-2 h-2"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full w-9 h-9">
              <Avatar className="border w-9 h-9">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-sm leading-none">{user?.full_name || "User"}</p>
                <p className="text-muted-foreground text-xs capitalize leading-none">
                  {user?.role || "Member"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 w-4 h-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 w-4 h-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={signOut}>
              <button type="submit" className="relative flex items-center hover:bg-accent px-2 py-1.5 rounded-sm outline-none w-full text-destructive text-sm transition-colors hover:text-accent-foreground cursor-pointer select-none">
                <LogOut className="mr-2 w-4 h-4" />
                <span>Log out</span>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
