"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Quote, RefreshCw } from "lucide-react"
import { useSupabase } from "@/lib/supabase-provider"

interface WealthQuoteCardProps {
  quote: {
    id: string
    quote: string
    author: string
  }
}

export function WealthQuoteCard({ quote: initialQuote }: WealthQuoteCardProps) {
  const [quote, setQuote] = useState(initialQuote)
  const [isLoading, setIsLoading] = useState(false)
  const { supabase } = useSupabase()

  const getNewQuote = async () => {
    setIsLoading(true)
    try {
      const { data: quotes } = await supabase.from("wealth_quotes").select("*").eq("active", true)

      if (quotes && quotes.length > 0) {
        // Filter out current quote and select a random one
        const otherQuotes = quotes.filter((q) => q.id !== quote.id)
        if (otherQuotes.length > 0) {
          const randomQuote = otherQuotes[Math.floor(Math.random() * otherQuotes.length)]
          setQuote(randomQuote)
        }
      }
    } catch (error) {
      console.error("Error fetching new quote:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <Quote className="h-5 w-5" />
            Daily Wisdom
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={getNewQuote}
            disabled={isLoading}
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <blockquote className="space-y-3">
          <p className="text-lg italic text-emerald-900 dark:text-emerald-100 leading-relaxed">"{quote.quote}"</p>
          <footer className="text-sm font-medium text-emerald-700 dark:text-emerald-300">— {quote.author}</footer>
        </blockquote>
      </CardContent>
    </Card>
  )
}
