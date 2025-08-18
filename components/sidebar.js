"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, TrendingUp, Tag, Package, Zap, MessageCircle, Home } from "lucide-react"

const navigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Demand Forecasting", href: "/forecasting", icon: TrendingUp },
  { name: "Promotion Management", href: "/promotions", icon: Tag },
  { name: "Stock Management", href: "/stock", icon: Package },
  { name: "POS Integrations", href: "/pos-integration", icon: Zap },
  { name: "Chat Bot", href: "/chat", icon: MessageCircle },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-600">DATA Dashboard</h1>
            <p className="text-xs text-gray-500">Analisis insight terbaik minimarket</p>
            <p className="text-xs text-gray-400">dashboard.id</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
