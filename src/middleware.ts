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


  if (!user && !url.pathname.startsWith("/login") && !url.pathname.startsWith("/signup") && url.pathname !== "/") {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }


  if (user) {

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const role = user.user_metadata?.app_role || profile?.role || user.user_metadata?.role
    const isCoordinator = role === "request_coordinator" || role === "coordinator"
    const isAdmin = role === "admin"

    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
      if (isAdmin) {
        url.pathname = "/admin/dashboard"
        return NextResponse.redirect(url)
      } else if (isCoordinator) {
        url.pathname = "/coordinator/dashboard"
        return NextResponse.redirect(url)
      } else {
        url.pathname = "/user/dashboard"
        return NextResponse.redirect(url)
      }
    }

    // Role-based protection: Request Coordinators cannot access admin features
    if (url.pathname.startsWith("/admin") && !isAdmin) {
      url.pathname = isCoordinator ? "/coordinator/dashboard" : "/user/dashboard"
      return NextResponse.redirect(url)
    }

    // Protect /coordinator routes from regular users
    if (url.pathname.startsWith("/coordinator") && !isCoordinator && !isAdmin) {
      url.pathname = "/user/dashboard"
      return NextResponse.redirect(url)
    }

    // Keep Request Coordinator in dedicated dashboard if accessing civilian user routes
    if (url.pathname.startsWith("/user") && isCoordinator) {
      url.pathname = "/coordinator/dashboard"
      return NextResponse.redirect(url)
    }



















  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
