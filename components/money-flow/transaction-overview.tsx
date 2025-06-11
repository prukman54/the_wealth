"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import type { Transaction } from "@/components/money-flow/money-flow-dashboard"
import { formatCurrency } from "@/lib/currency-utils"

interface TransactionOverviewProps {
  incomeTransactions: Transaction[]
  expenseTransactions: Transaction[]
  currency: string
  isLoading: boolean
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
]

export function TransactionOverview({
  incomeTransactions,
  expenseTransactions,
  currency,
  isLoading,
}: TransactionOverviewProps) {
  // Calculate category breakdowns
  const expensesByCategory = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {}

    expenseTransactions.forEach((transaction) => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount
    })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage:
          expenseTransactions.length > 0
            ? ((amount / expenseTransactions.reduce((sum, t) => sum + t.amount, 0)) * 100).toFixed(1)
            : "0",
      }))
      .sort((a, b) => b.value - a.value)
  }, [expenseTransactions])

  const incomeByCategory = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {}

    incomeTransactions.forEach((transaction) => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount
    })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage:
          incomeTransactions.length > 0
            ? ((amount / incomeTransactions.reduce((sum, t) => sum + t.amount, 0)) * 100).toFixed(1)
            : "0",
      }))
      .sort((a, b) => b.value - a.value)
  }, [incomeTransactions])

  // Monthly trend data
  const monthlyData = useMemo(() => {
    const monthlyTotals: { [key: string]: { income: number; expenses: number } } = {}

    // Process income
    incomeTransactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { income: 0, expenses: 0 }
      }
      monthlyTotals[month].income += transaction.amount
    })

    // Process expenses
    expenseTransactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { income: 0, expenses: 0 }
      }
      monthlyTotals[month].expenses += transaction.amount
    })

    return Object.entries(monthlyTotals)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        savings: data.income - data.expenses,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6) // Last 6 months
  }, [incomeTransactions, expenseTransactions])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading overview...</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading charts...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Monthly Trend Chart */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Income vs Expenses over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, currency)}
                  labelStyle={{ color: "var(--foreground)" }}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {expensesByCategory.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(category.value, currency)}</div>
                        <div className="text-muted-foreground">{category.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No expense data to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>Where your money comes from</CardDescription>
          </CardHeader>
          <CardContent>
            {incomeByCategory.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {incomeByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {incomeByCategory.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(category.value, currency)}</div>
                        <div className="text-muted-foreground">{category.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No income data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
