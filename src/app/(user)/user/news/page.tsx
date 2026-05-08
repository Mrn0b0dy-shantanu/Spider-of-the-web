import { fetchNews, searchNews } from "@/lib/api/news"
import { NewsFeedClient } from "@/components/news/NewsFeedClient"
import { Newspaper, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata = { title: "Verified Disaster News | AntiQuake" }

export default async function UserNewsPage() {
  const initialData = await fetchNews()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Verified Disaster News</h1>
        <p className="text-muted-foreground">
          Stay informed with fact-checked reports and disaster alerts from trusted sources.
        </p>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Verified by Drishtikon.life
        </p>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertTitle>Why Truth Matters</AlertTitle>
        <AlertDescription className="text-xs">
          During disasters, rumors spread fast. Use this feed to verify information before sharing or taking action. All data is provided by Drishtikon News Verification System.
        </AlertDescription>
      </Alert>

      <NewsFeedClient initialData={initialData} />
    </div>
  )
}
