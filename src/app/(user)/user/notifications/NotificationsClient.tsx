"use client"

import { useTransition } from "react"
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/app/actions/notifications"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Bell, Check, Trash2, MailOpen, AlertTriangle, Info, Package } from "lucide-react"
import Link from "next/link"

const typeIcons: Record<string, any> = {
  request_update: MailOpen,
  emergency: AlertTriangle,
  supply: Package,
  announcement: Info,
  system: Bell,
}

export default function UserNotificationsClient({ notifications }: { notifications: any[] }) {
  const [isPending, startTransition] = useTransition()
  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on your requests and emergency alerts.</p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => startTransition(() => markAllNotificationsRead())}
            disabled={isPending}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>You have no notifications at this time.</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => {
                const Icon = typeIcons[n.type] || Bell
                return (
                  <div 
                    key={n.id} 
                    className={`flex items-start gap-4 p-4 transition-colors ${n.is_read ? 'bg-background' : 'bg-primary/5'}`}
                  >
                    <div className={`mt-1 p-2 rounded-full ${n.is_read ? 'bg-muted' : 'bg-primary/20 text-primary'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-semibold ${n.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground shrink-0">{formatDate(n.created_at)}</span>
                      </div>
                      <p className={`text-sm ${n.is_read ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                        {n.message}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        {n.link && (
                          <Link href={n.link} className="text-xs font-bold text-primary hover:underline">
                            View Details
                          </Link>
                        )}
                        {!n.is_read && (
                          <button 
                            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => startTransition(() => markNotificationRead(n.id))}
                            disabled={isPending}
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                    {!n.is_read && <div className="mt-2 h-2 w-2 rounded-full bg-primary" />}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
