import { getIncidents } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Activity, Plus } from "lucide-react";

export default async function IncidentsPage() {
  const incidents = await getIncidents();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Incident Management</h1>
        <div className="ml-auto flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-muted"></div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Active Events</h2>
            <p className="text-muted-foreground">Manage ongoing disaster situations and alerts.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Incident
          </Button>
        </div>

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date Reported</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{incident.name}</td>
                  <td className="p-4 align-middle">{incident.type}</td>
                  <td className="p-4 align-middle">{incident.location}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                        ${incident.status === 'Critical' ? 'bg-destructive/10 text-destructive' : 
                          incident.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}
                      `}>
                        {incident.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{new Date(incident.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 align-middle">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {incidents.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">No incidents found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
