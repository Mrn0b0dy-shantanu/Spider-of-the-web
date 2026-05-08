"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Home, Users, MapPin, Phone, Plus } from "lucide-react"
import { updateShelterOccupancy } from "@/app/actions/shelters"
import { toast } from "sonner"

export default function AdminSheltersClient({ shelters }: { shelters: any[] }) {
  const [isPending, startTransition] = useTransition()

  const handleOccupancyChange = (id: string, newOccupancy: number) => {
    if (newOccupancy < 0) return
    startTransition(async () => {
      const res = await updateShelterOccupancy(id, newOccupancy)
      if (res?.success) {
        toast.success("Occupancy updated")
      } else {
        toast.error(res?.error || "Failed to update occupancy")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shelters & Camps</h1>
          <p className="text-muted-foreground mt-1">Manage emergency housing and relief camps.</p>
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Add Shelter
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shelters.map((shelter) => {
          const occupancyRate = (shelter.current_occupancy / shelter.capacity) * 100
          return (
            <Card key={shelter.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{shelter.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {shelter.location}
                    </CardDescription>
                  </div>
                  <StatusBadge status={shelter.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Occupancy</span>
                    <span>{shelter.current_occupancy} / {shelter.capacity}</span>
                  </div>
                  <Progress value={occupancyRate} className={occupancyRate > 90 ? "bg-destructive/20 [&>div]:bg-destructive" : ""} />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> {shelter.contact_person}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {shelter.contact_phone}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleOccupancyChange(shelter.id, shelter.current_occupancy - 10)}
                    disabled={isPending || shelter.current_occupancy <= 0}
                  >
                    -10
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleOccupancyChange(shelter.id, shelter.current_occupancy + 10)}
                    disabled={isPending || shelter.current_occupancy >= shelter.capacity}
                  >
                    +10
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
