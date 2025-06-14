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
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  CheckCircle,
  User,
  Phone,
  Globe,
  Mail,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number (minimum 10 digits)" }),
  region: z.string().min(1, { message: "Please select your region" }),
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

interface AuthFormProps {
  mode: "login" | "signup"
}

// Admin credentials
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
  const message = searchParams.get("message")

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
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
      console.log("🔐 Login attempt:", { email: data.email, authMode })

      // Admin login validation
      if (authMode === "admin") {
        if (data.email.trim() !== ADMIN_EMAIL || data.password !== ADMIN_PASSWORD) {
          toast({
            title: "Access denied",
            description: "Invalid admin credentials. Please check your email and password.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Check if admin exists in Supabase Auth
        const { data: authData, error: checkError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        // If admin doesn't exist in Supabase Auth, create the account
        if (checkError && checkError.message.includes("Invalid login credentials")) {
          console.log("Admin account doesn't exist in Supabase Auth. Creating account...")

          // Create admin account in Supabase Auth
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                full_name: "Admin User",
                role: "admin",
              },
            },
          })

          if (signUpError) {
            console.error("Failed to create admin account:", signUpError)
            toast({
              title: "Admin Setup Failed",
              description: "Could not create admin account. Please contact support.",
              variant: "destructive",
            })
            setIsLoading(false)
            return
          }

          // If admin was created successfully, try to sign in
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          })

          if (signInError) {
            console.error("Failed to sign in as admin:", signInError)
            toast({
              title: "Admin Login Failed",
              description: "Admin account created but login failed. Please try again.",
              variant: "destructive",
            })
            setIsLoading(false)
            return
          }
        } else if (checkError) {
          // Some other error occurred
          console.error("Admin login error:", checkError)
          toast({
            title: "Login Failed",
            description: checkError.message,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        console.log("✅ Admin authentication successful")

        // Check if admin profile exists in users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role, phone_number, region, full_name")
          .eq("email", data.email)
          .single()

        // Create or update admin profile if needed
        if (userError && userError.code === "PGRST116") {
          const { data: authUser } = await supabase.auth.getUser()
          if (authUser.user) {
            await supabase.from("users").insert({
              id: authUser.user.id,
              full_name: "Admin User",
              email: data.email,
              phone_number: "+977-9846965033",
              region: "np",
              role: "admin",
            })
          }
        } else if (userData?.role !== "admin") {
          await supabase
            .from("users")
            .update({
              role: "admin",
              phone_number: "+977-9846965033",
              region: "np",
            })
            .eq("email", data.email)
        }

        toast({
          title: "Welcome back, Admin!",
          description: "Successfully logged in to admin dashboard.",
        })
        router.push("/admin/dashboard")
        return
      }

      // Regular user login
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        console.error("❌ Supabase auth error:", authError)
        throw authError
      }

      console.log("✅ Authentication successful")

      // Check user profile in database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, phone_number, region, full_name")
        .eq("email", data.email)
        .single()

      // Handle regular user login
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      })

      // Check if profile is complete
      if (!userData?.phone_number || !userData?.region) {
        console.log("⚠️ Incomplete profile detected, redirecting to complete profile")
        router.push("/auth/complete-profile")
        return
      }

      // Profile is complete, redirect to dashboard
      const destination = returnUrl?.includes("rukman.com.np") ? "/dashboard?welcome=true" : "/dashboard"
      router.push(destination)
    } catch (error: any) {
      console.error("❌ Login error:", error)
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
      console.log("📝 Starting complete email signup:", {
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
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
            region: data.region,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?email_signup=true`,
        },
      })

      if (authError) {
        console.error("❌ Supabase auth error:", authError)
        throw authError
      }

      if (authData.user) {
        console.log("✅ User created in Supabase Auth:", authData.user.id)

        toast({
          title: "Account created successfully! 🎉",
          description: "Please check your email to verify your account, then login with your credentials.",
        })

        // Redirect to verify email page
        router.push("/auth/verify-email")
      }
    } catch (error: any) {
      console.error("❌ Signup error:", error)
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
      verification_error: "Email verification failed. Please try signing up again or contact support.",
    }
    return messages[errorCode as keyof typeof messages] || "An error occurred. Please try again."
  }

  const getSuccessMessage = (messageCode: string) => {
    const messages = {
      verified: "Email verified successfully! You can now login with your credentials.",
      profile_completed: "Profile completed successfully! Welcome to The Wealth platform.",
    }
    return messages[messageCode as keyof typeof messages] || ""
  }

  // Show Google button only for user signup and user login (not admin)
  const showGoogleButton = mode === "signup" || (mode === "login" && authMode === "user")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="self-start">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              {mode === "login" ? "Welcome back" : "Join The Wealth"}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground dark:text-gray-300">
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
                "Create your account and start building wealth today"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            {message && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {getSuccessMessage(message)}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && authMode === "user" && (
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
                  className="w-full h-12 text-base border-2 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white dark:border-gray-700"
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
                    <span className="w-full border-t dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground dark:text-gray-400">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </>
            )}

            {mode === "login" ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                {authMode === "admin" && (
                  <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                    <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200">
                      <strong>Admin Access:</strong> Use your designated admin credentials
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={authMode === "admin" ? ADMIN_EMAIL : "name@example.com"}
                    disabled={isLoading}
                    className="h-12 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-400"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500 dark:text-red-400">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
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
                      placeholder="Your password"
                      disabled={isLoading}
                      className="h-12 pr-12 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-400"
                      {...loginForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent dark:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {loginForm.formState.errors.password.message}
                    </p>
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
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    className="h-12 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-400"
                    {...signupForm.register("fullName")}
                  />
                  {signupForm.formState.errors.fullName && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {signupForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    className="h-12 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-400"
                    {...signupForm.register("email")}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password (min 8 characters)"
                      disabled={isLoading}
                      className="h-12 pr-12 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-400"
                      {...signupForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent dark:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+977-9800000000"
                    disabled={isLoading}
                    className="h-12 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-400"
                    {...signupForm.register("phoneNumber")}
                  />
                  {signupForm.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {signupForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    We'll use this for account security and important notifications
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Globe className="h-4 w-4" />
                    Region & Currency *
                  </Label>
                  <Select disabled={isLoading} onValueChange={(value) => signupForm.setValue("region", value)}>
                    <SelectTrigger className="h-12 dark:text-white dark:bg-gray-800 dark:border-gray-700">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="np">🇳🇵 Nepal (NPR)</SelectItem>
                      <SelectItem value="us">🇺🇸 United States (USD)</SelectItem>
                      <SelectItem value="eu">🇪🇺 Europe (EUR)</SelectItem>
                      <SelectItem value="uk">🇬🇧 United Kingdom (GBP)</SelectItem>
                      <SelectItem value="ca">🇨🇦 Canada (CAD)</SelectItem>
                      <SelectItem value="au">🇦🇺 Australia (AUD)</SelectItem>
                      <SelectItem value="jp">🇯🇵 Japan (JPY)</SelectItem>
                      <SelectItem value="in">🇮🇳 India (INR)</SelectItem>
                    </SelectContent>
                  </Select>
                  {signupForm.formState.errors.region && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {signupForm.formState.errors.region.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    This helps us show amounts in your local currency
                  </p>
                </div>

                <Button disabled={isLoading} type="submit" className="w-full h-12 text-base">
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Create Account
                </Button>
              </form>
            )}

            <div className="text-center text-sm text-foreground dark:text-gray-300">
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
              <div className="text-center text-xs text-muted-foreground dark:text-gray-400">
                <a href={returnUrl} className="text-primary hover:underline">
                  ← Back to Rukman Puri's Website
                </a>
              </div>
            )}

            {mode === "signup" && (
              <div className="text-center text-xs text-muted-foreground dark:text-gray-400">
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
