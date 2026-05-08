"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Activity, AlertCircle, ExternalLink, Map as MapIcon, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { upsertIncident } from "@/app/actions/admin"
import { useState, useTransition } from "react"
import { toast } from "sonner"

const severityColors: Record<string, string> = {
  minor: "bg-blue-500/15 text-blue-500",
  moderate: "bg-yellow-500/15 text-yellow-500",
  severe: "bg-orange-500/15 text-orange-500",
  catastrophic: "bg-red-500/15 text-red-500",
}

export default function AdminIncidentsClient({ incidents: initialIncidents }: { incidents: any[] }) {
  const [incidents, setIncidents] = useState(initialIncidents)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = async (incident: any, newStatus: string) => {
    const updatedIncident = { ...incident, status: newStatus }
    
    startTransition(async () => {
      const res = await upsertIncident(updatedIncident)
      if (res.success) {
        setIncidents(prev => prev.map(inc => inc.id === incident.id ? { ...inc, status: newStatus } : inc))
        toast.success(`Status updated for ${incident.name}`)
      } else {
        toast.error("Failed to update status")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Incidents</h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring of disaster events from USGS.</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 gap-2 bg-primary/5 border-primary/20">
          <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
          USGS Live Feed
        </Badge>
      </div>

      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px]">Incident Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Action</TableHead>
                <TableHead className="w-[180px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <span className="truncate max-w-[200px]" title={incident.name}>{incident.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{incident.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{incident.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize border-none ${severityColors[incident.severity]}`}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/admin/earthquakes?id=${incident.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <MapIcon className="h-3.5 w-3.5" />
                      View on Map
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={incident.status} 
                      onValueChange={(val) => handleStatusChange(incident, val)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue placeholder="Set Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="active">Active Response</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="contained">Contained</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {incidents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No active incidents detected.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
