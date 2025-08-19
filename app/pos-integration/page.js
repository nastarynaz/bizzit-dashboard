"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Wifi, WifiOff, Activity, RefreshCw, Settings, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react"
// Temporary empty data while migrating from database.js
const stores = [];

import { formatCurrency, formatNumber } from "@/lib/utils-format"

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

const generateTransactionId = (index) => {
  return "txn_" + Date.now() + "_" + index
}

// Mock real-time transactions
const generateRealtimeTransactions = () => {
  const transactions = []
  for (let i = 0; i < 20; i++) {
    const store = stores[Math.floor(Math.random() * stores.length)]
    transactions.push({
      id: generateTransactionId(i),
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
        id: generateTransactionId(Date.now()),
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
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">POS Integration</h1>
            <p className="text-muted-foreground">Real-time point of sale system integration and monitoring</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div
                className={
                  isLiveMode ? "w-3 h-3 rounded-full bg-green-500 animate-pulse" : "w-3 h-3 rounded-full bg-gray-400"
                }
              />
              <span className="text-sm text-muted-foreground">{isLiveMode ? "Live" : "Paused"}</span>
            </div>
            <Button variant="outline" onClick={() => setIsLiveMode(!isLiveMode)}>
              {isLiveMode ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isLiveMode ? "Live Mode" : "Start Live"}
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Configure POS
            </Button>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Stores</CardTitle>
            <Wifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connectedStores}/{stores.length}
            </div>
            <div className="text-sm text-green-600">{((connectedStores / stores.length) * 100).toFixed(0)}% online</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalTransactionsToday)}</div>
            <div className="text-sm text-blue-600">Across all stores</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <div className="text-sm text-green-600">Success rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSyncErrors}</div>
            <div className="text-sm text-orange-600">Need attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="realtime">Real-time Monitor</TabsTrigger>
          <TabsTrigger value="connections">Store Connections</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Log</TabsTrigger>
          <TabsTrigger value="settings">Integration Settings</TabsTrigger>
        </TabsList>

        {/* Real-time Monitor Tab */}
        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Live Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  Live Sales Activity
                </CardTitle>
                <CardDescription>Real-time sales data across all stores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={realtimeSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
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
                <CardTitle className="flex items-center">
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
                      className="flex items-center justify-between p-3 bg-muted rounded-lg border-l-4 border-blue-500"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <div>
                          <div className="font-medium">{transaction.storeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.items} items • {new Date(transaction.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(transaction.amount)}</div>
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Store Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {posConnections.map((connection) => (
              <Card key={connection.storeId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{connection.storeName}</CardTitle>
                      <CardDescription>POS System: {connection.posSystem}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          connection.status === "connected" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Connection Status</div>
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
                        <div className="text-xs text-muted-foreground">
                          Last sync: {new Date(connection.lastSync).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Today's Activity</div>
                      <div className="space-y-1">
                        <div className="text-lg font-semibold">{connection.transactionsToday}</div>
                        <div className="text-xs text-muted-foreground">transactions processed</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Sync Health</div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          {connection.syncErrors === 0 ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                          )}
                          <span className="text-sm font-medium">
                            {connection.syncErrors === 0 ? "Healthy" : connection.syncErrors + " errors"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Actions</div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Force Sync
                        </Button>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
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
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Sync Log</CardTitle>
              <CardDescription>Detailed log of all POS transactions and sync status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium">Store</th>
                      <th className="text-right py-3 px-4 font-medium">Amount</th>
                      <th className="text-right py-3 px-4 font-medium">Items</th>
                      <th className="text-left py-3 px-4 font-medium">Time</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realtimeTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm text-muted-foreground">
                          {transaction.id.slice(-8)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{transaction.storeName}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(transaction.amount)}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{transaction.items}</td>
                        <td className="py-3 px-4 text-muted-foreground">
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
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Configure POS system integration endpoints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value="https://dashboard.minimarket.com/api/pos/webhook"
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input id="apiKey" value="mk_live_••••••••••••••••" readOnly className="bg-muted" />
                </div>
                <div>
                  <Label htmlFor="syncInterval">Sync Interval (seconds)</Label>
                  <Input id="syncInterval" value="30" />
                </div>
                <Button className="w-full">Update Configuration</Button>
              </CardContent>
            </Card>

            {/* Integration Health */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Health</CardTitle>
                <CardDescription>System performance and reliability metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span>API Uptime</span>
                    </div>
                    <span className="font-semibold text-green-600">99.9%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 text-blue-600 mr-2" />
                      <span>Average Response Time</span>
                    </div>
                    <span className="font-semibold text-blue-600">120ms</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 text-purple-600 mr-2" />
                      <span>Transactions/Hour</span>
                    </div>
                    <span className="font-semibold text-purple-600">1,247</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <RefreshCw className="w-5 h-5 text-orange-600 mr-2" />
                      <span>Failed Syncs (24h)</span>
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
  )
}
