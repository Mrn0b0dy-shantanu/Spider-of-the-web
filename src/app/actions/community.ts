
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { CommunityRequest, CommunityFulfillment, CommunityComment, CommunityNotification } from "@/lib/types/community"

export async function getCommunityRequests(filters?: {
  category?: string;
  urgency?: string;
  status?: string;
  search?: string;
}) {
  const supabase = await createClient()
  let query = supabase
    .from("community_requests")
    .select("*, profiles!user_id(full_name, avatar_url)")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category)
  }
  if (filters?.urgency && filters.urgency !== "all") {
    query = query.eq("urgency", filters.urgency)
  }
  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createCommunityRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const urgency = formData.get("urgency") as string
  const quantity_needed = parseInt(formData.get("quantity_needed") as string || "1")
  const location = formData.get("location") as string
  const contact_info = formData.get("contact_info") as string
  const expires_at = formData.get("expires_at") as string || null

  const { data, error } = await supabase.from("community_requests").insert({
    user_id: user.id,
    title,
    category,
    description,
    urgency,
    quantity_needed,
    location,
    contact_info,
    expires_at,
    status: 'pending'
  }).select().single()

  if (error) return { error: error.message }

  revalidatePath("/user/community")
  return { success: true, data }
}

export async function fulfillCommunityRequest(requestId: string, quantity: number, notes?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }


  const { error: fulfillError } = await supabase.from("community_fulfillments").insert({
    request_id: requestId,
    user_id: user.id,
    quantity,
    notes,
    status: 'pending'
  })

  if (fulfillError) return { error: fulfillError.message }


  const { data: request } = await supabase.from("community_requests").select("quantity_needed, quantity_fulfilled").eq("id", requestId).single()

  if (request) {
    const newFulfilled = (request.quantity_fulfilled || 0) + quantity
    const newStatus = newFulfilled >= request.quantity_needed ? 'fulfilled' : 'partially_fulfilled'

    await supabase.from("community_requests").update({
      quantity_fulfilled: newFulfilled,
      status: newStatus
    }).eq("id", requestId)


    const { data: reqData } = await supabase.from("community_requests").select("user_id, title").eq("id", requestId).single()
    if (reqData && reqData.user_id !== user.id) {
      await supabase.from("community_notifications").insert({
        user_id: reqData.user_id,
        request_id: requestId,
        type: 'help_offered',
        message: `Someone offered to help with your request: "${reqData.title}"`
      })
    }
  }

  revalidatePath("/user/community")
  return { success: true }
}

export async function addCommunityComment(requestId: string, message: string, isAdmin = false) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("community_comments").insert({
    request_id: requestId,
    user_id: user.id,
    message,
    is_admin_update: isAdmin
  })

  if (error) return { error: error.message }


  const { data: reqData } = await supabase.from("community_requests").select("user_id, title").eq("id", requestId).single()
  if (reqData && reqData.user_id !== user.id) {
    await supabase.from("community_notifications").insert({
      user_id: reqData.user_id,
      request_id: requestId,
      type: 'comment_added',
      message: `New update on your request: "${reqData.title}"`
    })
  }

  revalidatePath("/user/community")
  return { success: true }
}

export async function getMyCommunityRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("community_requests")
    .select("*, profiles!user_id(full_name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getRequestsHelpingWith() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("community_fulfillments")
    .select("*, community_requests(*, profiles!user_id(full_name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return data || []
}

export async function createCommunityOffer(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("community_offers").insert({
    user_id: user.id,
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    quantity: parseInt(formData.get("quantity") as string) || 1,
    location: formData.get("location") as string,
    help_methods: formData.getAll("help_methods") as string[],
    status: "available",
  })

  if (error) return { error: error.message }
  revalidatePath("/user/community")
  revalidatePath("/admin/community")
  return { success: true }
}

export async function getCommunityOffers() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("community_offers")
    .select("*, profiles!user_id(full_name, avatar_url)")
    .order("created_at", { ascending: false })
  return data || []
}

export async function getMyCommunityOffers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("community_offers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  return data || []
}
