"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts"
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle, Calendar, Package } from "lucide-react"
import { demandForecast, products, formatNumber } from "@/lib/database"

const generateForecastData = (productId) => {
  const baseData = [
    { month: "Jan", actual: 850, predicted: 820, accuracy: 0.96 },
    { month: "Feb", actual: 920, predicted: 890, accuracy: 0.97 },
    { month: "Mar", actual: 1100, predicted: 1050, accuracy: 0.95 },
    { month: "Apr", actual: 1250, predicted: 1200, accuracy: 0.96 },
    { month: "May", actual: 1180, predicted: 1150, accuracy: 0.97 },
    { month: "Jun", actual: null, predicted: 1300, accuracy: null },
    { month: "Jul", actual: null, predicted: 1420, accuracy: null },
    { month: "Aug", actual: null, predicted: 1380, accuracy: null },
  ]

  let multiplier = 0.8
  if (productId === 1) multiplier = 1.2
  if (productId === 3) multiplier = 1.5

  return baseData.map((item) => ({
    ...item,
    actual: item.actual ? Math.round(item.actual * multiplier) : null,
    predicted: Math.round(item.predicted * multiplier),
  }))
}

const seasonalityData = [
  { period: "Q1", demand: 85, color: "#3B82F6" },
  { period: "Q2", demand: 120, color: "#60A5FA" },
  { period: "Q3", demand: 140, color: "#93C5FD" },
  { period: "Q4", demand: 95, color: "#DBEAFE" },
]

const accuracyMetrics = [
  { metric: "MAPE (Mean Absolute Percentage Error)", value: "8.5%", status: "good" },
  { metric: "MAE (Mean Absolute Error)", value: "45 units", status: "good" },
  { metric: "RMSE (Root Mean Square Error)", value: "62 units", status: "average" },
  { metric: "Forecast Bias", value: "-2.1%", status: "good" },
]

export default function DemandForecasting() {
  const getTrendBadgeClass = (trend) => {
    if (trend === "Naik") return "bg-green-100 text-green-800"
    if (trend === "Turun") return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  const getTrendColor = (trend) => {
    if (trend === "Naik") return "text-green-600"
    if (trend === "Turun") return "text-red-600"
    return "text-gray-600"
  }

  const getStatusBadgeClass = (status) => {
    if (status === "good") return "bg-green-100 text-green-800"
    if (status === "average") return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Demand Forecasting</h1>
            <p className="text-muted-foreground">AI-powered demand prediction and trend analysis</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Set Forecast Period
            </Button>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Generate Recommendations
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              High accuracy
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Tracked</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-xs text-muted-foreground">Active forecasts</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending Up</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-green-600">Products increasing</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs text-orange-600">Require attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Product Analysis</TabsTrigger>
          <TabsTrigger value="seasonality">Seasonality</TabsTrigger>
          <TabsTrigger value="accuracy">Model Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Overall Demand Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Demand Trend</CardTitle>
                <CardDescription>Historical vs predicted demand across all products</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={generateForecastData(1)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatNumber(value)} />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.1}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                    />
                    <ReferenceLine x="May" stroke="#EF4444" strokeDasharray="2 2" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Forecasts */}
            <Card>
              <CardHeader>
                <CardTitle>Product Forecasts</CardTitle>
                <CardDescription>Next month predictions and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demandForecast.map((forecast) => {
                    let dotColor = "bg-gray-500"
                    if (forecast.currentTrend === "Naik") dotColor = "bg-green-500"
                    if (forecast.currentTrend === "Turun") dotColor = "bg-red-500"

                    return (
                      <div
                        key={forecast.productId}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                          <div>
                            <div className="font-medium">{forecast.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              Accuracy: {(forecast.forecastAccuracy * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatNumber(forecast.nextMonthPrediction)} units</div>
                          <div className={`text-sm flex items-center ${getTrendColor(forecast.currentTrend)}`}>
                            {forecast.currentTrend === "Naik" && <TrendingUp className="w-3 h-3 mr-1" />}
                            {forecast.currentTrend === "Turun" && <TrendingDown className="w-3 h-3 mr-1" />}
                            {forecast.currentTrend}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Automated insights and suggested actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Stock Increase</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Increase Air Mineral stock by 25% for next month due to predicted high demand.
                  </p>
                </div>

                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="font-semibold text-orange-800">Seasonal Alert</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Prepare for summer peak: Increase beverage inventory by 40% in June-August.
                  </p>
                </div>

                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-800">Promotion Opportunity</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Consider promoting Keripik Kentang as demand is declining - boost with 15% discount.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Analysis Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {demandForecast.map((forecast) => (
              <Card key={forecast.productId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{forecast.productName}</CardTitle>
                      <CardDescription>Detailed demand analysis and predictions</CardDescription>
                    </div>
                    <Badge className={getTrendBadgeClass(forecast.currentTrend)}>{forecast.currentTrend}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Forecast Chart */}
                    <div className="lg:col-span-2">
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={generateForecastData(forecast.productId)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatNumber(value)} />
                          <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} name="Actual" />
                          <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Predicted"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Next Month Prediction</div>
                        <div className="text-xl font-bold">{formatNumber(forecast.nextMonthPrediction)}</div>
                        <div className="text-sm text-muted-foreground">units</div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Recommended Stock</div>
                        <div className="text-xl font-bold text-blue-600">{formatNumber(forecast.recommendedStock)}</div>
                        <div className="text-sm text-muted-foreground">units</div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
                        <div className="text-xl font-bold text-green-600">
                          {(forecast.forecastAccuracy * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">reliability</div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Seasonality</div>
                        <div className="text-sm font-medium">{forecast.seasonality}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Seasonality Tab */}
        <TabsContent value="seasonality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Seasonal Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Demand Patterns</CardTitle>
                <CardDescription>Quarterly demand variations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={seasonalityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="demand" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Seasonal Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Insights</CardTitle>
                <CardDescription>Key patterns and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Summer Peak (Q3)</h4>
                    <p className="text-sm text-muted-foreground">
                      Beverages and cooling products see 40% increase in demand. Prepare inventory 2 months in advance.
                    </p>
                  </div>

                  <div className="p-4 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Spring Growth (Q2)</h4>
                    <p className="text-sm text-muted-foreground">
                      General 20% uptick across all categories. Good time for new product launches.
                    </p>
                  </div>

                  <div className="p-4 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Winter Dip (Q1)</h4>
                    <p className="text-sm text-muted-foreground">
                      15% decrease in overall demand. Focus on promotions and inventory clearance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Model Performance Tab */}
        <TabsContent value="accuracy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Accuracy Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Metrics</CardTitle>
                <CardDescription>Statistical accuracy measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accuracyMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{metric.metric}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{metric.value}</span>
                        <Badge className={getStatusBadgeClass(metric.status)}>{metric.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model Information */}
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
                <CardDescription>AI forecasting model details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Algorithm</div>
                    <div>ARIMA + Machine Learning Ensemble</div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Training Data</div>
                    <div>24 months historical sales data</div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Update Frequency</div>
                    <div>Daily with new POS data</div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Forecast Horizon</div>
                    <div>3 months ahead</div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Last Updated</div>
                    <div>Today, 06:00 AM</div>
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
