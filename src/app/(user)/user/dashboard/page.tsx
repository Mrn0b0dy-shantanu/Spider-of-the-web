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

export const metadata = { title: "User Dashboard | AntiQuake" }

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
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Welcome to AntiQuake</h1>
          <p className="mt-1 text-muted-foreground">Access emergency support and track your relief requests.</p>
        </div>
        <Button asChild size="lg" className="shadow-lg px-6 h-12">
          <Link href="/user/create-request">
            <FilePlus className="mr-2 w-5 h-5" /> Create Emergency Request
          </Link>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="gap-4 grid md:grid-cols-3">
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

      <div className="gap-6 grid lg:grid-cols-7">
        {/* Left Column: Announcements & Requests */}
        <div className="space-y-6 lg:col-span-4">
          {/* Announcements */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Emergency Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">No active emergency announcements.</p>
              ) : (
                announcements.map((ann: any) => (
                  <div key={ann.id} className="bg-background shadow-sm p-4 border border-primary/10 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-sm">{ann.title}</h4>
                      <Badge variant={ann.priority === 'critical' ? 'destructive' : 'outline'} className="text-[10px] capitalize">
                        {ann.priority}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{ann.message}</p>
                    <p className="mt-2 text-[10px] text-muted-foreground">{formatDate(ann.created_at)}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* My Recent Requests */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
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
                <div className="py-8 text-muted-foreground text-center">
                  <p>You haven't made any requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.slice(0, 5).map((req: any) => (
                    <div key={req.id} className="flex justify-between items-center hover:bg-muted/30 p-3 border rounded-lg transition-colors">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{req.title}</p>
                        <p className="text-muted-foreground text-xs">{req.categories?.name} · {formatDate(req.created_at)}</p>
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
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="w-5 h-5 text-muted-foreground" />
                Active Shelters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shelters.slice(0, 3).map((shelter: any) => (
                <div key={shelter.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{shelter.name}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">{shelter.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <MapPin className="w-3 h-3" /> {shelter.location}
                  </div>
                  <div className="bg-muted mt-2 rounded-full w-full h-1.5">
                    <div
                      className="bg-primary rounded-full h-1.5"
                      style={{ width: `${Math.min(100, (shelter.current_occupancy / shelter.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link href="/user/shelters">Find Nearest Shelter</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="w-5 h-5 text-muted-foreground" />
                Emergency Hotline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center bg-destructive shadow-md p-4 rounded-lg text-destructive-foreground">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6" />
                  <div>
                    <p className="opacity-80 font-bold text-xs uppercase tracking-widest">National Emergency</p>
                    <p className="font-black text-2xl">999</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <a href="tel:999">Call Now</a>
                </Button>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Quick Contacts</p>
                <div className="gap-2 grid grid-cols-2">
                  <Button variant="outline" size="sm" className="justify-start gap-2" asChild>
                    <a href="tel:102"><Phone className="w-3 h-3" /> Fire: 102</a>
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start gap-2" asChild>
                    <a href="tel:100"><Phone className="w-3 h-3" /> Police: 100</a>
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
