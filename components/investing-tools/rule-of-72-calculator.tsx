"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, LightbulbIcon } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { calculateRuleOf72 } from "@/lib/investment-calculations"
import { formatCurrency } from "@/lib/currency-utils"

interface RuleOf72CalculatorProps {
  user: {
    id: string
    full_name: string
    email: string
    phone_number: string
    region: string
    role: string
  }
}

export function RuleOf72Calculator({ user }: RuleOf72CalculatorProps) {
  // Initial values
  const [interestRate, setInterestRate] = useState(7)
  const [currentAmount, setCurrentAmount] = useState(10000)

  // Results
  const [yearsToDouble, setYearsToDouble] = useState(0)
  const [doubledAmount, setDoubledAmount] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])

  // Calculate results when inputs change
  useEffect(() => {
    const years = calculateRuleOf72(interestRate)
    setYearsToDouble(years)
    setDoubledAmount(currentAmount * 2)

    // Generate chart data
    const data = [
      { name: "Current", value: currentAmount },
      { name: `After ${years.toFixed(1)} years`, value: currentAmount * 2 },
    ]
    setChartData(data)
  }, [interestRate, currentAmount])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="currentAmount">Current Amount</Label>
              <span className="text-sm text-muted-foreground">{formatCurrency(currentAmount, user.region)}</span>
            </div>
            <Input
              id="currentAmount"
              type="number"
              min="1"
              step="100"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <span className="text-sm text-muted-foreground">{interestRate}%</span>
            </div>
            <Slider
              id="interestRate"
              min={0.1}
              max={20}
              step={0.1}
              value={[interestRate]}
              onValueChange={(value) => setInterestRate(value[0])}
            />
          </div>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Years to Double Your Money</h4>
                  <p className="text-4xl font-bold text-primary">{yearsToDouble.toFixed(1)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Current Amount</h4>
                    <p className="text-lg font-semibold">{formatCurrency(currentAmount, user.region)}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Doubled Amount</h4>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(doubledAmount, user.region)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${formatCurrency(value, user.region, true)}`} />
                <Tooltip formatter={(value: number) => [formatCurrency(value, user.region), "Amount"]} />
                <Bar dataKey="value" name="Amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-4">
            <div className="flex items-start space-x-3">
              <LightbulbIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200">What is the Rule of 72?</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  The Rule of 72 is a simple way to determine how long an investment will take to double given a fixed
                  annual rate of interest. Divide 72 by the annual rate of return to get the approximate number of years
                  it will take for the investment to double.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200">Examples</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 list-disc pl-5 space-y-1">
                  <li>At 6% interest, your money will double in approximately 12 years (72 ÷ 6 = 12)</li>
                  <li>At 8% interest, your money will double in approximately 9 years (72 ÷ 8 = 9)</li>
                  <li>At 12% interest, your money will double in approximately 6 years (72 ÷ 12 = 6)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Accuracy Note</AlertTitle>
        <AlertDescription>
          The Rule of 72 is a simplified approximation that works best for interest rates between 6% and 10%. For higher
          or lower rates, the Rule of 69.3 or the Rule of 70 may be more accurate. This calculator uses the standard
          Rule of 72.
        </AlertDescription>
      </Alert>
    </div>
  )
}
