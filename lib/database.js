// Mock data for the minimarket dashboard

export const stores = [
  {
    id: 1,
    name: "Toko 1",
    location: "Jakarta Selatan",
    status: "active",
    dailyRevenue: 450000,
    dailyTransactions: 45,
    growth: 12.5,
  },
  {
    id: 2,
    name: "Toko 2",
    location: "Jakarta Timur",
    status: "active",
    dailyRevenue: 380000,
    dailyTransactions: 38,
    growth: 8.3,
  },
  {
    id: 3,
    name: "Toko 3",
    location: "Jakarta Barat",
    status: "active",
    dailyRevenue: 520000,
    dailyTransactions: 52,
    growth: 15.2,
  },
  {
    id: 4,
    name: "Toko 4",
    location: "Jakarta Utara",
    status: "active",
    dailyRevenue: 410000,
    dailyTransactions: 41,
    growth: -2.1,
  },
  {
    id: 5,
    name: "Toko 5",
    location: "Jakarta Pusat",
    status: "active",
    dailyRevenue: 470000,
    dailyTransactions: 47,
    growth: 9.8,
  },
  {
    id: 6,
    name: "Toko 6",
    location: "Depok",
    status: "active",
    dailyRevenue: 350000,
    dailyTransactions: 35,
    growth: 6.4,
  },
  {
    id: 7,
    name: "Toko 7",
    location: "Tangerang",
    status: "active",
    dailyRevenue: 430000,
    dailyTransactions: 43,
    growth: 11.2,
  },
]

export const products = [
  {
    id: 1,
    name: "Indomie Goreng",
    category: "Makanan",
    price: 3500,
    stock: 150,
    totalSold: 1250,
    revenue: 4375000,
  },
  {
    id: 2,
    name: "Aqua 600ml",
    category: "Minuman",
    price: 3000,
    stock: 200,
    totalSold: 980,
    revenue: 2940000,
  },
  {
    id: 3,
    name: "Beras Premium 5kg",
    category: "Sembako",
    price: 65000,
    stock: 50,
    totalSold: 120,
    revenue: 7800000,
  },
  {
    id: 4,
    name: "Minyak Goreng 1L",
    category: "Sembako",
    price: 18000,
    stock: 80,
    totalSold: 340,
    revenue: 6120000,
  },
  {
    id: 5,
    name: "Susu UHT 1L",
    category: "Minuman",
    price: 15000,
    stock: 60,
    totalSold: 280,
    revenue: 4200000,
  },
]

export const analyticsData = {
  byStore: {
    1: { revenue: 4500000, transactions: 450, growth: 12.5 },
    2: { revenue: 3800000, transactions: 380, growth: 8.3 },
    3: { revenue: 5200000, transactions: 520, growth: 15.2 },
    4: { revenue: 4100000, transactions: 410, growth: -2.1 },
    5: { revenue: 4700000, transactions: 470, growth: 9.8 },
    6: { revenue: 3500000, transactions: 350, growth: 6.4 },
    7: { revenue: 4300000, transactions: 430, growth: 11.2 },
  },
}

// Helper functions
export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(number) {
  return new Intl.NumberFormat("id-ID").format(number)
}

export function getGrowthColor(growth) {
  return growth > 0 ? "text-green-600" : "text-red-600"
}

export function getOverallAnalytics() {
  const totalRevenue = Object.values(analyticsData.byStore).reduce((sum, store) => sum + store.revenue, 0)
  const totalTransactions = Object.values(analyticsData.byStore).reduce((sum, store) => sum + store.transactions, 0)
  const avgOrderValue = totalRevenue / totalTransactions
  const avgGrowth =
    Object.values(analyticsData.byStore).reduce((sum, store) => sum + store.growth, 0) /
    Object.keys(analyticsData.byStore).length

  return {
    totalRevenue,
    totalTransactions,
    avgOrderValue,
    monthlyGrowth: avgGrowth,
  }
}

export function getTopProducts() {
  return products.sort((a, b) => b.totalSold - a.totalSold)
}

export function getRevenueTrendData(period) {
  const trends = {
    "1w": {
      title: "Revenue Trend - 1 Week",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [65, 70, 80, 85, 90, 95, 88],
    },
    "1m": {
      title: "Revenue Trend - 1 Month",
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [75, 85, 90, 95],
    },
    "1y": {
      title: "Revenue Trend - 1 Year",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [60, 65, 70, 75, 80, 85, 90, 95, 88, 82, 78, 85],
    },
    "2y": {
      title: "Revenue Trend - 2 Years",
      labels: ["2023 Q1", "2023 Q2", "2023 Q3", "2023 Q4", "2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4"],
      data: [60, 70, 75, 80, 85, 90, 95, 92],
    },
  }

  return trends[period] || trends["1w"]
}
