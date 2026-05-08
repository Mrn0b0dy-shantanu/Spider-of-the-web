"use client"

import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { createSupply, updateSupplyQuantity, deleteSupply } from "@/app/actions/supplies"
import { Plus, Package, Trash2, History, Loader2, Minus, PlusCircle } from "lucide-react"
import { toast } from "sonner"

export default function AdminSuppliesClient({ supplies }: { supplies: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [selectedSupply, setSelectedSupply] = useState<any>(null)
  const [adjustAmount, setAdjustAmount] = useState(0)

  const handleCreateSupply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await createSupply(formData)
      if (res?.success) {
        toast.success("Supply item created")
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast.error(res?.error || "Failed to create supply")
      }
    })
  }

  const handleAdjustQuantity = (id: string, current: number, change: number, type: "in" | "out" | "adjustment") => {
    if (current + change < 0) {
      toast.error("Insufficient stock")
      return
    }
    startTransition(async () => {
      const res = await updateSupplyQuantity(id, change, `${type} adjustment`, type)
      if (res?.success) {
        toast.success("Quantity updated")
      } else {
        toast.error(res?.error || "Failed to update quantity")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supply Inventory</h1>
          <p className="text-muted-foreground mt-1">Track and manage emergency relief supplies.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Supply Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateSupply}>
              <DialogHeader>
                <DialogTitle>New Supply Item</DialogTitle>
                <DialogDescription>Add a new item to the central inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Input id="category" name="category" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">Unit</Label>
                  <Input id="unit" name="unit" placeholder="e.g. Kits, Liters, Bags" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input id="location" name="location" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="min_threshold" className="text-right">Min Threshold</Label>
                  <Input id="min_threshold" name="min_threshold" type="number" defaultValue={10} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea id="description" name="description" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Create Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplies.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.category}</TableCell>
                  <TableCell className="text-sm">{item.location}</TableCell>
                  <TableCell>
                    <div className="font-bold">
                      {item.quantity} <span className="text-xs font-normal text-muted-foreground">{item.unit}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleAdjustQuantity(item.id, item.quantity, -1, "out")}
                        disabled={isPending || item.quantity <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleAdjustQuantity(item.id, item.quantity, 1, "in")}
                        disabled={isPending}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => {
                          if (confirm("Delete this item?")) {
                            startTransition(() => deleteSupply(item.id))
                          }
                        }}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
