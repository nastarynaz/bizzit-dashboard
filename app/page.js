"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Send, ExternalLink, Bot } from "lucide-react"

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("all-time")
  const [selectedStore, setSelectedStore] = useState("all")
  const [category, setCategory] = useState("all")
  const [chatMessage, setChatMessage] = useState("")

  // Mock data for stores
  const storeData = [
    { id: 1, name: "Toko 1", revenue: "Rp 45.000.000", growth: "+12.5%", color: "bg-green-500" },
    { id: 2, name: "Toko 2", revenue: "Rp 38.000.000", growth: "+8.3%", color: "bg-green-500" },
    { id: 3, name: "Toko 3", revenue: "Rp 52.000.000", growth: "+15.2%", color: "bg-green-500" },
    { id: 4, name: "Toko 4", revenue: "Rp 41.000.000", growth: "-2.1%", color: "bg-orange-500" },
    { id: 5, name: "Toko 5", revenue: "Rp 47.000.000", growth: "+9.8%", color: "bg-green-500" },
  ]

  // Mock promotion data
  const promotionProducts = [
    {
      no: 1,
      name: "Indomie Goreng",
      normalPrice: "Rp 3.500",
      discount: "15%",
      discountPrice: "Rp 2.975",
      type: "Flash Sale",
      duration: "3 hari",
    },
    {
      no: 2,
      name: "Aqua 600ml",
      normalPrice: "Rp 3.000",
      discount: "10%",
      discountPrice: "Rp 2.700",
      type: "Bundle",
      duration: "1 minggu",
    },
  ]

  // Sales chart data points
  const salesData = [
    { x: 5, y: 20 },
    { x: 10, y: 45 },
    { x: 15, y: 35 },
    { x: 20, y: 55 },
    { x: 25, y: 40 },
    { x: 30, y: 65 },
    { x: 35, y: 50 },
    { x: 40, y: 75 },
    { x: 45, y: 60 },
    { x: 50, y: 55 },
    { x: 55, y: 70 },
    { x: 60, y: 45 },
  ]

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage("")
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Summary</h1>
        <p className="text-gray-600">Analisis komprehensif dari 7 toko UMKM minimarket</p>
      </div>

      {/* Filters */}
      <div className="flex gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Timeframe:</label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All-time</SelectItem>
              <SelectItem value="1-year">1 Year</SelectItem>
              <SelectItem value="6-months">6 Months</SelectItem>
              <SelectItem value="3-months">3 Months</SelectItem>
              <SelectItem value="1-month">1 Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Toko:</label>
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {storeData.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Categories:</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="food">Makanan</SelectItem>
              <SelectItem value="beverage">Minuman</SelectItem>
              <SelectItem value="household">Kebutuhan RT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">Rp 22.000.000</p>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+18.2%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">332</p>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+9.3%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">Rp 50.904</p>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+2.2%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-gray-900">Rp 22.000.000</p>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+3.9%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Promotion Recommendation */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Product Promotion Recommendation</CardTitle>
              <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                Lihat Detail
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-600">No</th>
                      <th className="text-left py-2 font-medium text-gray-600">Nama Produk</th>
                      <th className="text-left py-2 font-medium text-gray-600">Harga Normal</th>
                      <th className="text-left py-2 font-medium text-gray-600">Besar Diskon</th>
                      <th className="text-left py-2 font-medium text-gray-600">Harga Diskon</th>
                      <th className="text-left py-2 font-medium text-gray-600">Jenis Diskon</th>
                      <th className="text-left py-2 font-medium text-gray-600">Durasi Diskon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotionProducts.map((product) => (
                      <tr key={product.no} className="border-b border-gray-100">
                        <td className="py-3">{product.no}</td>
                        <td className="py-3 font-medium">{product.name}</td>
                        <td className="py-3">{product.normalPrice}</td>
                        <td className="py-3">{product.discount}</td>
                        <td className="py-3 font-medium text-green-600">{product.discountPrice}</td>
                        <td className="py-3">{product.type}</td>
                        <td className="py-3">{product.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sales Details Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sales Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full relative">
                <svg viewBox="0 0 600 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  {[20, 40, 60, 80, 100].map((y) => (
                    <line
                      key={y}
                      x1="50"
                      y1={180 - y * 1.3}
                      x2="550"
                      y2={180 - y * 1.3}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Y-axis labels */}
                  {["20%", "40%", "60%", "80%", "100%"].map((label, index) => (
                    <text key={label} x="40" y={185 - index * 26} fontSize="12" fill="#6B7280" textAnchor="end">
                      {label}
                    </text>
                  ))}

                  {/* X-axis labels */}
                  {["5k", "10k", "15k", "20k", "25k", "30k", "35k", "40k", "45k", "50k", "55k", "60k"].map(
                    (label, index) => (
                      <text key={label} x={70 + index * 40} y="195" fontSize="12" fill="#6B7280" textAnchor="middle">
                        {label}
                      </text>
                    ),
                  )}

                  {/* Area fill */}
                  <path
                    d={`M 70 ${180 - salesData[0].y * 1.3} ${salesData
                      .map((point, index) => `L ${70 + index * 40} ${180 - point.y * 1.3}`)
                      .join(" ")} L ${70 + (salesData.length - 1) * 40} 180 L 70 180 Z`}
                    fill="url(#salesGradient)"
                  />

                  {/* Line */}
                  <path
                    d={`M 70 ${180 - salesData[0].y * 1.3} ${salesData
                      .map((point, index) => `L ${70 + index * 40} ${180 - point.y * 1.3}`)
                      .join(" ")}`}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />

                  {/* Data points */}
                  {salesData.map((point, index) => (
                    <circle
                      key={index}
                      cx={70 + index * 40}
                      cy={180 - point.y * 1.3}
                      r="3"
                      fill="#3B82F6"
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Peak point highlight */}
                  <circle cx={70 + 7 * 40} cy={180 - 75 * 1.3} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />
                  <rect x={70 + 7 * 40 - 25} y={180 - 75 * 1.3 - 25} width="50" height="20" fill="#3B82F6" rx="4" />
                  <text x={70 + 7 * 40} y={180 - 75 * 1.3 - 10} fontSize="12" fill="white" textAnchor="middle">
                    64.3564
                  </text>
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Store Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Performa Toko</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storeData.map((store) => (
                  <div key={store.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${store.color}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{store.name}</p>
                        <p className="text-sm text-gray-600">{store.revenue}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-medium ${
                            store.growth.startsWith("+") ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {store.growth}
                        </span>
                        {store.growth.startsWith("+") ? (
                          <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 ml-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Growth</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - AI Insights */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">AI Insights</CardTitle>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Bot className="h-4 w-4 mr-2" />
                Cek Insights
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Produk xx akan terjadi melonjakpada bulan ini. Promosi akan meningkatkan keuntungan kita.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <button className="text-sm text-gray-700 hover:text-blue-600 text-left w-full">
                  Apa promosi terbaik sekarang?
                </button>
                <button className="text-sm text-gray-700 hover:text-blue-600 text-left w-full">
                  Apa promosi sekarang?
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Still got question?"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleSendMessage} size="sm" variant="ghost">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
