"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDate } from "@/lib/utils"
import { coordinatorApproveRequest, coordinatorRejectRequest, coordinatorUpdateStatus } from "@/app/actions/coordinator"
import { toast } from "sonner"
import {
  Check,
  X,
  Clock,
  Loader2,
  MapPin,
  Users,
  Phone,
  User,
  AlertTriangle,
  FileText,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
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

interface RequestActionDialogProps {
  request: any
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function RequestActionDialog({
  request,
  isOpen,
  onClose,
  onSuccess,
}: RequestActionDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [actionType, setActionType] = useState<"view" | "approve" | "reject">("view")
  const [approveNotes, setApproveNotes] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const router = useRouter()

  if (!request) return null

  const handleApprove = () => {
    startTransition(async () => {
      const res = await coordinatorApproveRequest(request.id, approveNotes)
      if (res?.success) {
        toast.success(`Request "${request.title}" approved successfully!`)
        onSuccess?.()
        onClose()
        router.refresh()
      } else {
        toast.error(res?.error || "Failed to approve request.")
      }
    })
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejecting this request.")
      return
    }

    startTransition(async () => {
      const res = await coordinatorRejectRequest(request.id, rejectReason)
      if (res?.success) {
        toast.success(`Request "${request.title}" was rejected.`)
        onSuccess?.()
        onClose()
        router.refresh()
      } else {
        toast.error(res?.error || "Failed to reject request.")
      }
    })
  }

  const handleStatusAdvance = (status: "in_progress" | "fulfilled") => {
    startTransition(async () => {
      const statusLabel = status === "in_progress" ? "In Progress" : "Fulfilled"
      const res = await coordinatorUpdateStatus(
        request.id,
        status,
        `Status updated to ${statusLabel} by Request Coordinator`
      )
      if (res?.success) {
        toast.success(`Request marked as ${statusLabel}.`)
        onSuccess?.()
        onClose()
        router.refresh()
      } else {
        toast.error(res?.error || `Failed to update status to ${statusLabel}.`)
      }
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setActionType("view")
          setApproveNotes("")
          setRejectReason("")
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className={`capitalize text-xs font-semibold ${urgencyColors[request.urgency] || ""}`}
            >
              {request.urgency} Urgency
            </Badge>
            <StatusBadge status={request.status} />
          </div>
          <DialogTitle className="text-xl font-bold">{request.title}</DialogTitle>
          <DialogDescription>
            Submitted by {request.profiles?.full_name || request.contact_name || "Applicant"} ·{" "}
            {formatDate(request.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg text-sm border">
            <div>
              <span className="text-xs text-muted-foreground block">Category</span>
              <span className="font-medium">{request.categories?.name || "General Relief"}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">People Affected</span>
              <span className="font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary" /> {request.people_affected || 1}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Contact Phone</span>
              <span className="font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-primary" /> {request.contact_phone || "Not provided"}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <span className="text-xs text-muted-foreground block">Location / Address</span>
              <span className="font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-destructive shrink-0" />
                {request.location || "Coordinates / Address pending"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
              Emergency Situation Details
            </Label>
            <div className="bg-muted/30 p-3 rounded-md text-sm border whitespace-pre-wrap leading-relaxed">
              {request.description || "No specific narrative provided."}
            </div>
          </div>

          {/* Prior Notes if any */}
          {request.admin_notes && (
            <div className="bg-primary/5 p-3 rounded-md border border-primary/20 text-sm">
              <Label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                <MessageSquare className="w-3.5 h-3.5" /> Coordinator Notes / Log
              </Label>
              <p className="text-muted-foreground italic">&quot;{request.admin_notes}&quot;</p>
            </div>
          )}

          {/* Action Views: Approve or Reject Forms */}
          {actionType === "approve" && (
            <div className="bg-green-500/10 p-4 border border-green-500/30 rounded-lg space-y-3 animate-in fade-in-50">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm">
                <Check className="w-4 h-4" /> Approve & Dispatch Request
              </div>
              <p className="text-xs text-muted-foreground">
                Approving this request will mark it as <strong>Approved</strong>, notify the citizen, and queue relief operations.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="approve-notes" className="text-xs font-medium">
                  Dispatch Notes (Optional for applicant)
                </Label>
                <Textarea
                  id="approve-notes"
                  placeholder="e.g. Relief team dispatched from North Hub, ETA 45 minutes..."
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          {actionType === "reject" && (
            <div className="bg-destructive/10 p-4 border border-destructive/30 rounded-lg space-y-3 animate-in fade-in-50">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <X className="w-4 h-4" /> Reject Request
              </div>
              <p className="text-xs text-muted-foreground">
                Please provide a clear reason for rejecting this request. This reason will be logged and communicated to the citizen.
              </p>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Quick Reasons:</Label>
                <div className="flex flex-wrap gap-1.5">
                  {commonRejectReasons.map((reason, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectReason(reason)}
                      className="text-[11px] bg-background hover:bg-muted border rounded px-2 py-1 text-left transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reject-reason" className="text-xs font-medium">
                  Rejection Reason (Required) <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Explain why this request could not be approved..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between items-center pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (actionType !== "view") {
                setActionType("view")
              } else {
                onClose()
              }
            }}
            disabled={isPending}
          >
            {actionType !== "view" ? "Cancel Action" : "Close"}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {request.status === "pending" && actionType === "view" && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setActionType("reject")}
                >
                  <X className="w-4 h-4 mr-1" /> Reject Request
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setActionType("approve")}
                >
                  <Check className="w-4 h-4 mr-1" /> Approve Request
                </Button>
              </>
            )}

            {actionType === "approve" && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApprove}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                Confirm Approval
              </Button>
            )}

            {actionType === "reject" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReject}
                disabled={isPending || !rejectReason.trim()}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <X className="w-4 h-4 mr-1" />
                )}
                Confirm Rejection
              </Button>
            )}

            {request.status === "approved" && (
              <Button
                size="sm"
                variant="default"
                onClick={() => handleStatusAdvance("in_progress")}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 mr-1" />
                )}
                Mark In Progress
              </Button>
            )}

            {request.status === "in_progress" && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleStatusAdvance("fulfilled")}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                Mark Fulfilled
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
