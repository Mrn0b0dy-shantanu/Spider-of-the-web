"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { updateRequestStatus as baseUpdateRequestStatus } from "@/app/actions/requests"
import type { RequestStatus } from "@/lib/types"

export async function getCoordinatorStats() {
  const supabase = await createClient()

  const [
    { count: pendingCount },
    { count: criticalPendingCount },
    { count: highPendingCount },
    { count: activeCount },
    { count: totalCount },
  ] = await Promise.all([
    supabase
      .from("disaster_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("disaster_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("urgency", "critical"),
    supabase
      .from("disaster_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("urgency", "high"),
    supabase
      .from("disaster_requests")
      .select("*", { count: "exact", head: true })
      .in("status", ["approved", "in_progress"]),
    supabase
      .from("disaster_requests")
      .select("*", { count: "exact", head: true }),
  ])

  return {
    pending: pendingCount || 0,
    criticalPending: criticalPendingCount || 0,
    highPending: highPendingCount || 0,
    active: activeCount || 0,
    total: totalCount || 0,
    processed: Math.max(0, (totalCount || 0) - (pendingCount || 0)),
  }
}

export async function getCoordinatorPendingRequests() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("disaster_requests")
    .select("*, profiles!user_id(full_name, phone, location), categories!category_id(name, icon)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching joined pending requests:", error)
    const { data: fallback, error: fallbackError } = await supabase
      .from("disaster_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (fallbackError) {
      console.error("Error fetching fallback pending requests:", fallbackError)
      return []
    }
    return fallback || []
  }

  // Sort with critical first, then high, medium, low
  const urgencyWeight: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  }

  return (data || []).sort((a: any, b: any) => {
    const weightDiff = (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0)
    if (weightDiff !== 0) return weightDiff
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

export async function getCoordinatorActiveRequests() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("disaster_requests")
    .select("*, profiles!user_id(full_name, phone, location), categories!category_id(name, icon)")
    .in("status", ["approved", "in_progress"])
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching joined active requests:", error)
    const { data: fallback, error: fallbackError } = await supabase
      .from("disaster_requests")
      .select("*")
      .in("status", ["approved", "in_progress"])
      .order("updated_at", { ascending: false })

    if (fallbackError) {
      console.error("Error fetching fallback active requests:", fallbackError)
      return []
    }
    return fallback || []
  }

  return data || []
}

export async function getCoordinatorRequestDetail(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("disaster_requests")
    .select(
      "*, profiles!user_id(full_name, phone, location), categories!category_id(name, icon), request_updates(*, profiles(full_name))"
    )
    .eq("id", id)
    .single()

  if (error) {
    // Fallback simple query
    const { data: fallback } = await supabase
      .from("disaster_requests")
      .select("*, categories(name, icon), request_updates(*)")
      .eq("id", id)
      .single()
    return fallback
  }

  return data
}

export async function coordinatorApproveRequest(id: string, notes?: string) {
  const result = await baseUpdateRequestStatus(id, "approved", notes || "Approved for dispatch by Request Coordinator")
  revalidateCoordinatorPaths(id)
  return result
}

export async function coordinatorRejectRequest(id: string, reason: string) {
  const trimmedReason = reason?.trim()
  if (!trimmedReason) {
    return { error: "A rejection reason must be provided." }
  }

  const result = await baseUpdateRequestStatus(id, "rejected", trimmedReason)
  revalidateCoordinatorPaths(id)
  return result
}

export async function coordinatorUpdateStatus(id: string, status: RequestStatus, notes?: string) {
  const result = await baseUpdateRequestStatus(id, status, notes)
  revalidateCoordinatorPaths(id)
  return result
}

function revalidateCoordinatorPaths(id?: string) {
  revalidatePath("/coordinator/dashboard")
  revalidatePath("/coordinator/pending")
  revalidatePath("/coordinator/active")
  if (id) {
    revalidatePath(`/coordinator/requests/${id}`)
    revalidatePath(`/user/requests/${id}`)
  }
  revalidatePath("/admin/requests")
  revalidatePath("/admin/dashboard")
  revalidatePath("/user/requests")
  revalidatePath("/user/dashboard")
}
