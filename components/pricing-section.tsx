import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Choose the plan that's right for your financial journey.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-gray-500 dark:text-gray-400">Get started with basic financial tracking</p>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">$0</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Basic expense tracking</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Income tracking</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Simple budgeting tools</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Financial education articles</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/auth/signup" passHref>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm ring-2 ring-primary">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-gray-500 dark:text-gray-400">Advanced tools for serious wealth builders</p>
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Most Popular</div>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Advanced expense analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Investment portfolio tracking</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Savings goals with projections</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Financial health score</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/auth/signup?plan=pro" passHref>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Premium</h3>
              <p className="text-gray-500 dark:text-gray-400">Comprehensive wealth management suite</p>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">$19.99</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Tax optimization suggestions</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Retirement planning tools</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Estate planning resources</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Priority customer support</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/auth/signup?plan=premium" passHref>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
