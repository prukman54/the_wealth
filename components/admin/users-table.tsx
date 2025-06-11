"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Eye, RefreshCw } from "lucide-react"
import { formatCurrency } from "@/lib/currency-utils"
import { UserTransactionsModal } from "./user-transactions-modal"

type UserWithFinancials = {
  id: string
  full_name: string
  email: string
  phone_number: string
  region: string
  role: string
  created_at: string
  total_income: number
  total_expenses: number
  total_savings: number
}

export function AdminUsersTable() {
  const [users, setUsers] = useState<UserWithFinancials[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showTransactionsModal, setShowTransactionsModal] = useState(false)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)

      // Get all users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) {
        throw usersError
      }

      if (usersData) {
        // Calculate financial totals for each user
        const usersWithFinancials = await Promise.all(
          usersData.map(async (user) => {
            // Get total income
            const { data: incomeData } = await supabase.from("income").select("amount").eq("user_id", user.id)

            const totalIncome = incomeData?.reduce((sum, item) => sum + item.amount, 0) || 0

            // Get total expenses
            const { data: expenseData } = await supabase.from("expenses").select("amount").eq("user_id", user.id)

            const totalExpenses = expenseData?.reduce((sum, item) => sum + item.amount, 0) || 0

            // Calculate savings
            const totalSavings = totalIncome - totalExpenses

            return {
              ...user,
              total_income: totalIncome,
              total_expenses: totalExpenses,
              total_savings: totalSavings,
            }
          }),
        )

        setUsers(usersWithFinancials)
      }
    } catch (error: any) {
      toast({
        title: "Error fetching users",
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

  function handleViewTransactions(userId: string) {
    setSelectedUserId(userId)
    setShowTransactionsModal(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View all users and their financial summaries</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Total Income</TableHead>
                    <TableHead className="text-right">Total Expenses</TableHead>
                    <TableHead className="text-right">Total Savings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => {
                      const currency = getCurrencyByRegion(user.region)
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone_number || "—"}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                              {user.region.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(user.total_income, currency)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            {formatCurrency(user.total_expenses, currency)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <span className={user.total_savings >= 0 ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(user.total_savings, currency)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleViewTransactions(user.id)}>
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUserId && (
        <UserTransactionsModal
          userId={selectedUserId}
          userName={users.find((u) => u.id === selectedUserId)?.full_name || ""}
          userRegion={users.find((u) => u.id === selectedUserId)?.region || "np"}
          open={showTransactionsModal}
          onOpenChange={setShowTransactionsModal}
        />
      )}
    </>
  )
}
