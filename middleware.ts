import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Skip middleware for auth callback and static files
  if (
    req.nextUrl.pathname === "/auth/callback" ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/favicon")
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

    console.log("🔍 Middleware check:", {
      path: req.nextUrl.pathname,
      hasSession: !!session,
      userEmail: session?.user?.email,
    })

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!session) {
        console.log("🔒 No session for admin route, redirecting to login")
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/auth/login"
        redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check admin role and profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, phone_number, region, email, full_name")
        .eq("id", session.user.id)
        .single()

      console.log("👑 Admin route check:", {
        userEmail: session.user.email,
        userData,
        hasError: !!userError,
        errorCode: userError?.code,
        hasPhone: userData?.phone_number ? "YES" : "NO",
        hasRegion: userData?.region ? "YES" : "NO",
      })

      // If user doesn't exist in database, redirect to complete profile
      if (userError && userError.code === "PGRST116") {
        console.log("⚠️ Admin user not found in database, redirecting to complete profile")
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/auth/complete-profile"
        return NextResponse.redirect(redirectUrl)
      }

      // If user exists but is not admin, redirect to dashboard
      if (userData && userData.role !== "admin") {
        console.log("⛔ Non-admin trying to access admin area")
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/dashboard"
        return NextResponse.redirect(redirectUrl)
      }

      // If admin but missing profile data, redirect to complete profile
      if (userData && userData.role === "admin") {
        const missingPhone = !userData.phone_number || userData.phone_number.trim() === ""
        const missingRegion = !userData.region || userData.region.trim() === ""

        if (missingPhone || missingRegion) {
          console.log("👑 Admin profile incomplete:", {
            missingPhone,
            missingRegion,
            phone: userData.phone_number,
            region: userData.region,
          })
          const redirectUrl = req.nextUrl.clone()
          redirectUrl.pathname = "/auth/complete-profile"
          return NextResponse.redirect(redirectUrl)
        }
      }
    }

    // Protect dashboard routes
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!session) {
        console.log("🔒 No session for dashboard, redirecting to login")
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/auth/login"
        redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("phone_number, region, role, email, full_name")
        .eq("id", session.user.id)
        .single()

      console.log("👤 Dashboard route check:", {
        userEmail: session.user.email,
        userData,
        hasError: !!userError,
        errorCode: userError?.code,
        hasPhone: userData?.phone_number ? "YES" : "NO",
        hasRegion: userData?.region ? "YES" : "NO",
      })

      // If user doesn't exist in database, redirect to complete profile
      if (userError && userError.code === "PGRST116") {
        console.log("⚠️ User not found in database, redirecting to complete profile")
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = "/auth/complete-profile"
        return NextResponse.redirect(redirectUrl)
      }

      // If user exists but missing profile data, redirect to complete profile
      if (userData) {
        const missingPhone = !userData.phone_number || userData.phone_number.trim() === ""
        const missingRegion = !userData.region || userData.region.trim() === ""

        if (missingPhone || missingRegion) {
          console.log("🔄 User profile incomplete:", {
            userEmail: session.user.email,
            missingPhone,
            missingRegion,
            phone: userData.phone_number,
            region: userData.region,
          })
          const redirectUrl = req.nextUrl.clone()
          redirectUrl.pathname = "/auth/complete-profile"
          return NextResponse.redirect(redirectUrl)
        }
      }
    }

    // Redirect authenticated users away from auth pages (except callback and complete-profile)
    if (
      session &&
      req.nextUrl.pathname.startsWith("/auth") &&
      !req.nextUrl.pathname.includes("/callback") &&
      !req.nextUrl.pathname.includes("/complete-profile") &&
      !req.nextUrl.pathname.includes("/verify-email")
    ) {
      console.log("🔄 Authenticated user on auth page, checking redirect")

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, phone_number, region, email, full_name")
        .eq("id", session.user.id)
        .single()

      console.log("🔍 Auth redirect check:", {
        userEmail: session.user.email,
        userData,
        hasError: !!userError,
        errorCode: userError?.code,
        hasPhone: userData?.phone_number ? "YES" : "NO",
        hasRegion: userData?.region ? "YES" : "NO",
      })

      const redirectUrl = req.nextUrl.clone()

      // If user doesn't exist in database, redirect to complete profile
      if (userError && userError.code === "PGRST116") {
        console.log("⚠️ User not in database, redirecting to complete profile")
        redirectUrl.pathname = "/auth/complete-profile"
        return NextResponse.redirect(redirectUrl)
      }

      // If user exists but missing profile data, redirect to complete profile
      if (userData) {
        const missingPhone = !userData.phone_number || userData.phone_number.trim() === ""
        const missingRegion = !userData.region || userData.region.trim() === ""

        if (missingPhone || missingRegion) {
          console.log("🔄 Profile incomplete, redirecting to complete profile:", {
            userEmail: session.user.email,
            missingPhone,
            missingRegion,
          })
          redirectUrl.pathname = "/auth/complete-profile"
          return NextResponse.redirect(redirectUrl)
        }

        // Profile is complete - redirect to appropriate dashboard
        if (userData.role === "admin") {
          console.log("👑 Complete admin profile, redirecting to admin dashboard")
          redirectUrl.pathname = "/admin/dashboard"
        } else {
          console.log("👤 Complete user profile, redirecting to dashboard")
          redirectUrl.pathname = "/dashboard"
        }

        return NextResponse.redirect(redirectUrl)
      }
    }

    return res
  } catch (error) {
    console.error("💥 Middleware error:", error)
    return res
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*"],
}
