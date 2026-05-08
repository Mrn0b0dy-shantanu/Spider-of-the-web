"use client"

import { useState, useTransition } from "react"
import { signIn } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await signIn(formData)
      if (res?.error) {
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
          <p className="text-muted-foreground">National Disaster Coordination & Relief Platform</p>
        </div>

        <Card className="shadow-2xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="font-bold text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-primary text-xs hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full h-11" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <ArrowRight className="mr-2 w-4 h-4" />}
                Sign In
              </Button>
              <div className="text-muted-foreground text-sm text-center">
                Don't have an account?{" "}
                <Link href="/signup" className="font-bold text-primary hover:underline">Sign up</Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center">
          <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
            Authorized Personnel & Citizen Access Only
          </p>
        </div>
      </div>
    </div>
  )
}
