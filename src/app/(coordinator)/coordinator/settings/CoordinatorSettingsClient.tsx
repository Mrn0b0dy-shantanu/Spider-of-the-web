"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Bell, Shield, Volume2, Sliders, CheckCircle } from "lucide-react"

export function CoordinatorSettingsClient() {
  const [criticalSound, setCriticalSound] = useState(true)
  const [browserNotifications, setBrowserNotifications] = useState(true)
  const [autoAdvance, setAutoAdvance] = useState(false)

  const handleSave = () => {
    toast.success("Coordinator preferences saved.")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Coordinator Settings</h1>
          <Badge variant="outline" className="bg-blue-500/15 text-blue-500 border-blue-500/20 font-semibold">
            Triage Configuration
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Configure emergency request alert tones, dispatch notification channels, and operational preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Triage & Notification Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-primary" />
              Emergency Request Alerts
            </CardTitle>
            <CardDescription>
              Sound and visual cues when new disaster relief requests are submitted.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-lg border">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Volume2 className="w-4 h-4 text-amber-500" />
                  <span>Audio Alert for Critical Urgency Requests</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Play an audio chime whenever a critical life-safety request enters the queue.
                </p>
              </div>
              <Button
                size="sm"
                variant={criticalSound ? "default" : "outline"}
                onClick={() => setCriticalSound(!criticalSound)}
              >
                {criticalSound ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-lg border">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Bell className="w-4 h-4 text-blue-500" />
                  <span>Live Queue Refresh Indicator</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep real-time subscription open to immediately display incoming civilian requests.
                </p>
              </div>
              <Badge variant="outline" className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20">
                <CheckCircle className="w-3 h-3 mr-1" /> Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Operational Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sliders className="w-5 h-5 text-primary" />
              Triage Preferences
            </CardTitle>
            <CardDescription>
              Streamline workflow actions when processing emergency approvals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-lg border">
              <div className="space-y-0.5">
                <p className="font-medium text-sm">Standard Dispatch Notes</p>
                <p className="text-xs text-muted-foreground">
                  Automatically insert standard regional dispatch template during one-click approval.
                </p>
              </div>
              <Button
                size="sm"
                variant={autoAdvance ? "default" : "outline"}
                onClick={() => setAutoAdvance(!autoAdvance)}
              >
                {autoAdvance ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="pt-2">
              <Button onClick={handleSave} className="w-full sm:w-auto">
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}
