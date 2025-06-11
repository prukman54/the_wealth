import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface WealthQuoteProps {
  quote: {
    quote: string
    author: string
  }
}

export function WealthQuote({ quote }: WealthQuoteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="h-5 w-5" />
          Daily Wisdom
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="space-y-2">
          <p className="text-lg italic">"{quote.quote}"</p>
          <footer className="text-sm text-muted-foreground">— {quote.author}</footer>
        </blockquote>
      </CardContent>
    </Card>
  )
}
