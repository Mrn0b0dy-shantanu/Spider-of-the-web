"use client"

import { useState, useEffect, useCallback } from "react"
import { getCommunityRequests, getCommunityOffers } from "@/app/actions/community"
import { RequestCard } from "./RequestCard"
import { OfferCard } from "./OfferCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw, Loader2, Plus, FilterX, AlertCircle, HandHelping, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function CommunityFeed({ initialRequests, initialOffers = [] }: { initialRequests: any[], initialOffers?: any[] }) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "needs")
  const [requests, setRequests] = useState(initialRequests)
  const [offers, setOffers] = useState(initialOffers)
  const [query, setQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      if (activeTab === "needs") {
        const results = await getCommunityRequests({
          category: categoryFilter,
          urgency: urgencyFilter,
          search: query
        })
        setRequests(results)
      } else {
        const results = await getCommunityOffers()

        let filtered = results
        if (categoryFilter && categoryFilter !== "all") {
          filtered = filtered.filter(o => o.category === categoryFilter)
        }
        if (query) {
          filtered = filtered.filter(o => 
            o.title.toLowerCase().includes(query.toLowerCase()) || 
            o.description.toLowerCase().includes(query.toLowerCase())
          )
        }
        setOffers(filtered)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [categoryFilter, urgencyFilter, query, activeTab])


  useEffect(() => {
    const channel = supabase
      .channel('community-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_requests' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_fulfillments' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_offers' }, () => fetchData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchData])

  const handleReset = () => {
    setQuery("")
    setCategoryFilter("all")
    setUrgencyFilter("all")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 mb-6">
        <TabsList className="grid grid-cols-2 bg-muted/50 shadow-inner p-1 border w-full md:w-[400px] h-12">
          <TabsTrigger value="needs" className="gap-2 data-[state=active]:bg-primary h-full data-[state=active]:text-primary-foreground">
            <Users className="w-4 h-4" /> Community Needs
          </TabsTrigger>
          <TabsTrigger value="offers" className="gap-2 data-[state=active]:bg-green-600 h-full data-[state=active]:text-white">
            <HandHelping className="w-4 h-4" /> Available Help
          </TabsTrigger>
        </TabsList>

        <Button asChild className={cn(
          "shadow-lg hover:shadow-xl px-6 h-12 transition-all",
          activeTab === "needs" ? "bg-primary" : "bg-green-600 hover:bg-green-700"
        )}>
          <Link href={activeTab === "needs" ? "/user/community/request/new" : "/user/community/offer/new"}>
            <Plus className="mr-2 w-5 h-5" />
            {activeTab === "needs" ? "Request Assistance" : "Share Help"}
          </Link>
        </Button>
      </div>


      <div className="flex xl:flex-row flex-col gap-4 bg-card shadow-sm mb-8 p-4 border rounded-xl">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder={activeTab === "needs" ? "Search help requests..." : "Search available help..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
          <Button onClick={fetchData} disabled={isLoading} className="px-6 h-11">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Filter Feed"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="shelter">Shelter</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
            </SelectContent>
          </Select>

          {activeTab === "needs" && (
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-[160px] h-11">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button variant="outline" size="icon" onClick={handleReset} title="Reset filters" className="w-11 h-11">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>


      <div className="gap-4 grid grid-cols-2 md:grid-cols-4 mb-8">
        <div className="bg-muted/30 p-3 border rounded-lg text-center">
          <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Total Needs</p>
          <p className="font-bold text-2xl">{requests.length}</p>
        </div>
        <div className="bg-green-500/5 p-3 border border-green-500/10 rounded-lg text-center">
          <p className="font-bold text-[10px] text-green-600 uppercase tracking-widest">Help Available</p>
          <p className="font-bold text-green-600 text-2xl">{offers.length}</p>
        </div>
        <div className="bg-red-500/5 p-3 border border-red-500/10 rounded-lg text-center">
          <p className="font-bold text-[10px] text-red-600 uppercase tracking-widest">High Urgency</p>
          <p className="font-bold text-red-600 text-2xl">
            {requests.filter(r => r.urgency === 'critical' || r.urgency === 'high').length}
          </p>
        </div>
        <div className="bg-blue-500/5 p-3 border border-blue-500/10 rounded-lg text-center">
          <p className="font-bold text-[10px] text-blue-600 uppercase tracking-widest">Needs Met</p>
          <p className="font-bold text-blue-600 text-2xl">
            {requests.filter(r => r.status === 'fulfilled').length}
          </p>
        </div>
      </div>

      <TabsContent value="needs" className="mt-0">
        {isLoading ? (
          <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="rounded-xl w-full h-[250px]" />)}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState message="No requests matching your filters" link="/user/community/request/new" linkText="Create Request" />
        ) : (
          <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => <RequestCard key={request.id} request={request} />)}
          </div>
        )}
      </TabsContent>

      <TabsContent value="offers" className="mt-0">
        {isLoading ? (
          <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="rounded-xl w-full h-[250px]" />)}
          </div>
        ) : offers.length === 0 ? (
          <EmptyState message="No available help matching your filters" link="/user/community/offer/new" linkText="Share Help" />
        ) : (
          <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
    function EmptyState({ message, link, linkText }: { message: string, link: string, linkText: string }) {
      return (
        <div className="flex flex-col justify-center items-center bg-muted/20 py-20 border-2 border-dashed rounded-2xl">
          <FilterX className="opacity-20 mb-4 w-12 h-12 text-muted-foreground" />
          <h3 className="font-semibold text-xl">{message}</h3>
          <p className="mb-6 text-muted-foreground">Try adjusting your filters or contribute to the network.</p>
          <Button asChild>
            <Link href={link}>{linkText}</Link>
          </Button>
        </div>
      )
    }
