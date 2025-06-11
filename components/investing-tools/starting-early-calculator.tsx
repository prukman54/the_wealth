"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, TrendingUp, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { calculateStartingEarly } from "@/lib/investment-calculations"
import { formatCurrency } from "@/lib/currency-utils"

interface StartingEarlyCalculatorProps {
  user: {
    id: string
    full_name: string
    email: string
    phone_number: string
    region: string
    role: string
  }
}

export function StartingEarlyCalculator({ user }: StartingEarlyCalculatorProps) {
  // Initial values
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualRate, setAnnualRate] = useState(7)
  const [earlyStartAge, setEarlyStartAge] = useState(25)
  const [earlyStopAge, setEarlyStopAge] = useState(35)
  const [lateStartAge, setLateStartAge] = useState(35)
  const [endAge, setEndAge] = useState(65)

  // Results
  const [earlyInvestorBalance, setEarlyInvestorBalance] = useState(0)
  const [lateInvestorBalance, setLateInvestorBalance] = useState(0)
  const [earlyInvestorContributions, setEarlyInvestorContributions] = useState(0)
  const [lateInvestorContributions, setLateInvestorContributions] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])
  const [comparisonData, setComparisonData] = useState<any[]>([])

  // Calculate results when inputs change
  useEffect(() => {
    // Validate inputs
    if (earlyStartAge >= earlyStopAge || earlyStopAge > endAge || lateStartAge > endAge) {
      return
    }

    const result = calculateStartingEarly(
      monthlyContribution,
      annualRate,
      earlyStartAge,
      earlyStopAge,
      lateStartAge,
      endAge,
    )

    setEarlyInvestorBalance(result.earlyInvestor.finalBalance)
    setLateInvestorBalance(result.lateInvestor.finalBalance)
    setEarlyInvestorContributions(result.earlyInvestor.totalContributions)
    setLateInvestorContributions(result.lateInvestor.totalContributions)

    // Prepare chart data
    const chartData = []
    const maxAge = Math.max(
      ...result.earlyInvestor.yearlyData.map((d) => d.age),
      ...result.lateInvestor.yearlyData.map((d) => d.age),
    )

    for (let age = Math.min(earlyStartAge, lateStartAge); age <= maxAge; age++) {
      const earlyData = result.earlyInvestor.yearlyData.find((d) => d.age === age)
      const lateData = result.lateInvestor.yearlyData.find((d) => d.age === age)

      chartData.push({
        age,
        early: earlyData ? earlyData.balance : 0,
        late: lateData ? lateData.balance : 0,
      })
    }

    setChartData(chartData)

    // Prepare comparison data
    setComparisonData([
      {
        name: "Early Investor",
        contributions: result.earlyInvestor.totalContributions,
        growth: result.earlyInvestor.totalGrowth,
        total: result.earlyInvestor.finalBalance,
      },
      {
        name: "Late Investor",
        contributions: result.lateInvestor.totalContributions,
        growth: result.lateInvestor.totalGrowth,
        total: result.lateInvestor.finalBalance,
      },
    ])
  }, [monthlyContribution, annualRate, earlyStartAge, earlyStopAge, lateStartAge, endAge])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
              <span className="text-sm text-muted-foreground">{formatCurrency(monthlyContribution, user.region)}</span>
            </div>
            <Input
              id="monthlyContribution"
              type="number"
              min="1"
              step="50"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="annualRate">Annual Return Rate (%)</Label>
              <span className="text-sm text-muted-foreground">{annualRate}%</span>
            </div>
            <Slider
              id="annualRate"
              min={1}
              max={12}
              step={0.1}
              value={[annualRate]}
              onValueChange={(value) => setAnnualRate(value[0])}
            />
          </div>

          <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-950">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" /> Early Investor (Starts young, stops early)
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="earlyStartAge" className="text-blue-700 dark:text-blue-300">
                    Start Age
                  </Label>
                  <span className="text-sm text-blue-600 dark:text-blue-400">{earlyStartAge}</span>
                </div>
                <Slider
                  id="earlyStartAge"
                  min={20}
                  max={40}
                  step={1}
                  value={[earlyStartAge]}
                  onValueChange={(value) => setEarlyStartAge(value[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="earlyStopAge" className="text-blue-700 dark:text-blue-300">
                    Stop Age
                  </Label>
                  <span className="text-sm text-blue-600 dark:text-blue-400">{earlyStopAge}</span>
                </div>
                <Slider
                  id="earlyStopAge"
                  min={25}
                  max={45}
                  step={1}
                  value={[earlyStopAge]}
                  onValueChange={(value) => setEarlyStopAge(value[0])}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-950">
            <h3 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4" /> Late Investor (Starts later, never stops)
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="lateStartAge" className="text-amber-700 dark:text-amber-300">
                    Start Age
                  </Label>
                  <span className="text-sm text-amber-600 dark:text-amber-400">{lateStartAge}</span>
                </div>
                <Slider
                  id="lateStartAge"
                  min={30}
                  max={50}
                  step={1}
                  value={[lateStartAge]}
                  onValueChange={(value) => setLateStartAge(value[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="endAge" className="text-amber-700 dark:text-amber-300">
                    End Age (Both)
                  </Label>
                  <span className="text-sm text-amber-600 dark:text-amber-400">{endAge}</span>
                </div>
                <Slider
                  id="endAge"
                  min={50}
                  max={80}
                  step={1}
                  value={[endAge]}
                  onValueChange={(value) => setEndAge(value[0])}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Early Investor</h4>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(earlyInvestorBalance, user.region)}
                  </p>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <p>Invests for {earlyStopAge - earlyStartAge} years</p>
                    <p>Total contributed: {formatCurrency(earlyInvestorContributions, user.region)}</p>
                  </div>
                </div>
                <div className="space-y-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-md">
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Late Investor</h4>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(lateInvestorBalance, user.region)}
                  </p>
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    <p>Invests for {endAge - lateStartAge} years</p>
                    <p>Total contributed: {formatCurrency(lateInvestorContributions, user.region)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-md">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Difference</h4>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(Math.abs(earlyInvestorBalance - lateInvestorBalance), user.region)}
                  {earlyInvestorBalance > lateInvestorBalance ? " more for early investor" : " more for late investor"}
                </p>
                <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                  <p>
                    {earlyInvestorContributions < lateInvestorContributions
                      ? `Early investor contributes ${formatCurrency(lateInvestorContributions - earlyInvestorContributions, user.region)} less`
                      : `Early investor contributes ${formatCurrency(earlyInvestorContributions - lateInvestorContributions, user.region)} more`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${formatCurrency(value, user.region, true)}`} />
                <Tooltip formatter={(value: number) => [formatCurrency(value, user.region), ""]} />
                <Legend />
                <Bar dataKey="contributions" name="Contributions" stackId="a" fill="#82ca9d" />
                <Bar dataKey="growth" name="Growth" stackId="a" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" label={{ value: "Age", position: "insideBottomRight", offset: -10 }} />
            <YAxis
              tickFormatter={(value) => `${formatCurrency(value, user.region, true)}`}
              label={{ value: "Balance", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value, user.region), ""]}
              labelFormatter={(label) => `Age ${label}`}
            />
            <Legend />
            <Bar dataKey="early" name="Early Investor" fill="#3b82f6" />
            <Bar dataKey="late" name="Late Investor" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <InfoIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-200">The Power of Starting Early</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-300">
          <p className="mb-2">
            This calculator demonstrates the power of compound interest over time. Even if you can only invest for a
            short period when you're young, those early investments can grow substantially over decades.
          </p>
          <p>
            The key takeaway: <strong>Time in the market is often more important than timing the market</strong>.
            Starting early, even with smaller amounts, can lead to significantly better outcomes than waiting to invest
            larger amounts later.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
