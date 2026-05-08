"use client"

import { useState, useTransition } from "react"
import { signUp } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldAlert, Loader2, UserPlus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await signUp(formData)
      if (res?.success) {
        toast.success("Account created! Please login.")
        router.push("/login")
      } else if (res?.error) {
        toast.error(res.error)
      }
    })
  }

  return (
    <div className="flex justify-center items-center bg-muted/30 p-4 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="bg-primary shadow-primary/20 shadow-xl p-3 rounded-2xl">
            <ShieldAlert className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-black text-3xl tracking-tight">AntiQuake</h1>
          <p className="text-muted-foreground">Register for emergency relief services</p>
        </div>

        <Card className="shadow-2xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="font-bold text-2xl">Create Account</CardTitle>
            <CardDescription>Join the national relief coordination network</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Register As</Label>
                <Select name="role" defaultValue="user">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Citizen (Need Help / Volunteer)</SelectItem>
                    <SelectItem value="admin">Admin (Operational Personnel)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground italic">
                  Note: Admin roles may require additional verification after registration.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full h-11" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <UserPlus className="mr-2 w-4 h-4" />}
                Create Account
              </Button>
              <div className="text-muted-foreground text-sm text-center">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline">Login</Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
