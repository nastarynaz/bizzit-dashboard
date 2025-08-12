"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/database"
import { getPromotionRecommendations, getActivePromotions } from "@/lib/ai"

const promotionTypes = [
  { value: "bundling", label: "Bundling" },
  { value: "discount", label: "Discount" },
  { value: "bogo", label: "Buy One Get One" },
  { value: "cashback", label: "Cashback" },
]

const categories = [
  { value: "susu", label: "Susu" },
  { value: "makanan-ringan", label: "Makanan Ringan" },
  { value: "minuman", label: "Minuman" },
  { value: "kebutuhan-rumah", label: "Kebutuhan Rumah" },
  { value: "personal-care", label: "Personal Care" },
]

// Sample promotion performance data
const promotionPerformanceData = [
  { name: "Week 1", expected: 1200000, actual: 1350000 },
  { name: "Week 2", expected: 1400000, actual: 1280000 },
  { name: "Week 3", expected: 1600000, actual: 1720000 },
  { name: "Week 4", expected: 1800000, actual: 1650000 },
]

const overallMetrics = {
  trend: "Naik 12.5%",
  prediction: "Rp 5.8M profit",
  cac: "Rp 15.000",
  clv: "Rp 450.000",
  roi: "15.2%",
}

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState("recommendations")

  const promotionRecommendations = getPromotionRecommendations()
  const activePromotions = getActivePromotions()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Promotion Recommendations</h1>
          <p className="text-gray-600">Automated promotion suggestions based on sales data and demand forecasting</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="active">Active Promotions</TabsTrigger>
          </TabsList>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            {promotionRecommendations.map((recommendation, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-white rounded-lg border">
                {/* Product Identification */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3 text-sm">
                        <span className="text-green-800 font-semibold">Identifikasi Produk</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-700 font-medium">Nama produk</Label>
                      <div className="p-3 bg-white rounded border mt-1">{recommendation.productName}</div>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">SKU</Label>
                      <div className="p-3 bg-white rounded border mt-1">{recommendation.sku}</div>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Kategori</Label>
                      <div className="p-3 bg-white rounded border mt-1">{recommendation.category}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Promotion Analysis */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3 text-sm">
                        <span className="text-green-800 font-semibold">AI Analysis</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-700 font-medium">Recommendation Status</Label>
                      <div className="mt-1">
                        <Badge variant={recommendation.isRecommended ? "default" : "secondary"}>
                          {recommendation.isRecommended ? "Highly Recommended" : "Not Recommended"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">AI Confidence</Label>
                      <div className="p-3 bg-white rounded border mt-1">{recommendation.confidence}%</div>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Reason</Label>
                      <div className="p-3 bg-white rounded border mt-1 text-sm">{recommendation.reason}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Promotion Details */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3 text-sm">
                        <span className="text-green-800 font-semibold">Recommended Promotion</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-700 font-medium">Tipe promosi</Label>
                      <div className="p-3 bg-white rounded border mt-1">{recommendation.promoType}</div>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Besaran promosi</Label>
                      <div className="p-3 bg-white rounded border mt-1">{recommendation.discountPercent}%</div>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Harga Normal</Label>
                      <div className="p-3 bg-white rounded border mt-1">
                        {formatCurrency(recommendation.normalPrice)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Harga Promo</Label>
                      <div className="p-3 bg-white rounded border mt-1 font-semibold text-blue-600">
                        {formatCurrency(recommendation.promoPrice)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Predictions */}
                <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Time Recommendations */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-gray-900 flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3 text-sm">
                          <span className="text-blue-800 font-semibold">Optimal Timing</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-700 font-medium">Recommended Start</Label>
                        <div className="p-3 bg-white rounded border mt-1">{recommendation.recommendedStartDate}</div>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Recommended End</Label>
                        <div className="p-3 bg-white rounded border mt-1">{recommendation.recommendedEndDate}</div>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Optimal Duration</Label>
                        <div className="p-3 bg-white rounded border mt-1">{recommendation.optimalDuration}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Predictions */}
                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-gray-900 flex items-center">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3 text-sm">
                          <span className="text-purple-800 font-semibold">AI Predictions</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-700 font-medium">Predicted Sales Increase</Label>
                        <div className="p-3 bg-white rounded border mt-1 font-semibold text-green-600">
                          +{recommendation.predictedSalesIncrease} units
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Expected Revenue</Label>
                        <div className="p-3 bg-white rounded border mt-1 font-semibold text-blue-600">
                          {formatCurrency(recommendation.expectedRevenue)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Predicted Profit</Label>
                        <div className="p-3 bg-white rounded border mt-1 font-semibold text-purple-600">
                          {formatCurrency(recommendation.predictedProfit)}
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl">↗️</div>
                            <div className="bg-green-100 p-3 rounded-lg mt-2">
                              <span className="text-green-800 font-semibold">ROI: {recommendation.expectedROI}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Active Promotions Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePromotions.map((promo) => (
                <Card key={promo.id} className="bg-white border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">{promo.productName}</CardTitle>
                    <Badge variant="default" className="w-fit">
                      {promo.type}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-red-600">{promo.discount}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Normal Price:</span>
                      <span className="line-through text-gray-500">{formatCurrency(promo.originalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Promo Price:</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(promo.promoPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ends:</span>
                      <span className="text-sm">{promo.endDate}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Performance:</span>
                        <span className="font-semibold text-green-600">+{promo.salesIncrease}% sales</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
