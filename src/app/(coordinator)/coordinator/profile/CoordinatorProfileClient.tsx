"use client"

import { useTransition } from "react"
import { updateProfile } from "@/app/actions/profile"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Phone, MapPin, ShieldCheck, ClipboardCheck, Radio } from "lucide-react"

export function CoordinatorProfileClient({ profile }: { profile: any }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await updateProfile(formData)
      if (res?.success) {
        toast.success("Coordinator profile updated successfully")
      } else {
        toast.error(res?.error || "Failed to update profile")
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Coordinator Profile</h1>
          <Badge variant="outline" className="bg-blue-500/15 text-blue-500 border-blue-500/20 font-semibold">
            Request Coordinator
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your coordinator contact details, dispatch location, and emergency contacts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 ring-4 ring-blue-500/15">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-2xl font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {profile?.full_name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg">{profile?.full_name || "Coordinator"}</h3>
            

           
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Coordinator Information</CardTitle>
            <CardDescription>
              Your contact details used by emergency personnel and system logs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={profile?.full_name}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Direct Mobile / Radio Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={profile?.phone}
                      placeholder="+880 1700..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Operating Sector / Base Location</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={profile?.location}
                      placeholder="e.g. Dhaka Emergency Ops Center"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Secondary Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="emergency_contact_name">Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      defaultValue={profile?.emergency_contact_name}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      name="emergency_contact_phone"
                      defaultValue={profile?.emergency_contact_phone}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
