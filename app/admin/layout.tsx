"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { UserNav } from "@/components/user-nav"
import { Loader2, Shield } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { supabase } = useSupabase()

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Get user profile and check if admin
        const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (!profile || profile.role !== "admin") {
          router.push("/dashboard")
          return
        }

        setUser({ ...user, ...profile })
      } catch (error) {
        console.error("Error fetching admin user:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Admin Logo */}
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">The Wealth - Admin Panel</h1>
            </div>

            {/* Admin User Nav with Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Admin Dashboard</div>
              <UserNav user={user} />
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
