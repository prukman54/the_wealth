"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { transactionSchema, type TransactionFormValues } from "@/lib/validation-schemas"
import { getCurrencySymbol } from "@/lib/currency-utils"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  type: "income" | "expense"
  userId: string
  userRegion: string
}

const INCOME_CATEGORIES = [
  "Salary",
  "Business",
  "Freelance",
  "Investments",
  "Rental",
  "Dividends",
  "Interest",
  "Gifts",
  "Other",
]

const EXPENSE_CATEGORIES = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Debt Payments",
  "Personal",
  "Entertainment",
  "Education",
  "Clothing",
  "Gifts/Donations",
  "Travel",
  "Miscellaneous",
]

export function AddTransactionModal({
  isOpen,
  onClose,
  onSuccess,
  type,
  userId,
  userRegion,
}: AddTransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      category: "",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
    },
  })

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  async function onSubmit(data: TransactionFormValues) {
    setIsLoading(true)
    try {
      const tableName = type === "income" ? "income" : "expenses"

      const { error } = await supabase.from(tableName).insert({
        user_id: userId,
        amount: Number.parseFloat(data.amount),
        category: data.category,
        date: data.date,
        description: data.description || "",
      })

      if (error) {
        throw error
      }

      form.reset()
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Error adding transaction",
        description: error.message || "There was a problem adding your transaction",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {type === "income" ? "Income" : "Expense"}</DialogTitle>
          <DialogDescription>
            Record a new {type === "income" ? "income" : "expense"} transaction to track your money flow.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({getCurrencySymbol(userRegion)}) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {getCurrencySymbol(userRegion)}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max="1000000"
                placeholder="0.00"
                className="pl-12"
                disabled={isLoading}
                aria-invalid={!!form.formState.errors.amount}
                {...form.register("amount")}
              />
            </div>
            {form.formState.errors.amount && (
              <p className="text-sm text-red-500" role="alert">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              disabled={isLoading}
              onValueChange={(value) => form.setValue("category", value)}
              value={form.watch("category")}
              aria-label="Category"
            >
              <SelectTrigger aria-label="Select a category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              disabled={isLoading}
              {...form.register("date")}
              aria-invalid={!!form.formState.errors.date}
            />
            {form.formState.errors.date && <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a note about this transaction..."
              disabled={isLoading}
              {...form.register("description")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} aria-label="Cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} aria-label={`Add ${type === "income" ? "Income" : "Expense"}`}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add {type === "income" ? "Income" : "Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
