import { getEmergencyContacts } from "@/app/actions/admin"
import { getAnnouncements } from "@/app/actions/notifications"
import { getShelters } from "@/app/actions/shelters"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Phone, AlertTriangle, BookOpen, ShieldCheck, MapPin, ExternalLink } from "lucide-react"

export const metadata = { title: "Emergency Resources | AntiQuake" }

const typeColors: Record<string, string> = {
  police: "bg-blue-500",
  fire: "bg-red-500",
  medical: "bg-green-500",
  disaster: "bg-orange-500",
  general: "bg-slate-500",
  hotline: "bg-purple-500",
}

export default async function UserResourcesPage() {
  const [contacts, announcements, shelters] = await Promise.all([
    getEmergencyContacts(),
    getAnnouncements(),
    getShelters(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Emergency Resources</h1>
        <p className="mt-1 text-muted-foreground">Direct access to emergency hotlines and safety guides.</p>
      </div>

      <div className="gap-6 grid lg:grid-cols-3">

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Emergency Hotlines
              </CardTitle>
              <CardDescription>Immediate assistance available 24/7</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="gap-4 grid sm:grid-cols-2">
                {contacts.map((contact: any) => (
                  <div key={contact.id} className="flex flex-col bg-card hover:shadow-md p-4 border rounded-xl transition-shadow">
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Safety & Preparedness Guides
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4 grid sm:grid-cols-2">
              <div className="group bg-muted/30 hover:bg-muted/50 p-4 border rounded-lg cursor-pointer">
                <h4 className="flex justify-between items-center font-bold">
                  Flood Safety <ExternalLink className="opacity-0 group-hover:opacity-100 w-4 h-4 transition-opacity" />
                </h4>
                <p className="mt-1 text-muted-foreground text-xs">What to do before, during, and after a flood event.</p>
              </div>
              <div className="group bg-muted/30 hover:bg-muted/50 p-4 border rounded-lg cursor-pointer">
                <h4 className="flex justify-between items-center font-bold">
                  Earthquake Protocol <ExternalLink className="opacity-0 group-hover:opacity-100 w-4 h-4 transition-opacity" />
                </h4>
                <p className="mt-1 text-muted-foreground text-xs">Drop, Cover, and Hold On. Protecting yourself indoors.</p>
              </div>
              <div className="group bg-muted/30 hover:bg-muted/50 p-4 border rounded-lg cursor-pointer">
                <h4 className="flex justify-between items-center font-bold">
                  First Aid Basics <ExternalLink className="opacity-0 group-hover:opacity-100 w-4 h-4 transition-opacity" />
                </h4>
                <p className="mt-1 text-muted-foreground text-xs">Basic first aid procedures for common injuries.</p>
              </div>
              <div className="group bg-muted/30 hover:bg-muted/50 p-4 border rounded-lg cursor-pointer">
                <h4 className="flex justify-between items-center font-bold">
                  Emergency Kits <ExternalLink className="opacity-0 group-hover:opacity-100 w-4 h-4 transition-opacity" />
                </h4>
                <p className="mt-1 text-muted-foreground text-xs">Essential items to keep in your grab-and-go bag.</p>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="space-y-6">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">No active alerts at this time.</p>
              ) : (
                announcements.map((ann: any) => (
                  <div key={ann.id} className={`p-4 rounded-lg border-l-4 ${ann.priority === 'critical' ? 'border-destructive bg-destructive/5' : 'border-primary bg-primary/5'}`}>
                    <h5 className="font-bold text-sm">{ann.title}</h5>
                    <p className="mt-1 text-muted-foreground text-xs">{ann.message}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                Active Relief Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shelters.length === 0 ? (
                <p className="text-muted-foreground text-xs italic">No relief points active.</p>
              ) : (
                shelters.slice(0, 4).map((shelter, idx) => (
                  <div key={shelter.id}>
                    <div className="text-sm">
                      <p className="font-medium">{shelter.name}</p>
                      <p className="text-muted-foreground text-xs italic">{shelter.location}</p>
                    </div>
                    {idx < shelters.slice(0, 4).length - 1 && <Separator className="my-2" />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
