import { getPersonnel } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";

export default async function PersonnelPage() {
  const personnel = await getPersonnel();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Human Resources</h1>
        <div className="ml-auto flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-muted"></div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Staff & Volunteers</h2>
            <p className="text-muted-foreground">Manage deployments and availability of personnel.</p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Personnel
          </Button>
        </div>

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Organization</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((person) => (
                <tr key={person.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{person.name}</td>
                  <td className="p-4 align-middle">{person.role}</td>
                  <td className="p-4 align-middle">{person.organization}</td>
                  <td className="p-4 align-middle">{person.location}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                        ${person.status === 'Deployed' ? 'bg-primary/10 text-primary' : 
                          person.status === 'Available' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}
                      `}>
                        {person.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
