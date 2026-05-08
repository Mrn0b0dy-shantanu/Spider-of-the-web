"use client"

import { useState, useTransition } from "react"
import { createAnnouncement, getAnnouncements } from "@/app/actions/notifications"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Bell, Send, AlertTriangle, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminNotificationsClient({ announcements }: { announcements: any[] }) {
  const [isPending, startTransition] = useTransition()

  const handleCreateAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await createAnnouncement(formData)
      if (res?.success) {
        toast.success("Emergency announcement broadcasted")
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast.error(res?.error || "Failed to broadcast announcement")
      }
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground mt-1">Broadcast emergency alerts to all users.</p>
        </div>

        <Card className="border-destructive/20 bg-destructive/5 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              New Operational Broadcast
            </CardTitle>
            <CardDescription>This will send a real-time notification to all registered citizens.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Announcement Title</Label>
                <Input id="title" name="title" placeholder="e.g. Flood Warning - Sylhet Region" required />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select name="priority" defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General Info</SelectItem>
                    <SelectItem value="normal">Normal - Standard Update</SelectItem>
                    <SelectItem value="high">High - Urgent Action</SelectItem>
                    <SelectItem value="critical">Critical - Life Threatening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea id="message" name="message" placeholder="Detailed instructions or information..." rows={4} required />
              </div>

              <Button type="submit" variant="destructive" className="w-full h-11" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Broadcast Immediately
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight mt-1.5 invisible lg:visible">Active Broadcasts</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10 italic">No announcements broadcasted yet.</p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className={`p-4 rounded-lg border-l-4 ${ann.priority === 'critical' ? 'border-destructive bg-destructive/5' : 'border-primary bg-primary/5'}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-sm">{ann.title}</h4>
                    <Badge variant={ann.priority === 'critical' ? 'destructive' : 'outline'} className="capitalize text-[10px]">
                      {ann.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ann.message}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>By: {ann.profiles?.full_name || "Admin"}</span>
                    <span>{formatDate(ann.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
