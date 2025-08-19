// Store data - Empty, no dummy data
export const stores = [];

// Product categories - Empty, no dummy data
export const categories = [];

// Products data - Empty, no dummy data
export const products = [];

// Stock levels per store - Empty, no dummy data
export const stockLevels = [];

// Sales transactions - Empty, no dummy data
export const salesTransactions = [];

// Revenue trend data - Empty, no dummy data
export const revenueTrendData = {
  "1w": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [0, 0, 0, 0, 0, 0, 0],
    title: "Revenue Trend (7 Days)",
  },
  "1m": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [0, 0, 0, 0],
    title: "Revenue Trend (1 Month)",
  },
  "1y": {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    title: "Revenue Trend (1 Year)",
  },
  "2y": {
    labels: [
      "2023 Q1",
      "2023 Q2",
      "2023 Q3",
      "2023 Q4",
      "2024 Q1",
      "2024 Q2",
      "2024 Q3",
      "2024 Q4",
    ],
    data: [0, 0, 0, 0, 0, 0, 0, 0],
    title: "Revenue Trend (2 Years)",
  },
};

// Promotions data - Empty, no dummy data
export const promotions = [];

// Analytics data - Empty, no dummy data
export const analyticsData = {
  overall: {
    totalRevenue: 0,
    totalProfit: 0,
    totalTransactions: 0,
    averageTransaction: 0,
    topSellingProducts: [],
    monthlyGrowth: 0,
    cac: 0,
    clv: 0,
    roi: 0,
  },
  byStore: {},
};

// Demand forecasting data - Empty, no dummy data
export const demandForecast = [];

// Helper functions
export const getStoreById = (id) => stores.find((store) => store.id === id);
export const getProductById = (id) =>
  products.find((product) => product.id === id);
export const getStockByStore = (storeId) =>
  stockLevels.filter((stock) => stock.storeId === storeId);
export const getSalesByStore = (storeId) =>
  salesTransactions.filter((sale) => sale.storeId === storeId);
export const getPromotionByProduct = (productId) =>
  promotions.find((promo) => promo.productId === productId);

export const getOverallAnalytics = () => {
  return {
    totalRevenue: analyticsData.overall.totalRevenue,
    totalProfit: analyticsData.overall.totalProfit,
    totalTransactions: analyticsData.overall.totalTransactions,
    avgOrderValue: analyticsData.overall.totalTransactions > 0 
      ? Math.round(analyticsData.overall.totalRevenue / analyticsData.overall.totalTransactions)
      : 0,
    monthlyGrowth: analyticsData.overall.monthlyGrowth,
    cac: analyticsData.overall.cac,
    clv: analyticsData.overall.clv,
    roi: analyticsData.overall.roi,
  };
};

export const getTopProducts = () => {
  // Return empty array since no data is available
  return [];
};

export const getRevenueTrendData = (period) => {
  return revenueTrendData[period] || revenueTrendData["1w"];
};

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat("id-ID").format(number);
};

export const getGrowthColor = (growth) => {
  if (growth > 0) return "text-green-600";
  if (growth < 0) return "text-red-600";
  return "text-gray-600";
};

export const getStockStatus = (current, min, max) => {
  if (current <= min) return { status: "Low", color: "text-red-600 bg-red-50" };
  if (current >= max * 0.8)
    return { status: "High", color: "text-green-600 bg-green-50" };
  return { status: "Normal", color: "text-blue-600 bg-blue-50" };
};
