"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }


  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const role = user.user_metadata?.app_role || profile?.role || user.user_metadata?.role

    if (role === "admin") {
      redirect("/admin/dashboard")
    } else if (role === "request_coordinator" || role === "coordinator") {
      redirect("/coordinator/dashboard")
    } else {
      redirect("/user/dashboard")
    }
  }

  redirect("/user/dashboard")
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const rawRole = (formData.get("role") as string) || "user"
  const isCoordinator = rawRole === "request_coordinator" || rawRole === "coordinator"

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: isCoordinator ? "user" : rawRole,
        app_role: isCoordinator ? "request_coordinator" : rawRole,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
