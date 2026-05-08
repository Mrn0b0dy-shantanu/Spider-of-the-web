import { getDashboardStats, getRecentRequests } from "@/app/actions/admin"
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

export const metadata = { title: "Command Center | NDC ReliefOps Admin" }

const urgencyColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-500 border-red-500/20",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/15 text-green-500 border-green-500/20",
}

export default async function AdminDashboard() {
  const [stats, recentRequests] = await Promise.all([
    getDashboardStats(),
    getRecentRequests(8),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground mt-1">Real-time disaster management operations overview.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Disaster Requests</CardTitle>
            <CardDescription>Latest submissions from civilians requiring review</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/requests">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No requests yet. They will appear here when submitted.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req: any) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{req.title}</p>
                      <p className="text-xs text-muted-foreground">
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
  )
}
