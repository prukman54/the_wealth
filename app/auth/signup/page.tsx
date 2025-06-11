import { AuthForm } from "@/components/auth-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">Start your financial journey today</p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}
