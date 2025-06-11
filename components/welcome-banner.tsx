"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, ExternalLink } from "lucide-react"

interface WelcomeBannerProps {
  isNewUser?: boolean
  userName?: string
}

export function WelcomeBanner({ isNewUser, userName }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Alert className="mb-6 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <AlertDescription className="text-emerald-800 dark:text-emerald-200">
            {isNewUser ? (
              <>
                🎉 <strong>Welcome to The Wealth Portal, {userName?.split(" ")[0] || "there"}!</strong>
                Your account has been created successfully. Start by exploring your dashboard and setting up your first
                financial goals.
              </>
            ) : (
              <>
                👋 <strong>Welcome back, {userName?.split(" ")[0] || "there"}!</strong>
                You've successfully accessed The Wealth Portal from Rukman Puri's website.
              </>
            )}
          </AlertDescription>
          <div className="mt-2 flex gap-2">
            <a
              href="https://rukman.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              Back to Main Website
            </a>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
}
