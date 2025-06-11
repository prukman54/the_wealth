"use client"

import type React from "react"

import { LogOut } from "lucide-react"
import { useSupabase } from "@/lib/supabase-provider"
import { useRouter } from "next/navigation"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const MobileNav = ({ isOpen, onClose, children }: MobileNavProps) => {
  const { supabase } = useSupabase()
  const router = useRouter()

  return (
    <div className={`fixed inset-0 z-50 bg-white dark:bg-gray-900 ${isOpen ? "block" : "hidden"}`}>
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="text-lg font-semibold">Menu</div>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="p-4">
        {children}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/")
            }}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md w-full"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  )
}
