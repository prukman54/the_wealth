"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, PiggyBank, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/currency-utils"

interface SummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  currency: string
  onAddIncome: () => void
  onAddExpense: () => void
}

export function SummaryCards({
  totalIncome,
  totalExpenses,
  totalSavings,
  currency,
  onAddIncome,
  onAddExpense,
}: SummaryCardsProps) {
  const savingsRate = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : "0"

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Total Income</CardTitle>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <Button size="sm" onClick={onAddIncome} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {formatCurrency(totalIncome, currency)}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">Money coming in</p>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Total Expenses</CardTitle>
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            <Button size="sm" onClick={onAddExpense} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-800 dark:text-red-200">
            {formatCurrency(totalExpenses, currency)}
          </div>
          <p className="text-xs text-red-600 dark:text-red-400">Money going out</p>
        </CardContent>
      </Card>

      <Card
        className={`${
          totalSavings >= 0
            ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
            : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className={`text-sm font-medium ${
              totalSavings >= 0 ? "text-blue-800 dark:text-blue-200" : "text-orange-800 dark:text-orange-200"
            }`}
          >
            Net Savings
          </CardTitle>
          <PiggyBank
            className={`h-4 w-4 ${
              totalSavings >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
            }`}
          />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              totalSavings >= 0 ? "text-blue-800 dark:text-blue-200" : "text-orange-800 dark:text-orange-200"
            }`}
          >
            {formatCurrency(totalSavings, currency)}
          </div>
          <p
            className={`text-xs ${
              totalSavings >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
            }`}
          >
            {totalSavings >= 0 ? `${savingsRate}% savings rate` : "Spending more than earning"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
