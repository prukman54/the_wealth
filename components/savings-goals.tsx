import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const goals = [
  {
    name: "Emergency Fund",
    current: 8500,
    target: 10000,
    percentage: 85,
  },
  {
    name: "Vacation",
    current: 2300,
    target: 5000,
    percentage: 46,
  },
  {
    name: "New Car",
    current: 12000,
    target: 25000,
    percentage: 48,
  },
]

export function SavingsGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goals</CardTitle>
        <CardDescription>Track your progress towards your financial goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{goal.name}</p>
              <p className="text-sm text-muted-foreground">
                ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
              </p>
            </div>
            <Progress value={goal.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">{goal.percentage}% complete</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
