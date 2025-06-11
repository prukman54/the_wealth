"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, LogIn, UserPlus } from "lucide-react"

// Create a content component that uses useSearchParams
function PortalRedirectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [returnUrl, setReturnUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get return URL from query params or referrer
    const returnParam = searchParams.get("return")
    const referrer = document.referrer

    if (returnParam) {
      setReturnUrl(decodeURIComponent(returnParam))
    } else if (referrer && referrer.includes("rukman.com.np")) {
      setReturnUrl("https://rukman.com.np")
    }
  }, [searchParams])

  const handleBackToWebsite = () => {
    if (returnUrl) {
      window.location.href = returnUrl
    } else {
      window.location.href = "https://rukman.com.np"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Access The Wealth Portal</span>
        </CardTitle>
        <CardDescription>
          {returnUrl && returnUrl.includes("rukman.com.np")
            ? "Welcome from Rukman Puri's website! Choose an option below to continue."
            : "Choose how you'd like to access your financial dashboard."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Link href={`/auth/login${returnUrl ? `?return=${encodeURIComponent(returnUrl)}` : ""}`} passHref>
            <Button className="w-full justify-start" size="lg">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Existing Account
            </Button>
          </Link>

          <Link href={`/auth/signup${returnUrl ? `?return=${encodeURIComponent(returnUrl)}` : ""}`} passHref>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <UserPlus className="mr-2 h-4 w-4" />
              Create New Account
            </Button>
          </Link>
        </div>

        {returnUrl && (
          <div className="pt-4 border-t">
            <Button variant="ghost" onClick={handleBackToWebsite} className="w-full justify-start">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {returnUrl.includes("rukman.com.np") ? "Rukman Puri's Website" : "Previous Page"}
            </Button>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>
            Need help? Contact{" "}
            <a
              href="https://rukman.com.np/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Rukman Puri
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Main export component with Suspense boundary
export function PortalRedirect() {
  return (
    <Suspense fallback={<div className="w-full p-8 text-center">Loading portal options...</div>}>
      <PortalRedirectContent />
    </Suspense>
  )
}
