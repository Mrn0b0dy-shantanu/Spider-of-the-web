"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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
  const router = useRouter()
  const supabase = createClient()


  useEffect(() => {
    const channel = supabase
      .channel('admin-requests-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disaster_requests' }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

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
        <h1 className="font-bold text-3xl tracking-tight">Disaster Requests</h1>
        <p className="mt-1 text-muted-foreground">Review and manage civilian emergency requests.</p>
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
                        <TableCell colSpan={7} className="py-10 text-muted-foreground text-center">
                          No requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((req: any) => (
                        <TableRow key={req.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{req.title}</p>
                              <p className="text-muted-foreground text-xs">{req.location || "No location"}</p>
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
                          <TableCell className="text-muted-foreground text-xs">{formatDate(req.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(req)}>
                                  <Eye className="mr-1 w-4 h-4" /> Review
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
                                  <div className="gap-4 grid grid-cols-2 text-sm">
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
                                    <p className="mb-1 font-medium text-sm">Description</p>
                                    <p className="bg-muted/50 p-3 rounded-md text-muted-foreground text-sm">{req.description || "No description provided."}</p>
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
                                <DialogFooter className="flex sm:justify-start gap-2">
                                  {req.status === "pending" && (
                                    <>
                                      <Button
                                        onClick={() => handleStatusUpdate(req.id, "approved")}
                                        disabled={isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        {isPending ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Check className="mr-2 w-4 h-4" />}
                                        Approve
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleStatusUpdate(req.id, "rejected")}
                                        disabled={isPending}
                                      >
                                        <X className="mr-2 w-4 h-4" /> Reject
                                      </Button>
                                    </>
                                  )}
                                  {req.status === "approved" && (
                                    <Button
                                      onClick={() => handleStatusUpdate(req.id, "in_progress")}
                                      disabled={isPending}
                                    >
                                      <Clock className="mr-2 w-4 h-4" /> Mark In Progress
                                    </Button>
                                  )}
                                  {req.status === "in_progress" && (
                                    <Button
                                      onClick={() => handleStatusUpdate(req.id, "fulfilled")}
                                      disabled={isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="mr-2 w-4 h-4" /> Mark Fulfilled
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
