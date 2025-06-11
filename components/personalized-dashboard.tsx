"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WelcomeBanner } from "@/components/welcome-banner"
import { ProfileSection } from "@/components/profile-section"
import { WealthQuoteCard } from "@/components/wealth-quote-card"
import { DashboardShell } from "@/components/dashboard-shell"
import { getCurrencySymbol } from "@/lib/currency-utils"
import { TrendingUp, PiggyBank, ArrowRight, DollarSign, Target } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"

interface PersonalizedDashboardProps {
  user: {
    id: string
    full_name: string
    email: string
    phone_number: string
    region: string
    role: string
  } | null
  quote: {
    id: string
    quote: string
    author: string
  } | null
  showWelcome: boolean
  isNewUser: boolean
}

export function PersonalizedDashboard({ user, quote, showWelcome, isNewUser }: PersonalizedDashboardProps) {
  const [currentTime, setCurrentTime] = useState("")
  const [greeting, setGreeting] = useState("")
  const [currentQuote, setCurrentQuote] = useState(quote)
  const [isRotatingQuote, setIsRotatingQuote] = useState(false)

  // Auto-rotate quotes every 30 seconds
  useEffect(() => {
    if (!currentQuote) return

    const rotateQuote = async () => {
      try {
        setIsRotatingQuote(true)
        const { data: quotes } = await supabase
          .from("wealth_quotes")
          .select("*")
          .eq("active", true)
          .neq("id", currentQuote.id)

        if (quotes && quotes.length > 0) {
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
          setCurrentQuote(randomQuote)
        }
      } catch (error) {
        console.error("Error rotating quote:", error)
      } finally {
        setIsRotatingQuote(false)
      }
    }

    const interval = setInterval(rotateQuote, 30000) // 30 seconds
    return () => clearInterval(interval)
  }, [currentQuote, supabase])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()

      // Set greeting based on time
      if (hour < 12) {
        setGreeting("Good morning")
      } else if (hour < 17) {
        setGreeting("Good afternoon")
      } else {
        setGreeting("Good evening")
      }

      // Set current time
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const firstName = user?.full_name?.split(" ")[0] || "there"
  const currencySymbol = getCurrencySymbol(user?.region || "np")
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(user?.region, {
      style: "currency",
      currency: getCurrencySymbol(user?.region || "np"),
    }).format(amount)
  }

  return (
    <DashboardShell>
      {showWelcome && <WelcomeBanner isNewUser={isNewUser} userName={user?.full_name} />}

      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground">{currentTime}</p>
        <p className="text-lg">Ready to take control of your financial future?</p>
      </div>

      {/* Quote Section */}
      {currentQuote && <WealthQuoteCard quote={currentQuote} />}

      {/* Main Action Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
          <Link href="/dashboard/money-flow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Money Flow</CardTitle>
                    <CardDescription>Track your income and expenses</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="text-sm font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+{formatCurrency(0)}</div>
                    <div className="text-xs text-muted-foreground">Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">-{formatCurrency(0)}</div>
                    <div className="text-xs text-muted-foreground">Expenses</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Start tracking your money to see where it goes and how to save more.
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
          <Link href="/dashboard/investing">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <PiggyBank className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Investing Tools</CardTitle>
                    <CardDescription>Grow your wealth through smart investing</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Portfolio Value</span>
                  <span className="text-sm font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-xs text-muted-foreground">Investments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">0%</div>
                    <div className="text-xs text-muted-foreground">Returns</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn about investing and start building your investment portfolio.
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(0)}</div>
            <p className="text-xs text-muted-foreground">Your total assets minus debts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Percentage of income saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Getting Started</div>
            <p className="text-xs text-muted-foreground">Begin tracking to see your score</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Section */}
      <ProfileSection user={user} />
    </DashboardShell>
  )
}
