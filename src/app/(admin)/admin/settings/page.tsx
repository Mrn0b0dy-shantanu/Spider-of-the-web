import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Bell, Lock, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = { title: "Settings | AntiQuake Admin" }

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">System Settings</h1>
        <p className="mt-1 text-muted-foreground">Configure global operational parameters and security.</p>
      </div>

      <div className="gap-6 grid">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security & Access
            </CardTitle>
            <CardDescription>Manage administrative privileges and authentication policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center bg-muted/30 p-4 border rounded-lg">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-muted-foreground text-xs">Enforce 2FA for all administrative accounts.</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Channels
            </CardTitle>
            <CardDescription>Configure how emergency alerts are delivered to citizens.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center bg-muted/30 p-4 border rounded-lg">
              <div>
                <p className="font-medium">SMS Gateway</p>
                <p className="text-muted-foreground text-xs">Currently connected to National SMS API.</p>
              </div>
              <Badge>Connected</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
