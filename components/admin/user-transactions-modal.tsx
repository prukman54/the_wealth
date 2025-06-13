"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/currency-utils"

type Transaction = {
  id: string
  user_id: string
  amount: number
  description: string
  category: string
  date: string
  created_at: string
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
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([])
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([])
  const [loadingIncome, setLoadingIncome] = useState(true)
  const [loadingExpenses, setLoadingExpenses] = useState(true)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    if (open && userId) {
      fetchTransactions()
    }
  }, [open, userId])

  async function fetchTransactions() {
    try {
      console.log(`Fetching transactions for user: ${userId}`)

      // Fetch income transactions
      setLoadingIncome(true)
      const { data: incomeData, error: incomeError } = await supabase
        .from("income")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (incomeError) {
        console.error("Error fetching income:", incomeError)
        throw incomeError
      }

      console.log(`Found ${incomeData?.length || 0} income transactions`)
      setIncomeTransactions(incomeData || [])

      // Fetch expense transactions
      setLoadingExpenses(true)
      const { data: expenseData, error: expenseError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (expenseError) {
        console.error("Error fetching expenses:", expenseError)
        throw expenseError
      }

      console.log(`Found ${expenseData?.length || 0} expense transactions`)
      setExpenseTransactions(expenseData || [])
    } catch (error: any) {
      console.error("Error in fetchTransactions:", error)
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoadingIncome(false)
      setLoadingExpenses(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Transactions for {userName}</DialogTitle>
          <DialogDescription>View all income and expense transactions for this user.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="income" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="mt-4">
            {loadingIncome ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomeTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No income transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      incomeTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(transaction.amount, currency)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="expenses" className="mt-4">
            {loadingExpenses ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No expense transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenseTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            {formatCurrency(transaction.amount, currency)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
