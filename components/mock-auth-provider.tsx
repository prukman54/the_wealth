"use client"

import type React from "react"
import { createContext, useContext } from "react"

// Mock Supabase client for demo purposes
const mockSupabaseClient = {
  auth: {
    signInWithPassword: async () => ({ error: new Error("Demo mode - Supabase not configured") }),
    signUp: async () => ({ error: new Error("Demo mode - Supabase not configured") }),
    signInWithOAuth: async () => ({ error: new Error("Demo mode - Supabase not configured") }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: async () => ({ data: { session: null } }),
    getUser: async () => ({ data: { user: null } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error("Demo mode") }),
      }),
    }),
    insert: async () => ({ error: new Error("Demo mode") }),
  }),
}

type MockSupabaseContext = {
  supabase: typeof mockSupabaseClient
}

const MockContext = createContext<MockSupabaseContext | undefined>(undefined)

export function MockSupabaseProvider({ children }: { children: React.ReactNode }) {
  return <MockContext.Provider value={{ supabase: mockSupabaseClient }}>{children}</MockContext.Provider>
}

export const useMockSupabase = () => {
  const context = useContext(MockContext)
  if (context === undefined) {
    throw new Error("useMockSupabase must be used inside MockSupabaseProvider")
  }
  return context
}
