"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, TrendingUp, Tag, Package, CreditCard, MessageCircle, Home, Server } from "lucide-react"
import { getVisibleNavigationItems } from "@/lib/sidebar-visibility-config"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Overview",
    url: "/",
    icon: Home,
  },
  {
    title: "Forecasting",
    url: "/forecasting",
    icon: TrendingUp,
  },
  {
    title: "Promotion Management",
    url: "/promotions",
    icon: Tag,
  },
  {
    title: "Stock Management",
    url: "/stock",
    icon: Package,
  },
  {
    title: "POS Integrations",
    url: "/pos-integration",
    icon: CreditCard,
  },
  {
    title: "External API Test",
    url: "/api-test-external",
    icon: Server,
  },
  {
    title: "Chatbot",
    url: "/chatbot",
    icon: MessageCircle,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  
  // Get only the visible navigation items based on configuration
  const visibleNavigationItems = getVisibleNavigationItems(navigationItems)

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4 border-b">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <div className="flex flex-col">
            <span className="font-semibold">Minimarket</span>
            <span className="text-xs text-muted-foreground">Sales Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
