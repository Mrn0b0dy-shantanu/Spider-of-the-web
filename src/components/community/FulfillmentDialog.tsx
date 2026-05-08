
"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { fulfillCommunityRequest } from "@/app/actions/community"
import { toast } from "sonner"
import { Loader2, HandHelping, Info } from "lucide-react"

export function FulfillmentDialog({ request, children }: { request: any, children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(Math.min(1, request.quantity_needed - request.quantity_fulfilled))
  const [notes, setNotes] = useState("")
  const [isPending, startTransition] = useTransition()

  const remaining = request.quantity_needed - request.quantity_fulfilled

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await fulfillCommunityRequest(request.id, quantity, notes)
      if (res.success) {
        toast.success("Thank you for your help! Your offer has been recorded.")
        setOpen(false)
        setNotes("")
      } else {
        toast.error(res.error || "Failed to submit offer")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HandHelping className="w-5 h-5 text-primary" />
              Help with: {request.title}
            </DialogTitle>
            <DialogDescription>
              Offer your resources or assistance to this community member.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex gap-3 text-xs text-muted-foreground">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground mb-1">Fulfillment Progress</p>
                <p>Needs {request.quantity_needed} units. {request.quantity_fulfilled} already offered. {remaining} units remaining.</p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity you can provide</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={remaining}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Optional Notes (e.g. pickup details, timing)</Label>
              <Textarea
                id="notes"
                placeholder="I can drop this off at the community center..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm My Offer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
