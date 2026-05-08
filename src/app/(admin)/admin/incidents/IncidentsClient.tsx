"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Activity, AlertCircle, ExternalLink, Map as MapIcon, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { upsertIncident } from "@/app/actions/admin"
import { useState, useTransition, useEffect } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const severityColors: Record<string, string> = {
  minor: "bg-blue-500/15 text-blue-500",
  moderate: "bg-yellow-500/15 text-yellow-500",
  severe: "bg-orange-500/15 text-orange-500",
  catastrophic: "bg-red-500/15 text-red-500",
}

export default function AdminIncidentsClient({ incidents: initialIncidents }: { incidents: any[] }) {
  const [incidents, setIncidents] = useState(initialIncidents)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()


  useEffect(() => {
    const channel = supabase
      .channel('admin-incidents-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])


  useEffect(() => {
    setIncidents(initialIncidents)
  }, [initialIncidents])

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Active Incidents</h1>
          <p className="mt-1 text-muted-foreground">Real-time monitoring of disaster events from USGS.</p>
        </div>
        <Badge variant="outline" className="gap-2 bg-primary/5 px-3 py-1 border-primary/20">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="font-semibold">USGS Live Feed</span>
            </div>
            <span className="opacity-70 text-[8px] uppercase tracking-tighter">Source: USGS FDSN API</span>
          </div>
        </Badge>
      </div>

      <Card className="shadow-sm border-primary/10 overflow-hidden">
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
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <span className="max-w-[200px] truncate" title={incident.name}>{incident.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{incident.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{incident.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize border-none ${severityColors[incident.severity]}`}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/earthquakes?id=${incident.id}`}
                      className="inline-flex items-center gap-1.5 font-medium text-primary text-sm hover:underline"
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      View on Map
                      <ExternalLink className="opacity-0 group-hover:opacity-100 w-3 h-3 transition-opacity" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={incident.status}
                      onValueChange={(val) => handleStatusChange(incident, val)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-full h-8">
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
                  <TableCell colSpan={6} className="h-32 text-muted-foreground text-center">
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
