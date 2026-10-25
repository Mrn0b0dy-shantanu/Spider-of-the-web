"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Search,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Activity
} from "lucide-react"

interface PersonnelAndPartnersProps {
  personnel: any[]
  organizations: any[]
}

const orgTypeColors: Record<string, string> = {
  government: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  ngo: "bg-green-500/15 text-green-500 border-green-500/20",
  private: "bg-purple-500/15 text-purple-500 border-purple-500/20",
  international: "bg-orange-500/15 text-orange-500 border-orange-500/20",
}

export default function AdminPersonnelAndPartnersClient({
  personnel,
  organizations,
}: PersonnelAndPartnersProps) {
  const [activeTab, setActiveTab] = useState("personnel")
  const [personnelSearch, setPersonnelSearch] = useState("")
  const [personnelStatusFilter, setPersonnelStatusFilter] = useState("all")
  const [orgSearch, setOrgSearch] = useState("")
  const [orgTypeFilter, setOrgTypeFilter] = useState("all")

  const deployedCount = personnel.filter(
    (p) => p.status === "active" || p.status === "deployed"
  ).length

  const totalOrgWorkers = organizations.reduce(
    (acc, org) => acc + (org.personnel_count || 0),
    0
  )

  const filteredPersonnel = personnel.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.role?.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.specialization?.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.organization?.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.location?.toLowerCase().includes(personnelSearch.toLowerCase())

    const matchesStatus =
      personnelStatusFilter === "all" || p.status === personnelStatusFilter

    return matchesSearch && matchesStatus
  })

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase().includes(orgSearch.toLowerCase()) ||
      org.description?.toLowerCase().includes(orgSearch.toLowerCase())

    const matchesType =
      orgTypeFilter === "all" || org.type === orgTypeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personnel & Partner Organizations</h1>
          <p className="text-muted-foreground mt-1">
            Consolidated management for field personnel deployments and partner agency coordination.
          </p>
        </div>
      </div>

      {/* Top metrics summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 bg-card shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Field Personnel</p>
              <p className="text-2xl font-bold">{personnel.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-500/10 text-green-500">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Currently Deployed</p>
              <p className="text-2xl font-bold">{deployedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Partner Agencies</p>
              <p className="text-2xl font-bold">{organizations.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Agency Workforce</p>
              <p className="text-2xl font-bold">{totalOrgWorkers.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/60 p-1 flex-wrap h-auto gap-1">
          <TabsTrigger value="personnel" className="gap-2">
            <Users className="h-4 w-4" />
            Field Personnel
            <Badge variant="secondary" className="ml-1 text-xs">
              {personnel.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="organizations" className="gap-2">
            <Building className="h-4 w-4" />
            Partnered Organizations
            <Badge variant="secondary" className="ml-1 text-xs">
              {organizations.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="overview" className="gap-2">
            Combined View
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Field Personnel */}
        <TabsContent value="personnel" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search personnel by name, role, agency, location..."
                value={personnelSearch}
                onChange={(e) => setPersonnelSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={personnelStatusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setPersonnelStatusFilter("all")}
              >
                All Status
              </Button>
              <Button
                variant={personnelStatusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setPersonnelStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={personnelStatusFilter === "deployed" ? "default" : "outline"}
                size="sm"
                onClick={() => setPersonnelStatusFilter("deployed")}
              >
                Deployed
              </Button>
              <Button
                variant={personnelStatusFilter === "standby" ? "default" : "outline"}
                size="sm"
                onClick={() => setPersonnelStatusFilter("standby")}
              >
                Standby
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Personnel Name</TableHead>
                    <TableHead>Role / Specialization</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Current Location</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersonnel.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        No personnel matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPersonnel.map((p) => (
                      <TableRow key={p.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-xs">
                              {p.name?.charAt(0) || "P"}
                            </div>
                            <span>{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{p.role}</div>
                          <div className="text-xs text-muted-foreground">{p.specialization}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <Badge variant="outline" className="font-normal text-xs">
                            {p.organization}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span>{p.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={p.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Partner Organizations */}
        <TabsContent value="organizations" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partner organizations..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={orgTypeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrgTypeFilter("all")}
              >
                All Types
              </Button>
              <Button
                variant={orgTypeFilter === "government" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrgTypeFilter("government")}
              >
                Government
              </Button>
              <Button
                variant={orgTypeFilter === "ngo" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrgTypeFilter("ngo")}
              >
                NGO
              </Button>
              <Button
                variant={orgTypeFilter === "international" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrgTypeFilter("international")}
              >
                International
              </Button>
              <Button
                variant={orgTypeFilter === "private" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrgTypeFilter("private")}
              >
                Private
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredOrgs.length === 0 ? (
              <Card className="col-span-2 py-10 text-center text-muted-foreground">
                <Building className="mx-auto mb-2 h-10 w-10 opacity-30" />
                <p>No partner organizations matching your criteria.</p>
              </Card>
            ) : (
              filteredOrgs.map((org) => (
                <Card key={org.id} className="shadow-xs hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{org.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`mt-2 capitalize ${orgTypeColors[org.type] || ""}`}
                        >
                          {org.type}
                        </Badge>
                      </div>
                      <Building className="h-8 w-8 text-muted-foreground opacity-20" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {org.description || "Partner relief agency participating in emergency operations."}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{(org.personnel_count || 0).toLocaleString()} personnel</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{org.contact_email}</span>
                      </div>
                      {org.contact_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{org.contact_phone}</span>
                        </div>
                      )}
                      {org.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={org.website.startsWith("http") ? org.website : `https://${org.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate text-primary hover:underline"
                          >
                            {org.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Combined View */}
        <TabsContent value="overview" className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Deployed Field Personnel ({deployedCount})
              </h2>
              <Button variant="link" size="sm" onClick={() => setActiveTab("personnel")}>
                View All Personnel
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {personnel.slice(0, 5).map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-sm">{p.role}</TableCell>
                        <TableCell className="text-sm">{p.organization}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {p.location}
                          </span>
                        </TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Partner Organizations ({organizations.length})
              </h2>
              <Button variant="link" size="sm" onClick={() => setActiveTab("organizations")}>
                View All Organizations
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {organizations.slice(0, 6).map((org) => (
                <Card key={org.id} className="p-4 shadow-xs">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm">{org.name}</h4>
                    <Badge variant="outline" className={`capitalize text-[10px] ${orgTypeColors[org.type] || ""}`}>
                      {org.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{org.description}</p>
                  <div className="text-xs text-muted-foreground flex justify-between items-center pt-2 border-t">
                    <span>{org.personnel_count} staff</span>
                    <span>{org.contact_phone || org.contact_email}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
