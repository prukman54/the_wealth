"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionTable } from "@/components/money-flow/transaction-table"
import { TransactionOverview } from "@/components/money-flow/transaction-overview"
import type { Transaction } from "@/components/money-flow/money-flow-dashboard"

interface TransactionTabsProps {
  incomeTransactions: Transaction[]
  expenseTransactions: Transaction[]
  currency: string
  isLoading: boolean
  onRefresh: () => void
}

export function TransactionTabs({
  incomeTransactions,
  expenseTransactions,
  currency,
  isLoading,
  onRefresh,
}: TransactionTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="income">Income ({incomeTransactions.length})</TabsTrigger>
        <TabsTrigger value="expenses">Expenses ({expenseTransactions.length})</TabsTrigger>
        <TabsTrigger value="all">All Transactions</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <TransactionOverview
          incomeTransactions={incomeTransactions}
          expenseTransactions={expenseTransactions}
          currency={currency}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="income" className="space-y-4">
        <TransactionTable
          transactions={incomeTransactions}
          type="income"
          currency={currency}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />
      </TabsContent>

      <TabsContent value="expenses" className="space-y-4">
        <TransactionTable
          transactions={expenseTransactions}
          type="expense"
          currency={currency}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />
      </TabsContent>

      <TabsContent value="all" className="space-y-4">
        <TransactionTable
          transactions={[...incomeTransactions, ...expenseTransactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )}
          type="all"
          currency={currency}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />
      </TabsContent>
    </Tabs>
  )
}
