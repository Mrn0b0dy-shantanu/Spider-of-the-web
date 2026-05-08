import { Activity, Box, Users, Building, ShieldAlert, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDashboardStats, getIncidents, getRequests } from "@/lib/services/api";

export default async function Home() {
  const stats: any = await getDashboardStats();
  const incidents = await getIncidents();
  const requests = await getRequests();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex items-center gap-2 font-semibold md:hidden">
          <ShieldAlert className="h-6 w-6 text-destructive" />
          <span className="text-xl tracking-tight">NDC ReliefOps</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {/* User profile dropdown placeholder */}
          <div className="h-8 w-8 rounded-full bg-muted"></div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
            <p className="text-muted-foreground">Monitor and manage disaster response operations.</p>
          </div>
          <Button asChild>
            <Link href="/earthquakes" className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              Live Earthquake Radar
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Active Incidents</h3>
              <Activity className="h-4 w-4 text-destructive" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{stats.activeIncidents}</div>
              <p className="text-xs text-muted-foreground">High priority alerts</p>
            </div>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Deployed Personnel</h3>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{stats.deployedPersonnel}</div>
              <p className="text-xs text-muted-foreground">Currently in the field</p>
            </div>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Critical Supplies</h3>
              <Box className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{stats.criticalSupplies.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total units in inventory</p>
            </div>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Partner Orgs</h3>
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{stats.partnerOrgs}</div>
              <p className="text-xs text-muted-foreground">Coordinating agencies</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Recent Incident Reports</h3>
              <p className="text-sm text-muted-foreground">Latest situational updates from the field.</p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-8">
                {incidents.map((incident) => (
                  <div key={incident.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{incident.name}</p>
                      <p className="text-sm text-muted-foreground">{incident.type} - {incident.location}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors
                        ${incident.status === 'Critical' ? 'bg-destructive/10 text-destructive' : 
                          incident.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}
                      `}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Resource Requests</h3>
              <p className="text-sm text-muted-foreground">Pending supply and personnel needs.</p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{req.item}</p>
                      <p className="text-xs text-muted-foreground">Req for: {req.destination}</p>
                    </div>
                    <div className="text-sm font-bold">{req.quantity} {req.unit}</div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">View All Requests</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
