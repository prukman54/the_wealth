import { getSession, getUserDetails } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Plus, BookOpen } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function InvestingPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const user = await getUserDetails()

  return (
    <DashboardShell>
      <DashboardHeader heading="Investing Tools" text="Build wealth through smart investing and compound growth" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-blue-800 dark:text-blue-200">Portfolio</CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">Your investments</CardDescription>
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Investment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-blue-700 dark:text-blue-300 mb-4">Start building your investment portfolio</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Track stocks, bonds, mutual funds, real estate, and other investments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-purple-800 dark:text-purple-200">Learn</CardTitle>
                  <CardDescription className="text-purple-700 dark:text-purple-300">
                    Investment education
                  </CardDescription>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                Start Learning
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-purple-700 dark:text-purple-300 mb-4">Learn the basics of investing</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Understand risk, diversification, compound interest, and investment strategies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Basics for Beginners</CardTitle>
          <CardDescription>Start your investment journey with these fundamental concepts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit mb-3 dark:bg-green-900">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-semibold mb-2">Start Small</h3>
              <p className="text-sm text-muted-foreground">
                You don't need a lot of money to start investing. Begin with what you can afford.
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="rounded-full bg-yellow-100 p-3 mx-auto w-fit mb-3 dark:bg-yellow-900">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Diversify</h3>
              <p className="text-sm text-muted-foreground">
                Don't put all your eggs in one basket. Spread your investments across different assets.
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="rounded-full bg-blue-100 p-3 mx-auto w-fit mb-3 dark:bg-blue-900">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="font-semibold mb-2">Time is Key</h3>
              <p className="text-sm text-muted-foreground">
                The earlier you start, the more time your money has to grow through compound interest.
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="rounded-full bg-purple-100 p-3 mx-auto w-fit mb-3 dark:bg-purple-900">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold mb-2">Keep Learning</h3>
              <p className="text-sm text-muted-foreground">
                Stay informed about markets, read about investing, and never stop learning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </DashboardShell>
  )
}
