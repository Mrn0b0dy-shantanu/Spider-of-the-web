
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createCommunityRequest } from "@/app/actions/community"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Plus, Info, MapPin, Phone, Package, AlertCircle } from "lucide-react"

const categories = [
  "Water", "Food", "Medicine", "Shelter", "Rescue", "Clothing", 
  "Transportation", "Emergency Tools", "Power/Charging", "Hygiene", "Other"
]

const urgencyLevels = [
  { value: "low", label: "Low", description: "Not urgent, but needed" },
  { value: "medium", label: "Medium", description: "Needed within 24-48 hours" },
  { value: "high", label: "High", description: "Needed urgently (within 12 hours)" },
  { value: "critical", label: "Critical", description: "Life-threatening or immediate" }
]

export function CreateRequestForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await createCommunityRequest(formData)
      if (res.success) {
        toast.success("Community request posted successfully!")
        router.push("/user/community")
      } else {
        toast.error(res.error || "Failed to post request")
      }
    })
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-primary/10">
      <CardHeader className="bg-primary/5 border-b pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground">
            <Plus className="w-5 h-5" />
          </div>
          <CardTitle className="text-2xl">New Relief Request</CardTitle>
        </div>
        <CardDescription>
          Tell the community what you need. Your request will be visible to neighbors and the command center.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Summary of Need</Label>
              <Input id="title" name="title" placeholder="e.g. Need 5 bottles of drinking water" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select name="urgency" defaultValue="medium" required>
                  <SelectTrigger id="urgency">
                    <SelectValue placeholder="Select Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{level.label}</span>
                          <span className="text-[10px] text-muted-foreground">{level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Please describe exactly what you need and any relevant details..."
                className="min-h-[120px] resize-none"
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity_needed" className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Quantity Needed
                </Label>
                <Input id="quantity_needed" name="quantity_needed" type="number" min={1} defaultValue={1} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location" className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Specific Location
                </Label>
                <Input id="location" name="location" placeholder="e.g. Block C, Sector 4, Dhaka" required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact_info" className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Contact Information
              </Label>
              <Input id="contact_info" name="contact_info" placeholder="Phone number or preferred contact method" required />
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-xl border flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              By posting this request, you agree to share your location and contact info with verified community members who wish to help.
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-11" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Community Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
