"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ArrowLeft, TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle, Calendar, Package } from "lucide-react"
import { demandForecast, products, formatNumber } from "@/lib/database"
import Link from "next/link"

// Extended forecast data with historical and predicted values
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

  // Adjust data based on product characteristics
  const multiplier = productId === 1 ? 1.2 : productId === 3 ? 1.5 : 0.8
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
                <h1 className="text-3xl font-bold text-gray-900">Demand Forecasting</h1>
                <p className="text-gray-600">AI-powered demand prediction and trend analysis</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Set Forecast Period
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Target className="w-4 h-4 mr-2" />
                Generate Recommendations
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Forecast Accuracy</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">87.2%</div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">High accuracy</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Products Tracked</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{products.length}</div>
              <div className="text-sm text-gray-600">Active forecasts</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Trending Up</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-green-600">Products increasing</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-orange-600">Require attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-blue-50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Product Analysis
            </TabsTrigger>
            <TabsTrigger value="seasonality" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Seasonality
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Model Performance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Demand Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Overall Demand Trend</CardTitle>
                  <CardDescription>Historical vs predicted demand across all products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={generateForecastData(1)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip formatter={(value) => formatNumber(value)} labelStyle={{ color: "#374151" }} />
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
                  <CardTitle className="text-gray-900">Product Forecasts</CardTitle>
                  <CardDescription>Next month predictions and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demandForecast.map((forecast) => (
                      <div
                        key={forecast.productId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              forecast.currentTrend === "Naik"
                                ? "bg-green-500"
                                : forecast.currentTrend === "Turun"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{forecast.productName}</div>
                            <div className="text-sm text-gray-500">
                              Accuracy: {(forecast.forecastAccuracy * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {formatNumber(forecast.nextMonthPrediction)} units
                          </div>
                          <div
                            className={`text-sm flex items-center ${
                              forecast.currentTrend === "Naik"
                                ? "text-green-600"
                                : forecast.currentTrend === "Turun"
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {forecast.currentTrend === "Naik" ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : forecast.currentTrend === "Turun" ? (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            ) : null}
                            {forecast.currentTrend}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">AI Recommendations</CardTitle>
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
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {demandForecast.map((forecast) => (
                <Card key={forecast.productId}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-gray-900">{forecast.productName}</CardTitle>
                        <CardDescription>Detailed demand analysis and predictions</CardDescription>
                      </div>
                      <Badge
                        className={`${
                          forecast.currentTrend === "Naik"
                            ? "bg-green-100 text-green-800"
                            : forecast.currentTrend === "Turun"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {forecast.currentTrend}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Forecast Chart */}
                      <div className="lg:col-span-2">
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={generateForecastData(forecast.productId)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip formatter={(value) => formatNumber(value)} labelStyle={{ color: "#374151" }} />
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
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Next Month Prediction</div>
                          <div className="text-xl font-bold text-gray-900">
                            {formatNumber(forecast.nextMonthPrediction)}
                          </div>
                          <div className="text-sm text-gray-500">units</div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Recommended Stock</div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatNumber(forecast.recommendedStock)}
                          </div>
                          <div className="text-sm text-gray-500">units</div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Forecast Accuracy</div>
                          <div className="text-xl font-bold text-green-600">
                            {(forecast.forecastAccuracy * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-500">reliability</div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Seasonality</div>
                          <div className="text-sm font-medium text-gray-900">{forecast.seasonality}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Seasonality Tab */}
          <TabsContent value="seasonality" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Seasonal Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Seasonal Demand Patterns</CardTitle>
                  <CardDescription>Quarterly demand variations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={seasonalityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="period" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip formatter={(value) => `${value}%`} labelStyle={{ color: "#374151" }} />
                      <Bar dataKey="demand" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Seasonal Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Seasonal Insights</CardTitle>
                  <CardDescription>Key patterns and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Summer Peak (Q3)</h4>
                      <p className="text-sm text-gray-700">
                        Beverages and cooling products see 40% increase in demand. Prepare inventory 2 months in
                        advance.
                      </p>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Spring Growth (Q2)</h4>
                      <p className="text-sm text-gray-700">
                        General 20% uptick across all categories. Good time for new product launches.
                      </p>
                    </div>

                    <div className="p-4 border border-orange-200 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">Winter Dip (Q1)</h4>
                      <p className="text-sm text-gray-700">
                        15% decrease in overall demand. Focus on promotions and inventory clearance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Model Performance Tab */}
          <TabsContent value="accuracy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Accuracy Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Model Performance Metrics</CardTitle>
                  <CardDescription>Statistical accuracy measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accuracyMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{metric.metric}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{metric.value}</span>
                          <Badge
                            className={`${
                              metric.status === "good"
                                ? "bg-green-100 text-green-800"
                                : metric.status === "average"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Model Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Model Information</CardTitle>
                  <CardDescription>AI forecasting model details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Algorithm</div>
                      <div className="text-gray-900">ARIMA + Machine Learning Ensemble</div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Training Data</div>
                      <div className="text-gray-900">24 months historical sales data</div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Update Frequency</div>
                      <div className="text-gray-900">Daily with new POS data</div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Forecast Horizon</div>
                      <div className="text-gray-900">3 months ahead</div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">Last Updated</div>
                      <div className="text-gray-900">Today, 06:00 AM</div>
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
