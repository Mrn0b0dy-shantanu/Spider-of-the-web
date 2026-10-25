"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  Search,
  Filter,
  Users
} from "lucide-react"

interface UserResourcesClientProps {
  contacts: any[]
  announcements: any[]
  shelters: any[]
}

const typeColors: Record<string, string> = {
  police: "bg-blue-500",
  fire: "bg-red-500",
  medical: "bg-green-500",
  disaster: "bg-orange-500",
  general: "bg-slate-500",
  hotline: "bg-purple-500",
}

export default function UserResourcesClient({
  contacts,
  announcements,
  shelters,
}: UserResourcesClientProps) {
  const [activeTab, setActiveTab] = useState("shelters")
  const [shelterSearch, setShelterSearch] = useState("")
  const [shelterFilter, setShelterFilter] = useState("all")

  const filteredShelters = shelters.filter((shelter) => {
    const matchesSearch =
      shelter.name.toLowerCase().includes(shelterSearch.toLowerCase()) ||
      shelter.location.toLowerCase().includes(shelterSearch.toLowerCase()) ||
      (shelter.amenities &&
        shelter.amenities.some((a: string) =>
          a.toLowerCase().includes(shelterSearch.toLowerCase())
        ))

    const matchesStatus =
      shelterFilter === "all" ||
      (shelterFilter === "available" && shelter.status !== "full" && (shelter.current_occupancy / shelter.capacity) < 1) ||
      (shelterFilter === "full" && (shelter.status === "full" || (shelter.current_occupancy / shelter.capacity) >= 1))

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Emergency Resources & Shelters</h1>
        <p className="mt-1 text-muted-foreground">
          Single hub for emergency shelters, 24/7 hotlines, relief contacts, and disaster safety guides.
        </p>
      </div>

      {announcements.length > 0 && (
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Active Emergency Alerts ({announcements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((ann: any) => (
              <div
                key={ann.id}
                className={`p-3 rounded-lg border-l-4 bg-background shadow-xs ${
                  ann.priority === "critical"
                    ? "border-destructive"
                    : "border-primary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{ann.title}</h4>
                  <Badge
                    variant={ann.priority === "critical" ? "destructive" : "outline"}
                    className="text-[10px] capitalize"
                  >
                    {ann.priority}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{ann.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="h-auto flex-wrap gap-1 bg-muted/60 p-1">
          <TabsTrigger value="shelters" className="gap-2">
            <Home className="h-4 w-4" />
            Active Shelters
            <Badge variant="secondary" className="ml-1 text-xs">
              {shelters.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="hotlines" className="gap-2">
            <Phone className="h-4 w-4" />
            Emergency Hotlines
            <Badge variant="secondary" className="ml-1 text-xs">
              {contacts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="guides" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Safety Guides
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            All Resources
          </TabsTrigger>
        </TabsList>

        {/* Shelters Tab */}
        <TabsContent value="shelters" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shelters by name, location, or amenity..."
                value={shelterSearch}
                onChange={(e) => setShelterSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={shelterFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setShelterFilter("all")}
              >
                All Shelters
              </Button>
              <Button
                variant={shelterFilter === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setShelterFilter("available")}
              >
                Space Available
              </Button>
              <Button
                variant={shelterFilter === "full" ? "default" : "outline"}
                size="sm"
                onClick={() => setShelterFilter("full")}
              >
                At Capacity
              </Button>
            </div>
          </div>

          {filteredShelters.length === 0 ? (
            <Card className="py-12 text-center text-muted-foreground">
              <Home className="mx-auto mb-2 h-10 w-10 opacity-30" />
              <p className="font-medium">No shelters matching your criteria.</p>
              <p className="text-xs mt-1">Try clearing filters or search terms.</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredShelters.map((shelter) => {
                const occupancyRate = (shelter.current_occupancy / shelter.capacity) * 100
                const isFull = shelter.status === "full" || occupancyRate >= 100

                return (
                  <Card
                    key={shelter.id}
                    className={`overflow-hidden transition-all ${
                      isFull
                        ? "opacity-75 grayscale-[0.3]"
                        : "border-primary/20 shadow-md hover:shadow-lg"
                    }`}
                  >
                    <CardHeader className="pb-3 bg-muted/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-lg truncate">{shelter.name}</CardTitle>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{shelter.location}</span>
                          </div>
                        </div>
                        <Badge
                          variant={isFull ? "destructive" : "default"}
                          className="capitalize shrink-0"
                        >
                          {shelter.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {shelter.description || "Temporary emergency shelter and relief accommodation."}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                          <span>Space Available</span>
                          <span className={isFull ? "text-destructive" : "text-primary"}>
                            {Math.max(0, shelter.capacity - shelter.current_occupancy)} units
                          </span>
                        </div>
                        <Progress
                          value={Math.min(100, occupancyRate)}
                          className={isFull ? "[&>div]:bg-destructive" : ""}
                        />
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>{shelter.current_occupancy} occupied</span>
                          <span>{shelter.capacity} total capacity</span>
                        </div>
                      </div>

                      {shelter.amenities && shelter.amenities.length > 0 && (
                        <div className="pt-2 border-t space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Amenities Available
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {shelter.amenities.map((amenity: string) => (
                              <Badge
                                key={amenity}
                                variant="secondary"
                                className="text-[10px] py-0 capitalize"
                              >
                                <CheckCircle2 className="h-2.5 w-2.5 mr-1 text-primary" /> {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t flex items-center justify-between">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">
                            Contact Person
                          </span>
                          <span className="text-sm font-medium truncate">
                            {shelter.contact_person || "Relief Coordinator"}
                          </span>
                        </div>
                        {shelter.contact_phone && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${shelter.contact_phone}`}>
                              <Phone className="h-3.5 w-3.5 mr-1" /> Call
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Hotlines Tab */}
        <TabsContent value="hotlines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Emergency Hotlines & Relief Desks
              </CardTitle>
              <CardDescription>Direct 24/7 access to national and regional emergency services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
                {contacts.map((contact: any) => (
                  <div
                    key={contact.id}
                    className="flex flex-col bg-card hover:shadow-md p-4 border rounded-xl transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <Badge className={typeColors[contact.type] || "bg-primary"}>
                        {contact.type}
                      </Badge>
                      <span className="font-black text-primary text-lg">{contact.phone}</span>
                    </div>
                    <h4 className="font-bold">{contact.name}</h4>
                    <p className="flex-1 mt-1 text-muted-foreground text-xs">{contact.description}</p>
                    <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                      <a href={`tel:${contact.phone}`}>Call {contact.phone}</a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Safety & Preparedness Protocols
              </CardTitle>
              <CardDescription>Official citizen guidelines for disaster response and recovery</CardDescription>
            </CardHeader>
            <CardContent className="gap-4 grid sm:grid-cols-2">
              <div className="group bg-muted/30 hover:bg-muted/50 p-4 border rounded-lg transition-colors">
                <h4 className="flex justify-between items-center font-bold">
                  Earthquake Protocol <ExternalLink className="opacity-60 group-hover:opacity-100 w-4 h-4 transition-opacity" />
                </h4>
                <p className="mt-1 text-muted-foreground text-xs">
                  Drop, Cover, and Hold On. Protect yourself indoors, identify safe spots, and evacuate after shaking stops.
                </p>
              </div>
              <div className="group bg-muted/30 hover:bg-muted/50 p-4 border rounded-lg transition-colors">
                <h4 className="flex justify-between items-center font-bold">
                  Flood Safety <ExternalLink className="opacity-60 group-hover:opacity-100 w-4 h-4 transition-opacity" />
                </h4>
                <p className="mt-1 text-muted-foreground text-xs">
                  Turn around, don't drown. Move to higher ground immediately and avoid moving floodwaters.
                </p>
              </div>
              <div className="group bg-muted/30 hover:bg-muted/50 p-4 border rounded-lg transition-colors">
                <h4 className="flex justify-between items-center font-bold">
                  First Aid Basics <ExternalLink className="opacity-60 group-hover:opacity-100 w-4 h-4 transition-opacity" />
                </h4>
                <p className="mt-1 text-muted-foreground text-xs">
                  Stop heavy bleeding, treat shock, address burns, and stabilize fractures before emergency medical arrival.
                </p>
              </div>
              <div className="group bg-muted/30 hover:bg-muted/50 p-4 border rounded-lg transition-colors">
                <h4 className="flex justify-between items-center font-bold">
                  Emergency Grab Bag <ExternalLink className="opacity-60 group-hover:opacity-100 w-4 h-4 transition-opacity" />
                </h4>
                <p className="mt-1 text-muted-foreground text-xs">
                  Keep 3 days of non-perishable food, potable water, essential medicines, flashlights, and vital documents.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Tab */}
        <TabsContent value="all" className="space-y-8">
          {/* Shelters Summary in All */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Active Shelters & Camps ({shelters.length})
              </h2>
              <Button variant="link" size="sm" onClick={() => setActiveTab("shelters")}>
                View All Shelters
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shelters.slice(0, 6).map((shelter) => {
                const occupancyRate = (shelter.current_occupancy / shelter.capacity) * 100
                const isFull = shelter.status === "full" || occupancyRate >= 100

                return (
                  <Card key={shelter.id} className="border-primary/20 shadow-xs">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{shelter.name}</CardTitle>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {shelter.location}
                          </p>
                        </div>
                        <Badge variant={isFull ? "destructive" : "outline"} className="capitalize text-xs">
                          {shelter.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Capacity: {shelter.current_occupancy} / {shelter.capacity}</span>
                        <span>{Math.max(0, shelter.capacity - shelter.current_occupancy)} space left</span>
                      </div>
                      <Progress value={Math.min(100, occupancyRate)} className="h-1.5" />
                      <div className="pt-2 flex justify-between items-center">
                        <span className="text-[11px] text-muted-foreground">{shelter.contact_person}</span>
                        <a href={`tel:${shelter.contact_phone}`} className="text-primary font-medium hover:underline text-xs flex items-center gap-1">
                          <Phone className="h-3 w-3" /> Call
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Hotlines Summary in All */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Emergency Hotlines
              </h2>
              <Button variant="link" size="sm" onClick={() => setActiveTab("hotlines")}>
                View All Hotlines
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contacts.slice(0, 6).map((contact: any) => (
                <div key={contact.id} className="p-4 border rounded-xl bg-card shadow-xs flex justify-between items-center">
                  <div>
                    <Badge className={typeColors[contact.type] || "bg-primary"}>{contact.type}</Badge>
                    <h4 className="font-semibold text-sm mt-1">{contact.name}</h4>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Guides Summary in All */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Safety Protocols
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-lg bg-muted/20">
                <h4 className="font-semibold text-sm">Earthquake Protocol</h4>
                <p className="text-xs text-muted-foreground mt-1">Drop, Cover, and Hold On indoors. Move away from glass and hazards.</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/20">
                <h4 className="font-semibold text-sm">Emergency Grab Bag</h4>
                <p className="text-xs text-muted-foreground mt-1">Keep 3 days of non-perishable food, water, flashlight, and medications ready.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
