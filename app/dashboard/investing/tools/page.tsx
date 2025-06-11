import { getSession, getUserDetails } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { InvestingToolsTabs } from "@/components/investing-tools/investing-tools-tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function InvestingToolsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const user = await getUserDetails()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Investing Tools"
        text="Interactive calculators to help you make smarter investment decisions"
      />

      <InvestingToolsTabs user={user} />

      <div className="flex justify-center mt-8">
        <Link href="/dashboard/investing">
          <Button variant="outline">Back to Investing Dashboard</Button>
        </Link>
      </div>
    </DashboardShell>
  )
}
