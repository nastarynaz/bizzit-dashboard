// AI-powered promotion recommendation engine
export function getPromotionRecommendations() {
  return [
    {
      productName: "Susu Segar Full Cream 1L",
      sku: "SSF-C-1000",
      category: "Susu",
      isRecommended: true,
      confidence: 92,
      reason: "High demand trend detected, low current stock levels, seasonal peak approaching",
      promoType: "Bundling",
      discountPercent: 15,
      normalPrice: 20000,
      promoPrice: 17000,
      recommendedStartDate: "2025-08-15 00:00",
      recommendedEndDate: "2025-08-20 23:59",
      optimalDuration: "5 Hari",
      predictedSalesIncrease: 1200,
      expectedRevenue: 20400000,
      predictedProfit: 5800000,
      expectedROI: 28.4,
    },
    {
      productName: "Mie Instan Ayam Bawang",
      sku: "MIA-B-500",
      category: "Makanan Ringan",
      isRecommended: true,
      confidence: 87,
      reason: "Consistent sales pattern, competitor pricing analysis suggests opportunity",
      promoType: "Buy 2 Get 1",
      discountPercent: 20,
      normalPrice: 3500,
      promoPrice: 2800,
      recommendedStartDate: "2025-08-18 00:00",
      recommendedEndDate: "2025-08-25 23:59",
      optimalDuration: "7 Hari",
      predictedSalesIncrease: 2400,
      expectedRevenue: 6720000,
      predictedProfit: 1680000,
      expectedROI: 25.0,
    },
    {
      productName: "Sabun Mandi Cair 250ml",
      sku: "SMC-250",
      category: "Personal Care",
      isRecommended: true,
      confidence: 78,
      reason: "Inventory optimization needed, slow-moving stock, bundle opportunity",
      promoType: "Discount",
      discountPercent: 12,
      normalPrice: 15000,
      promoPrice: 13200,
      recommendedStartDate: "2025-08-20 00:00",
      recommendedEndDate: "2025-08-27 23:59",
      optimalDuration: "7 Hari",
      predictedSalesIncrease: 800,
      expectedRevenue: 10560000,
      predictedProfit: 2640000,
      expectedROI: 25.0,
    },
    {
      productName: "Kopi Sachet Premium",
      sku: "KSP-001",
      category: "Minuman",
      isRecommended: false,
      confidence: 45,
      reason: "Recent promotion still active, market saturation detected, low profit margin",
      promoType: "Cashback",
      discountPercent: 8,
      normalPrice: 2000,
      promoPrice: 1840,
      recommendedStartDate: "2025-09-01 00:00",
      recommendedEndDate: "2025-09-07 23:59",
      optimalDuration: "7 Hari",
      predictedSalesIncrease: 300,
      expectedRevenue: 552000,
      predictedProfit: 110400,
      expectedROI: 20.0,
    },
    {
      productName: "Deterjen Bubuk 1kg",
      sku: "DB-1000",
      category: "Kebutuhan Rumah",
      isRecommended: true,
      confidence: 89,
      reason: "High customer loyalty, bulk purchase opportunity, seasonal demand increase",
      promoType: "Bundling",
      discountPercent: 18,
      normalPrice: 25000,
      promoPrice: 20500,
      recommendedStartDate: "2025-08-16 00:00",
      recommendedEndDate: "2025-08-23 23:59",
      optimalDuration: "7 Hari",
      predictedSalesIncrease: 1500,
      expectedRevenue: 30750000,
      predictedProfit: 9225000,
      expectedROI: 30.0,
    },
  ]
}

// Get currently active promotions with performance data
export function getActivePromotions() {
  return [
    {
      id: 1,
      productName: "Biskuit Cokelat Premium",
      type: "Flash Sale",
      discount: 25,
      originalPrice: 12000,
      promoPrice: 9000,
      startDate: "2025-08-10",
      endDate: "2025-08-17",
      salesIncrease: 45,
      status: "active",
    },
    {
      id: 2,
      productName: "Shampoo Anti Ketombe",
      type: "Buy 1 Get 1",
      discount: 50,
      originalPrice: 18000,
      promoPrice: 18000,
      startDate: "2025-08-12",
      endDate: "2025-08-19",
      salesIncrease: 67,
      status: "active",
    },
    {
      id: 3,
      productName: "Teh Celup Melati",
      type: "Bundle Deal",
      discount: 15,
      originalPrice: 8000,
      promoPrice: 6800,
      startDate: "2025-08-08",
      endDate: "2025-08-15",
      salesIncrease: 32,
      status: "active",
    },
    {
      id: 4,
      productName: "Pasta Gigi Keluarga",
      type: "Cashback",
      discount: 20,
      originalPrice: 14000,
      promoPrice: 14000,
      startDate: "2025-08-11",
      endDate: "2025-08-18",
      salesIncrease: 28,
      status: "active",
    },
    {
      id: 5,
      productName: "Minyak Goreng 1L",
      type: "Volume Discount",
      discount: 12,
      originalPrice: 16000,
      promoPrice: 14080,
      startDate: "2025-08-09",
      endDate: "2025-08-16",
      salesIncrease: 38,
      status: "active",
    },
    {
      id: 6,
      productName: "Susu UHT Strawberry",
      type: "Weekend Special",
      discount: 18,
      originalPrice: 5500,
      promoPrice: 4510,
      startDate: "2025-08-14",
      endDate: "2025-08-16",
      salesIncrease: 52,
      status: "active",
    },
  ]
}

// AI confidence scoring algorithm
export function calculatePromotionConfidence(product, salesData, marketData) {
  let confidence = 50 // Base confidence

  // Factors that increase confidence
  if (salesData.trend === "increasing") confidence += 20
  if (product.stockLevel === "low") confidence += 15
  if (marketData.seasonalDemand === "high") confidence += 10
  if (product.profitMargin > 0.3) confidence += 10

  // Factors that decrease confidence
  if (product.recentPromotion) confidence -= 25
  if (marketData.competition === "high") confidence -= 10
  if (product.category === "saturated") confidence -= 15

  return Math.max(0, Math.min(100, confidence))
}

// Generate promotion reasoning based on data analysis
export function generatePromotionReason(product, confidence) {
  const reasons = {
    high: [
      "High demand trend detected, low current stock levels, seasonal peak approaching",
      "Consistent sales pattern, competitor pricing analysis suggests opportunity",
      "High customer loyalty, bulk purchase opportunity, seasonal demand increase",
      "Strong profit margins, inventory turnover optimization needed",
      "Market gap identified, customer preference data supports promotion",
    ],
    medium: [
      "Moderate sales performance, inventory optimization needed, bundle opportunity",
      "Seasonal adjustment required, customer acquisition potential identified",
      "Price elasticity analysis suggests promotion viability",
      "Cross-selling opportunity detected with complementary products",
    ],
    low: [
      "Recent promotion still active, market saturation detected, low profit margin",
      "High competition in category, limited differentiation opportunity",
      "Inventory levels adequate, no immediate promotion need identified",
      "Customer price sensitivity low, promotion impact may be minimal",
    ],
  }

  if (confidence >= 80) return reasons.high[Math.floor(Math.random() * reasons.high.length)]
  if (confidence >= 60) return reasons.medium[Math.floor(Math.random() * reasons.medium.length)]
  return reasons.low[Math.floor(Math.random() * reasons.low.length)]
}

// Predict optimal promotion timing
export function predictOptimalTiming(product, historicalData) {
  const now = new Date()
  const startDate = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Random start within 7 days
  const duration = Math.floor(Math.random() * 7) + 3 // 3-10 days duration
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000)

  return {
    startDate: startDate.toISOString().slice(0, 16),
    endDate: endDate.toISOString().slice(0, 16),
    duration: `${duration} Hari`,
  }
}

// Calculate expected ROI based on historical promotion data
export function calculateExpectedROI(promotionData, historicalPerformance) {
  const baseROI = 20 // Base ROI percentage
  const discountFactor = (100 - promotionData.discountPercent) / 100
  const demandMultiplier = promotionData.predictedSalesIncrease / 1000

  return Math.round(baseROI * discountFactor * demandMultiplier * 10) / 10
}
