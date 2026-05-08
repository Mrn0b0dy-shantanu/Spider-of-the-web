import { getRequests } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { CreateRequestButton } from "./RequestsClient";

export default async function RequestsPage() {
  const requests = await getRequests();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Resource Requests</h1>
        <div className="ml-auto flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-muted"></div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Needs & Commitments</h2>
            <p className="text-muted-foreground">Manage and track requests for supplies and personnel.</p>
          </div>
          <CreateRequestButton />
        </div>

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Item Requested</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Quantity</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Destination</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{req.item}</td>
                  <td className="p-4 align-middle">{req.quantity} {req.unit}</td>
                  <td className="p-4 align-middle">{req.destination}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                        ${req.priority === 'High' ? 'bg-destructive/10 text-destructive' : 
                          req.priority === 'Medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-muted text-muted-foreground'}
                      `}>
                        {req.priority}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                        ${req.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' : 
                          req.status === 'Approved' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}
                      `}>
                        {req.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <Button variant="outline" size="sm">Fulfill</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">No requests found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
