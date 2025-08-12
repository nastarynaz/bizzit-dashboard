"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ArrowLeft, TrendingUp, ShoppingCart, DollarSign, Package, AlertTriangle, CheckCircle } from "lucide-react"
import {
  stores,
  analyticsData,
  products,
  stockLevels,
  promotions,
  formatCurrency,
  formatNumber,
  getGrowthColor,
  getStockStatus,
} from "@/lib/database"
import Link from "next/link"
import { useParams } from "next/navigation"

// Sample data for individual store
const generateStoreData = (storeId) => {
  const dailySales = [
    { day: "Mon", sales: 2800000, transactions: 45 },
    { day: "Tue", sales: 3200000, transactions: 52 },
    { day: "Wed", sales: 2900000, transactions: 48 },
    { day: "Thu", sales: 3500000, transactions: 58 },
    { day: "Fri", sales: 4200000, transactions: 67 },
    { day: "Sat", sales: 4800000, transactions: 78 },
    { day: "Sun", sales: 3600000, transactions: 59 },
  ]

  const hourlyData = [
    { hour: "06:00", customers: 5 },
    { hour: "08:00", customers: 15 },
    { hour: "10:00", customers: 25 },
    { hour: "12:00", customers: 45 },
    { hour: "14:00", customers: 35 },
    { hour: "16:00", customers: 40 },
    { hour: "18:00", customers: 55 },
    { hour: "20:00", customers: 30 },
    { hour: "22:00", customers: 10 },
  ]

  const productPerformance = [
    { name: "Susu Segar", sales: 180, revenue: 3060000, color: "#3B82F6" },
    { name: "Air Mineral", sales: 320, revenue: 800000, color: "#60A5FA" },
    { name: "Keripik", sales: 95, revenue: 807500, color: "#93C5FD" },
    { name: "Sabun Cuci", sales: 45, revenue: 540000, color: "#DBEAFE" },
    { name: "Shampoo", sales: 28, revenue: 700000, color: "#EFF6FF" },
  ]

  return { dailySales, hourlyData, productPerformance }
}

export default function StoreAnalytics() {
  const params = useParams()
  const storeId = Number.parseInt(params.id)
  const store = stores.find((s) => s.id === storeId)
  const storeAnalytics = analyticsData.byStore[storeId]
  const storeStock = stockLevels.filter((stock) => stock.storeId === storeId)
  const storePromotions = promotions.filter((promo) => Math.random() > 0.5) // Mock active promotions

  if (!store) {
    return <div>Store not found</div>
  }

  const { dailySales, hourlyData, productPerformance } = generateStoreData(storeId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
                <p className="text-gray-600">
                  {store.location} • Manager: {store.manager}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(storeAnalytics?.revenue || 0)}</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className={getGrowthColor(storeAnalytics?.growth || 0)}>
                  {storeAnalytics?.growth > 0 ? "+" : ""}
                  {storeAnalytics?.growth?.toFixed(1) || "0.0"}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(storeAnalytics?.transactions || 0)}</div>
              <div className="text-sm text-gray-600">This month</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Transaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency((storeAnalytics?.revenue || 0) / (storeAnalytics?.transactions || 1))}
              </div>
              <div className="text-sm text-gray-600">Per transaction</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stock Items</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{storeStock.length}</div>
              <div className="text-sm text-red-600">
                {storeStock.filter((s) => s.currentStock <= s.minStock).length} low stock
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-blue-50">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Products
            </TabsTrigger>
            <TabsTrigger value="stock" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Stock
            </TabsTrigger>
            <TabsTrigger value="promotions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Promotions
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Sales Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Daily Sales Trend</CardTitle>
                  <CardDescription>Sales performance over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailySales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip formatter={(value) => formatCurrency(value)} labelStyle={{ color: "#374151" }} />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Customer Traffic */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Customer Traffic</CardTitle>
                  <CardDescription>Hourly customer visits today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="hour" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip labelStyle={{ color: "#374151" }} />
                      <Bar dataKey="customers" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Product Performance</CardTitle>
                  <CardDescription>Revenue by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip formatter={(value) => formatCurrency(value)} labelStyle={{ color: "#374151" }} />
                      <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Products List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Top Selling Products</CardTitle>
                  <CardDescription>Best performers this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productPerformance.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.sales} units sold</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stock Tab */}
          <TabsContent value="stock" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Stock Levels</CardTitle>
                <CardDescription>Current inventory status for this store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Current Stock</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Min Stock</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Max Stock</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeStock.map((stock) => {
                        const product = products.find((p) => p.id === stock.productId)
                        const status = getStockStatus(stock.currentStock, stock.minStock, stock.maxStock)
                        return (
                          <tr key={stock.productId} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{product?.name}</div>
                              <div className="text-sm text-gray-500">{product?.sku}</div>
                            </td>
                            <td className="py-3 px-4 text-right font-medium text-gray-900">{stock.currentStock}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{stock.minStock}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{stock.maxStock}</td>
                            <td className="py-3 px-4 text-center">
                              <Badge className={status.color}>
                                {stock.currentStock <= stock.minStock && <AlertTriangle className="w-3 h-3 mr-1" />}
                                {status.status}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Promotions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Active Promotions</CardTitle>
                  <CardDescription>Currently running promotions in this store</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {storePromotions.map((promo) => (
                      <div key={promo.id} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{promo.name}</h4>
                            <p className="text-sm text-gray-600">{promo.sku}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{promo.discountPercent}% OFF</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Normal Price:</span>
                            <span className="ml-2 font-medium">{formatCurrency(promo.normalPrice)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Promo Price:</span>
                            <span className="ml-2 font-medium text-blue-600">{formatCurrency(promo.promoPrice)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-2 font-medium">{promo.duration}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Expected Sales:</span>
                            <span className="ml-2 font-medium">{promo.predictedSales} units</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Promotion Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Promotion Impact</CardTitle>
                  <CardDescription>Expected vs actual performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Expected Revenue</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(storePromotions.reduce((sum, p) => sum + p.expectedRevenue, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Predicted Profit</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(storePromotions.reduce((sum, p) => sum + p.predictedProfit, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Units</span>
                        <span className="font-semibold text-blue-600">
                          {formatNumber(storePromotions.reduce((sum, p) => sum + p.predictedSales, 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
