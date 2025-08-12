"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  Activity,
  RefreshCw,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react"
import { stores, formatCurrency, formatNumber } from "@/lib/database"
import Link from "next/link"

// Mock POS connection status for each store
const posConnections = stores.map((store) => ({
  storeId: store.id,
  storeName: store.name,
  status: Math.random() > 0.2 ? "connected" : "disconnected",
  lastSync: new Date(Date.now() - Math.random() * 3600000).toISOString(),
  posSystem: ["Square", "Toast", "Shopify POS", "Clover", "Lightspeed"][Math.floor(Math.random() * 5)],
  transactionsToday: Math.floor(Math.random() * 150) + 50,
  syncErrors: Math.floor(Math.random() * 3),
}))

// Mock real-time transactions
const generateRealtimeTransactions = () => {
  const transactions = []
  for (let i = 0; i < 20; i++) {
    const store = stores[Math.floor(Math.random() * stores.length)]
    transactions.push({
      id: `txn_${Date.now()}_${i}`,
      storeId: store.id,
      storeName: store.name,
      amount: Math.floor(Math.random() * 200000) + 10000,
      items: Math.floor(Math.random() * 8) + 1,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      status: Math.random() > 0.1 ? "synced" : "pending",
    })
  }
  return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

// Mock real-time sales data
const realtimeSalesData = [
  { time: "09:00", sales: 850000, transactions: 12 },
  { time: "10:00", sales: 1200000, transactions: 18 },
  { time: "11:00", sales: 1800000, transactions: 25 },
  { time: "12:00", sales: 2400000, transactions: 35 },
  { time: "13:00", sales: 2100000, transactions: 28 },
  { time: "14:00", sales: 1900000, transactions: 24 },
  { time: "15:00", sales: 2200000, transactions: 31 },
  { time: "16:00", sales: 2600000, transactions: 38 },
]

export default function POSIntegration() {
  const [realtimeTransactions, setRealtimeTransactions] = useState(generateRealtimeTransactions())
  const [isLiveMode, setIsLiveMode] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveMode) return

    const interval = setInterval(() => {
      const newTransaction = {
        id: `txn_${Date.now()}`,
        storeId: stores[Math.floor(Math.random() * stores.length)].id,
        storeName: stores[Math.floor(Math.random() * stores.length)].name,
        amount: Math.floor(Math.random() * 200000) + 10000,
        items: Math.floor(Math.random() * 8) + 1,
        timestamp: new Date().toISOString(),
        status: "synced",
      }

      setRealtimeTransactions((prev) => [newTransaction, ...prev.slice(0, 19)])
    }, 3000)

    return () => clearInterval(interval)
  }, [isLiveMode])

  const connectedStores = posConnections.filter((conn) => conn.status === "connected").length
  const totalTransactionsToday = posConnections.reduce((sum, conn) => sum + conn.transactionsToday, 0)
  const totalSyncErrors = posConnections.reduce((sum, conn) => sum + conn.syncErrors, 0)

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
                <h1 className="text-3xl font-bold text-gray-900">POS Integration</h1>
                <p className="text-gray-600">Real-time point of sale system integration and monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isLiveMode ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                <span className="text-sm text-gray-600">{isLiveMode ? "Live" : "Paused"}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsLiveMode(!isLiveMode)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
              >
                {isLiveMode ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isLiveMode ? "Live Mode" : "Start Live"}
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Settings className="w-4 h-4 mr-2" />
                Configure POS
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Connected Stores</CardTitle>
              <Wifi className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {connectedStores}/{stores.length}
              </div>
              <div className="text-sm text-green-600">
                {((connectedStores / stores.length) * 100).toFixed(0)}% online
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Transactions Today</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalTransactionsToday)}</div>
              <div className="text-sm text-blue-600">Across all stores</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sync Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">98.5%</div>
              <div className="text-sm text-green-600">Success rate</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sync Errors</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalSyncErrors}</div>
              <div className="text-sm text-orange-600">Need attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="realtime" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-blue-50">
            <TabsTrigger value="realtime" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Real-time Monitor
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Store Connections
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Transaction Log
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Integration Settings
            </TabsTrigger>
          </TabsList>

          {/* Real-time Monitor Tab */}
          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                    Live Sales Activity
                  </CardTitle>
                  <CardDescription>Real-time sales data across all stores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={realtimeSalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="time" stroke="#6B7280" />
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

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Activity className="w-5 h-5 text-green-500 mr-2" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>Live transaction feed from all stores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {realtimeTransactions.slice(0, 8).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <div>
                            <div className="font-medium text-gray-900">{transaction.storeName}</div>
                            <div className="text-sm text-gray-500">
                              {transaction.items} items • {new Date(transaction.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</div>
                          <Badge
                            className={
                              transaction.status === "synced"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Store Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {posConnections.map((connection) => (
                <Card key={connection.storeId} className="border-blue-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-gray-900">{connection.storeName}</CardTitle>
                        <CardDescription>POS System: {connection.posSystem}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            connection.status === "connected"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {connection.status === "connected" ? (
                            <Wifi className="w-3 h-3 mr-1" />
                          ) : (
                            <WifiOff className="w-3 h-3 mr-1" />
                          )}
                          {connection.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Connection Status</div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            {connection.status === "connected" ? (
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                            )}
                            <span className="text-sm font-medium">
                              {connection.status === "connected" ? "Online" : "Offline"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last sync: {new Date(connection.lastSync).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Today's Activity</div>
                        <div className="space-y-1">
                          <div className="text-lg font-semibold text-gray-900">{connection.transactionsToday}</div>
                          <div className="text-xs text-gray-500">transactions processed</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Sync Health</div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            {connection.syncErrors === 0 ? (
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                            )}
                            <span className="text-sm font-medium">
                              {connection.syncErrors === 0 ? "Healthy" : `${connection.syncErrors} errors`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Actions</div>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-blue-600 border-blue-600 bg-transparent"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Force Sync
                          </Button>
                          <Button variant="outline" size="sm" className="w-full text-gray-600 bg-transparent">
                            <Settings className="w-3 h-3 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transaction Log Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Transaction Sync Log</CardTitle>
                <CardDescription>Detailed log of all POS transactions and sync status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Transaction ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Store</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Items</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {realtimeTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm text-gray-600">{transaction.id.slice(-8)}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{transaction.storeName}</div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600">{transaction.items}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge
                              className={
                                transaction.status === "synced"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {transaction.status === "synced" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {transaction.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">API Configuration</CardTitle>
                  <CardDescription>Configure POS system integration endpoints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="webhookUrl" className="text-gray-700">
                      Webhook URL
                    </Label>
                    <Input
                      id="webhookUrl"
                      value="https://dashboard.minimarket.com/api/pos/webhook"
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiKey" className="text-gray-700">
                      API Key
                    </Label>
                    <Input id="apiKey" value="mk_live_••••••••••••••••" readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="syncInterval" className="text-gray-700">
                      Sync Interval (seconds)
                    </Label>
                    <Input id="syncInterval" value="30" className="bg-white" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Update Configuration</Button>
                </CardContent>
              </Card>

              {/* Integration Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Integration Health</CardTitle>
                  <CardDescription>System performance and reliability metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-gray-700">API Uptime</span>
                      </div>
                      <span className="font-semibold text-green-600">99.9%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Activity className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-gray-700">Average Response Time</span>
                      </div>
                      <span className="font-semibold text-blue-600">120ms</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Zap className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-gray-700">Transactions/Hour</span>
                      </div>
                      <span className="font-semibold text-purple-600">1,247</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <RefreshCw className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="text-gray-700">Failed Syncs (24h)</span>
                      </div>
                      <span className="font-semibold text-orange-600">3</span>
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
