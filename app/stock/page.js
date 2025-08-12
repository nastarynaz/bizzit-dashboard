"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  Plus,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react"
import { stores, products, stockLevels, formatNumber, getStockStatus } from "@/lib/database"
import Link from "next/link"

// Enhanced stock data with additional fields
const enhancedStockData = stockLevels.map((stock) => {
  const product = products.find((p) => p.id === stock.productId)
  const store = stores.find((s) => s.id === stock.storeId)
  const status = getStockStatus(stock.currentStock, stock.minStock, stock.maxStock)

  return {
    ...stock,
    productName: product?.name || "Unknown Product",
    productSku: product?.sku || "N/A",
    storeName: store?.name || "Unknown Store",
    status: status.status,
    statusColor: status.color,
    reorderPoint: stock.minStock + 10,
    lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    supplier: product?.supplier || "Unknown Supplier",
    unitCost: Math.floor(Math.random() * 15000) + 5000,
    totalValue: 0, // Will be calculated
  }
})

// Calculate total value
enhancedStockData.forEach((item) => {
  item.totalValue = item.currentStock * item.unitCost
})

// Stock alerts
const stockAlerts = enhancedStockData
  .filter((item) => item.status === "Low" || item.currentStock <= item.reorderPoint)
  .sort((a, b) => a.currentStock - b.currentStock)

// Stock summary by status
const stockSummary = [
  { name: "Low Stock", value: enhancedStockData.filter((item) => item.status === "Low").length, color: "#EF4444" },
  { name: "Normal", value: enhancedStockData.filter((item) => item.status === "Normal").length, color: "#3B82F6" },
  { name: "High Stock", value: enhancedStockData.filter((item) => item.status === "High").length, color: "#10B981" },
]

// Stock movement data (mock)
const stockMovements = [
  {
    id: 1,
    type: "restock",
    productName: "Susu Segar Full Cream 1L",
    storeName: "Minimarket Utama",
    quantity: 50,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    id: 2,
    type: "transfer",
    productName: "Air Mineral 600ml",
    fromStore: "Minimarket Utama",
    toStore: "Minimarket Cabang A",
    quantity: 30,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: "in-transit",
  },
  {
    id: 3,
    type: "sale",
    productName: "Keripik Kentang Original",
    storeName: "Minimarket Cabang B",
    quantity: -15,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
]

export default function StockManagement() {
  const [selectedStore, setSelectedStore] = useState("all")
  const [transferForm, setTransferForm] = useState({
    product: "",
    fromStore: "",
    toStore: "",
    quantity: "",
  })

  const filteredStock =
    selectedStore === "all"
      ? enhancedStockData
      : enhancedStockData.filter((item) => item.storeId.toString() === selectedStore)

  const totalStockValue = filteredStock.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockCount = filteredStock.filter((item) => item.status === "Low").length
  const totalItems = filteredStock.reduce((sum, item) => sum + item.currentStock, 0)

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
                <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
                <p className="text-gray-600">Inventory control and optimization across all stores</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Stock
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Filter */}
        <div className="mb-6">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-64 bg-white">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Stock Value</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">Rp {formatNumber(totalStockValue)}</div>
              <div className="text-sm text-blue-600">
                Across {selectedStore === "all" ? "all stores" : "selected store"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalItems)}</div>
              <div className="text-sm text-gray-600">Units in stock</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{lowStockCount}</div>
              <div className="text-sm text-red-600">Need attention</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stock Turnover</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">8.5x</div>
              <div className="text-sm text-green-600">Annual rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-blue-50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Alerts
            </TabsTrigger>
            <TabsTrigger value="movements" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Movements
            </TabsTrigger>
            <TabsTrigger value="transfers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Transfers
            </TabsTrigger>
            <TabsTrigger
              value="optimization"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Optimization
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stock Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Stock Status Distribution</CardTitle>
                  <CardDescription>Current stock levels across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stockSummary}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {stockSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {stockSummary.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stock by Store */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-gray-900">Stock by Store</CardTitle>
                  <CardDescription>Inventory distribution across all locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={stores.map((store) => ({
                        name: store.name.replace("Minimarket ", ""),
                        stock: enhancedStockData
                          .filter((item) => item.storeId === store.id)
                          .reduce((sum, item) => sum + item.currentStock, 0),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip labelStyle={{ color: "#374151" }} />
                      <Bar dataKey="stock" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Stock Details Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Stock Details</CardTitle>
                <CardDescription>Detailed inventory information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Store</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Current</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Min</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Max</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStock.slice(0, 10).map((item) => (
                        <tr
                          key={`${item.storeId}-${item.productId}`}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{item.productName}</div>
                              <div className="text-sm text-gray-500">{item.productSku}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{item.storeName}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">{item.currentStock}</td>
                          <td className="py-3 px-4 text-right text-gray-600">{item.minStock}</td>
                          <td className="py-3 px-4 text-right text-gray-600">{item.maxStock}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={item.statusColor}>
                              {item.status === "Low" && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">
                            Rp {formatNumber(item.totalValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  Stock Alerts ({stockAlerts.length})
                </CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockAlerts.map((alert) => (
                    <div
                      key={`${alert.storeId}-${alert.productId}`}
                      className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50"
                    >
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="font-medium text-gray-900">{alert.productName}</div>
                          <div className="text-sm text-gray-600">
                            {alert.storeName} • SKU: {alert.productSku}
                          </div>
                          <div className="text-sm text-red-600">
                            Only {alert.currentStock} units left (Min: {alert.minStock})
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Reorder
                        </Button>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 bg-transparent">
                          Transfer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Movements Tab */}
          <TabsContent value="movements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Stock Movements</CardTitle>
                <CardDescription>Recent inventory changes and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            movement.type === "restock"
                              ? "bg-green-100"
                              : movement.type === "transfer"
                                ? "bg-blue-100"
                                : "bg-orange-100"
                          }`}
                        >
                          {movement.type === "restock" && <Plus className="w-5 h-5 text-green-600" />}
                          {movement.type === "transfer" && <ArrowUpDown className="w-5 h-5 text-blue-600" />}
                          {movement.type === "sale" && <TrendingDown className="w-5 h-5 text-orange-600" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{movement.productName}</div>
                          <div className="text-sm text-gray-600">
                            {movement.type === "transfer"
                              ? `${movement.fromStore} → ${movement.toStore}`
                              : movement.storeName}
                          </div>
                          <div className="text-sm text-gray-500">{new Date(movement.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                          {movement.quantity > 0 ? "+" : ""}
                          {movement.quantity} units
                        </div>
                        <Badge
                          className={
                            movement.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : movement.status === "in-transit"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {movement.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {movement.status === "in-transit" && <Truck className="w-3 h-3 mr-1" />}
                          {movement.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {movement.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfers Tab */}
          <TabsContent value="transfers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Transfer */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Create Stock Transfer</CardTitle>
                  <CardDescription>Move inventory between stores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="product" className="text-gray-700">
                      Product
                    </Label>
                    <Select onValueChange={(value) => setTransferForm({ ...transferForm, product: value })}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} ({product.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fromStore" className="text-gray-700">
                      From Store
                    </Label>
                    <Select onValueChange={(value) => setTransferForm({ ...transferForm, fromStore: value })}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select source store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id.toString()}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="toStore" className="text-gray-700">
                      To Store
                    </Label>
                    <Select onValueChange={(value) => setTransferForm({ ...transferForm, toStore: value })}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select destination store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id.toString()}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-gray-700">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={transferForm.quantity}
                      onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                      placeholder="Enter quantity"
                      className="bg-white"
                    />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Create Transfer
                  </Button>
                </CardContent>
              </Card>

              {/* Transfer History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Recent Transfers</CardTitle>
                  <CardDescription>Latest stock transfer activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stockMovements
                      .filter((m) => m.type === "transfer")
                      .map((transfer) => (
                        <div key={transfer.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-900">{transfer.productName}</div>
                            <Badge
                              className={
                                transfer.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {transfer.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {transfer.fromStore} → {transfer.toStore}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transfer.quantity} units • {new Date(transfer.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Optimization Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">AI Recommendations</CardTitle>
                  <CardDescription>Automated inventory optimization suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">Reorder Recommendation</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Reorder 200 units of Air Mineral for Cabang A - predicted stockout in 3 days.
                      </p>
                    </div>

                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center mb-2">
                        <ArrowUpDown className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">Transfer Opportunity</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Transfer 50 units of Keripik from Utama to Cabang C to balance inventory.
                      </p>
                    </div>

                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="font-semibold text-orange-800">Overstock Alert</span>
                      </div>
                      <p className="text-sm text-orange-700">
                        Cabang E has 180% of optimal Shampoo stock - consider promotion or transfer.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Optimization Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Inventory Efficiency</span>
                      <span className="font-semibold text-green-600">87.5%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Stock Turnover Rate</span>
                      <span className="font-semibold text-blue-600">8.5x/year</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Carrying Cost</span>
                      <span className="font-semibold text-orange-600">12.3%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Stockout Risk</span>
                      <span className="font-semibold text-red-600">2.1%</span>
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
