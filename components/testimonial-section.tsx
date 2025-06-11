export function TestimonialSection() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Hear from people who have transformed their financial lives with The Wealth.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm">
            <div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 fill-primary text-primary"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400">
                  "The Wealth has completely changed how I manage my money. I've gone from living paycheck to paycheck
                  to having a solid emergency fund and investment portfolio."
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div className="ml-4">
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Manager</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm">
            <div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 fill-primary text-primary"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400">
                  "As someone who was never good with money, The Wealth's educational resources and easy tracking tools
                  have been a game-changer for my financial confidence."
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div className="ml-4">
                <p className="text-sm font-medium">Michael Chen</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Software Developer</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm">
            <div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 fill-primary text-primary"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400">
                  "I've tried many financial apps, but The Wealth stands out with its comprehensive approach to not just
                  tracking, but actually building wealth through smart decisions."
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div className="ml-4">
                <p className="text-sm font-medium">Aisha Patel</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Small Business Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
