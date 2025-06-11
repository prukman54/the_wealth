import { BarChart3, PiggyBank, TrendingUp, LineChart, Shield, BookOpen } from "lucide-react"

export function FeatureSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Build Wealth</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our comprehensive tools help you track, plan, and grow your wealth with confidence.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
              <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Expense Tracking</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Easily track and categorize your expenses to understand your spending habits.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
              <PiggyBank className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Savings Goals</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Set and track savings goals with visual progress indicators and milestone celebrations.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Investment Tracking</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Monitor your investments and track performance across different asset classes.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
              <LineChart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Financial Reports</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Generate detailed reports and visualizations to understand your financial health.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Secure Data</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Your financial data is encrypted and securely stored with bank-level security.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
              <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold">Financial Education</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Access educational resources to improve your financial literacy and decision-making.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
