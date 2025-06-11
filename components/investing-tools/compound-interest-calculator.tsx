"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, LightbulbIcon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { calculateCompoundInterest } from "@/lib/investment-calculations"
import { formatCurrency } from "@/lib/currency-utils"

interface CompoundInterestCalculatorProps {
  user: {
    id: string
    full_name: string
    email: string
    phone_number: string
    region: string
    role: string
  }
}

export function CompoundInterestCalculator({ user }: CompoundInterestCalculatorProps) {
  // Initial values
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [annualRate, setAnnualRate] = useState(7)
  const [years, setYears] = useState(20)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [compoundFrequency, setCompoundFrequency] = useState<"yearly" | "quarterly" | "monthly" | "daily">("monthly")

  // Results
  const [futureValue, setFutureValue] = useState(0)
  const [interestEarned, setInterestEarned] = useState(0)
  const [totalContributions, setTotalContributions] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])

  // Calculate results when inputs change
  useEffect(() => {
    const result = calculateCompoundInterest(
      initialInvestment,
      annualRate,
      years,
      monthlyContribution,
      compoundFrequency,
    )

    setFutureValue(result.futureValue)
    setInterestEarned(result.interestEarned)
    setTotalContributions(result.totalContributions)
    setChartData(result.yearlyData)
  }, [initialInvestment, annualRate, years, monthlyContribution, compoundFrequency])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="initialInvestment">Initial Investment</Label>
              <span className="text-sm text-muted-foreground">{formatCurrency(initialInvestment, user.region)}</span>
            </div>
            <Input
              id="initialInvestment"
              type="number"
              min="0"
              step="100"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="annualRate">Annual Interest Rate (%)</Label>
              <span className="text-sm text-muted-foreground">{annualRate}%</span>
            </div>
            <Slider
              id="annualRate"
              min={0}
              max={20}
              step={0.1}
              value={[annualRate]}
              onValueChange={(value) => setAnnualRate(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="years">Investment Duration (Years)</Label>
              <span className="text-sm text-muted-foreground">{years} years</span>
            </div>
            <Slider
              id="years"
              min={1}
              max={40}
              step={1}
              value={[years]}
              onValueChange={(value) => setYears(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
              <span className="text-sm text-muted-foreground">{formatCurrency(monthlyContribution, user.region)}</span>
            </div>
            <Input
              id="monthlyContribution"
              type="number"
              min="0"
              step="50"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="compoundFrequency">Compound Frequency</Label>
            <Select value={compoundFrequency} onValueChange={(value) => setCompoundFrequency(value as any)}>
              <SelectTrigger id="compoundFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Future Value</h4>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(futureValue, user.region)}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Interest Earned</h4>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(interestEarned, user.region)}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Total Contributions</h4>
                  <p className="text-2xl font-bold">{formatCurrency(totalContributions, user.region)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Years", position: "insideBottomRight", offset: -10 }} />
                <YAxis
                  tickFormatter={(value) => `${formatCurrency(value, user.region, true)}`}
                  label={{ value: "Value", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value, user.region), ""]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Total Balance"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="principal"
                  name="Principal"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basics">Compound Interest Basics</TabsTrigger>
          <TabsTrigger value="formula">The Formula</TabsTrigger>
          <TabsTrigger value="tips">Investment Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="basics" className="p-4 border rounded-md mt-2">
          <div className="flex items-start space-x-4">
            <LightbulbIcon className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">What is Compound Interest?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Compound interest is the interest on a loan or deposit calculated based on both the initial principal
                and the accumulated interest from previous periods. It's essentially "interest on interest" and is the
                reason why investing early is so powerful.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                The more frequently interest is compounded (daily vs. monthly vs. yearly), the more your money will grow
                over time. This is why Albert Einstein allegedly called compound interest "the eighth wonder of the
                world."
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="formula" className="p-4 border rounded-md mt-2">
          <div className="flex items-start space-x-4">
            <InfoIcon className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">The Compound Interest Formula</h3>
              <p className="text-sm text-muted-foreground mt-1">For a single initial investment, the formula is:</p>
              <div className="bg-muted p-2 rounded-md my-2 text-center">
                <p className="font-mono">A = P(1 + r/n)^(nt)</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Where:
                <br />A = Final amount
                <br />P = Principal (initial investment)
                <br />r = Annual interest rate (decimal)
                <br />n = Number of times compounded per year
                <br />t = Time in years
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                With regular contributions, the calculation becomes more complex, as each contribution compounds for a
                different length of time.
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tips" className="p-4 border rounded-md mt-2">
          <div className="flex items-start space-x-4">
            <LightbulbIcon className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Investment Tips</h3>
              <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5 space-y-1">
                <li>Start early: Even small amounts can grow significantly over time</li>
                <li>Be consistent: Regular contributions often matter more than the initial investment</li>
                <li>Reinvest dividends: This accelerates the compounding effect</li>
                <li>Consider tax-advantaged accounts: They can protect your gains from taxes</li>
                <li>Be patient: Compound interest works best over long time periods</li>
                <li>Increase contributions over time: As your income grows, try to invest more</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          This calculator provides estimates based on constant returns. Actual investment returns will vary and may be
          higher or lower than historical averages. Past performance is not indicative of future results.
        </AlertDescription>
      </Alert>
    </div>
  )
}
