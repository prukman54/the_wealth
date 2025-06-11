"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompoundInterestCalculator } from "./compound-interest-calculator"
import { RuleOf72Calculator } from "./rule-of-72-calculator"
import { StartingEarlyCalculator } from "./starting-early-calculator"
import { InflationCalculator } from "./inflation-calculator"
import { AssetAllocationTool } from "./asset-allocation-tool"

export function InvestingToolsTabs() {
  return (
    <Tabs defaultValue="compound" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="compound">Compound Interest</TabsTrigger>
        <TabsTrigger value="rule72">Rule of 72</TabsTrigger>
        <TabsTrigger value="early">Starting Early</TabsTrigger>
        <TabsTrigger value="inflation">Inflation Impact</TabsTrigger>
        <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
      </TabsList>

      <TabsContent value="compound" className="mt-6">
        <CompoundInterestCalculator />
      </TabsContent>

      <TabsContent value="rule72" className="mt-6">
        <RuleOf72Calculator />
      </TabsContent>

      <TabsContent value="early" className="mt-6">
        <StartingEarlyCalculator />
      </TabsContent>

      <TabsContent value="inflation" className="mt-6">
        <InflationCalculator />
      </TabsContent>

      <TabsContent value="allocation" className="mt-6">
        <AssetAllocationTool />
      </TabsContent>
    </Tabs>
  )
}
