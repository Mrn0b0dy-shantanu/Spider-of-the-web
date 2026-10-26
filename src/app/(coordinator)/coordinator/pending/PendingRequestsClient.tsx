"use client"

import { useState } from "react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"
import { RequestActionDialog } from "@/components/coordinator/RequestActionDialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import {
  Eye,
  Check,
  X,
  Search,
  MapPin,
  Clock,
  Users,
  Phone,
  AlertTriangle,
  ClockAlert,
} from "lucide-react"

const urgencyColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-500 border-red-500/20",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/15 text-green-500 border-green-500/20",
}

export function PendingRequestsClient({ requests }: { requests: any[] }) {
  const [search, setSearch] = useState("")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title?.toLowerCase().includes(search.toLowerCase()) ||
      req.location?.toLowerCase().includes(search.toLowerCase()) ||
      req.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      req.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
      req.contact_phone?.includes(search) ||
      req.description?.toLowerCase().includes(search.toLowerCase())

    const matchesUrgency = urgencyFilter === "all" || req.urgency === urgencyFilter

    return matchesSearch && matchesUrgency
  })

  const handleOpenDialog = (req: any) => {
    setSelectedRequest(req)
    setIsDialogOpen(true)
  }

  const criticalCount = requests.filter((r) => r.urgency === "critical").length
  const highCount = requests.filter((r) => r.urgency === "high").length

  return (
    <div className="space-y-6">
      <RealtimeRefresh tables={["disaster_requests"]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Pending Requests</h1>
            <Badge variant="secondary" className="font-mono">
              {requests.length} Awaiting
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Review incoming civilian relief requests, verify urgency, and approve or reject submissions.
          </p>
        </div>

        {criticalCount > 0 && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-lg text-destructive text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>{criticalCount} Critical Urgency Request(s) Require Immediate Action</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, location, name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={urgencyFilter} onValueChange={setUrgencyFilter} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">
              All ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="critical" className="text-red-500 font-medium">
              Critical ({criticalCount})
            </TabsTrigger>
            <TabsTrigger value="high" className="text-orange-500 font-medium">
              High ({highCount})
            </TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="low">Low</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Title & Location</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>People</TableHead>
                <TableHead>Submission Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <ClockAlert className="h-8 w-8 mx-auto opacity-20 mb-2" />
                    <p className="font-medium text-sm">No pending requests matching the criteria.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-semibold text-sm">{req.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-destructive shrink-0" />
                        <span className="truncate max-w-[220px]">{req.location || "Location not set"}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-medium">
                        {req.profiles?.full_name || req.contact_name || "Unknown"}
                      </div>
                      {req.contact_phone && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{req.contact_phone}</span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-sm">
                      <span className="bg-muted px-2 py-0.5 rounded text-xs">
                        {req.categories?.name || "General"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize text-xs font-semibold ${urgencyColors[req.urgency] || ""}`}
                      >
                        {req.urgency}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        <span>{req.people_affected || 1}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(req.created_at)}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(req)}
                          className="h-8 px-2.5 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenDialog(req)}
                          className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOpenDialog(req)}
                          className="h-8 px-2.5 text-xs font-semibold"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <RequestActionDialog
        request={selectedRequest}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  )
}
