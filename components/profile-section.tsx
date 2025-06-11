"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { Loader2, Edit, Save, X, User } from "lucide-react"
import { getCurrencySymbol, CURRENCY_MAP } from "@/lib/currency-utils"

interface ProfileSectionProps {
  user: {
    id: string
    full_name: string
    email: string
    phone_number: string
    region: string
    role: string
  } | null
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
    region: user?.region || "np",
  })
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const handleEdit = () => {
    setIsEditing(true)
    setFormData({
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || "",
      email: user?.email || "",
      region: user?.region || "np",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || "",
      email: user?.email || "",
      region: user?.region || "np",
    })
  }

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Update user profile
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          email: formData.email,
          region: formData.region,
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      // Update auth user email if changed
      if (formData.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: formData.email,
        })

        if (authError) {
          console.warn("Auth email update failed:", authError.message)
          // Don't throw error as profile update succeeded
        }
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      setIsEditing(false)

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "There was a problem updating your profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const currencyInfo = CURRENCY_MAP[formData.region as keyof typeof CURRENCY_MAP] || CURRENCY_MAP.np

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </div>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            {isEditing ? (
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                disabled={isLoading}
              />
            ) : (
              <div className="rounded-md border px-3 py-2 bg-muted">{user?.full_name}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                disabled={isLoading}
              />
            ) : (
              <div className="rounded-md border px-3 py-2 bg-muted">{user?.phone_number || "Not provided"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            ) : (
              <div className="rounded-md border px-3 py-2 bg-muted">{user?.email}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region & Currency</Label>
            {isEditing ? (
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
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
            ) : (
              <div className="rounded-md border px-3 py-2 bg-muted">
                {CURRENCY_MAP[user?.region as keyof typeof CURRENCY_MAP]?.name || "Nepal (NPR)"}
                <span className="ml-2 text-muted-foreground">({getCurrencySymbol(user?.region || "np")})</span>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Currency Preview:</strong> Your region determines the currency symbol shown throughout the app.
              Currently selected:{" "}
              <strong>
                {currencyInfo.name} ({currencyInfo.symbol})
              </strong>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
