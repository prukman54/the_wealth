"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export async function createUserProfile(userData: {
  fullName: string
  phoneNumber: string
  email: string
  region: string
}) {
  try {
    console.log("🔐 Creating user profile with server action:", userData)

    const supabase = createServerActionClient<Database>({ cookies })

    // Get the authenticated user
    const { data: authData } = await supabase.auth.getUser()

    if (!authData.user) {
      console.error("❌ No authenticated user found")
      return { success: false, error: "No authenticated user found" }
    }

    console.log("✅ User authenticated:", authData.user.id)

    // Create the user profile
    const { error } = await supabase.from("users").insert({
      id: authData.user.id,
      full_name: userData.fullName,
      phone_number: userData.phoneNumber,
      email: userData.email,
      region: userData.region,
      role: "user",
    })

    if (error) {
      console.error("❌ Error creating profile:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Profile created successfully")
    return { success: true }
  } catch (error: any) {
    console.error("❌ Unexpected error:", error)
    return { success: false, error: error.message }
  }
}
