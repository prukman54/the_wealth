"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Info, TrendingUp, Shield, DollarSign, Home, Coins } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface AssetAllocation {
  stocks: number
  bonds: number
  cash: number
  crypto: number
  realEstate: number
}

interface AssetInfo {
  name: string
  description: string
  riskLevel: "Low" | "Medium" | "High" | "Very High"
  expectedReturn: string
  icon: React.ReactNode
  color: string
}

const assetInfo: Record<keyof AssetAllocation, AssetInfo> = {
  stocks: {
    name: "Stocks",
    description: "Shares of publicly traded companies. Higher potential returns but more volatile.",
    riskLevel: "High",
    expectedReturn: "8-12%",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "#3b82f6",
  },
  bonds: {
    name: "Bonds",
    description: "Government and corporate debt securities. Lower risk, steady income.",
    riskLevel: "Low",
    expectedReturn: "3-6%",
    icon: <Shield className="h-4 w-4" />,
    color: "#10b981",
  },
  cash: {
    name: "Cash",
    description: "Savings accounts, CDs, money market funds. Very safe but low returns.",
    riskLevel: "Low",
    expectedReturn: "1-3%",
    icon: <DollarSign className="h-4 w-4" />,
    color: "#f59e0b",
  },
  crypto: {
    name: "Cryptocurrency",
    description: "Digital currencies like Bitcoin. Very high risk and volatility.",
    riskLevel: "Very High",
    expectedReturn: "10-30%",
    icon: <Coins className="h-4 w-4" />,
    color: "#8b5cf6",
  },
  realEstate: {
    name: "Real Estate",
    description: "Property investments, REITs. Moderate risk with inflation protection.",
    riskLevel: "Medium",
    expectedReturn: "6-10%",
    icon: <Home className="h-4 w-4" />,
    color: "#ef4444",
  },
}

const riskProfiles = {
  conservative: { name: "Conservative", description: "Low risk, steady growth", color: "bg-green-100 text-green-800" },
  moderate: { name: "Moderate", description: "Balanced risk and return", color: "bg-yellow-100 text-yellow-800" },
  aggressive: { name: "Aggressive", description: "High risk, high potential return", color: "bg-red-100 text-red-800" },
  speculative: {
    name: "Speculative",
    description: "Very high risk, maximum growth potential",
    color: "bg-purple-100 text-purple-800",
  },
}

export function AssetAllocationTool() {
  const [allocation, setAllocation] = useState<AssetAllocation>({
    stocks: 60,
    bonds: 30,
    cash: 5,
    crypto: 0,
    realEstate: 5,
  })

  const [showEducation, setShowEducation] = useState(false)

  // Ensure total always equals 100%
  const updateAllocation = (asset: keyof AssetAllocation, value: number) => {
    const newAllocation = { ...allocation, [asset]: value }
    const total = Object.values(newAllocation).reduce((sum, val) => sum + val, 0)

    if (total !== 100) {
      // Distribute the difference proportionally among other assets
      const difference = 100 - total
      const otherAssets = Object.keys(newAllocation).filter((key) => key !== asset) as (keyof AssetAllocation)[]
      const otherTotal = otherAssets.reduce((sum, key) => sum + newAllocation[key], 0)

      if (otherTotal > 0) {
        otherAssets.forEach((key) => {
          const proportion = newAllocation[key] / otherTotal
          newAllocation[key] = Math.max(0, Math.round(newAllocation[key] + difference * proportion))
        })
      }
    }

    setAllocation(newAllocation)
  }

  const getRiskProfile = () => {
    const riskScore =
      allocation.stocks * 0.8 +
      allocation.crypto * 1.0 +
      allocation.realEstate * 0.6 +
      allocation.bonds * 0.2 +
      allocation.cash * 0.1

    if (riskScore >= 70) return riskProfiles.speculative
    if (riskScore >= 50) return riskProfiles.aggressive
    if (riskScore >= 30) return riskProfiles.moderate
    return riskProfiles.conservative
  }

  const getExpectedReturn = () => {
    const weightedReturn =
      (allocation.stocks * 10 +
        allocation.bonds * 4.5 +
        allocation.cash * 2 +
        allocation.crypto * 20 +
        allocation.realEstate * 8) /
      100

    return weightedReturn.toFixed(1)
  }

  const chartData = Object.entries(allocation)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: assetInfo[key as keyof AssetAllocation].name,
      value,
      color: assetInfo[key as keyof AssetAllocation].color,
    }))

  const resetToConservative = () => {
    setAllocation({ stocks: 30, bonds: 50, cash: 15, crypto: 0, realEstate: 5 })
  }

  const resetToModerate = () => {
    setAllocation({ stocks: 60, bonds: 30, cash: 5, crypto: 0, realEstate: 5 })
  }

  const resetToAggressive = () => {
    setAllocation({ stocks: 80, bonds: 10, cash: 5, crypto: 0, realEstate: 5 })
  }

  const currentProfile = getRiskProfile()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Asset Allocation Tool</h2>
        <p className="text-muted-foreground">Create your ideal investment portfolio by adjusting asset allocations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Allocation Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Adjust the sliders to set your desired asset allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(allocation).map(([asset, value]) => {
              const info = assetInfo[asset as keyof AssetAllocation]
              return (
                <div key={asset} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {info.icon}
                      <Label className="font-medium">{info.name}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          info.riskLevel === "Low"
                            ? "border-green-500 text-green-700"
                            : info.riskLevel === "Medium"
                              ? "border-yellow-500 text-yellow-700"
                              : info.riskLevel === "High"
                                ? "border-orange-500 text-orange-700"
                                : "border-red-500 text-red-700"
                        }
                      >
                        {info.riskLevel}
                      </Badge>
                      <span className="font-mono text-sm w-8 text-right">{value}%</span>
                    </div>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => updateAllocation(asset as keyof AssetAllocation, newValue[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </div>
              )
            })}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total Allocation:</span>
                <span className="font-mono text-lg">
                  {Object.values(allocation).reduce((sum, val) => sum + val, 0)}%
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={resetToConservative}>
                  Conservative
                </Button>
                <Button variant="outline" size="sm" onClick={resetToModerate}>
                  Moderate
                </Button>
                <Button variant="outline" size="sm" onClick={resetToAggressive}>
                  Aggressive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Visualization</CardTitle>
            <CardDescription>Visual representation of your asset allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Risk Profile:</span>
                <Badge className={currentProfile.color}>{currentProfile.name}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Expected Annual Return:</span>
                <span className="font-mono text-lg font-bold text-green-600">{getExpectedReturn()}%</span>
              </div>

              <p className="text-sm text-muted-foreground">{currentProfile.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational Content */}
      <Card>
        <Collapsible open={showEducation} onOpenChange={setShowEducation}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  <CardTitle>Learn About Asset Allocation</CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  {showEducation ? "Hide" : "Show"} Details
                </Button>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">What is Asset Allocation?</h4>
                  <p className="text-sm text-muted-foreground">
                    Asset allocation is the strategy of dividing your investment portfolio among different asset
                    categories. It's one of the most important decisions you'll make as an investor because it has a
                    major impact on your investment returns and risk level.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Why Does It Matter?</h4>
                  <p className="text-sm text-muted-foreground">
                    Different asset classes perform differently over time and in various market conditions. By
                    diversifying across asset classes, you can potentially reduce risk while maintaining the opportunity
                    for returns.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Asset Class Details:</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(assetInfo).map(([key, info]) => (
                    <div key={key} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        {info.icon}
                        <span className="font-medium">{info.name}</span>
                        <Badge variant="outline" className="ml-auto">
                          {info.expectedReturn}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Younger investors can typically afford more risk (higher stock allocation)</li>
                  <li>• As you approach retirement, consider shifting to more conservative assets</li>
                  <li>• Rebalance your portfolio periodically to maintain your target allocation</li>
                  <li>• Consider your risk tolerance, time horizon, and financial goals</li>
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}
