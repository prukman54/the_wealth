import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const transactions = [
  {
    name: "Grocery Shopping",
    email: "Food & Dining",
    amount: "-$89.50",
  },
  {
    name: "Salary Deposit",
    email: "Income",
    amount: "+$3,200.00",
  },
  {
    name: "Netflix Subscription",
    email: "Entertainment",
    amount: "-$15.99",
  },
  {
    name: "Gas Station",
    email: "Transportation",
    amount: "-$45.20",
  },
  {
    name: "Freelance Payment",
    email: "Income",
    amount: "+$850.00",
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{transaction.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.email}</p>
          </div>
          <div
            className={`ml-auto font-medium ${transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}
          >
            {transaction.amount}
          </div>
        </div>
      ))}
    </div>
  )
}
