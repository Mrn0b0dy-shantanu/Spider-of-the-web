import { getOrganizations } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Building, Plus } from "lucide-react";

export default async function OrganizationsPage() {
  const orgs = await getOrganizations();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Partner Organizations</h1>
        <div className="ml-auto flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-muted"></div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Agencies & NGOs</h2>
            <p className="text-muted-foreground">Manage participating organizations in the relief effort.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <div key={org.id} className="rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-lg font-semibold">{org.name}</h3>
                <Building className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="p-6 pt-0 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{org.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Personnel:</span>
                  <span className="font-medium">{org.personnelCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="font-medium text-primary">{org.contactEmail}</span>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="w-full">View Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
