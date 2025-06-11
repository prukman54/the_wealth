"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { Loader2, AlertCircle, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Form validation schemas
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

interface AuthFormProps {
  mode: "login" | "signup"
}

// Admin credentials - EXACT match required
const ADMIN_EMAIL = "prukman54@gmail.com"
const ADMIN_PASSWORD = "$$1M_BTC$$"

function AuthFormContent({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [authMode, setAuthMode] = useState<"user" | "admin">("user")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const returnUrl = searchParams.get("return")
  const error = searchParams.get("error")

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

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

  async function handleGoogleAuth() {
    setIsGoogleLoading(true)
    try {
      const redirectTo = `${window.location.origin}/auth/callback${
        returnUrl ? `?return=${encodeURIComponent(returnUrl)}` : ""
      }`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error("Google OAuth error:", error)
      toast({
        title: "Google authentication failed",
        description: error.message || "Please try again",
        variant: "destructive",
      })
      setIsGoogleLoading(false)
    }
  }

  async function handleLogin(data: LoginFormValues) {
    setIsLoading(true)

    try {
      console.log("Login attempt:", {
        email: data.email,
        authMode,
        isAdminEmail: data.email === ADMIN_EMAIL,
        isAdminPassword: data.password === ADMIN_PASSWORD,
      })

      // Check if this is an admin login attempt
      const isAdminLogin = authMode === "admin" && data.email.trim() === ADMIN_EMAIL && data.password === ADMIN_PASSWORD

      console.log("Admin login check:", { isAdminLogin, authMode })

      // For admin login, validate credentials first
      if (authMode === "admin") {
        if (!isAdminLogin) {
          console.log("Invalid admin credentials")
          toast({
            title: "Access denied",
            description: "Invalid admin credentials. Please check your email and password.",
            variant: "destructive",
          })
          return
        }
      }

      // Authenticate with Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        console.error("Supabase auth error:", authError)

        // Special handling for admin account that doesn't exist in Supabase
        if (isAdminLogin && authError.message.includes("Invalid login credentials")) {
          toast({
            title: "Admin Account Setup Required",
            description: "Please create your admin account in Supabase Authentication first.",
            variant: "destructive",
          })
          return
        }

        throw authError
      }

      console.log("Supabase auth successful")

      // Check user role in database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, phone_number, full_name, region")
        .eq("email", data.email)
        .single()

      console.log("User data from database:", userData, userError)

      // Handle admin login
      if (authMode === "admin") {
        // If user doesn't exist in users table, create admin profile
        if (userError && userError.code === "PGRST116") {
          console.log("Creating admin user profile")
          const { data: authUser } = await supabase.auth.getUser()
          if (authUser.user) {
            const { error: createError } = await supabase.from("users").insert({
              id: authUser.user.id,
              full_name: "Admin User",
              email: data.email,
              phone_number: "+977-9846965033", // Admin phone
              region: "np", // Admin region
              role: "admin",
            })

            if (createError) {
              console.error("Error creating admin profile:", createError)
              throw createError
            }
          }
        } else if (userData?.role !== "admin") {
          // Update existing user to admin role
          console.log("Updating user role to admin")
          const { error: updateError } = await supabase
            .from("users")
            .update({
              role: "admin",
              phone_number: "+977-9846965033",
              region: "np",
            })
            .eq("email", data.email)

          if (updateError) {
            console.error("Error updating user role:", updateError)
          }
        }

        toast({
          title: "Welcome back, Admin!",
          description: "Successfully logged in to admin dashboard.",
        })

        console.log("Redirecting to admin dashboard")
        router.push("/admin/dashboard")
        return
      }

      // Handle regular user login - they should have complete profiles from email signup
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      })

      // For email/password users, profile should already be complete
      // Redirect directly to dashboard
      if (returnUrl?.includes("rukman.com.np")) {
        console.log("Redirecting to dashboard with welcome")
        router.push("/dashboard?welcome=true")
      } else {
        console.log("Redirecting to dashboard")
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignup(data: SignupFormValues) {
    setIsLoading(true)
    try {
      console.log("📝 Email signup with complete profile data:", {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        region: data.region,
      })

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?email_signup=true`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create complete user profile immediately
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          email: data.email,
          region: data.region,
          role: "user",
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          throw profileError
        }

        console.log("✅ Complete user profile created during email signup")

        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account, then login with your credentials.",
        })

        // Redirect to verify email page with instructions to login after verification
        router.push("/auth/verify-email")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string) => {
    const messages = {
      oauth_error: "Google authentication failed. Please try again.",
      user_error: "Unable to retrieve user information. Please try again.",
      unexpected_error: "An unexpected error occurred. Please try again.",
      no_code: "Authentication was incomplete. Please try again.",
    }
    return messages[errorCode as keyof typeof messages] || "An error occurred. Please try again."
  }

  // Show Google button only for user signup and user login (not admin)
  const showGoogleButton = mode === "signup" || (mode === "login" && authMode === "user")

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
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create account"}</CardTitle>
            <CardDescription className="text-base">
              {returnUrl?.includes("rukman.com.np") ? (
                <>
                  Welcome from Rukman Puri's website!{" "}
                  {mode === "login"
                    ? "Sign in to access your financial dashboard"
                    : "Create an account to start tracking your wealth"}
                </>
              ) : mode === "login" ? (
                "Enter your credentials to access your account"
              ) : (
                "Enter your information to create your account"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
              </Alert>
            )}

            {mode === "login" && (
              <Tabs defaultValue="user" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user" onClick={() => setAuthMode("user")}>
                    User Login
                  </TabsTrigger>
                  <TabsTrigger value="admin" onClick={() => setAuthMode("admin")}>
                    <Shield className="h-4 w-4 mr-1" />
                    Admin Login
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {showGoogleButton && (
              <>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-12 text-base border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={handleGoogleAuth}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
              </>
            )}

            {mode === "login" ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                {authMode === "admin" && (
                  <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                    <Shield className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200">
                      <strong>Admin Access:</strong> Use your designated admin credentials
                      <br />
                      <span className="text-sm">Email: {ADMIN_EMAIL}</span>
                      <br />
                      <span className="text-sm">Password: {ADMIN_PASSWORD}</span>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={authMode === "admin" ? ADMIN_EMAIL : "name@example.com"}
                    disabled={isLoading}
                    className="h-12"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    {authMode === "user" && (
                      <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={authMode === "admin" ? "Enter admin password" : "Your password"}
                      disabled={isLoading}
                      className="h-12 pr-12"
                      {...loginForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button disabled={isLoading} type="submit" className="w-full h-12 text-base">
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {authMode === "admin" ? (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Sign In as Admin
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      disabled={isLoading}
                      className="h-12"
                      {...signupForm.register("fullName")}
                    />
                    {signupForm.formState.errors.fullName && (
                      <p className="text-sm text-red-500">{signupForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+977-9800000000"
                      disabled={isLoading}
                      className="h-12"
                      {...signupForm.register("phoneNumber")}
                    />
                    {signupForm.formState.errors.phoneNumber && (
                      <p className="text-sm text-red-500">{signupForm.formState.errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    className="h-12"
                    {...signupForm.register("email")}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      disabled={isLoading}
                      className="h-12 pr-12"
                      {...signupForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-medium">
                    Region *
                  </Label>
                  <Select disabled={isLoading} onValueChange={(value) => signupForm.setValue("region", value)}>
                    <SelectTrigger className="h-12">
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

                <Button disabled={isLoading} type="submit" className="w-full h-12 text-base">
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Create Account
                </Button>
              </form>
            )}

            <div className="text-center text-sm">
              {mode === "login" ? (
                <div>
                  Don't have an account?{" "}
                  <Link
                    href={`/auth/signup${returnUrl ? `?return=${encodeURIComponent(returnUrl)}` : ""}`}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div>
                  Already have an account?{" "}
                  <Link
                    href={`/auth/login${returnUrl ? `?return=${encodeURIComponent(returnUrl)}` : ""}`}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>

            {returnUrl?.includes("rukman.com.np") && (
              <div className="text-center text-xs text-muted-foreground">
                <a href={returnUrl} className="text-primary hover:underline">
                  ← Back to Rukman Puri's Website
                </a>
              </div>
            )}

            {mode === "signup" && (
              <div className="text-center text-xs text-muted-foreground">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AuthForm({ mode }: AuthFormProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthFormContent mode={mode} />
    </Suspense>
  )
}
