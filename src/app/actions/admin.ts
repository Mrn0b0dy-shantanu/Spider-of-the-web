import { createClient } from "@/lib/supabase/server"

export async function getEmergencyContacts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("is_active", true)
    .order("display_order")
  return data || []
}
