"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  return data
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("profiles").update({
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
    location: formData.get("location") as string,
    emergency_contact_name: formData.get("emergency_contact_name") as string,
    emergency_contact_phone: formData.get("emergency_contact_phone") as string,
  }).eq("id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/user/profile")
  return { success: true }
}
