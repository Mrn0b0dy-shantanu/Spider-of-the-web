"use client"

import { useState } from "react"
import Link from "next/link"
import { StatsCard } from "@/components/shared/StatsCard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"
import { RequestActionDialog } from "@/components/coordinator/RequestActionDialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import {
  Clock,
  AlertTriangle,
  Activity,
  CheckCircle2,
  ChevronRight,
  Eye,
  MapPin,
  Users,
  Radio,
  FileText,
  ClockAlert,
} from "lucide-react"

const urgencyColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-500 border-red-500/20",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/15 text-green-500 border-green-500/20",
}

interface CoordinatorDashboardClientProps {
  stats: {
    pending: number
    criticalPending: number
    highPending: number
    active: number
    total: number
    processed: number
  }
  pendingRequests: any[]
  activeRequests: any[]
}

export function CoordinatorDashboardClient({
  stats,
  pendingRequests,
  activeRequests,
}: CoordinatorDashboardClientProps) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenRequest = (req: any) => {
    setSelectedRequest(req)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <RealtimeRefresh tables={["disaster_requests"]} />

      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Request Coordination Center</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Emergency triage, request approval, and active dispatch monitoring.
        </p>
      </div>

      {/* Key Metric Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Approval"
          value={stats.pending}
          description="Requests awaiting coordinator decision"
          icon={Clock}
          iconClassName={stats.pending > 0 ? "text-amber-500" : "text-muted-foreground"}
        />
        <StatsCard
          title="Critical Urgency"
          value={stats.criticalPending}
          description="Immediate life-safety priority"
          icon={AlertTriangle}
          iconClassName={stats.criticalPending > 0 ? "text-destructive animate-pulse" : "text-muted-foreground"}
        />
        <StatsCard
          title="Active Requests"
          value={stats.active}
          description="Relief missions currently underway"
          icon={Activity}
          iconClassName="text-blue-500"
        />
        <StatsCard
          title="Total Processed"
          value={stats.processed}
          description="Approved, in-progress, or resolved"
          icon={CheckCircle2}
          iconClassName="text-green-500"
        />
      </div>

      {/* Grid: Pending Review Queue and Active Requests Overview */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Left: Pending Requests Awaiting Approval (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClockAlert className="w-5 h-5 text-amber-500" />
                  Priority Approval Queue
                </CardTitle>
                <CardDescription>
                  Emergency requests requiring immediate triage & approval
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/coordinator/pending">
                  View All ({stats.pending}) <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {pendingRequests.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-green-500/40 mb-2" />
                  <p className="font-medium text-sm">All pending requests are reviewed!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    New incoming emergency submissions will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {pendingRequests.slice(0, 5).map((req) => (
                    <div
                      key={req.id}
                      className="p-4 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-[10px] capitalize font-bold ${urgencyColors[req.urgency] || ""}`}
                          >
                            {req.urgency}
                          </Badge>
                          <span className="font-semibold text-sm truncate">{req.title}</span>
                          <span className="text-xs text-muted-foreground">
                            · {req.categories?.name || "General"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-destructive" />
                            {req.location || "No location provided"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-primary" />
                            {req.people_affected || 1} affected
                          </span>
                          <span>{formatDate(req.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenRequest(req)}
                          className="h-8 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Active Relief Operations Overview (3 cols) */}
        <div className="space-y-6 lg:col-span-3">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Active Operations
                </CardTitle>
                <CardDescription>
                  Approved and deployed relief missions
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/coordinator/active">
                  View All ({stats.active}) <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {activeRequests.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto opacity-20 mb-2" />
                  <p className="font-medium text-sm">No active operations right now.</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Approved requests in progress will be tracked here.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {activeRequests.slice(0, 5).map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-medium text-sm truncate">{req.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="truncate">{req.location || "Location logged"}</span>
                          <span>·</span>
                          <span className="capitalize">{req.urgency}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={req.status} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenRequest(req)}
                          className="h-7 w-7"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global Action & Details Modal */}
      <RequestActionDialog
        request={selectedRequest}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  )
}
