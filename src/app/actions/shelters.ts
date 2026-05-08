"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getShelters() {
  const supabase = await createClient()
  const { data } = await supabase.from("shelters").select("*").order("name")
  return data || []
}

export async function createShelter(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from("shelters").insert({
    name: formData.get("name") as string,
    location: formData.get("location") as string,
    capacity: parseInt(formData.get("capacity") as string),
    current_occupancy: parseInt(formData.get("current_occupancy") as string) || 0,
    status: formData.get("status") as string,
    contact_phone: formData.get("contact_phone") as string,
    contact_person: formData.get("contact_person") as string,
    description: formData.get("description") as string,
    amenities: ((formData.get("amenities") as string) || "").split(",").map(a => a.trim()).filter(Boolean),
  })
  if (error) return { error: error.message }
  revalidatePath("/admin/shelters")
  revalidatePath("/user/shelters")
  return { success: true }
}

export async function updateShelterOccupancy(id: string, occupancy: number) {
  const supabase = await createClient()
  const { data: shelter } = await supabase.from("shelters").select("capacity").eq("id", id).single()
  if (!shelter) return { error: "Shelter not found" }

  const status = occupancy >= shelter.capacity ? "full" : "active"
  const { error } = await supabase.from("shelters").update({ current_occupancy: occupancy, status }).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/shelters")
  revalidatePath("/user/shelters")
  return { success: true }
}

export async function deleteShelter(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("shelters").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/shelters")
  return { success: true }
}
