"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SummaryCards } from "@/components/money-flow/summary-cards"
import { TransactionTabs } from "@/components/money-flow/transaction-tabs"
import { AddTransactionModal } from "@/components/money-flow/add-transaction-modal"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"

export interface Transaction {
  id: string
  user_id: string
  amount: number
  description: string
  category: string
  date: string
  created_at: string
  type: "income" | "expense"
}

interface MoneyFlowDashboardProps {
  user: {
    id: string
    full_name: string
    email: string
    phone_number: string
    region: string
    role: string
  }
}

export function MoneyFlowDashboard({ user }: MoneyFlowDashboardProps) {
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([])
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"income" | "expense">("income")
  const { supabase } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    try {
      setIsLoading(true)

      // Fetch income transactions
      const { data: incomeData, error: incomeError } = await supabase
        .from("income")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })

      if (incomeError) throw incomeError

      // Fetch expense transactions
      const { data: expenseData, error: expenseError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })

      if (expenseError) throw expenseError

      // Transform data to include type
      const incomeWithType: Transaction[] = (incomeData || []).map((item) => ({
        ...item,
        type: "income" as const,
      }))

      const expenseWithType: Transaction[] = (expenseData || []).map((item) => ({
        ...item,
        type: "expense" as const,
      }))

      setIncomeTransactions(incomeWithType)
      setExpenseTransactions(expenseWithType)
    } catch (error: any) {
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTransaction = (type: "income" | "expense") => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleTransactionAdded = () => {
    fetchTransactions()
    setIsModalOpen(false)
    toast({
      title: "Transaction added",
      description: `${modalType === "income" ? "Income" : "Expense"} transaction has been added successfully.`,
    })
  }

  // Calculate totals
  const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalSavings = totalIncome - totalExpenses

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Money Flow"
        text="Track your income and expenses to understand your financial patterns"
      />

      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        totalSavings={totalSavings}
        currency={user.region}
        onAddIncome={() => handleAddTransaction("income")}
        onAddExpense={() => handleAddTransaction("expense")}
      />

      <TransactionTabs
        incomeTransactions={incomeTransactions}
        expenseTransactions={expenseTransactions}
        currency={user.region}
        isLoading={isLoading}
        onRefresh={fetchTransactions}
      />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTransactionAdded}
        type={modalType}
        userId={user.id}
      />
    </DashboardShell>
  )
}
