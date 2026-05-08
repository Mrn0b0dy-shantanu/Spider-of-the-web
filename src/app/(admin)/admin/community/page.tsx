
import { getCommunityRequests, getCommunityOffers } from "@/app/actions/community"
import { getDashboardStats, getCommunityStats } from "@/app/actions/admin"
import { CommunityFeed } from "@/components/community/CommunityFeed"
import { Users, ShieldAlert, BarChart3, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = { title: "Community Monitoring | AntiQuake Admin" }

export default async function AdminCommunityPage() {
  const [initialRequests, initialOffers, commStats, dashboardStats] = await Promise.all([
    getCommunityRequests(),
    getCommunityOffers(),
    getCommunityStats(),
    getDashboardStats()
  ])

  const urgentCount = initialRequests.filter(r => r.urgency === 'critical' || r.urgency === 'high').length
  const fulfillmentRate = Math.round((initialRequests.filter(r => r.status === 'fulfilled').length / (initialRequests.length || 1)) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Monitor</h1>
          <p className="text-muted-foreground mt-1">
            Oversee decentralized relief activity and intervene in critical shortages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 gap-1.5 bg-destructive/10 text-destructive border-destructive/20 animate-pulse">
            <AlertCircle className="h-3.5 w-3.5" />
            {urgentCount} Urgent Needs
          </Badge>
          <Badge variant="outline" className="px-3 py-1 gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            {fulfillmentRate}% Fulfilled
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commStats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">Requests posted by civilians</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Community Responders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commStats.activeResponders}</div>
            <p className="text-xs text-green-600 font-medium">Volunteers providing aid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Resource Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 truncate">{commStats.topGaps}</div>
            <p className="text-xs text-muted-foreground">Highest demand unfulfilled needs</p>
          </CardContent>
        </Card>
      </div>

      <CommunityFeed initialRequests={initialRequests} initialOffers={initialOffers} />
    </div>
  )
}
