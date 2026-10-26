"use client"

import { useState } from "react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"
import { RequestActionDialog } from "@/components/coordinator/RequestActionDialog"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import {
  Eye,
  Check,
  Clock,
  Search,
  MapPin,
  Users,
  Phone,
  Activity,
  CheckCircle2,
} from "lucide-react"

const urgencyColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-500 border-red-500/20",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/15 text-green-500 border-green-500/20",
}

export function ActiveRequestsClient({ requests }: { requests: any[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
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

    const matchesStatus = statusFilter === "all" || req.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleOpenDialog = (req: any) => {
    setSelectedRequest(req)
    setIsDialogOpen(true)
  }

  const approvedCount = requests.filter((r) => r.status === "approved").length
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length

  return (
    <div className="space-y-6">
      <RealtimeRefresh tables={["disaster_requests"]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Active Requests</h1>
            <Badge variant="secondary" className="font-mono">
              {requests.length} Active Missions
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor approved relief operations in the field, track dispatch progress, and fulfill missions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md font-medium">
            <Activity className="w-3.5 h-3.5" /> {inProgressCount} In Progress
          </span>
          <span className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2.5 py-1 rounded-md font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> {approvedCount} Approved & Queued
          </span>
        </div>
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

        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">
              All Active ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedCount})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress ({inProgressCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Active Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Title & Location</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>People</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto opacity-20 mb-2" />
                    <p className="font-medium text-sm">No active requests matching criteria.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-semibold text-sm">{req.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-destructive shrink-0" />
                        <span className="truncate max-w-[200px]">{req.location || "Location logged"}</span>
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

                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>

                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        <span>{req.people_affected || 1}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(req.updated_at || req.created_at)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(req)}
                          className="h-8 px-2.5 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                        {req.status === "approved" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleOpenDialog(req)}
                            className="h-8 px-3 text-xs"
                          >
                            <Clock className="h-3.5 w-3.5 mr-1" /> Advance
                          </Button>
                        )}
                        {req.status === "in_progress" && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenDialog(req)}
                            className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Fulfill
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <RequestActionDialog
        request={selectedRequest}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  )
}
