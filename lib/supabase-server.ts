import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  // Check if environment variables are available
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url === "https://placeholder.supabase.co" || key === "placeholder-key") {
    console.warn("Supabase environment variables not configured properly")
    // Return a mock client for build-time
    return null as any
  }

  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
}

export async function getSession() {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return null

    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getUserDetails() {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return null

    const { data: userDetails } = await supabase.from("users").select("*").single()
    return userDetails
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getUser() {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return null

    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}
