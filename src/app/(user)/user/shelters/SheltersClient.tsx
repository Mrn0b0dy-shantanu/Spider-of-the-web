"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Home, MapPin, Phone, Users, CheckCircle2 } from "lucide-react"

export default function UserSheltersClient({ shelters }: { shelters: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Shelters</h1>
        <p className="text-muted-foreground mt-1">Find nearby emergency housing and relief camps.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shelters.map((shelter) => {
          const occupancyRate = (shelter.current_occupancy / shelter.capacity) * 100
          const isFull = shelter.status === "full" || occupancyRate >= 100

          return (
            <Card key={shelter.id} className={`overflow-hidden ${isFull ? 'opacity-75 grayscale-[0.5]' : 'border-primary/20 shadow-lg'}`}>
              <CardHeader className="pb-2 bg-muted/30">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{shelter.name}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {shelter.location}
                    </div>
                  </div>
                  <Badge variant={isFull ? "destructive" : "default"} className="capitalize">
                    {shelter.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{shelter.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>Space Available</span>
                    <span>{Math.max(0, shelter.capacity - shelter.current_occupancy)} units</span>
                  </div>
                  <Progress value={occupancyRate} className={isFull ? "[&>div]:bg-destructive" : ""} />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{shelter.current_occupancy} occupied</span>
                    <span>{shelter.capacity} total capacity</span>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {shelter.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="secondary" className="text-[10px] py-0 capitalize">
                        <CheckCircle2 className="h-2.5 w-2.5 mr-1 text-primary" /> {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Point of Contact</span>
                    <span className="text-sm font-medium">{shelter.contact_person}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${shelter.contact_phone}`}>
                      <Phone className="h-3 w-3 mr-1" /> Call
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
