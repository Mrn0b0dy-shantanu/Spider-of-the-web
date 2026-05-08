"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Mail, Phone, Users, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const typeColors: Record<string, string> = {
  government: "bg-blue-500/15 text-blue-500",
  ngo: "bg-green-500/15 text-green-500",
  private: "bg-purple-500/15 text-purple-500",
  international: "bg-orange-500/15 text-orange-500",
}

export default function AdminOrganizationsClient({ organizations }: { organizations: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Partner Organizations</h1>
        <p className="text-muted-foreground mt-1">Coordinating with government and relief agencies.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {organizations.map((org) => (
          <Card key={org.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{org.name}</CardTitle>
                  <Badge variant="outline" className={`mt-2 capitalize ${typeColors[org.type]}`}>
                    {org.type}
                  </Badge>
                </div>
                <Building className="h-8 w-8 text-muted-foreground opacity-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{org.description}</p>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{org.personnel_count.toLocaleString()} personnel</span>
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
                    <span className="truncate text-primary hover:underline cursor-pointer">{org.website}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
