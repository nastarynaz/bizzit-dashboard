// Store data - 7 toko
export const stores = [
  {
    id: 1,
    name: "Minimarket Utama",
    location: "Jakarta Pusat",
    manager: "Budi Santoso",
    status: "active",
    dailyRevenue: 22000000 / 30, // Monthly revenue divided by 30 days
    dailyTransactions: 420 / 30,
    growth: 15.2,
  },
  {
    id: 2,
    name: "Minimarket Cabang A",
    location: "Jakarta Selatan",
    manager: "Siti Rahayu",
    status: "active",
    dailyRevenue: 18500000 / 30,
    dailyTransactions: 365 / 30,
    growth: 11.8,
  },
  {
    id: 3,
    name: "Minimarket Cabang B",
    location: "Jakarta Timur",
    manager: "Ahmad Wijaya",
    status: "active",
    dailyRevenue: 19200000 / 30,
    dailyTransactions: 385 / 30,
    growth: 13.1,
  },
  {
    id: 4,
    name: "Minimarket Cabang C",
    location: "Jakarta Barat",
    manager: "Dewi Lestari",
    status: "active",
    dailyRevenue: 17800000 / 30,
    dailyTransactions: 348 / 30,
    growth: 9.5,
  },
  {
    id: 5,
    name: "Minimarket Cabang D",
    location: "Jakarta Utara",
    manager: "Rudi Hartono",
    status: "active",
    dailyRevenue: 16900000 / 30,
    dailyTransactions: 332 / 30,
    growth: 10.8,
  },
  {
    id: 6,
    name: "Minimarket Cabang E",
    location: "Bekasi",
    manager: "Maya Sari",
    status: "active",
    dailyRevenue: 15300000 / 30,
    dailyTransactions: 298 / 30,
    growth: 8.2,
  },
  {
    id: 7,
    name: "Minimarket Cabang F",
    location: "Depok",
    manager: "Andi Pratama",
    status: "active",
    dailyRevenue: 15300000 / 30,
    dailyTransactions: 302 / 30,
    growth: 14.6,
  },
]

// Product categories
export const categories = [
  { id: 1, name: "Susu & Dairy", icon: "🥛" },
  { id: 2, name: "Makanan Ringan", icon: "🍿" },
  { id: 3, name: "Minuman", icon: "🥤" },
  { id: 4, name: "Kebutuhan Rumah", icon: "🏠" },
  { id: 5, name: "Personal Care", icon: "🧴" },
]

// Products data
export const products = [
  {
    id: 1,
    name: "Susu Segar Full Cream 1L",
    sku: "SSF-C-1000",
    category: "Susu",
    normalPrice: 20000,
    promoPrice: 17000,
    margin: 0.05,
    supplier: "PT Dairy Indonesia",
  },
  {
    id: 2,
    name: "Keripik Kentang Original",
    sku: "KKO-S-150",
    category: "Makanan Ringan",
    normalPrice: 8500,
    promoPrice: 7500,
    margin: 0.12,
    supplier: "CV Snack Nusantara",
  },
  {
    id: 3,
    name: "Air Mineral 600ml",
    sku: "AM-B-600",
    category: "Minuman",
    normalPrice: 3000,
    promoPrice: 2500,
    margin: 0.15,
    supplier: "PT Aqua Sejahtera",
  },
  {
    id: 4,
    name: "Sabun Cuci Piring 800ml",
    sku: "SCP-L-800",
    category: "Kebutuhan Rumah",
    normalPrice: 12000,
    promoPrice: 10500,
    margin: 0.08,
    supplier: "PT Clean Home",
  },
  {
    id: 5,
    name: "Shampoo Anti Ketombe 200ml",
    sku: "SAK-B-200",
    category: "Personal Care",
    normalPrice: 25000,
    promoPrice: 22000,
    margin: 0.1,
    supplier: "PT Beauty Care",
  },
]

// Stock levels per store
export const stockLevels = [
  // Store 1
  { storeId: 1, productId: 1, currentStock: 45, minStock: 20, maxStock: 100 },
  { storeId: 1, productId: 2, currentStock: 78, minStock: 30, maxStock: 150 },
  { storeId: 1, productId: 3, currentStock: 120, minStock: 50, maxStock: 200 },
  { storeId: 1, productId: 4, currentStock: 32, minStock: 15, maxStock: 80 },
  { storeId: 1, productId: 5, currentStock: 28, minStock: 10, maxStock: 60 },

  // Store 2
  { storeId: 2, productId: 1, currentStock: 38, minStock: 20, maxStock: 100 },
  { storeId: 2, productId: 2, currentStock: 65, minStock: 30, maxStock: 150 },
  { storeId: 2, productId: 3, currentStock: 95, minStock: 50, maxStock: 200 },
  { storeId: 2, productId: 4, currentStock: 28, minStock: 15, maxStock: 80 },
  { storeId: 2, productId: 5, currentStock: 22, minStock: 10, maxStock: 60 },

  // Store 3
  { storeId: 3, productId: 1, currentStock: 52, minStock: 20, maxStock: 100 },
  { storeId: 3, productId: 2, currentStock: 88, minStock: 30, maxStock: 150 },
  { storeId: 3, productId: 3, currentStock: 145, minStock: 50, maxStock: 200 },
  { storeId: 3, productId: 4, currentStock: 18, minStock: 15, maxStock: 80 },
  { storeId: 3, productId: 5, currentStock: 35, minStock: 10, maxStock: 60 },

  // Store 4
  { storeId: 4, productId: 1, currentStock: 29, minStock: 20, maxStock: 100 },
  { storeId: 4, productId: 2, currentStock: 42, minStock: 30, maxStock: 150 },
  { storeId: 4, productId: 3, currentStock: 78, minStock: 50, maxStock: 200 },
  { storeId: 4, productId: 4, currentStock: 25, minStock: 15, maxStock: 80 },
  { storeId: 4, productId: 5, currentStock: 15, minStock: 10, maxStock: 60 },

  // Store 5
  { storeId: 5, productId: 1, currentStock: 41, minStock: 20, maxStock: 100 },
  { storeId: 5, productId: 2, currentStock: 55, minStock: 30, maxStock: 150 },
  { storeId: 5, productId: 3, currentStock: 102, minStock: 50, maxStock: 200 },
  { storeId: 5, productId: 4, currentStock: 38, minStock: 15, maxStock: 80 },
  { storeId: 5, productId: 5, currentStock: 12, minStock: 10, maxStock: 60 },

  // Store 6
  { storeId: 6, productId: 1, currentStock: 33, minStock: 20, maxStock: 100 },
  { storeId: 6, productId: 2, currentStock: 48, minStock: 30, maxStock: 150 },
  { storeId: 6, productId: 3, currentStock: 89, minStock: 50, maxStock: 200 },
  { storeId: 6, productId: 4, currentStock: 22, minStock: 15, maxStock: 80 },
  { storeId: 6, productId: 5, currentStock: 19, minStock: 10, maxStock: 60 },

  // Store 7
  { storeId: 7, productId: 1, currentStock: 47, minStock: 20, maxStock: 100 },
  { storeId: 7, productId: 2, currentStock: 72, minStock: 30, maxStock: 150 },
  { storeId: 7, productId: 3, currentStock: 134, minStock: 50, maxStock: 200 },
  { storeId: 7, productId: 4, currentStock: 29, minStock: 15, maxStock: 80 },
  { storeId: 7, productId: 5, currentStock: 31, minStock: 10, maxStock: 60 },
]

// Sales transactions (historical data)
export const salesTransactions = [
  {
    id: 1,
    storeId: 1,
    productId: 1,
    quantity: 12,
    unitPrice: 17000,
    totalAmount: 204000,
    date: "2025-01-10",
    time: "14:30:00",
    isPromo: true,
  },
  {
    id: 2,
    storeId: 1,
    productId: 2,
    quantity: 8,
    unitPrice: 8500,
    totalAmount: 68000,
    date: "2025-01-10",
    time: "15:45:00",
    isPromo: false,
  },
  {
    id: 3,
    storeId: 2,
    productId: 3,
    quantity: 24,
    unitPrice: 2500,
    totalAmount: 60000,
    date: "2025-01-10",
    time: "16:20:00",
    isPromo: true,
  },
  // More transactions...
]

// Revenue trend data for different periods
export const revenueTrendData = {
  "1w": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [65, 78, 82, 95, 88, 92, 105],
    title: "Revenue Trend (7 Days)",
  },
  "1m": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [85, 92, 78, 96],
    title: "Revenue Trend (1 Month)",
  },
  "1y": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: [75, 82, 88, 79, 95, 102, 98, 105, 92, 87, 94, 108],
    title: "Revenue Trend (1 Year)",
  },
  "2y": {
    labels: ["2023 Q1", "2023 Q2", "2023 Q3", "2023 Q4", "2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4"],
    data: [68, 75, 82, 89, 85, 92, 98, 105],
    title: "Revenue Trend (2 Years)",
  },
}

// Promotions data
export const promotions = [
  {
    id: 1,
    productId: 1,
    name: "Susu Segar Full Cream 1L",
    sku: "SSF-C-1000",
    category: "Susu",
    isEligible: true,
    promoType: "Bundling",
    discountPercent: 15,
    normalPrice: 20000,
    promoPrice: 17000,
    marginAfterPromo: 0.05,
    startDate: "2025-08-15",
    endDate: "2025-08-20",
    duration: "5 Hari",
    predictedSales: 1200,
    expectedRevenue: 20400000,
    predictedProfit: 5800000,
  },
  {
    id: 2,
    productId: 2,
    name: "Keripik Kentang Original",
    sku: "KKO-S-150",
    category: "Makanan Ringan",
    isEligible: false,
    promoType: "Discount",
    discountPercent: 12,
    normalPrice: 8500,
    promoPrice: 7500,
    marginAfterPromo: 0.08,
    startDate: "2025-08-18",
    endDate: "2025-08-25",
    duration: "7 Hari",
    predictedSales: 800,
    expectedRevenue: 6000000,
    predictedProfit: 1200000,
  },
]

// Analytics data
export const analyticsData = {
  overall: {
    totalRevenue: 125000000,
    totalProfit: 18750000,
    totalTransactions: 2450,
    averageTransaction: 51020,
    topSellingProducts: [1, 3, 2, 5, 4],
    monthlyGrowth: 12.5,
    cac: 15000,
    clv: 450000,
    roi: 0.15,
  },
  byStore: {
    1: { revenue: 22000000, profit: 3300000, transactions: 420, growth: 15.2 },
    2: { revenue: 18500000, profit: 2775000, transactions: 365, growth: 11.8 },
    3: { revenue: 19200000, profit: 2880000, transactions: 385, growth: 13.1 },
    4: { revenue: 17800000, profit: 2670000, transactions: 348, growth: 9.5 },
    5: { revenue: 16900000, profit: 2535000, transactions: 332, growth: 10.8 },
    6: { revenue: 15300000, profit: 2295000, transactions: 298, growth: 8.2 },
    7: { revenue: 15300000, profit: 2295000, transactions: 302, growth: 14.6 },
  },
}

// Demand forecasting data
export const demandForecast = [
  {
    productId: 1,
    productName: "Susu Segar Full Cream 1L",
    currentTrend: "Naik",
    predictedDemand: "Tinggi",
    seasonality: "Stabil",
    forecastAccuracy: 0.87,
    nextMonthPrediction: 1450,
    recommendedStock: 180,
  },
  {
    productId: 2,
    productName: "Keripik Kentang Original",
    currentTrend: "Turun",
    predictedDemand: "Sedang",
    seasonality: "Weekend Tinggi",
    forecastAccuracy: 0.82,
    nextMonthPrediction: 980,
    recommendedStock: 120,
  },
  {
    productId: 3,
    productName: "Air Mineral 600ml",
    currentTrend: "Naik",
    predictedDemand: "Sangat Tinggi",
    seasonality: "Musim Panas Tinggi",
    forecastAccuracy: 0.91,
    nextMonthPrediction: 2200,
    recommendedStock: 300,
  },
]

// Helper functions
export const getStoreById = (id) => stores.find((store) => store.id === id)
export const getProductById = (id) => products.find((product) => product.id === id)
export const getStockByStore = (storeId) => stockLevels.filter((stock) => stock.storeId === storeId)
export const getSalesByStore = (storeId) => salesTransactions.filter((sale) => sale.storeId === storeId)
export const getPromotionByProduct = (productId) => promotions.find((promo) => promo.productId === productId)

export const getOverallAnalytics = () => {
  return {
    totalRevenue: analyticsData.overall.totalRevenue,
    totalProfit: analyticsData.overall.totalProfit,
    totalTransactions: analyticsData.overall.totalTransactions,
    avgOrderValue: Math.round(analyticsData.overall.totalRevenue / analyticsData.overall.totalTransactions),
    monthlyGrowth: analyticsData.overall.monthlyGrowth,
    cac: analyticsData.overall.cac,
    clv: analyticsData.overall.clv,
    roi: analyticsData.overall.roi,
  }
}

export const getTopProducts = () => {
  // Generate mock sales data for top products based on analyticsData.overall.topSellingProducts
  const topProductIds = analyticsData.overall.topSellingProducts

  return topProductIds.map((productId, index) => {
    const product = getProductById(productId)
    // Mock sales data - in real app this would come from actual sales aggregation
    const baseSales = 1000 - index * 150
    const revenue = baseSales * product.normalPrice

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      totalSold: baseSales,
      revenue: revenue,
      growth: 15 - index * 2, // Mock growth percentage
    }
  })
}

export const getRevenueTrendData = (period) => {
  return revenueTrendData[period] || revenueTrendData["1w"]
}

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat("id-ID").format(number)
}

export const getGrowthColor = (growth) => {
  if (growth > 0) return "text-green-600"
  if (growth < 0) return "text-red-600"
  return "text-gray-600"
}

export const getStockStatus = (current, min, max) => {
  if (current <= min) return { status: "Low", color: "text-red-600 bg-red-50" }
  if (current >= max * 0.8) return { status: "High", color: "text-green-600 bg-green-50" }
  return { status: "Normal", color: "text-blue-600 bg-blue-50" }
}
