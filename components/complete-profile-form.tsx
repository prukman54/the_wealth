"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, CheckCircle, User, Phone, Globe, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { completeProfile } from "@/app/actions/complete-profile"

const profileSchema = z.object({
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number (minimum 10 digits)" }),
  region: z.string().min(1, { message: "Please select your region" }),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function CompleteProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [existingProfile, setExistingProfile] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber: "",
      region: "",
    },
  })

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          console.error("No user found in session")
          router.push("/auth/login")
          return
        }

        console.log("👤 Complete Profile - User data:", {
          email: user?.email,
          name: user?.user_metadata?.full_name || user?.user_metadata?.name,
          provider: user?.app_metadata?.provider,
        })

        setUser(user)

        // Check if user already has a profile
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profile) {
          console.log("📋 Existing profile found:", {
            hasPhone: !!profile.phone_number,
            hasRegion: !!profile.region,
          })

          setExistingProfile(profile)

          // Pre-fill form with existing data if available
          if (profile.phone_number) {
            form.setValue("phoneNumber", profile.phone_number)
          }

          if (profile.region) {
            form.setValue("region", profile.region)
          }
        }
      } catch (error) {
        console.error("Error getting user:", error)
        router.push("/auth/login")
      } finally {
        setIsLoadingUser(false)
      }
    }
    getUser()
  }, [supabase, router, form])

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast({
        title: "Error",
        description: "User session not found. Please try logging in again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    console.log("📝 Completing profile with data:", data)

    try {
      const result = await completeProfile({
        phoneNumber: data.phoneNumber,
        region: data.region,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      console.log("✅ Profile completed successfully")

      toast({
        title: "Profile completed! 🎉",
        description: "Welcome to The Wealth platform. Let's start building your financial future!",
      })

      // Check if user is admin
      const isAdmin = user.email === "prukman54@gmail.com"

      if (isAdmin) {
        console.log("👑 Admin user - redirecting to admin dashboard")
        router.push("/admin/dashboard")
      } else {
        console.log("👤 Regular user - redirecting to dashboard")
        router.push("/dashboard?welcome=true&new=true")
      }
    } catch (error: any) {
      console.error("❌ Profile completion error:", error)
      toast({
        title: "Error updating profile",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground dark:text-gray-300">Session expired. Redirecting to login...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "there"
  const isAdmin = user.email === "prukman54@gmail.com"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Progress indicator */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-foreground dark:text-white">
              {existingProfile ? "Update Your Profile" : "Almost there!"}
            </h1>
          </div>
          <p className="text-muted-foreground dark:text-gray-300">
            {existingProfile
              ? "Please update your profile information"
              : "We just need a little more info to complete your profile"}
          </p>
          <Progress value={75} className="w-full" />
          <p className="text-xs text-muted-foreground dark:text-gray-400">Step 2 of 2</p>
        </div>

        <Card className="border-0 shadow-xl dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl dark:text-white">
              {existingProfile ? "Update Profile" : "Complete Your Profile"}
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              {isAdmin ? (
                <>Welcome Admin {userName}! Please complete your profile to access the admin dashboard.</>
              ) : (
                <>Welcome {userName}! We need a couple more details to personalize your experience.</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Account info display */}
              <div className="bg-muted/50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
                  <div>
                    <p className="text-sm font-medium dark:text-white">{userName}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      {user.app_metadata?.provider === "google" ? "From Google Account" : "Email Account"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium dark:text-white">{user.email}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">Email verified</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Admin Account</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">Administrative privileges</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone number input */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2 dark:text-white">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+977-9800000000"
                  disabled={isLoading}
                  {...form.register("phoneNumber")}
                  className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  We'll use this for account security and important notifications
                </p>
              </div>

              {/* Region selection */}
              <div className="space-y-2">
                <Label htmlFor="region" className="flex items-center gap-2 dark:text-white">
                  <Globe className="h-4 w-4" />
                  Region & Currency *
                </Label>
                <Select
                  disabled={isLoading}
                  onValueChange={(value) => form.setValue("region", value)}
                  defaultValue={form.getValues("region")}
                >
                  <SelectTrigger className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
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
                {form.formState.errors.region && (
                  <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                    {form.formState.errors.region.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  This helps us show amounts in your local currency
                </p>
              </div>

              <Button disabled={isLoading} type="submit" className="w-full h-12 text-base dark:text-white">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {existingProfile
                  ? isAdmin
                    ? "Update Profile & Access Admin Dashboard"
                    : "Update Profile & Continue"
                  : isAdmin
                    ? "Complete Profile & Access Admin Dashboard"
                    : "Complete Profile & Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground dark:text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
