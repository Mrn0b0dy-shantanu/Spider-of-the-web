"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: totalRequests },
    { count: pendingRequests },
    { count: criticalRequests },
    { count: activeIncidents },
    { count: deployedPersonnel },
    { count: activeShelters },
    { data: supplies },
  ] = await Promise.all([
    supabase.from("disaster_requests").select("*", { count: "exact", head: true }),
    supabase.from("disaster_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("disaster_requests").select("*", { count: "exact", head: true }).eq("urgency", "critical"),
    supabase.from("incidents").select("*", { count: "exact", head: true }).in("status", ["active", "critical"]),
    supabase.from("personnel").select("*", { count: "exact", head: true }).eq("status", "deployed"),
    supabase.from("shelters").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("supplies").select("status"),
  ])

  const lowStockCount = supplies?.filter(s => s.status === "low_stock" || s.status === "out_of_stock").length || 0

  return {
    totalRequests: totalRequests || 0,
    pendingRequests: pendingRequests || 0,
    criticalRequests: criticalRequests || 0,
    activeIncidents: activeIncidents || 0,
    deployedPersonnel: deployedPersonnel || 0,
    activeShelters: activeShelters || 0,
    lowStockCount,
  }
}

export async function getRecentRequests(limit = 10) {
  const supabase = await createClient()


  const { data, error } = await supabase
    .from("disaster_requests")
    .select("*, profiles!user_id(full_name), categories!category_id(name, icon)")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching joined recent requests:", error)


    const { data: simpleData, error: simpleError } = await supabase
      .from("disaster_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (simpleError) {
      console.error("Error fetching simple recent requests:", simpleError)
      return []
    }

    return simpleData || []
  }

  return data || []
}

export async function getUserList() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
  return data || []
}

export async function getRequestsByStatus() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("disaster_requests")
    .select("status, urgency")

  const statusCounts: Record<string, number> = {}
  const urgencyCounts: Record<string, number> = {}

  data?.forEach(r => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1
    urgencyCounts[r.urgency] = (urgencyCounts[r.urgency] || 0) + 1
  })

  return { statusCounts, urgencyCounts }
}

export async function getRequestsByCategory() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("disaster_requests")
    .select("categories(name)")

  const categoryCounts: Record<string, number> = {}

  data?.forEach((r: any) => {
    const name = r.categories?.name || (Array.isArray(r.categories) ? r.categories[0]?.name : "General")
    categoryCounts[name] = (categoryCounts[name] || 0) + 1
  })

  return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }))
}

export async function getIncidents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false })
  return data || []
}

export async function getPersonnel() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("personnel")
    .select("*")
    .order("name")
  return data || []
}

export async function getOrganizations() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .order("name")
  return data || []
}

export async function getEmergencyContacts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("is_active", true)
    .order("display_order")
  return data || []
}

export async function upsertIncident(incident: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("incidents")
    .upsert(incident, { onConflict: 'id' })
    .select()

  if (error) {
    console.error("Error upserting incident:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/incidents")
  return { success: true, data }
}

export async function getCommunityStats() {
  const supabase = await createClient()

  const [
    { count: totalRequests },
    { count: totalFulfillments },
    { data: requests }
  ] = await Promise.all([
    supabase.from("community_requests").select("*", { count: "exact", head: true }),
    supabase.from("community_fulfillments").select("*", { count: "exact", head: true }),
    supabase.from("community_requests").select("category, status, quantity_needed, quantity_fulfilled")
  ])


  const categoryGaps: Record<string, number> = {}
  requests?.forEach(r => {
    if (r.status !== 'fulfilled') {
      const gap = r.quantity_needed - (r.quantity_fulfilled || 0)
      categoryGaps[r.category] = (categoryGaps[r.category] || 0) + gap
    }
  })

  const sortedGaps = Object.entries(categoryGaps)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1))

  return {
    totalRequests: totalRequests || 0,
    activeResponders: totalFulfillments || 0,
    topGaps: sortedGaps.length > 0 ? sortedGaps.join(", ") : "None"
  }
}

export async function getOperationalTrends() {
  const supabase = await createClient()


  const [
    { data: personnel },
    { data: shelters },
    { data: requests }
  ] = await Promise.all([
    supabase.from("personnel").select("created_at"),
    supabase.from("shelters").select("created_at, current_occupancy, capacity"),
    supabase.from("disaster_requests").select("created_at")
  ])


  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const trends = last7Days.map(date => {
    const pCount = personnel?.filter(p => p.created_at.split('T')[0] <= date).length || 0
    const sOccupancy = shelters?.reduce((acc, s) => acc + (s.current_occupancy || 0), 0) || 0
    const rCount = requests?.filter(r => r.created_at.split('T')[0] <= date).length || 0

    return {
      date: date.split('-').slice(1).join('-'),
      personnel: pCount,
      occupancy: sOccupancy,
      requests: rCount
    }
  })

  return trends
}
