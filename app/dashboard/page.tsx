import { getSession, getUserDetails } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { PersonalizedDashboard } from "@/components/personalized-dashboard"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { welcome?: string; new?: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const user = await getUserDetails()
  const showWelcome = searchParams.welcome === "true"
  const isNewUser = searchParams.new === "true"

  // Get a random wealth quote
  const supabase = await createServerSupabaseClient()
  const { data: quotes } = await supabase.from("wealth_quotes").select("*").eq("active", true)

  // Select a random quote
  const randomQuote = quotes && quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : null

  return <PersonalizedDashboard user={user} quote={randomQuote} showWelcome={showWelcome} isNewUser={isNewUser} />
}
