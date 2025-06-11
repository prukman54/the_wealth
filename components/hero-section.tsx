"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Target } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Take Control of Your{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Financial Future
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
                  Track expenses, build wealth, and achieve your financial goals with our comprehensive personal finance
                  platform.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="text-base px-8 py-3 h-auto">
                  <Link href="/auth/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8 py-3 h-auto">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4 text-green-500" />
                  Bank-level Security
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Target className="h-4 w-4 text-blue-500" />
                  Goal Tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  Investment Tools
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative lg:order-last">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Dashboard Preview */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-12 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center text-white text-sm font-medium">The Wealth Dashboard</div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">$12,450</div>
                        <div className="text-sm text-green-600/80 dark:text-green-400/80">Total Income</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$8,230</div>
                        <div className="text-sm text-blue-600/80 dark:text-blue-400/80">Savings</div>
                      </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>

                    {/* Recent Transactions */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Salary</div>
                            <div className="text-xs text-gray-500">Today</div>
                          </div>
                        </div>
                        <div className="text-green-600 font-medium">+$3,200</div>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Groceries</div>
                            <div className="text-xs text-gray-500">Yesterday</div>
                          </div>
                        </div>
                        <div className="text-red-600 font-medium">-$85</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
