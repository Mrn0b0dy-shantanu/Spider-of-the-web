
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createCommunityOffer } from "@/app/actions/community"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Heart, Loader2, MapPin, Package, HandHelping } from "lucide-react"

const categories = [
  { value: "water", label: "Water" },
  { value: "food", label: "Food" },
  { value: "medicine", label: "Medicine" },
  { value: "shelter", label: "Shelter Space" },
  { value: "transport", label: "Transport/Vehicle" },
  { value: "tools", label: "Tools/Equipment" },
  { value: "power", label: "Power/Charging" },
  { value: "other", label: "Other Resources" },
]

const helpMethods = [
  { id: "delivery", label: "I can deliver" },
  { id: "pickup", label: "Pickup only" },
  { id: "onsite", label: "Help at location" },
]

export function CreateOfferForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])

  const handleSubmit = async (formData: FormData) => {
    selectedMethods.forEach(m => formData.append("help_methods", m))
    
    startTransition(async () => {
      const res = await createCommunityOffer(formData)
      if (res.success) {
        toast.success("Help offer posted successfully!")
        router.push("/user/community?tab=offers")
      } else {
        toast.error(res.error || "Failed to post offer")
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-primary/20 shadow-xl overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HandHelping className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Share Your Resources</CardTitle>
          </div>
          <CardDescription>
            Post what you have available to share with neighbors in need. Proactive help saves lives.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">What can you share?</Label>
                <Input id="title" name="title" placeholder="e.g., 20L Drinking Water" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Resource Category</Label>
                <Select name="category" required defaultValue="water">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Describe the help (Condition, limits, etc.)</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Details about what you are sharing..." 
                className="min-h-[100px]"
                required 
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Available</Label>
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Your General Location</Label>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Input id="location" name="location" placeholder="Area or neighborhood" required />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>How can this be accessed?</Label>
              <div className="flex flex-wrap gap-4">
                {helpMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2 bg-muted/50 px-3 py-2 rounded-lg border">
                    <Checkbox 
                      id={method.id} 
                      onCheckedChange={(checked) => {
                        if (checked) setSelectedMethods([...selectedMethods, method.id])
                        else setSelectedMethods(selectedMethods.filter(m => m !== method.id))
                      }}
                    />
                    <label htmlFor={method.id} className="text-sm font-medium cursor-pointer">
                      {method.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 pt-6">
            <Button type="submit" className="w-full h-12 text-lg shadow-lg" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Posting Offer...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5 fill-primary-foreground" />
                  Share This Help
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
