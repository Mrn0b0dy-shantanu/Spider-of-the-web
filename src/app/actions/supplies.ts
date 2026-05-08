"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSupplies() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("supplies")
    .select("*")
    .order("name")
  return data || []
}

export async function createSupply(formData: FormData) {
  const supabase = await createClient()
  const quantity = parseInt(formData.get("quantity") as string)
  const minThreshold = parseInt(formData.get("min_threshold") as string) || 10

  let status = "available"
  if (quantity === 0) status = "out_of_stock"
  else if (quantity <= minThreshold) status = "low_stock"

  const { error } = await supabase.from("supplies").insert({
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    quantity,
    unit: formData.get("unit") as string,
    location: formData.get("location") as string,
    description: formData.get("description") as string,
    min_threshold: minThreshold,
    status,
  })

  if (error) return { error: error.message }
  revalidatePath("/admin/supplies")
  return { success: true }
}

export async function updateSupplyQuantity(id: string, change: number, notes: string, changeType: "in" | "out" | "adjustment") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: supply } = await supabase.from("supplies").select("*").eq("id", id).single()
  if (!supply) return { error: "Supply not found" }

  const newQty = supply.quantity + change
  if (newQty < 0) return { error: "Insufficient stock" }

  let status = "available"
  if (newQty === 0) status = "out_of_stock"
  else if (newQty <= supply.min_threshold) status = "low_stock"

  const { error } = await supabase.from("supplies").update({ quantity: newQty, status }).eq("id", id)
  if (error) return { error: error.message }

  await supabase.from("inventory_logs").insert({
    supply_id: id,
    change_type: changeType,
    quantity_change: change,
    previous_quantity: supply.quantity,
    new_quantity: newQty,
    notes,
    performed_by: user?.id,
  })

  revalidatePath("/admin/supplies")
  return { success: true }
}

export async function deleteSupply(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("supplies").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/supplies")
  return { success: true }
}
