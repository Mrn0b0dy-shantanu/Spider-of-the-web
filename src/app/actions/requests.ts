import { createClient } from "@/lib/supabase/server"

export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*").eq("is_active", true).order("name")
  return data || []
}
