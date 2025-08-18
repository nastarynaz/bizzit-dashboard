"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  Store,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Activity,
  Filter,
  Calendar,
  MapPin,
  Grid3X3,
} from "lucide-react"
import {
  stores,
  getOverallAnalytics,
  getTopProducts,
  formatCurrency,
  formatNumber,
  getGrowthColor,
  analyticsData,
  getRevenueTrendData,
} from "@/lib/database"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("1w")
  const [selectedStore, setSelectedStore] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const analytics = getOverallAnalytics()
  const topProducts = getTopProducts()

  const categories = [
    "Makanan & Minuman",
    "Kebutuhan Rumah Tangga",
    "Kesehatan & Kecantikan",
    "Elektronik",
    "Pakaian & Aksesoris",
  ]

  // Filter data based on selected store
  const getFilteredAnalytics = () => {
    if (selectedStore === "all") {
      return analytics
    }

    const storeId = Number.parseInt(selectedStore)
    const storeAnalytics = analyticsData.byStore[storeId]

    return {
      totalRevenue: storeAnalytics?.revenue || 0,
      totalTransactions: storeAnalytics?.transactions || 0,
      avgOrderValue: Math.round((storeAnalytics?.revenue || 0) / (storeAnalytics?.transactions || 1)),
      monthlyGrowth: storeAnalytics?.growth || 0,
    }
  }

  const getFilteredStores = () => {
    if (selectedStore === "all") {
      return stores
    }
    return stores.filter((store) => store.id === Number.parseInt(selectedStore))
  }

  const filteredAnalytics = getFilteredAnalytics()
  const filteredStores = getFilteredStores()
  const revenueTrend = getRevenueTrendData(selectedPeriod)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              {selectedStore === "all"
                ? "Real-time analytics untuk semua toko"
                : `Analytics untuk ${stores.find((s) => s.id === Number.parseInt(selectedStore))?.name}`}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filter Data</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeframe
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1w">1 Minggu</SelectItem>
                  <SelectItem value="1m">1 Bulan</SelectItem>
                  <SelectItem value="3m">3 Bulan</SelectItem>
                  <SelectItem value="1y">1 Tahun</SelectItem>
                  <SelectItem value="2y">2 Tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Toko
              </label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih toko" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Toko</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Categories
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(filteredAnalytics.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />+{filteredAnalytics.monthlyGrowth.toFixed(1)}% from
              last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(filteredAnalytics.totalTransactions)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(filteredAnalytics.avgOrderValue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              +5.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {selectedStore === "all" ? "Active Stores" : "Store Status"}
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedStore === "all" ? `${stores.filter((s) => s.status === "active").length}/7` : "Active"}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="mr-1 h-4 w-4 text-green-500" />
              {selectedStore === "all" ? "All operational" : "Operational"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{revenueTrend.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {revenueTrend.data.map((height, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-primary rounded-t transition-all duration-300 ease-in-out"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-2 text-center">{revenueTrend.labels[index]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatNumber(product.totalSold)} sold</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedStore === "all" ? "Store Overview" : "Store Details"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Store</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Daily Revenue</th>
                  <th className="text-left py-3 px-4 font-medium">Transactions</th>
                  <th className="text-left py-3 px-4 font-medium">Growth</th>
                  <th className="text-left py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{store.name}</p>
                        <p className="text-sm text-muted-foreground">{store.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={store.status === "active" ? "default" : "secondary"}>{store.status}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(store.dailyRevenue)}</td>
                    <td className="py-3 px-4">{formatNumber(Math.round(store.dailyTransactions))}</td>
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
                        <Button variant="outline" size="sm">
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
    </div>
  )
}
