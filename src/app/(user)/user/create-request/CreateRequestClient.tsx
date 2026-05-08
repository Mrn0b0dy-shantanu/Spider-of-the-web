"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createDisasterRequest } from "@/app/actions/requests"
import { toast } from "sonner"
import { Loader2, Send, AlertTriangle } from "lucide-react"

export default function CreateRequestClient({ categories }: { categories: any[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await createDisasterRequest(formData)
      if (res?.success) {
        toast.success("Request submitted successfully")
        router.push("/user/requests")
      } else {
        toast.error(res?.error || "Failed to submit request")
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Emergency Request</h1>
        <p className="text-muted-foreground mt-1">Please provide accurate details for faster relief coordination.</p>
      </div>

      <Card className="border-primary/20 shadow-xl">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Request Information
          </CardTitle>
          <CardDescription>Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Request Summary (Brief Title) *</Label>
              <Input id="title" name="title" placeholder="e.g. Need drinking water for 5 families" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Request Category *</Label>
                <Select name="category_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select name="urgency" defaultValue="medium" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General Need</SelectItem>
                    <SelectItem value="medium">Medium - Important</SelectItem>
                    <SelectItem value="high">High - Urgent Assistance</SelectItem>
                    <SelectItem value="critical">Critical - Life-Threatening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Area/Address) *</Label>
              <Input id="location" name="location" placeholder="e.g. Block C, Sector 4, Sylhet City" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="people_affected">Approx. People Affected *</Label>
                <Input id="people_affected" name="people_affected" type="number" defaultValue={1} min={1} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone *</Label>
                <Input id="contact_phone" name="contact_phone" type="tel" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Describe the situation and what specifically is needed..." 
                rows={5} 
                required 
              />
            </div>

            <Button type="submit" className="w-full h-12 text-lg shadow-lg" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
