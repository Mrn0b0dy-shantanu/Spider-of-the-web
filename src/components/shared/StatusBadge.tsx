import { Badge } from "@/components/ui/badge"
import { getStatusColor } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize font-medium px-2.5 py-0.5",
        getStatusColor(status),
        className
      )}
    >
      {status.replace("_", " ")}
    </Badge>
  )
}
