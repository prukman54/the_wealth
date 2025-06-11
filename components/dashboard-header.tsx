"use client"

import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardHeaderProps {
  user: any
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button and logo */}
          <div className="flex items-center lg:hidden">
            <MobileNav />
            <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">The Wealth</h1>
          </div>

          {/* Desktop search */}
          <div className="hidden lg:flex lg:flex-1 lg:max-w-md">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input type="search" placeholder="Search transactions, goals..." className="pl-10 pr-4 py-2 w-full" />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User menu */}
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
