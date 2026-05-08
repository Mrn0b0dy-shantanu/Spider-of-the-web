
import { getCommunityRequests, getCommunityOffers } from "@/app/actions/community"
import { CommunityFeed } from "@/components/community/CommunityFeed"
import { Users, ShieldAlert, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = { title: "Community Aid Network | AntiQuake" }

export default async function CommunityAidPage() {
  const [initialRequests, initialOffers] = await Promise.all([
    getCommunityRequests(),
    getCommunityOffers()
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Aid Network</h1>
          <p className="text-muted-foreground mt-1">
            Connect directly with neighbors to provide or receive emergency assistance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 gap-1.5 bg-primary/10 text-primary border-primary/20">
            <Users className="h-3.5 w-3.5" />
            Live Community
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 gap-1.5 bg-green-500/10 text-green-600 border-green-500/20">
            <Heart className="h-3.5 w-3.5" />
            Peer-to-Peer
          </Badge>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ShieldAlert className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Community Safety First</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            This network is for peer-to-peer assistance. For life-threatening emergencies, always call 999. 
            Official responders also monitor this feed to prioritize resource allocation.
          </p>
        </div>
      </div>

      <CommunityFeed initialRequests={initialRequests} initialOffers={initialOffers} />
    </div>
  )
}
