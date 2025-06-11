import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="self-start">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent you a verification link to complete your account setup.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> After clicking the verification link in your email, please return here and
                login with your credentials to access your dashboard.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <p className="font-medium">Check your email inbox</p>
                  <p className="text-sm text-muted-foreground">Look for an email from The Wealth platform</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <p className="font-medium">Click the verification link</p>
                  <p className="text-sm text-muted-foreground">This will verify your email address</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">3</span>
                </div>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Login with your credentials</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Once verified, return here and login to access your dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full h-12">
                <Link href="/auth/login">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  I've Verified - Login Now
                </Link>
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email?{" "}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Try signing up again
                  </Link>
                </p>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <p>
                Having trouble? Check your spam folder or{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
