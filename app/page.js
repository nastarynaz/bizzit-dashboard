"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  Store,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Target,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import {
  stores,
  getOverallAnalytics,
  getTopProducts,
  formatCurrency,
  formatNumber,
  getGrowthColor,
} from "@/lib/database"

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const analytics = getOverallAnalytics()
  const topProducts = getTopProducts()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minimarket Sales Dashboard</h1>
          <p className="text-gray-600">Overview semua toko - Real-time analytics dan insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
                <span className="text-sm text-gray-500 ml-1">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
                <ShoppingCart className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalTransactions)}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.2%</span>
                <span className="text-sm text-gray-500 ml-1">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Average Order Value</CardTitle>
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.avgOrderValue)}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5.1%</span>
                <span className="text-sm text-gray-500 ml-1">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Stores</CardTitle>
                <Store className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stores.filter((s) => s.status === "active").length}/7
              </div>
              <div className="flex items-center mt-2">
                <Activity className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">All operational</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Revenue Trend (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {[65, 78, 82, 95, 88, 92, 105].map((height, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-blue-500 rounded-t" style={{ height: `${height}%` }} />
                    <span className="text-xs text-gray-500 mt-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatNumber(product.totalSold)} sold</p>
                      <p className="text-sm text-gray-500">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store Overview */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Store Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Store</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Daily Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Transactions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Growth</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{store.name}</p>
                          <p className="text-sm text-gray-500">{store.location}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={store.status === "active" ? "default" : "secondary"}
                          className={store.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {store.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(store.dailyRevenue)}</td>
                      <td className="py-3 px-4 text-gray-600">{formatNumber(store.dailyTransactions)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {store.growth > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className={getGrowthColor(store.growth)}>
                            {store.growth > 0 ? "+" : ""}
                            {store.growth}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/store/${store.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                          >
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/forecasting">
                <Button
                  variant="outline"
                  className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent h-12"
                >
                  <Target className="w-5 h-5 mr-3" />
                  Demand Forecasting
                </Button>
              </Link>
              <Link href="/promotions">
                <Button
                  variant="outline"
                  className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent h-12"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Promotion Management
                </Button>
              </Link>
              <Link href="/stock">
                <Button
                  variant="outline"
                  className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent h-12"
                >
                  <Package className="w-5 h-5 mr-3" />
                  Stock Management
                </Button>
              </Link>
              <Link href="/pos-integration">
                <Button
                  variant="outline"
                  className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent h-12"
                >
                  <PieChart className="w-5 h-5 mr-3" />
                  POS Integration
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
