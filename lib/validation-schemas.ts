import * as z from "zod"

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
})

export const signupSchema = z
  .object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Profile validation schemas
export const completeProfileSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[+]?[1-9][\d]{0,15}$/, { message: "Please enter a valid phone number" }),
  region: z.string().min(1, { message: "Please select your region" }),
})

// Transaction validation schemas
export const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine(
      (val) => {
        const num = Number.parseFloat(val)
        return !isNaN(num) && num > 0 && num <= 1000000
      },
      { message: "Amount must be a positive number less than 1,000,000" },
    ),
  category: z.string().min(1, { message: "Please select a category" }),
  date: z
    .string()
    .min(1, { message: "Please select a date" })
    .refine(
      (date) => {
        const selectedDate = new Date(date)
        const today = new Date()
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(today.getFullYear() - 1)
        return selectedDate <= today && selectedDate >= oneYearAgo
      },
      { message: "Date must be within the last year and not in the future" },
    ),
  description: z.string().max(500, { message: "Description must be less than 500 characters" }).optional(),
})

// Quote validation schemas
export const quoteSchema = z.object({
  quote: z
    .string()
    .min(10, { message: "Quote must be at least 10 characters" })
    .max(500, { message: "Quote must be less than 500 characters" }),
  author: z
    .string()
    .min(2, { message: "Author name must be at least 2 characters" })
    .max(100, { message: "Author name must be less than 100 characters" }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>
export type TransactionFormValues = z.infer<typeof transactionSchema>
export type QuoteFormValues = z.infer<typeof quoteSchema>
