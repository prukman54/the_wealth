import { getSession, getUserDetails } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { AdminUsersTable } from "@/components/admin/users-table"
import { AdminQuoteManager } from "@/components/admin/quote-manager"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const user = await getUserDetails()

  // Check if user is admin
  if (user?.role !== "admin") {
    redirect("/dashboard")
  }

  // Get user count
  const supabase = await createServerSupabaseClient()
  const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

  // Get transaction counts
  const { count: incomeCount } = await supabase.from("income").select("*", { count: "exact", head: true })
  const { count: expenseCount } = await supabase.from("expenses").select("*", { count: "exact", head: true })

  // Get quote count
  const { count: quoteCount } = await supabase.from("wealth_quotes").select("*", { count: "exact", head: true })

  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Dashboard" text="Manage users and system settings" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incomeCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expense Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wealth Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quoteCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <AdminUsersTable />
        <AdminQuoteManager />
      </div>
    </DashboardShell>
  )
}
