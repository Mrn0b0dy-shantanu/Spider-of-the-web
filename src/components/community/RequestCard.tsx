
"use client"

import { CommunityRequest } from "@/lib/types/community"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatDate } from "@/lib/utils"
import { MapPin, Clock, User, AlertTriangle, CheckCircle2, MessageSquare, HandHelping } from "lucide-react"
import { cn } from "@/lib/utils"
import { FulfillmentDialog } from "./FulfillmentDialog"

export function RequestCard({ request }: { request: any }) {
  const progress = (request.quantity_fulfilled / request.quantity_needed) * 100
  const isFulfilled = request.status === 'fulfilled'
  const isUrgent = request.urgency === 'critical' || request.urgency === 'high'

  const urgencyColors = {
    low: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    critical: "bg-red-500/10 text-red-600 border-red-500/20 animate-pulse",
  }

  const statusColors = {
    pending: "bg-muted text-muted-foreground",
    partially_fulfilled: "bg-primary/10 text-primary border-primary/20",
    fulfilled: "bg-green-500/10 text-green-600 border-green-500/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    expired: "bg-muted text-muted-foreground opacity-60",
  }

  return (
    <Card className={cn(
      "h-full flex flex-col overflow-hidden transition-all hover:shadow-md border-l-4",
      isUrgent ? "border-l-destructive" : "border-l-primary/40",
      request.status === 'fulfilled' && "opacity-80"
    )}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={cn("text-[10px] uppercase font-bold", urgencyColors[request.urgency as keyof typeof urgencyColors])}>
            {request.urgency} Priority
          </Badge>
          <Badge variant="outline" className={cn("text-[10px] capitalize", statusColors[request.status as keyof typeof statusColors])}>
            {request.status.replace("_", " ")}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-snug line-clamp-2 min-h-[3.5rem]">
          {request.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[3rem]">
          {request.description}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Progress</span>
            <span>{request.quantity_fulfilled} / {request.quantity_needed} units</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-y-2 pt-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{request.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDate(request.created_at)}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{request.profiles?.full_name || "Community Member"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[9px] py-0 px-1.5 h-4 uppercase font-normal">
              {request.category}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {!isFulfilled ? (
          <FulfillmentDialog request={request}>
            <Button className="flex-1 gap-2 h-9 text-xs shadow-sm" size="sm">
              <HandHelping className="w-3.5 h-3.5" /> Help Out
            </Button>
          </FulfillmentDialog>
        ) : (
          <Button variant="outline" className="flex-1 gap-2 h-9 text-xs border-green-500/20 text-green-600 bg-green-500/5 cursor-default hover:bg-green-500/5" size="sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fulfilled
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 border" title="Comments">
          <MessageSquare className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
