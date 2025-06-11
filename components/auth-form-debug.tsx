"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  region: z.string().min(1, { message: "Please select your region" }),
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

type AuthFormProps = {
  mode: "login" | "signup"
}

// Admin credentials
const ADMIN_EMAIL = "prukman54@gmail.com"
const ADMIN_PASSWORD = "$$1M_BTC$$"

// Create a wrapper component that uses useSearchParams
function AuthFormContent({ mode }: { mode: "login" | "signup" }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [authMode, setAuthMode] = useState<"user" | "admin">("user")
  const [debugInfo, setDebugInfo] = useState<any>({})
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const plan = searchParams.get("plan")
  const returnUrl = getReturnUrl(searchParams)
  const error = searchParams.get("error")

  // Debug information
  useEffect(() => {
    const debug = {
      mode,
      authMode,
      isLoading,
      isGoogleLoading,
      hasSupabase: !!supabase,
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      currentUrl: window.location.href,
      returnUrl,
      error,
    }
    setDebugInfo(debug)
    console.log("Auth Form Debug Info:", debug)
  }, [mode, authMode, isLoading, isGoogleLoading, supabase, returnUrl, error])

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      region: "",
    },
  })

  // Handle Google OAuth
  async function signInWithGoogle() {
    console.log("Google OAuth attempt started")
    setIsGoogleLoading(true)

    try {
      // Use the current origin for redirect URL
      const currentOrigin = window.location.origin
      const redirectTo = returnUrl
        ? `${currentOrigin}/auth/callback?return=${encodeURIComponent(returnUrl)}`
        : `${currentOrigin}/auth/callback`

      console.log("Redirect URL:", redirectTo)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      console.log("Google OAuth response:", { data, error })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Google OAuth error:", error)
      toast({
        title: "Google login failed",
        description: error.message || "There was a problem signing in with Google",
        variant: "destructive",
      })
      setIsGoogleLoading(false)
    }
  }

  // Handle login
  async function onLogin(data: LoginFormValues) {
    setIsLoading(true)
    try {
      // Check if this is an admin login attempt
      const isAdminLogin = authMode === "admin" && data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      // Check user role in database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("email", data.email)
        .single()

      if (userError) {
        // If user doesn't exist in users table but auth succeeded, create profile
        if (userError.code === "PGRST116") {
          const { data: authUser } = await supabase.auth.getUser()
          if (authUser.user) {
            const { error: profileError } = await supabase.from("users").insert({
              id: authUser.user.id,
              full_name: authUser.user.user_metadata?.full_name || "",
              email: data.email,
              phone_number: "",
              region: "np", // Default to Nepal
              role: isAdminLogin ? "admin" : "user",
            })

            if (profileError) {
              console.error("Error creating user profile:", profileError)
            }
          }
        } else {
          throw userError
        }
      }

      // Verify admin access
      if (authMode === "admin") {
        if (!isAdminLogin) {
          toast({
            title: "Access denied",
            description: "Invalid admin credentials",
            variant: "destructive",
          })
          await supabase.auth.signOut()
          return
        }

        // Update user role to admin if not already
        if (userData?.role !== "admin") {
          await supabase.from("users").update({ role: "admin" }).eq("email", data.email)
        }
      }

      toast({
        title: "Login successful",
        description: "Welcome back to The Wealth",
      })

      // Handle return URL or redirect to appropriate dashboard
      if (returnUrl && returnUrl.includes("rukman.com.np")) {
        router.push("/dashboard?welcome=true")
      } else if (isAdminLogin || userData?.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle signup
  async function onSignup(data: SignupFormValues) {
    setIsLoading(true)
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      })

      if (authError) {
        throw authError
      }

      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          email: data.email,
          region: data.region,
          role: "user", // All signups are regular users initially
        })

        if (profileError) {
          throw profileError
        }
      }

      toast({
        title: "Account created successfully",
        description: "Please log in to access your account.",
      })

      // Sign out the user after signup to force them to log in
      await supabase.auth.signOut()

      // Redirect to login page with return URL preserved
      const loginUrl = returnUrl ? `/auth/login?return=${encodeURIComponent(returnUrl)}` : "/auth/login"
      router.push(loginUrl)
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "There was a problem creating your account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get error message based on error code
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "oauth_error":
        return "There was an issue with Google authentication. Please try again."
      case "user_error":
        return "Unable to retrieve user information. Please try again."
      case "unexpected_error":
        return "An unexpected error occurred. Please try again."
      case "no_code":
        return "Authentication was incomplete. Please try again."
      default:
        return "An error occurred during authentication. Please try again."
    }
  }

  // Determine if Google OAuth should be shown
  const shouldShowGoogleOAuth = mode === "login" ? authMode !== "admin" : true
  const isGoogleDisabled = isLoading || isGoogleLoading || (mode === "login" && authMode === "admin")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Sign In" : "Sign Up"}</CardTitle>
        <CardDescription>
          {returnUrl && returnUrl.includes("rukman.com.np") ? (
            <>
              Welcome from Rukman Puri's website!{" "}
              {mode === "login"
                ? "Sign in to access your financial dashboard"
                : "Create an account to start tracking your wealth"}
            </>
          ) : mode === "login" ? (
            "Enter your credentials to access your account"
          ) : (
            "Create an account to start your financial journey"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Debug Information - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <details>
                <summary>Debug Info (Dev Only)</summary>
                <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
                <p className="mt-2 text-xs">
                  Google OAuth Visible: {shouldShowGoogleOAuth ? "YES" : "NO"}
                  <br />
                  Google OAuth Disabled: {isGoogleDisabled ? "YES" : "NO"}
                </p>
              </details>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>
        )}

        {mode === "login" && (
          <Tabs defaultValue="user" className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" onClick={() => setAuthMode("user")}>
                User Login
              </TabsTrigger>
              <TabsTrigger value="admin" onClick={() => setAuthMode("admin")}>
                Admin Login
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="space-y-4">
          {/* Google OAuth Button */}
          {shouldShowGoogleOAuth && (
            <Button
              variant="outline"
              type="button"
              disabled={isGoogleDisabled}
              className="w-full"
              onClick={signInWithGoogle}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>
          )}

          {/* Show message when Google OAuth is hidden */}
          {!shouldShowGoogleOAuth && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Google OAuth is not available for admin login. Please use admin credentials below.
              </AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Rest of the form remains the same */}
          {mode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              {authMode === "admin" && (
                <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Admin Login:</strong> Use the designated admin credentials to access the admin dashboard.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder={authMode === "admin" ? "Admin email" : "name@example.com"}
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {authMode === "user" && (
                    <Link
                      href="/auth/reset-password"
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={authMode === "admin" ? "Admin password" : "Your password"}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {authMode === "admin" ? "Sign In as Admin" : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  {...signupForm.register("fullName")}
                />
                {signupForm.formState.errors.fullName && (
                  <p className="text-sm text-red-500">{signupForm.formState.errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+977-9800000000"
                  disabled={isLoading}
                  {...signupForm.register("phoneNumber")}
                />
                {signupForm.formState.errors.phoneNumber && (
                  <p className="text-sm text-red-500">{signupForm.formState.errors.phoneNumber.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...signupForm.register("email")}
                />
                {signupForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{signupForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...signupForm.register("password")}
                />
                {signupForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{signupForm.formState.errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Select disabled={isLoading} onValueChange={(value) => signupForm.setValue("region", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="np">Nepal (NPR)</SelectItem>
                    <SelectItem value="us">United States (USD)</SelectItem>
                    <SelectItem value="eu">Europe (EUR)</SelectItem>
                    <SelectItem value="uk">United Kingdom (GBP)</SelectItem>
                    <SelectItem value="ca">Canada (CAD)</SelectItem>
                    <SelectItem value="au">Australia (AUD)</SelectItem>
                    <SelectItem value="jp">Japan (JPY)</SelectItem>
                    <SelectItem value="in">India (INR)</SelectItem>
                  </SelectContent>
                </Select>
                {signupForm.formState.errors.region && (
                  <p className="text-sm text-red-500">{signupForm.formState.errors.region.message}</p>
                )}
              </div>
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          {mode === "login" ? (
            <div>
              Don't have an account?{" "}
              <Link
                href={`/auth/signup${returnUrl ? `?return=${encodeURIComponent(returnUrl)}` : ""}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div>
              Already have an account?{" "}
              <Link
                href={`/auth/login${returnUrl ? `?return=${encodeURIComponent(returnUrl)}` : ""}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
        {returnUrl && returnUrl.includes("rukman.com.np") && (
          <div className="text-center text-xs text-muted-foreground">
            <a href={returnUrl} className="text-primary underline-offset-4 hover:underline">
              ← Back to Rukman Puri's Website
            </a>
          </div>
        )}
        {mode === "signup" && (
          <div className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

// Helper function to get return URL
function getReturnUrl(searchParams: URLSearchParams): string {
  const returnParam = searchParams.get("return")
  if (returnParam) {
    return decodeURIComponent(returnParam)
  }
  return ""
}

// Main export component with Suspense boundary
export function AuthFormDebug({ mode }: { mode: "login" | "signup" }) {
  return (
    <Suspense fallback={<div className="w-full p-8 text-center">Loading authentication form...</div>}>
      <AuthFormContent mode={mode} />
    </Suspense>
  )
}
