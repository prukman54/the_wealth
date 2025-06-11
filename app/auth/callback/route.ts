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
  const emailSignup = requestUrl.searchParams.get("email_signup")

  console.log("🔄 Auth Callback Started:", {
    hasCode: !!code,
    error,
    returnUrl,
    emailSignup,
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

    console.log("✅ User authenticated:", {
      email: sessionData.user.email,
      id: sessionData.user.id,
      provider: sessionData.user.app_metadata?.provider,
      emailSignup,
    })

    // Check if user exists in our database
    console.log("🔍 Checking if user exists in database...")
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", sessionData.user.id)
      .single()

    // EMAIL SIGNUP VERIFICATION - User already has complete profile
    if (emailSignup === "true") {
      console.log("📧 Email signup verification - user verified their email")

      if (existingUser && existingUser.phone_number && existingUser.region) {
        console.log("✅ Email signup user has complete profile - redirecting to login with success message")

        // Sign out the user so they need to login with credentials
        await supabase.auth.signOut()

        const redirectUrl = new URL("/auth/login", requestUrl.origin)
        redirectUrl.searchParams.set("message", "verified")
        return NextResponse.redirect(redirectUrl)
      } else {
        console.log("⚠️ Email signup user missing profile data - redirecting to login")

        // Sign out the user so they need to login with credentials
        await supabase.auth.signOut()

        const redirectUrl = new URL("/auth/login", requestUrl.origin)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // GOOGLE OAUTH FLOW - New or existing Google user
    if (sessionData.user.app_metadata?.provider === "google") {
      console.log("🔍 Google OAuth flow detected")

      // NEW GOOGLE USER - Create basic profile and redirect to complete profile
      if (fetchError && fetchError.code === "PGRST116") {
        console.log("👤 New Google user - creating basic profile")

        const fullName =
          sessionData.user.user_metadata?.full_name ||
          sessionData.user.user_metadata?.name ||
          sessionData.user.user_metadata?.display_name ||
          ""
        const email = sessionData.user.email || ""

        const { error: insertError } = await supabase.from("users").insert({
          id: sessionData.user.id,
          full_name: fullName,
          email: email,
          phone_number: "", // Empty - needs to be completed
          region: "", // Empty - needs to be completed
          role: "user",
        })

        if (insertError) {
          console.error("❌ Error creating Google user profile:", insertError)
        }

        // Redirect to complete profile for Google users
        const redirectUrl = new URL("/auth/complete-profile", requestUrl.origin)
        console.log("🔄 Redirecting new Google user to complete profile")
        return NextResponse.redirect(redirectUrl)
      }

      // EXISTING GOOGLE USER - Check profile completion
      if (existingUser) {
        console.log("👤 Existing Google user found:", {
          email: existingUser.email,
          hasPhone: !!existingUser.phone_number,
          hasRegion: !!existingUser.region,
        })

        // Check if profile needs completion
        if (!existingUser.phone_number || !existingUser.region) {
          console.log("⚠️ Google user profile incomplete - redirecting to complete profile")
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
        console.log("✅ Redirecting Google user with complete profile to:", finalRedirect)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // DIRECT EMAIL/PASSWORD LOGIN (not through verification)
    // This shouldn't happen in normal flow, but handle as fallback
    if (existingUser && existingUser.phone_number && existingUser.region) {
      console.log("✅ Direct login user with complete profile")
      let finalRedirect = "/dashboard"
      if (returnUrl && returnUrl.includes("rukman.com.np")) {
        finalRedirect = "/dashboard?welcome=true"
      }
      const redirectUrl = new URL(finalRedirect, requestUrl.origin)
      return NextResponse.redirect(redirectUrl)
    }

    // Fallback - redirect to login
    console.log("⚠️ Fallback redirect to login")
    const redirectUrl = new URL("/auth/login", requestUrl.origin)
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("💥 Unexpected error in auth callback:", error)
    const redirectUrl = new URL("/auth/login", requestUrl.origin)
    redirectUrl.searchParams.set("error", "unexpected_error")
    return NextResponse.redirect(redirectUrl)
  }
}
