import { getRequestDetail } from "@/app/actions/requests"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Clock, MapPin, User, Phone, Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export const metadata = { title: "Request Details | NDC Relief" }

const urgencyColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-500 border-red-500/20",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/15 text-green-500 border-green-500/20",
}

export default async function UserRequestDetailPage({ params }: { params: { id: string } }) {
  const request = await getRequestDetail(params.id)

  if (!request) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/user/requests" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to My Requests
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{request.title}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Badge variant="outline">{request.categories?.name}</Badge>
            <span>Submitted {formatDate(request.created_at)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`capitalize py-1 px-3 ${urgencyColors[request.urgency]}`}>
            {request.urgency} Urgency
          </Badge>
          <StatusBadge status={request.status} className="py-1 px-3" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{request.description || "No detailed description provided."}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Location</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  {request.location}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">People Affected</p>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  {request.people_affected} people
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Contact Person</p>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  {request.contact_name || "Self"}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Phone</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  {request.contact_phone}
                </div>
              </div>
            </div>

            {request.admin_notes && (
              <div className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <p className="text-xs font-bold uppercase text-primary tracking-wider mb-2 flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5" /> Admin Response
                </p>
                <p className="text-sm italic">"{request.admin_notes}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Timeline</CardTitle>
            <CardDescription>History of status changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-muted">
              {request.request_updates?.length === 0 ? (
                <div className="relative">
                  <div className="absolute -left-[1.85rem] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-sm font-medium">Request Submitted</p>
                  <p className="text-xs text-muted-foreground">{formatDate(request.created_at)}</p>
                </div>
              ) : (
                request.request_updates.map((update: any) => (
                  <div key={update.id} className="relative">
                    <div className="absolute -left-[1.85rem] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                    <p className="text-sm font-medium">
                      Status updated to <span className="capitalize text-primary">{update.new_status.replace("_", " ")}</span>
                    </p>
                    {update.message && <p className="text-xs text-muted-foreground mt-1 mb-1 italic">"{update.message}"</p>}
                    <p className="text-[10px] text-muted-foreground">{formatDate(update.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
