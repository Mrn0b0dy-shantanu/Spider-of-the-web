import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy h:mm a")
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
    case "monitoring":
    case "available":
    case "low":
      return "bg-yellow-500/15 text-yellow-500 border-yellow-500/20"
    case "approved":
    case "active":
    case "deployed":
    case "medium":
      return "bg-blue-500/15 text-blue-500 border-blue-500/20"
    case "in_progress":
      return "bg-purple-500/15 text-purple-500 border-purple-500/20"
    case "fulfilled":
    case "resolved":
    case "high":
      return "bg-green-500/15 text-green-500 border-green-500/20"
    case "rejected":
    case "critical":
    case "catastrophic":
    case "out_of_stock":
    case "full":
    case "closed":
      return "bg-destructive/15 text-destructive border-destructive/20"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}
