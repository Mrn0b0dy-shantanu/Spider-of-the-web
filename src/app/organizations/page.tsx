import { getOrganizations } from "@/lib/services/api";
import { CreateOrganizationButton } from "./OrganizationsClient";

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Organizations</h1>
        <div className="ml-auto flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-muted"></div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Partner Directory</h2>
            <p className="text-muted-foreground">Manage NGOs, Government agencies, and private partners.</p>
          </div>
          <CreateOrganizationButton />
        </div>

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Organization Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Personnel Count</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{org.name}</td>
                  <td className="p-4 align-middle">{org.type}</td>
                  <td className="p-4 align-middle">{org.personnelCount.toLocaleString()}</td>
                  <td className="p-4 align-middle">{org.contactEmail}</td>
                  <td className="p-4 align-middle">
                    <button className="text-primary hover:underline font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {organizations.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No organizations found. Click "Add Organization" to get started.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
