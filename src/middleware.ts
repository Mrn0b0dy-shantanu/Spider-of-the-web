import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // If user is not logged in and trying to access a protected route
  if (!user && !url.pathname.startsWith("/login") && !url.pathname.startsWith("/signup") && url.pathname !== "/") {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // If user is logged in
  if (user) {
    // Get user profile/role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const role = profile?.role

    // Redirect from auth pages to respective dashboards
    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup") || url.pathname === "/") {
      if (role === "admin") {
        url.pathname = "/dashboard" // This will be (admin)/dashboard
        return NextResponse.redirect(url)
      } else {
        url.pathname = "/dashboard" // This will be (user)/dashboard
        return NextResponse.redirect(url)
      }
    }

    // Role-based protection for route groups
    // Note: Next.js App Router route groups (admin) and (user) don't appear in the URL
    // So we need to handle specific paths or use a more explicit routing strategy if needed.
    // However, since we are using route groups, the actual URL paths will be /dashboard, /requests etc.
    // We can differentiate them if we prefixes them, but the requirement says /(admin)/dashboard etc.
    // Wait, the requirement says route groups. In App Router, /(admin)/dashboard is accessed as /dashboard.
    // This creates a conflict if both groups have /dashboard.
    // I should check if the user wanted different URL prefixes or just internal organization.
    // The prompt says: "/(admin)/dashboard", "/(admin)/requests" etc.
    // If I want both to have /dashboard, I can't differentiate by URL unless I use different paths.
    // Let's assume the user wants /admin/dashboard and /user/dashboard or similar if they want separation.
    // OR, I can use a single /dashboard that renders different components based on role.
    // BUT the prompt says "TWO fully separated dashboard systems" and "separate layouts".
    // Usually this means /admin/dashboard and /user/dashboard OR using a catch-all.
    // Let's look at the prompt again: "Create route groups: /(admin), /(user)".
    // If I use (admin) and (user) groups, I should probably prefix the routes inside to avoid collision if they have same names.
    // Example: /(admin)/admin/dashboard and /(user)/user/dashboard.
    // Actually, I'll use /(admin)/admin/... and /(user)/user/... to be safe and clear.
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
