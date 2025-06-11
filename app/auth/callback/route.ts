import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const returnUrl = requestUrl.searchParams.get("return")
  const error = requestUrl.searchParams.get("error")

  console.log("🔄 Auth Callback Started (Google OAuth only):", {
    hasCode: !!code,
    error,
    returnUrl,
    origin: requestUrl.origin,
  })

  // Handle OAuth errors
  if (error) {
    console.error("❌ OAuth Error:", error)
    const redirectUrl = new URL("/auth/login", requestUrl.origin)
    redirectUrl.searchParams.set("error", "oauth_error")
    return NextResponse.redirect(redirectUrl)
  }

  // Handle missing code
  if (!code) {
    console.error("❌ No authorization code received")
    const redirectUrl = new URL("/auth/login", requestUrl.origin)
    redirectUrl.searchParams.set("error", "no_code")
    return NextResponse.redirect(redirectUrl)
  }

  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    })

    console.log("🔑 Exchanging code for session...")

    // Exchange code for session
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("❌ Code exchange error:", exchangeError)
      const redirectUrl = new URL("/auth/login", requestUrl.origin)
      redirectUrl.searchParams.set("error", "oauth_error")
      return NextResponse.redirect(redirectUrl)
    }

    if (!sessionData.user) {
      console.error("❌ No user data after code exchange")
      const redirectUrl = new URL("/auth/login", requestUrl.origin)
      redirectUrl.searchParams.set("error", "user_error")
      return NextResponse.redirect(redirectUrl)
    }

    console.log("✅ User authenticated via Google:", {
      email: sessionData.user.email,
      id: sessionData.user.id,
      provider: sessionData.user.app_metadata?.provider,
    })

    // Check if user exists in our database
    console.log("🔍 Checking if user exists in database...")
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", sessionData.user.id)
      .single()

    // NEW USER - Create profile and redirect to complete profile
    if (fetchError && fetchError.code === "PGRST116") {
      console.log("👤 New Google user detected - creating basic profile")

      const fullName =
        sessionData.user.user_metadata?.full_name ||
        sessionData.user.user_metadata?.name ||
        sessionData.user.user_metadata?.display_name ||
        ""
      const email = sessionData.user.email || ""

      console.log("📝 Creating user profile with Google data:", {
        fullName,
        email,
        provider: sessionData.user.app_metadata?.provider,
      })

      const { error: insertError } = await supabase.from("users").insert({
        id: sessionData.user.id,
        full_name: fullName,
        email: email,
        phone_number: "", // Will be completed in profile setup
        region: "", // Will be selected in profile setup
        role: "user", // Google users are always regular users
      })

      if (insertError) {
        console.error("❌ Error creating user profile:", insertError)
      } else {
        console.log("✅ User profile created successfully")
      }

      // Always redirect new Google users to complete profile
      const redirectUrl = new URL("/auth/complete-profile", requestUrl.origin)
      console.log("🔄 Redirecting new Google user to complete profile")
      return NextResponse.redirect(redirectUrl)
    }

    // EXISTING USER - Check profile completion and redirect accordingly
    if (existingUser) {
      console.log("👤 Existing Google user found:", {
        email: existingUser.email,
        hasPhone: !!existingUser.phone_number,
        hasRegion: !!existingUser.region,
        role: existingUser.role,
      })

      // Check if profile needs completion
      if (!existingUser.phone_number || !existingUser.region) {
        console.log("⚠️ Profile incomplete - redirecting to complete profile")
        const redirectUrl = new URL("/auth/complete-profile", requestUrl.origin)
        return NextResponse.redirect(redirectUrl)
      }

      // Profile is complete - go to dashboard
      let finalRedirect = "/dashboard"
      if (returnUrl && returnUrl.includes("rukman.com.np")) {
        finalRedirect = "/dashboard?welcome=true"
        console.log("🔗 External referral - redirecting with welcome")
      }

      const redirectUrl = new URL(finalRedirect, requestUrl.origin)
      console.log("✅ Redirecting existing Google user to:", finalRedirect)
      return NextResponse.redirect(redirectUrl)
    }

    // Fallback - should not reach here
    console.log("⚠️ Fallback redirect to dashboard")
    const redirectUrl = new URL("/dashboard", requestUrl.origin)
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("💥 Unexpected error in auth callback:", error)
    const redirectUrl = new URL("/auth/login", requestUrl.origin)
    redirectUrl.searchParams.set("error", "unexpected_error")
    return NextResponse.redirect(redirectUrl)
  }
}
