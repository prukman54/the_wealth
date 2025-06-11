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
import { Loader2, CheckCircle, User, Phone, Globe } from "lucide-react"
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

        console.log("👤 Complete Profile - User data:", {
          email: user?.email,
          name: user?.user_metadata?.full_name || user?.user_metadata?.name,
          provider: user?.app_metadata?.provider,
        })

        setUser(user)
      } catch (error) {
        console.error("Error getting user:", error)
        router.push("/auth/login")
      } finally {
        setIsLoadingUser(false)
      }
    }
    getUser()
  }, [supabase, router])

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
        title: "Profile completed!",
        description: "Welcome to The Wealth platform. Let's start building your financial future!",
      })

      // Redirect to dashboard
      router.push("/dashboard?welcome=true&new=true")
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
          <p className="text-muted-foreground">Loading your profile...</p>
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
              <p className="text-muted-foreground">Session expired. Redirecting to login...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "there"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Progress indicator */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Almost there!</h1>
          <p className="text-muted-foreground">Just 2 more details to complete your profile</p>
          <Progress value={66} className="w-full" />
          <p className="text-xs text-muted-foreground">Step 2 of 3</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">Complete Your Profile</CardTitle>
            <CardDescription>
              Welcome {userName}! We need a couple more details to personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Account info display */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">From Google Account</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Email verified</p>
                  </div>
                </div>
              </div>

              {/* Phone number input */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+977-9800000000"
                  disabled={isLoading}
                  {...form.register("phoneNumber")}
                  className="h-12"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  We'll use this for account security and important notifications
                </p>
              </div>

              {/* Region selection */}
              <div className="space-y-2">
                <Label htmlFor="region" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Region & Currency *
                </Label>
                <Select disabled={isLoading} onValueChange={(value) => form.setValue("region", value)}>
                  <SelectTrigger className="h-12">
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
                {form.formState.errors.region && (
                  <p className="text-sm text-red-500 flex items-center gap-1">{form.formState.errors.region.message}</p>
                )}
                <p className="text-xs text-muted-foreground">This helps us show amounts in your local currency</p>
              </div>

              <Button disabled={isLoading} type="submit" className="w-full h-12 text-base">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Profile & Continue
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
