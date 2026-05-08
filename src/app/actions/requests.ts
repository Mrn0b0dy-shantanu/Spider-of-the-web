"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { RequestStatus } from "@/lib/types"

export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*").eq("is_active", true).order("name")
  return data || []
}

export async function createDisasterRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("disaster_requests").insert({
    user_id: user.id,
    category_id: formData.get("category_id") as string || null,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    urgency: formData.get("urgency") as string,
    location: formData.get("location") as string,
    contact_name: formData.get("contact_name") as string,
    contact_phone: formData.get("contact_phone") as string,
    people_affected: parseInt(formData.get("people_affected") as string) || 1,
    status: "pending",
  })

  if (error) return { error: error.message }

  revalidatePath("/user/requests")
  revalidatePath("/admin/requests")
  return { success: true }
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
  adminNotes?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: existing } = await supabase
    .from("disaster_requests")
    .select("status, user_id")
    .eq("id", id)
    .single()

  const { error } = await supabase.from("disaster_requests").update({
    status,
    admin_notes: adminNotes,
    updated_at: new Date().toISOString(),
  }).eq("id", id)

  if (error) return { error: error.message }


  await supabase.from("request_updates").insert({
    request_id: id,
    old_status: existing?.status,
    new_status: status,
    message: adminNotes || `Status changed to ${status}`,
    updated_by: user.id,
  })


  if (existing?.user_id) {
    const statusMessages: Record<string, string> = {
      approved: "Your request has been approved. Relief is on the way.",
      rejected: "Your request could not be fulfilled at this time.",
      in_progress: "Your request is currently being processed.",
      fulfilled: "Your request has been fulfilled. Stay safe.",
    }
    await supabase.from("notifications").insert({
      user_id: existing.user_id,
      title: `Request ${status.replace("_", " ").toUpperCase()}`,
      message: statusMessages[status] || `Your request status: ${status}`,
      type: "request_update",
      link: `/user/requests/${id}`,
    })
  }

  revalidatePath("/admin/requests")
  revalidatePath("/user/requests")
  return { success: true }
}

export async function getAllRequests(filters?: {
  status?: string
  urgency?: string
  search?: string
}) {
  const supabase = await createClient()
  let query = supabase
    .from("disaster_requests")
    .select("*, profiles!user_id(full_name, phone), categories!category_id(name, icon)")
    .order("created_at", { ascending: false })

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }
  if (filters?.urgency && filters.urgency !== "all") {
    query = query.eq("urgency", filters.urgency)
  }

  const { data, error } = await query
  if (error) {
    console.error("Error in getAllRequests (joined):", error)

    const { data: simpleData, error: simpleError } = await supabase
      .from("disaster_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (simpleError) {
      console.error("Error in getAllRequests (simple):", simpleError)
      return []
    }
    return simpleData || []
  }
  return data || []
}

export async function getUserRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("disaster_requests")
    .select("*, categories(name, icon)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return []
  return data || []
}

export async function getRequestDetail(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("disaster_requests")
    .select("*, profiles(full_name, phone, location), categories(name, icon), request_updates(*, profiles(full_name))")
    .eq("id", id)
    .single()

  return data
}
