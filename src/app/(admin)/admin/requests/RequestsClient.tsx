"use client"

import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { updateRequestStatus } from "@/app/actions/requests"
import { formatDate } from "@/lib/utils"
import { Check, X, Eye, Clock, AlertTriangle, Loader2, MessageSquare } from "lucide-react"
import type { DisasterRequest, RequestStatus } from "@/lib/types"

const urgencyColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-500 border-red-500/20",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/15 text-green-500 border-green-500/20",
}

export default function AdminRequestsClient({ requests }: { requests: any[] }) {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isPending, startTransition] = useTransition()

  const filtered = activeTab === "all" ? requests : requests.filter(r => r.status === activeTab)

  const handleStatusUpdate = (id: string, status: RequestStatus) => {
    startTransition(async () => {
      await updateRequestStatus(id, status, adminNotes)
      setSelectedRequest(null)
      setAdminNotes("")
    })
  }

  const tabs = ["all", "pending", "approved", "in_progress", "rejected", "fulfilled"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Disaster Requests</h1>
        <p className="text-muted-foreground mt-1">Review and manage civilian emergency requests.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          {tabs.map(tab => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab.replace("_", " ")}
              <Badge variant="secondary" className="ml-1.5 text-xs">
                {tab === "all" ? requests.length : requests.filter(r => r.status === tab).length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          No requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((req: any) => (
                        <TableRow key={req.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{req.title}</p>
                              <p className="text-xs text-muted-foreground">{req.location || "No location"}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{req.profiles?.full_name || "Unknown"}</TableCell>
                          <TableCell className="text-sm">{req.categories?.name || "General"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`capitalize text-xs ${urgencyColors[req.urgency] || ""}`}>
                              {req.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell><StatusBadge status={req.status} /></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{formatDate(req.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(req)}>
                                  <Eye className="h-4 w-4 mr-1" /> Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{req.title}</DialogTitle>
                                  <DialogDescription>
                                    Submitted by {req.profiles?.full_name} · {formatDate(req.created_at)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-muted-foreground">Category:</span> {req.categories?.name}</div>
                                    <div><span className="text-muted-foreground">Urgency:</span>
                                      <Badge variant="outline" className={`ml-1 capitalize text-xs ${urgencyColors[req.urgency]}`}>{req.urgency}</Badge>
                                    </div>
                                    <div><span className="text-muted-foreground">Location:</span> {req.location || "N/A"}</div>
                                    <div><span className="text-muted-foreground">People Affected:</span> {req.people_affected}</div>
                                    <div><span className="text-muted-foreground">Contact:</span> {req.contact_name || "N/A"}</div>
                                    <div><span className="text-muted-foreground">Phone:</span> {req.contact_phone || "N/A"}</div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">Description</p>
                                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">{req.description || "No description provided."}</p>
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">Admin Notes / Response Message</Label>
                                    <Textarea
                                      id="notes"
                                      placeholder="Add a note for the applicant..."
                                      value={adminNotes}
                                      onChange={e => setAdminNotes(e.target.value)}
                                      className="mt-1.5"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="flex gap-2 sm:justify-start">
                                  {req.status === "pending" && (
                                    <>
                                      <Button
                                        onClick={() => handleStatusUpdate(req.id, "approved")}
                                        disabled={isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                        Approve
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleStatusUpdate(req.id, "rejected")}
                                        disabled={isPending}
                                      >
                                        <X className="h-4 w-4 mr-2" /> Reject
                                      </Button>
                                    </>
                                  )}
                                  {req.status === "approved" && (
                                    <Button
                                      onClick={() => handleStatusUpdate(req.id, "in_progress")}
                                      disabled={isPending}
                                    >
                                      <Clock className="h-4 w-4 mr-2" /> Mark In Progress
                                    </Button>
                                  )}
                                  {req.status === "in_progress" && (
                                    <Button
                                      onClick={() => handleStatusUpdate(req.id, "fulfilled")}
                                      disabled={isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4 mr-2" /> Mark Fulfilled
                                    </Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
