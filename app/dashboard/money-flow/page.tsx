import { getSession, getUserDetails } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MoneyFlowDashboard } from "@/components/money-flow/money-flow-dashboard"

export const dynamic = "force-dynamic"

export default async function MoneyFlowPage() {
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
      <DashboardHeader heading="Money Flow" text="Track where your money comes from and where it goes" />
      <MoneyFlowDashboard user={user} />
      <div className="flex justify-center">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </DashboardShell>
  )
}
