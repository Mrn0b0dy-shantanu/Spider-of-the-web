import { getDashboardStats, getRecentRequests, getRequestsByCategory } from "@/app/actions/admin"
import { DashboardCharts } from "@/components/admin/DashboardCharts"
import { StatsCard } from "@/components/shared/StatsCard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle, Activity, Box, Users, Home, FileText,
  TrendingUp, Clock, ChevronRight
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
          description="Pending review in system"
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
          title="Processed Requests"
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
              <CardDescription>Latest submissions from civilians</CardDescription>
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
            <CardTitle className="text-lg">Operational Architecture</CardTitle>
            <CardDescription>Emergency coordination infrastructure status and response channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-lg border bg-muted/20">
                <p className="text-xs text-muted-foreground font-medium">Relief Shelters</p>
                <p className="text-xl font-bold mt-1 text-primary">{stats.activeShelters} Active</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Operational relief camps</p>
              </div>
              <div className="p-3.5 rounded-lg border bg-muted/20">
                <p className="text-xs text-muted-foreground font-medium">Field Personnel</p>
                <p className="text-xl font-bold mt-1 text-blue-500">{stats.deployedPersonnel} Deployed</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Response workforce</p>
              </div>
              <div className="p-3.5 rounded-lg border bg-muted/20">
                <p className="text-xs text-muted-foreground font-medium">Supply Monitor</p>
                <p className="text-xl font-bold mt-1 text-destructive">{stats.lowStockCount} Low Stock</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Inventory alerts</p>
              </div>
            </div>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
