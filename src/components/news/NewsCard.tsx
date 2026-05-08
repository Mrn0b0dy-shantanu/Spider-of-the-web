"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NewsItem } from "@/lib/api/news"
import { cn, formatDate } from "@/lib/utils"
import { ExternalLink, ShieldCheck, ShieldAlert, AlertCircle, Calendar, Tag } from "lucide-react"

export function NewsCard({ item }: { item: NewsItem }) {
  const isFalse = item.verdict_type === 'false';
  const isMisleading = item.verdict_type === 'misleading';
  const isUnverified = item.verdict_type === 'unverified';

  return (
    <Card className="group flex flex-col hover:shadow-md h-full overflow-hidden transition-shadow">
      <div className="relative bg-muted w-full h-48 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title_en}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            <AlertCircle className="opacity-20 w-10 h-10" />
          </div>
        )}
        <div className="top-3 left-3 absolute">
          <Badge
            variant={isFalse ? "destructive" : isMisleading ? "secondary" : "outline"}
            className={cn(
              "gap-1 shadow-sm",
              isMisleading && "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20",
              isUnverified && "bg-muted text-muted-foreground"
            )}
          >
            {isFalse ? <ShieldAlert className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {item.verdict}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="flex items-center gap-2 mr-auto">
            {item.analysis?.category_tags?.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="px-1.5 py-0 h-4 font-normal text-[10px] capitalize">
                <Tag className="mr-1 w-2.5 h-2.5" />{tag.split("_").join(" ")}
              </Badge>
            ))}
          </div>
          <div className="flex items-center mr-auto text-[10px] text-muted-foreground">
            <Calendar className="mr-1 w-2.5 h-2.5" />
            {formatDate(item.published_at)}
          </div>
        </div>
        <CardTitle className="text-base line-clamp-2 leading-snug" title={item.title_en}>
          {item.title_en}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-0">
        <p className="mb-4 text-muted-foreground text-xs line-clamp-3">
          {item.summary_ai_en || item.analysis?.summary_en}
        </p>

        {item.analysis?.impact_level === 'high' && (
          <div className="flex items-center gap-1.5 bg-destructive/5 p-2 border border-destructive/10 rounded-md font-medium text-[10px] text-destructive">
            <AlertCircle className="w-3 h-3" />
            High Impact Event
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/20 mt-auto p-4 pt-0 border-t">
        <Button variant="ghost" size="sm" className="gap-2 mt-3 w-full h-8 text-xs" asChild>
          <a href={item.source_url} target="_blank" rel="noopener noreferrer">
            Read Full Report <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
