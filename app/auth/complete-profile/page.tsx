import { CompleteProfileForm } from "@/components/complete-profile-form"
import { getSession } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function CompleteProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">Please provide additional information to complete your account setup</p>
        </div>
        <CompleteProfileForm />
      </div>
    </div>
  )
}
