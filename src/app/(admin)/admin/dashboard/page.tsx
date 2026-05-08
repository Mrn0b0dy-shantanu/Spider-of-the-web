import { getDashboardStats, getRecentRequests, getRequestsByCategory } from "@/app/actions/admin"
import { DashboardCharts } from "@/components/admin/DashboardCharts"
import { StatsCard } from "@/components/shared/StatsCard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle, Activity, Box, Users, Home, FileText,
  TrendingUp, Clock, ChevronRight, Bell
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"

export const metadata = { title: "Command Center | AntiQuake Admin" }

const urgencyColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-500 border-red-500/20",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/15 text-green-500 border-green-500/20",
}

export default async function AdminDashboard() {
  const [stats, recentRequests, categoryData] = await Promise.all([
    getDashboardStats(),
    getRecentRequests(8),
    getRequestsByCategory(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <RealtimeRefresh tables={["disaster_requests", "incidents", "supplies", "personnel", "shelters"]} />
        <h1 className="font-bold text-3xl tracking-tight">Command Center</h1>
        <p className="mt-1 text-muted-foreground">Real-time disaster management operations overview.</p>
      </div>


      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Requests"
          value={stats.pendingRequests}
          description="Awaiting admin action"
          icon={Clock}
          iconClassName="text-yellow-500"
        />
        <StatsCard
          title="Critical Urgency"
          value={stats.criticalRequests}
          description="Immediate response needed"
          icon={AlertTriangle}
          iconClassName="text-destructive"
        />
        <StatsCard
          title="Active Incidents"
          value={stats.activeIncidents}
          description="Ongoing emergencies"
          icon={Activity}
          iconClassName="text-orange-500"
        />
        <StatsCard
          title="Deployed Personnel"
          value={stats.deployedPersonnel}
          description="Currently in the field"
          icon={Users}
          iconClassName="text-blue-500"
        />
        <StatsCard
          title="Active Shelters"
          value={stats.activeShelters}
          description="Operational relief camps"
          icon={Home}
          iconClassName="text-green-500"
        />
        <StatsCard
          title="Supply Alerts"
          value={stats.lowStockCount}
          description="Items low or out of stock"
          icon={Box}
          iconClassName="text-destructive"
        />
        <StatsCard
          title="Total Requests"
          value={stats.totalRequests}
          description="All time requests received"
          icon={FileText}
        />
        <StatsCard
          title="Approval Rate"
          value={`${stats.totalRequests > 0 ? Math.round((stats.totalRequests - stats.pendingRequests) / stats.totalRequests * 100) : 0}%`}
          description="Requests processed"
          icon={TrendingUp}
          iconClassName="text-green-500"
        />
      </div>


      <div className="gap-6 grid lg:grid-cols-7">

        <DashboardCharts categoryData={categoryData} />


        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Recent Disaster Requests</CardTitle>
              <CardDescription>Latest submissions from civilians requiring review</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/requests">
                View All <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <div className="py-8 text-muted-foreground text-center">
                <FileText className="opacity-40 mx-auto mb-3 w-10 h-10" />
                <p>No requests yet. They will appear here when submitted.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((req: any) => (
                  <div key={req.id} className="flex justify-between items-center bg-muted/30 hover:bg-muted/50 p-3 border rounded-lg transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{req.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {req.profiles?.full_name || "Unknown"} · {req.categories?.name || "General"} · {formatDate(req.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <Badge variant="outline" className={`text-xs capitalize ${urgencyColors[req.urgency] || ""}`}>
                        {req.urgency}
                      </Badge>
                      <StatusBadge status={req.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-destructive" />
              Quick Emergency Broadcast
            </CardTitle>
            <CardDescription>Send an urgent alert to all registered citizens.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (formData) => {
              "use server"
              const { createAnnouncement } = await import("@/app/actions/notifications")
              await createAnnouncement(formData)
            }} className="space-y-4">
              <div className="gap-2 grid">
                <input
                  name="title"
                  placeholder="Alert Title (e.g. Flood Warning)"
                  className="flex bg-background file:bg-transparent disabled:opacity-50 px-3 py-2 border border-input file:border-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-full h-10 file:font-medium placeholder:text-muted-foreground text-sm file:text-sm disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div className="gap-2 grid">
                <textarea
                  name="message"
                  placeholder="Detailed emergency instructions..."
                  className="flex bg-background disabled:opacity-50 px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-full min-h-[80px] placeholder:text-muted-foreground text-sm disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <select name="priority" className="flex bg-background px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10 text-sm">
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">CRITICAL ALERT</option>
                </select>
                <Button type="submit" variant="destructive">
                  <Bell className="mr-2 w-4 h-4" /> Send Broadcast
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Database Status</span>
              <Badge className="bg-green-500">Operational</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">USGS Feed</span>
              <Badge className="bg-green-500">Connected</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Real-time Sync</span>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t">
              <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-tight">External Data Partners</p>
              <div className="flex flex-col gap-1">
                <span className="flex justify-between text-[10px]">Seismic Data: <span className="font-semibold text-foreground">USGS FDSN API</span></span>
                <span className="flex justify-between text-[10px]">News Verification: <span className="font-semibold text-foreground">Drishtikon.life</span></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
