"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)
  return data || []
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient()
  await supabase.from("notifications").update({ is_read: true }).eq("id", id)
  revalidatePath("/user/notifications")
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id)
  revalidatePath("/user/notifications")
}

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("announcements").insert({
    title: formData.get("title") as string,
    message: formData.get("message") as string,
    priority: formData.get("priority") as string,
    is_active: true,
    created_by: user.id,
  })

  if (error) return { error: error.message }

  // Notify all users
  const { data: users } = await supabase.from("profiles").select("id").eq("role", "user")
  if (users?.length) {
    await supabase.from("notifications").insert(
      users.map(u => ({
        user_id: u.id,
        title: formData.get("title") as string,
        message: formData.get("message") as string,
        type: "announcement",
      }))
    )
  }

  revalidatePath("/admin/notifications")
  return { success: true }
}

export async function getAnnouncements() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("announcements")
    .select("*, profiles(full_name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
  return data || []
}
