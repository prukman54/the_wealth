"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Quote = {
  id: string
  quote: string
  author: string
  active: boolean
  created_at: string
}

export function AdminQuoteManager() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [newQuote, setNewQuote] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    fetchQuotes()
  }, [])

  async function fetchQuotes() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("wealth_quotes").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        setQuotes(data as Quote[])
      }
    } catch (error: any) {
      toast({
        title: "Error fetching quotes",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function addQuote() {
    if (!newQuote || !newAuthor) {
      toast({
        title: "Missing information",
        description: "Please provide both quote and author",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const { data, error } = await supabase
        .from("wealth_quotes")
        .insert([{ quote: newQuote, author: newAuthor, active: true }])
        .select()

      if (error) {
        throw error
      }

      if (data) {
        setQuotes([...data, ...quotes])
        setNewQuote("")
        setNewAuthor("")
        setIsAdding(false)
        toast({
          title: "Quote added",
          description: "The quote has been added successfully",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error adding quote",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function toggleQuoteStatus(quoteId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase.from("wealth_quotes").update({ active: !currentStatus }).eq("id", quoteId)

      if (error) {
        throw error
      }

      // Update local state
      setQuotes(
        quotes.map((quote) => {
          if (quote.id === quoteId) {
            return { ...quote, active: !currentStatus }
          }
          return quote
        }),
      )

      toast({
        title: "Quote status updated",
        description: `Quote is now ${!currentStatus ? "active" : "inactive"}`,
      })
    } catch (error: any) {
      toast({
        title: "Error updating quote",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  async function deleteQuote(quoteId: string) {
    try {
      const { error } = await supabase.from("wealth_quotes").delete().eq("id", quoteId)

      if (error) {
        throw error
      }

      // Update local state
      setQuotes(quotes.filter((quote) => quote.id !== quoteId))

      toast({
        title: "Quote deleted",
        description: "The quote has been deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error deleting quote",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Wealth Quotes Management</CardTitle>
            <CardDescription>Manage inspirational quotes shown to users - add, edit, and delete quotes</CardDescription>
          </div>
          {!isAdding && (
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="mr-1 h-4 w-4" /> Add Quote
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6 space-y-4 rounded-md border p-4">
            <div className="space-y-2">
              <Label htmlFor="quote">Quote</Label>
              <Input
                id="quote"
                placeholder="Enter inspirational quote"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Enter author name"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAdding(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={addQuote} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Quote
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No quotes found. Add your first quote!
                    </TableCell>
                  </TableRow>
                ) : (
                  quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-mono text-xs">{quote.id.slice(0, 8)}...</TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={quote.quote}>
                          {quote.quote}
                        </div>
                      </TableCell>
                      <TableCell>{quote.author}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={quote.active}
                            onCheckedChange={() => toggleQuoteStatus(quote.id, quote.active)}
                          />
                          <span className="text-xs">{quote.active ? "Active" : "Inactive"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Quote</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this quote? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteQuote(quote.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
