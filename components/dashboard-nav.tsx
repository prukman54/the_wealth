import { BarChart, Calendar, FileText, HelpCircle, Home, Settings, Shield } from "lucide-react"

import type { NavItem } from "@/types"

interface DashboardNavProps {
  items?: NavItem[]
  user?: {
    role: string | undefined
  }
}

export const DashboardNav = ({ items = [], user }: DashboardNavProps) => {
  const routes = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: FileText,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Help",
      href: "/dashboard/help",
      icon: HelpCircle,
    },
    {
      title: "Admin",
      href: "/admin/dashboard",
      icon: Shield,
      adminOnly: true,
    },
  ]

  return (
    <nav className="grid gap-6">
      {routes
        .filter((item) => !item.adminOnly || user?.role === "admin")
        .map((item, index) => (
          <a key={index} href={item.href} className="flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </a>
        ))}
    </nav>
  )
}
