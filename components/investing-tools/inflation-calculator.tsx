"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { InfoIcon, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { calculateInflationImpact } from "@/lib/investment-calculations"
import { formatCurrency } from "@/lib/currency-utils"

interface InflationCalculatorProps {
  user?: {
    id: string
    full_name: string
    email: string
    phone_number: string
    region: string
    role: string
  }
}

export function InflationCalculator({ user }: InflationCalculatorProps) {
  // Initial values
  const [currentAmount, setCurrentAmount] = useState(10000)
  const [returnRate, setReturnRate] = useState(7)
  const [inflationRate, setInflationRate] = useState(3)
  const [years, setYears] = useState(20)

  // Results
  const [realReturnRate, setRealReturnRate] = useState(0)
  const [nominalFutureValue, setNominalFutureValue] = useState(0)
  const [realFutureValue, setRealFutureValue] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])

  // Calculate results when inputs change
  useEffect(() => {
    const result = calculateInflationImpact(currentAmount, returnRate, inflationRate, years)

    setRealReturnRate(result.realReturnRate)
    setNominalFutureValue(result.nominalFutureValue)
    setRealFutureValue(result.realFutureValue)
    setChartData(result.yearlyData)
  }, [currentAmount, returnRate, inflationRate, years])

  const userRegion = user?.region || "US"

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="currentAmount">Current Amount</Label>
              <span className="text-sm text-muted-foreground">{formatCurrency(currentAmount, userRegion)}</span>
            </div>
            <Input
              id="currentAmount"
              type="number"
              min="1"
              step="100"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(Number(e.target.value))}
              aria-describedby="currentAmount-help"
            />
            <p id="currentAmount-help" className="text-xs text-muted-foreground">
              Enter your initial investment amount
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="returnRate">Investment Return Rate (%)</Label>
              <span className="text-sm text-muted-foreground">{returnRate}%</span>
            </div>
            <Slider
              id="returnRate"
              min={0}
              max={15}
              step={0.1}
              value={[returnRate]}
              onValueChange={(value) => setReturnRate(value[0])}
              aria-describedby="returnRate-help"
            />
            <p id="returnRate-help" className="text-xs text-muted-foreground">
              Expected annual return on your investment
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
              <span className="text-sm text-muted-foreground">{inflationRate}%</span>
            </div>
            <Slider
              id="inflationRate"
              min={0}
              max={10}
              step={0.1}
              value={[inflationRate]}
              onValueChange={(value) => setInflationRate(value[0])}
              aria-describedby="inflationRate-help"
            />
            <p id="inflationRate-help" className="text-xs text-muted-foreground">
              Expected annual inflation rate
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="years">Time Period (Years)</Label>
              <span className="text-sm text-muted-foreground">{years} years</span>
            </div>
            <Slider
              id="years"
              min={1}
              max={40}
              step={1}
              value={[years]}
              onValueChange={(value) => setYears(value[0])}
              aria-describedby="years-help"
            />
            <p id="years-help" className="text-xs text-muted-foreground">
              Investment time horizon
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Real Return Rate</h4>
                  <p className="text-2xl font-bold text-primary">{realReturnRate.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground">After inflation</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Nominal Future Value</h4>
                  <p className="text-2xl font-bold">{formatCurrency(nominalFutureValue, userRegion)}</p>
                  <p className="text-xs text-muted-foreground">Before inflation</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Real Future Value</h4>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(realFutureValue, userRegion)}</p>
                  <p className="text-xs text-muted-foreground">After inflation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Years", position: "insideBottomRight", offset: -10 }} />
                <YAxis
                  tickFormatter={(value) => `${formatCurrency(value, userRegion, true)}`}
                  label={{ value: "Value", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value, userRegion), ""]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="nominalValue"
                  name="Nominal Value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="realValue"
                  name="Real Value"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Years", position: "insideBottomRight", offset: -10 }} />
                <YAxis
                  domain={[0, 100]}
                  label={{ value: "Purchasing Power (%)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Purchasing Power"]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="purchasingPower"
                  name="Purchasing Power"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg space-y-4">
            <div className="flex items-start space-x-3">
              <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-200">Understanding Inflation's Impact</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Inflation erodes the purchasing power of money over time. A dollar today will buy less in the future
                  due to rising prices. This calculator shows how inflation affects your investment returns in real
                  terms.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <InfoIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-200">Key Insights</h3>
                <ul className="text-sm text-amber-700 dark:text-amber-300 mt-1 space-y-1">
                  <li>• Real return = Nominal return - Inflation rate</li>
                  <li>• Higher inflation reduces your purchasing power</li>
                  <li>• Investments should beat inflation to grow wealth</li>
                  <li>• Consider inflation-protected securities (TIPS)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <InfoIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-200">Historical Context</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Historical average inflation rates: US ~3%, Europe ~2%, Emerging markets ~4-6%. Your investments need
                  to exceed these rates to maintain purchasing power.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
