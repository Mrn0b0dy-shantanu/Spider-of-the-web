import { getInventory } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Box, Plus, Search } from "lucide-react";

export default async function LogisticsPage() {
  const inventory = await getInventory();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Logistics & Inventory</h1>
        <div className="ml-auto flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-muted"></div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Supplies Catalog</h2>
            <p className="text-muted-foreground">Track relief materials, equipment, and medical supplies.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Item Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location Hub</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Quantity</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{item.name}</td>
                  <td className="p-4 align-middle">{item.category}</td>
                  <td className="p-4 align-middle">{item.location}</td>
                  <td className="p-4 align-middle">{item.quantity.toLocaleString()} {item.unit}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                        ${item.status === 'Out of Stock' ? 'bg-destructive/10 text-destructive' : 
                          item.status === 'Low Stock' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}
                      `}>
                        {item.status}
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
