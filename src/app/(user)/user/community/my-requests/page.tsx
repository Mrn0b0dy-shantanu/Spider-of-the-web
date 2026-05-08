
import { getMyCommunityRequests } from "@/app/actions/community"
import { RequestCard } from "@/components/community/RequestCard"
import { Users, FileText, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = { title: "My Relief Requests | AntiQuake" }

export default async function MyRequestsPage() {
  const requests = await getMyCommunityRequests()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Relief Requests</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage the assistance requests you've posted to the community.
          </p>
        </div>
        <Button asChild>
          <Link href="/user/community/request/new">
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
          <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold">No requests posted yet</h3>
          <p className="text-muted-foreground mb-6">Need help? Post your first community relief request.</p>
          <Button asChild>
            <Link href="/user/community/request/new">Create Request</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}
