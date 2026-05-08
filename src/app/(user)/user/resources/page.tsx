import { getEmergencyContacts } from "@/app/actions/admin"
import { getAnnouncements } from "@/app/actions/notifications"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Phone, AlertTriangle, BookOpen, ShieldCheck, MapPin, ExternalLink } from "lucide-react"

export const metadata = { title: "Emergency Resources | NDC Relief" }

const typeColors: Record<string, string> = {
  police: "bg-blue-500",
  fire: "bg-red-500",
  medical: "bg-green-500",
  disaster: "bg-orange-500",
  general: "bg-slate-500",
  hotline: "bg-purple-500",
}

export default async function UserResourcesPage() {
  const [contacts, announcements] = await Promise.all([
    getEmergencyContacts(),
    getAnnouncements(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emergency Resources</h1>
        <p className="text-muted-foreground mt-1">Direct access to emergency hotlines and safety guides.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hotlines */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Emergency Hotlines
              </CardTitle>
              <CardDescription>Immediate assistance available 24/7</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {contacts.map((contact: any) => (
                  <div key={contact.id} className="flex flex-col p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={typeColors[contact.type] || "bg-primary"}>
                        {contact.type}
                      </Badge>
                      <span className="text-lg font-black text-primary">{contact.phone}</span>
                    </div>
                    <h4 className="font-bold">{contact.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 flex-1">{contact.description}</p>
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
                <ShieldCheck className="h-5 w-5 text-primary" />
                Safety & Preparedness Guides
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg border bg-muted/30 group hover:bg-muted/50 cursor-pointer">
                <h4 className="font-bold flex items-center justify-between">
                  Flood Safety <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground mt-1">What to do before, during, and after a flood event.</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30 group hover:bg-muted/50 cursor-pointer">
                <h4 className="font-bold flex items-center justify-between">
                  Earthquake Protocol <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Drop, Cover, and Hold On. Protecting yourself indoors.</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30 group hover:bg-muted/50 cursor-pointer">
                <h4 className="font-bold flex items-center justify-between">
                  First Aid Basics <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Basic first aid procedures for common injuries.</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30 group hover:bg-muted/50 cursor-pointer">
                <h4 className="font-bold flex items-center justify-between">
                  Emergency Kits <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Essential items to keep in your grab-and-go bag.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements sidebar */}
        <div className="space-y-6">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No active alerts at this time.</p>
              ) : (
                announcements.map((ann: any) => (
                  <div key={ann.id} className={`p-4 rounded-lg border-l-4 ${ann.priority === 'critical' ? 'border-destructive bg-destructive/5' : 'border-primary bg-primary/5'}`}>
                    <h5 className="font-bold text-sm">{ann.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1">{ann.message}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                Supply Centers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Dhaka Central Hub</p>
                <p className="text-xs text-muted-foreground italic">Farmgate Area, Dhaka</p>
              </div>
              <Separator />
              <div className="text-sm">
                <p className="font-medium">Sylhet Zonal Hub</p>
                <p className="text-xs text-muted-foreground italic">Circuit House Road, Sylhet</p>
              </div>
              <Separator />
              <div className="text-sm">
                <p className="font-medium">Chittagong Relief Point</p>
                <p className="text-xs text-muted-foreground italic">Agrabad, Chittagong</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
