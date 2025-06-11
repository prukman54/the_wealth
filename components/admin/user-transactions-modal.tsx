"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/currency-utils"
import { format } from "date-fns"

type Transaction = {
  id: string
  amount: number
  description: string
  category: string
  date: string
  created_at: string
  type: "income" | "expense"
}

interface UserTransactionsModalProps {
  userId: string
  userName: string
  userRegion: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserTransactionsModal({
  userId,
  userName,
  userRegion,
  open,
  onOpenChange,
}: UserTransactionsModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    if (open && userId) {
      fetchUserTransactions()
    }
  }, [open, userId])

  async function fetchUserTransactions() {
    try {
      setLoading(true)

      // Fetch income transactions
      const { data: incomeData, error: incomeError } = await supabase
        .from("income")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (incomeError) {
        throw incomeError
      }

      // Fetch expense transactions
      const { data: expenseData, error: expenseError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (expenseError) {
        throw expenseError
      }

      // Combine and format transactions
      const allTransactions: Transaction[] = [
        ...(incomeData?.map((item) => ({ ...item, type: "income" as const })) || []),
        ...(expenseData?.map((item) => ({ ...item, type: "expense" as const })) || []),
      ]

      // Sort by date (most recent first)
      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setTransactions(allTransactions)
    } catch (error: any) {
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function getCurrencyByRegion(region: string): string {
    const currencyMap: { [key: string]: string } = {
      np: "NPR",
      us: "USD",
      eu: "EUR",
      uk: "GBP",
      ca: "CAD",
      au: "AUD",
      jp: "JPY",
      in: "INR",
    }
    return currencyMap[region] || "USD"
  }

  const currency = getCurrencyByRegion(userRegion)
  const incomeTransactions = transactions.filter((t) => t.type === "income")
  const expenseTransactions = transactions.filter((t) => t.type === "expense")

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transactions for {userName}</DialogTitle>
          <DialogDescription>View all income and expense transactions for this user</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Total Income</div>
                <div className="text-lg font-bold text-green-600">{formatCurrency(totalIncome, currency)}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Total Expenses</div>
                <div className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses, currency)}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Net Savings</div>
                <div
                  className={`text-lg font-bold ${totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(totalIncome - totalExpenses, currency)}
                </div>
              </div>
            </div>

            {/* Transactions Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Transactions ({transactions.length})</TabsTrigger>
                <TabsTrigger value="income">Income ({incomeTransactions.length})</TabsTrigger>
                <TabsTrigger value="expenses">Expenses ({expenseTransactions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <TransactionTable transactions={transactions} currency={currency} />
              </TabsContent>

              <TabsContent value="income" className="space-y-4">
                <TransactionTable transactions={incomeTransactions} currency={currency} />
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                <TransactionTable transactions={expenseTransactions} currency={currency} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function TransactionTable({ transactions, currency }: { transactions: Transaction[]; currency: string }) {
  if (transactions.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No transactions found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
              <TableCell>
                <Badge
                  className={
                    transaction.type === "income"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }
                >
                  {transaction.type === "income" ? "Income" : "Expense"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{transaction.category}</Badge>
              </TableCell>
              <TableCell>{transaction.description || "—"}</TableCell>
              <TableCell className="text-right font-medium">
                <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount, currency)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
