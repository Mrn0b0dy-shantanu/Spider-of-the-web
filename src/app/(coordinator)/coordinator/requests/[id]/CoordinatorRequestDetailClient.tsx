"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/lib/utils"
import {
  coordinatorApproveRequest,
  coordinatorRejectRequest,
  coordinatorUpdateStatus,
} from "@/app/actions/coordinator"
import { toast } from "sonner"
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Users,
  MessageSquare,
  Check,
  X,
  Clock,
  Loader2,
  Calendar,
  AlertTriangle,
} from "lucide-react"

const urgencyColors: Record<string, string> = {
  critical: "bg-red-500/15 text-red-500 border-red-500/20",
  high: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/15 text-green-500 border-green-500/20",
}

const commonRejectReasons = [
  "Duplicate emergency request already being processed",
  "Outside designated response sector / redirected to regional command",
  "Requires specialized medical evacuation team (triage escalated)",
  "Requested relief supplies are temporarily depleted",
  "Insufficient location or contact verification",
]

export function CoordinatorRequestDetailClient({ request }: { request: any }) {
  const [isPending, startTransition] = useTransition()
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showApproveForm, setShowApproveForm] = useState(false)
  const [approveNotes, setApproveNotes] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const router = useRouter()

  const handleApprove = () => {
    startTransition(async () => {
      const res = await coordinatorApproveRequest(request.id, approveNotes)
      if (res?.success) {
        toast.success(`Request "${request.title}" approved!`)
        setShowApproveForm(false)
        router.refresh()
      } else {
        toast.error(res?.error || "Failed to approve request.")
      }
    })
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason.")
      return
    }

    startTransition(async () => {
      const res = await coordinatorRejectRequest(request.id, rejectReason)
      if (res?.success) {
        toast.success(`Request "${request.title}" was rejected.`)
        setShowRejectForm(false)
        router.refresh()
      } else {
        toast.error(res?.error || "Failed to reject request.")
      }
    })
  }

  const handleStatusUpdate = (status: "in_progress" | "fulfilled") => {
    startTransition(async () => {
      const statusLabel = status === "in_progress" ? "In Progress" : "Fulfilled"
      const res = await coordinatorUpdateStatus(
        request.id,
        status,
        `Status updated to ${statusLabel} by Request Coordinator`
      )
      if (res?.success) {
        toast.success(`Request updated to ${statusLabel}.`)
        router.refresh()
      } else {
        toast.error(res?.error || "Failed to update status.")
      }
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href={request.status === "pending" ? "/coordinator/pending" : "/coordinator/active"}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {request.status === "pending" ? "Pending Requests" : "Active Requests"}
        </Link>
      </div>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">{request.title}</h1>
          <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground flex-wrap">
            <Badge variant="outline">{request.categories?.name || "General Relief"}</Badge>
            <span>Submitted {formatDate(request.created_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`capitalize py-1 px-3 text-xs font-bold ${urgencyColors[request.urgency] || ""}`}
          >
            {request.urgency} Urgency
          </Badge>
          <StatusBadge status={request.status} className="px-3 py-1" />
        </div>
      </div>

      {/* Action Banner for Coordinator */}
      {request.status === "pending" && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" /> Request Awaiting Coordinator Decision
            </CardTitle>
            <CardDescription>
              Review the emergency report below and approve for field dispatch or provide a reason for rejection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showApproveForm && !showRejectForm && (
              <div className="flex items-center gap-3">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowApproveForm(true)}
                >
                  <Check className="w-4 h-4 mr-1.5" /> Approve Request
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectForm(true)}
                >
                  <X className="w-4 h-4 mr-1.5" /> Reject Request
                </Button>
              </div>
            )}

            {showApproveForm && (
              <div className="p-4 bg-background border rounded-lg space-y-3">
                <p className="font-semibold text-sm text-green-600 dark:text-green-400">
                  Confirm Approval & Dispatch
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="approveNotes">Dispatch Notes (Optional)</Label>
                  <Textarea
                    id="approveNotes"
                    placeholder="e.g. Unit dispatched from regional warehouse..."
                    value={approveNotes}
                    onChange={(e) => setApproveNotes(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleApprove}
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                    Confirm Approval
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApproveForm(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {showRejectForm && (
              <div className="p-4 bg-background border border-destructive/30 rounded-lg space-y-3">
                <p className="font-semibold text-sm text-destructive">
                  Provide Rejection Reason
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {commonRejectReasons.map((reason, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectReason(reason)}
                      className="text-[11px] bg-muted hover:bg-accent border rounded px-2 py-1 text-left"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rejectReason">
                    Reason for Rejection (Required) <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="rejectReason"
                    placeholder="Explain why this request is being rejected..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleReject}
                    disabled={isPending || !rejectReason.trim()}
                  >
                    {isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                    Confirm Rejection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRejectForm(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Progress Actions for Active Requests */}
      {(request.status === "approved" || request.status === "in_progress") && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm text-blue-600 dark:text-blue-400">
                Active Relief Operation
              </p>
              <p className="text-xs text-muted-foreground">
                Current status: <span className="capitalize font-medium">{request.status.replace("_", " ")}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {request.status === "approved" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("in_progress")}
                  disabled={isPending}
                >
                  <Clock className="w-4 h-4 mr-1.5" /> Mark In Progress
                </Button>
              )}
              {request.status === "in_progress" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleStatusUpdate("fulfilled")}
                  disabled={isPending}
                >
                  <Check className="w-4 h-4 mr-1.5" /> Mark Fulfilled
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Details & Narrative (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Situation & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/40 p-4 rounded-lg border">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Citizen Situation Narrative
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {request.description || "No specific detailed description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
                    Location
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-destructive shrink-0" />
                    <span>{request.location || "Coordinates not specified"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
                    People Affected
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    <span>{request.people_affected || 1} individuals</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
                    Applicant / Contact
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4 text-primary shrink-0" />
                    <span>{request.contact_name || request.profiles?.full_name || "Self"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
                    Contact Phone
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span>{request.contact_phone || "No phone listed"}</span>
                  </div>
                </div>
              </div>

              {request.admin_notes && (
                <div className="bg-primary/5 p-4 border border-primary/20 rounded-lg">
                  <p className="flex items-center gap-2 mb-2 font-bold text-primary text-xs uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5" /> Coordinator Response Note
                  </p>
                  <p className="text-sm italic">"{request.admin_notes}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Update Timeline (1 col) */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
              <CardDescription>Full audit trail of decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-muted">
                {/* Initial submission */}
                <div className="relative">
                  <div className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-medium text-sm">Request Submitted</p>
                  <p className="text-muted-foreground text-xs">{formatDate(request.created_at)}</p>
                </div>

                {request.request_updates?.map((update: any) => (
                  <div key={update.id} className="relative">
                    <div className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                    <p className="font-medium text-sm">
                      Status changed to{" "}
                      <span className="text-primary capitalize font-semibold">
                        {update.new_status?.replace("_", " ")}
                      </span>
                    </p>
                    {update.message && (
                      <p className="mt-1 text-muted-foreground text-xs italic bg-muted/40 p-2 rounded">
                        "{update.message}"
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDate(update.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
