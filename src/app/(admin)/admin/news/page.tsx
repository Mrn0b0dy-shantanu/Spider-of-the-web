import { fetchNews, searchNews } from "@/lib/api/news"
import { NewsFeedClient } from "@/components/news/NewsFeedClient"
import { Newspaper, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = { title: "News Verification | AntiQuake Admin" }

export default async function AdminNewsPage() {
  const initialData = await fetchNews()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Verification</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and verify disaster-related news and social media rumors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 gap-1.5 bg-green-500/10 text-green-600 border-green-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Drishtikon Verified Feed
          </Badge>
          <Badge variant="outline" className="px-3 py-1 gap-1.5 text-[10px] font-normal opacity-70 uppercase">
            Data: Drishtikon.life
          </Badge>
          <Badge variant="outline" className="px-3 py-1 gap-1.5">
            <Newspaper className="h-3.5 w-3.5" />
            {initialData.total}+ Reports
          </Badge>
        </div>
      </div>

      <NewsFeedClient initialData={initialData} />
    </div>
  )
}
