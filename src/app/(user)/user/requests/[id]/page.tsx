import { getRequestDetail } from "@/app/actions/requests"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Clock, MapPin, User, Phone, Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export const metadata = { title: "Request Details | AntiQuake" }

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
    <div className="space-y-6 mx-auto max-w-4xl">
      <Link href="/user/requests" className="flex items-center gap-2 mb-4 text-muted-foreground hover:text-primary text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to My Requests
      </Link>

      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">{request.title}</h1>
          <p className="flex items-center gap-2 mt-1 text-muted-foreground">
            <Badge variant="outline">{request.categories?.name}</Badge>
            <span>Submitted {formatDate(request.created_at)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`capitalize py-1 px-3 ${urgencyColors[request.urgency]}`}>
            {request.urgency} Urgency
          </Badge>
          <StatusBadge status={request.status} className="px-3 py-1" />
        </div>
      </div>

      <div className="gap-6 grid md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{request.description || "No detailed description provided."}</p>
            </div>

            <div className="gap-6 grid grid-cols-2">
              <div className="space-y-1">
                <p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">Location</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  {request.location}
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">People Affected</p>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  {request.people_affected} people
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">Contact Person</p>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary" />
                  {request.contact_name || "Self"}
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">Phone</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  {request.contact_phone}
                </div>
              </div>
            </div>

            {request.admin_notes && (
              <div className="bg-primary/5 mt-6 p-4 border border-primary/20 rounded-lg">
                <p className="flex items-center gap-2 mb-2 font-bold text-primary text-xs uppercase tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5" /> Admin Response
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
            <div className="before:top-2 before:bottom-2 before:left-2 before:absolute relative space-y-6 before:bg-muted pl-6 before:w-px">
              {request.request_updates?.length === 0 ? (
                <div className="relative">
                  <div className="top-1 -left-[1.85rem] absolute bg-primary rounded-full ring-4 ring-background w-3 h-3" />
                  <p className="font-medium text-sm">Request Submitted</p>
                  <p className="text-muted-foreground text-xs">{formatDate(request.created_at)}</p>
                </div>
              ) : (
                request.request_updates.map((update: any) => (
                  <div key={update.id} className="relative">
                    <div className="top-1 -left-[1.85rem] absolute bg-primary rounded-full ring-4 ring-background w-3 h-3" />
                    <p className="font-medium text-sm">
                      Status updated to <span className="text-primary capitalize">{update.new_status.replace("_", " ")}</span>
                    </p>
                    {update.message && <p className="mt-1 mb-1 text-muted-foreground text-xs italic">"{update.message}"</p>}
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
