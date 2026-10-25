"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDate } from "@/lib/utils"
import { Eye } from "lucide-react"

const urgencyColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-500 border-red-500/20",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/15 text-green-500 border-green-500/20",
}

export default function AdminRequestsClient({ requests }: { requests: any[] }) {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("admin-requests-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "disaster_requests" }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  const filtered = activeTab === "all" ? requests : requests.filter((r) => r.status === activeTab)
  const tabs = ["all", "pending", "approved", "in_progress", "rejected", "fulfilled"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Disaster Requests</h1>
        <p className="mt-1 text-muted-foreground">Monitor and inspect civilian emergency requests.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab.replace("_", " ")}
              <Badge variant="secondary" className="ml-1.5 text-xs">
                {tab === "all" ? requests.length : requests.filter((r) => r.status === tab).length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
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
                      <TableHead className="text-right">Action</TableHead>
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
                          <TableCell>
                            <StatusBadge status={req.status} />
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">{formatDate(req.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(req)}>
                                  <Eye className="mr-1 w-4 h-4" /> View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{req.title}</DialogTitle>
                                  <DialogDescription>
                                    Submitted by {req.profiles?.full_name || "Unknown"} · {formatDate(req.created_at)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="gap-4 grid grid-cols-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Category:</span> {req.categories?.name || "General"}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Urgency:</span>
                                      <Badge variant="outline" className={`ml-1 capitalize text-xs ${urgencyColors[req.urgency]}`}>
                                        {req.urgency}
                                      </Badge>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Status:</span>
                                      <span className="ml-1.5 inline-block align-middle">
                                        <StatusBadge status={req.status} />
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">People Affected:</span> {req.people_affected || "N/A"}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Location:</span> {req.location || "N/A"}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Contact:</span> {req.contact_name || "N/A"}{" "}
                                      {req.contact_phone && `(${req.contact_phone})`}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="mb-1 font-medium text-sm">Description</p>
                                    <p className="bg-muted/50 p-3 rounded-md text-muted-foreground text-sm">
                                      {req.description || "No description provided."}
                                    </p>
                                  </div>
                                  {req.admin_notes && (
                                    <div>
                                      <p className="mb-1 font-medium text-sm">Notes / Response</p>
                                      <p className="bg-muted/50 p-3 rounded-md text-muted-foreground text-sm">
                                        {req.admin_notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                  </DialogClose>
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
