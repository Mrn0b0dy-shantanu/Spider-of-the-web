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
  const { data } = await supabase
    .from("disaster_requests")
    .select("*, profiles(full_name), categories(name, icon)")
    .order("created_at", { ascending: false })
    .limit(limit)
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
