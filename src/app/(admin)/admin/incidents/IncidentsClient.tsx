"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Activity, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const severityColors: Record<string, string> = {
  minor: "bg-blue-500/15 text-blue-500",
  moderate: "bg-yellow-500/15 text-yellow-500",
  severe: "bg-orange-500/15 text-orange-500",
  catastrophic: "bg-red-500/15 text-red-500",
}

export default function AdminIncidentsClient({ incidents }: { incidents: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Incidents</h1>
        <p className="text-muted-foreground mt-1">Real-time monitoring of disaster events.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Affected Population</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      {incident.name}
                    </div>
                  </TableCell>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell className="text-sm">{incident.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${severityColors[incident.severity]}`}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-semibold">
                    {incident.affected_population.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={incident.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
