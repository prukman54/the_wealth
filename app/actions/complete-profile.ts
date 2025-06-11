"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

interface CompleteProfileData {
  phoneNumber: string
  region: string
}

export async function completeProfile(data: CompleteProfileData) {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("❌ User not found:", userError)
      return { error: "User not authenticated" }
    }

    console.log("📝 Completing profile for user:", user.email)

    // Get user's name from metadata
    const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User"

    // Update or insert user profile
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .upsert({
        id: user.id,
        email: user.email,
        name: userName,
        phone_number: data.phoneNumber,
        region: data.region,
        role: "user",
        profile_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (profileError) {
      console.error("❌ Profile update error:", profileError)
      return { error: "Failed to update profile: " + profileError.message }
    }

    console.log("✅ Profile completed successfully:", profileData)
    return { success: true, data: profileData }
  } catch (error: any) {
    console.error("❌ Complete profile server action error:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}
