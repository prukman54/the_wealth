import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Skip middleware for auth callback and static files
  if (
    req.nextUrl.pathname === "/auth/callback" ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api")
  ) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({
      req,
      res,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!session) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/auth/login"
        redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check admin role
      const { data: userData } = await supabase
        .from("users")
        .select("role, phone_number, region")
        .eq("id", session.user.id)
        .single()

      if (userData?.role !== "admin") {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/dashboard"
        return NextResponse.redirect(redirectUrl)
      }

      // Check if admin profile is complete
      if (!userData?.phone_number || !userData?.region) {
        console.log("👑 Admin profile incomplete - redirecting to complete profile")
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/auth/complete-profile"
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Protect dashboard routes and check profile completion
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!session) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/auth/login"
        redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Get user data to check profile completion
      const { data: userData } = await supabase
        .from("users")
        .select("phone_number, region, role")
        .eq("id", session.user.id)
        .single()

      // Check profile completion for ALL users (including admin when accessing dashboard)
      if (!userData?.phone_number || !userData?.region) {
        console.log("🔄 Middleware: Incomplete profile detected, redirecting to complete profile")
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/auth/complete-profile"
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Redirect authenticated users away from auth pages (except callback and complete-profile)
    if (
      session &&
      req.nextUrl.pathname.startsWith("/auth") &&
      !req.nextUrl.pathname.includes("/callback") &&
      !req.nextUrl.pathname.includes("/complete-profile")
    ) {
      const { data: userData } = await supabase
        .from("users")
        .select("role, phone_number, region")
        .eq("id", session.user.id)
        .single()

      const redirectUrl = req.nextUrl.clone()

      // Check if profile is incomplete
      if (!userData?.phone_number || !userData?.region) {
        redirectUrl.pathname = "/auth/complete-profile"
        return NextResponse.redirect(redirectUrl)
      }

      // Profile is complete - redirect to appropriate dashboard
      if (userData?.role === "admin") {
        redirectUrl.pathname = "/admin/dashboard"
      } else {
        redirectUrl.pathname = "/dashboard"
      }

      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return res
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*"],
}
