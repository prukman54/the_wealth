"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle } from "lucide-react"
import { useState } from "react"

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <AlertTriangle className="h-4 w-4" />
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Demo Mode:</strong> This is a preview of The Wealth application. To fully activate the app, you'll
            need to:
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Set up a Supabase project</li>
              <li>Configure environment variables</li>
              <li>Run the database setup scripts</li>
            </ul>
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
}
