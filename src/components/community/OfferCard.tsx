
"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Package, HandHelping, User, MessageCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function OfferCard({ offer }: { offer: any }) {
  const initials = offer.profiles?.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?"

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow border-green-500/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 capitalize font-bold">
            <HandHelping className="w-3 h-3 mr-1" />
            {offer.category}
          </Badge>
          <span className="text-[10px] text-muted-foreground flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(offer.created_at)}
          </span>
        </div>
        <CardTitle className="text-xl line-clamp-1">{offer.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {offer.description}
        </p>

        <div className="flex flex-wrap gap-3 py-3 border-y bg-muted/30 -mx-6 px-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Package className="w-4 h-4 text-primary" />
            <span>Qty: {offer.quantity}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate max-w-[150px]">{offer.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {offer.help_methods?.map((method: string) => (
            <Badge key={method} variant="secondary" className="text-[9px] uppercase tracking-wider bg-muted text-muted-foreground">
              {method}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-muted shadow-sm">
            <AvatarImage src={offer.profiles?.avatar_url} />
            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-bold truncate max-w-[100px]">{offer.profiles?.full_name || "Volunteer"}</span>
            <span className="text-[8px] uppercase tracking-tighter text-muted-foreground">Community Member</span>
          </div>
        </div>
        <Button size="sm" className="gap-1.5 h-8">
          <MessageCircle className="w-3.5 h-3.5" />
          Request Help
        </Button>
      </CardFooter>
    </Card>
  )
}
