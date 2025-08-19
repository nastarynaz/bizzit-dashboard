// Utility functions for formatting
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
