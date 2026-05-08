
import { getRequestsHelpingWith } from "@/app/actions/community"
import { RequestCard } from "@/components/community/RequestCard"
import { HandHelping, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = { title: "Requests I'm Helping With | AntiQuake" }

export default async function HelpingPage() {
  const fulfillments = await getRequestsHelpingWith()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Helping Others</h1>
          <p className="text-muted-foreground mt-1">
            Review the community requests you have volunteered to assist with.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 gap-1.5 bg-green-500/10 text-green-600 border-green-500/20">
            <Heart className="h-3.5 w-3.5" />
            Active Volunteer
          </Badge>
        </div>
      </div>

      {fulfillments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
          <HandHelping className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold">Not helping with any requests yet</h3>
          <p className="text-muted-foreground mb-6">Browse the network and see who you can support.</p>
          <Button asChild>
            <Link href="/user/community">Browse Aid Network</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fulfillments.map((f) => (
            <RequestCard key={f.id} request={f.community_requests} />
          ))}
        </div>
      )}
    </div>
  )
}
