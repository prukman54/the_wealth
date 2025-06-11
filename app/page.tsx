import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold">The Wealth</span>
              <span className="text-sm text-muted-foreground">by Rukman Puri</span>
            </Link>
          </div>
          <nav className="hidden gap-6 md:flex">
            <a
              href="https://rukman.com.np"
              className="text-sm font-medium transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Main Website
            </a>
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" passHref>
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/signup" passHref>
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <PricingSection />
      <Footer />
    </div>
  )
}
