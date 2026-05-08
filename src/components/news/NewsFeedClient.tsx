"use client"

import { useState, useEffect, useCallback } from "react"
import { NewsItem, fetchNews, searchNews, NewsResponse } from "@/lib/api/news"
import { NewsCard } from "./NewsCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw, Loader2, Newspaper, FilterX } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function NewsFeedClient({ initialData }: { initialData: NewsResponse }) {
  const [data, setData] = useState<NewsResponse>(initialData)
  const [query, setQuery] = useState("")
  const [verdictFilter, setVerdictFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsLoading(true)
    setIsSearching(true)
    try {
      if (query.trim()) {
        const results = await searchNews(query)
        setData(results)
      } else {
        const results = await fetchNews(1, 20, verdictFilter === "all" ? undefined : verdictFilter)
        setData(results)
        setIsSearching(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [query, verdictFilter])

  const handleReset = async () => {
    setQuery("")
    setVerdictFilter("all")
    setIsLoading(true)
    setIsSearching(false)
    try {
      const results = await fetchNews()
      setData(results)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    if (!isSearching) {
      handleSearch()
    }
  }, [verdictFilter])

  return (
    <div className="space-y-6">
      <div className="top-0 z-10 sticky flex md:flex-row flex-col gap-4 bg-card shadow-sm p-4 border rounded-xl">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search disaster rumors (e.g. earthquake, flood)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        <div className="flex gap-2">
          <Select value={verdictFilter} onValueChange={setVerdictFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Verdict Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verdicts</SelectItem>
              <SelectItem value="false">False</SelectItem>
              <SelectItem value="misleading">Misleading</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleReset} title="Reset filters">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="rounded-xl w-full h-48" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      ) : data.results.length === 0 ? (
        <div className="flex flex-col justify-center items-center bg-muted/20 py-20 border-2 border-dashed rounded-2xl">
          <FilterX className="opacity-20 mb-4 w-12 h-12 text-muted-foreground" />
          <h3 className="font-semibold text-xl">No reports found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          <Button variant="link" onClick={handleReset} className="mt-2">Clear all filters</Button>
        </div>
      ) : (
        <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.results.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && data.total_pages > 1 && (
        <div className="flex justify-center pt-8">
          <p className="text-muted-foreground text-sm">
            Showing {data.results.length} of {data.total} verified reports
          </p>
        </div>
      )}
    </div>
  )
}
