import { getUserRequests } from "@/app/actions/requests"
import { getAnnouncements } from "@/app/actions/notifications"
import { getShelters } from "@/app/actions/shelters"
import { StatsCard } from "@/components/shared/StatsCard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, Home, Bell, Phone, FilePlus, 
  ChevronRight, AlertCircle, Info, MapPin
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export const metadata = { title: "User Dashboard | NDC Relief" }

export default async function UserDashboard() {
  const [requests, announcements, shelters] = await Promise.all([
    getUserRequests(),
    getAnnouncements(),
    getShelters(),
  ])

  const pendingCount = requests.filter(r => r.status === "pending").length
  const approvedCount = requests.filter(r => r.status === "approved" || r.status === "in_progress").length

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to NDC Relief</h1>
          <p className="text-muted-foreground mt-1">Access emergency support and track your relief requests.</p>
        </div>
        <Button asChild size="lg" className="h-12 px-6 shadow-lg">
          <Link href="/user/create-request">
            <FilePlus className="h-5 w-5 mr-2" /> Create Emergency Request
          </Link>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="My Active Requests"
          value={pendingCount + approvedCount}
          description="Requests currently in system"
          icon={FileText}
          iconClassName="text-primary"
        />
        <StatsCard
          title="Approved Requests"
          value={approvedCount}
          description="Relief operations confirmed"
          icon={AlertCircle}
          iconClassName="text-green-500"
        />
        <StatsCard
          title="Unread Notifications"
          value={0} // Placeholder for now
          description="Updates on your requests"
          icon={Bell}
          iconClassName="text-blue-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Left Column: Announcements & Requests */}
        <div className="lg:col-span-4 space-y-6">
          {/* Announcements */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Emergency Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No active emergency announcements.</p>
              ) : (
                announcements.map((ann: any) => (
                  <div key={ann.id} className="p-4 rounded-lg bg-background border border-primary/10 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm">{ann.title}</h4>
                      <Badge variant={ann.priority === 'critical' ? 'destructive' : 'outline'} className="capitalize text-[10px]">
                        {ann.priority}
                      </priority>
                    </div>
                    <p className="text-sm text-muted-foreground">{ann.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">{formatDate(ann.created_at)}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* My Recent Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Recent Requests</CardTitle>
                <CardDescription>Status of your relief and assistance needs</CardDescription>
              </div>
              <Button asChild variant="link" size="sm">
                <Link href="/user/requests">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't made any requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.slice(0, 5).map((req: any) => (
                    <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{req.title}</p>
                        <p className="text-xs text-muted-foreground">{req.categories?.name} · {formatDate(req.created_at)}</p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Nearby Shelters & Resources */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="h-5 w-5 text-muted-foreground" />
                Active Shelters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shelters.slice(0, 3).map((shelter: any) => (
                <div key={shelter.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{shelter.name}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">{shelter.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {shelter.location}
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (shelter.current_occupancy / shelter.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/user/shelters">Find Nearest Shelter</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                Emergency Hotline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-destructive text-destructive-foreground flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">National Emergency</p>
                    <p className="text-2xl font-black">999</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <a href="tel:999">Call Now</a>
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Quick Contacts</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start gap-2" asChild>
                    <a href="tel:102"><Phone className="h-3 w-3" /> Fire: 102</a>
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start gap-2" asChild>
                    <a href="tel:100"><Phone className="h-3 w-3" /> Police: 100</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
