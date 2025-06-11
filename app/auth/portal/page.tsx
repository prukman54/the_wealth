import { Suspense } from "react"
import { PortalRedirect } from "@/components/portal-redirect"

export default function PortalPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Welcome to The Wealth Portal</h1>
          <p className="text-muted-foreground">Choose how you'd like to continue</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <PortalRedirect />
        </Suspense>
      </div>
    </div>
  )
}
