"use client"

import { useState, useTransition } from "react"
import { updateProfile } from "@/app/actions/profile"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, User, Phone, MapPin, ShieldCheck } from "lucide-react"

export default function UserProfileClient({ profile }: { profile: any }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await updateProfile(formData)
      if (res?.success) {
        toast.success("Profile updated successfully")
      } else {
        toast.error(res?.error || "Failed to update profile")
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and emergency contacts.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-2xl">{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg">{profile?.full_name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{profile?.role}</p>
            <div className="mt-4 pt-4 border-t w-full space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3" /> Account Verified
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" /> Member since 2024
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your contact details for relief coordination.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" name="full_name" defaultValue={profile?.full_name} required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={profile?.phone} placeholder="+880..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">General Location</Label>
                    <Input id="location" name="location" defaultValue={profile?.location} placeholder="e.g. Dhaka, Bangladesh" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="emergency_contact_name">Contact Name</Label>
                    <Input id="emergency_contact_name" name="emergency_contact_name" defaultValue={profile?.emergency_contact_name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                    <Input id="emergency_contact_phone" name="emergency_contact_phone" defaultValue={profile?.emergency_contact_phone} />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
