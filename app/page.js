"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  BarChart3,
  ArrowRight,
  Send,
  Bot,
  Loader2,
} from "lucide-react";
import {
  stores,
  getOverallAnalytics,
  getTopProducts,
  formatCurrency,
  formatNumber,
  analyticsData,
} from "@/lib/database";
import externalAPIClient from "@/lib/api/external-api";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("1w");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chatInput, setChatInput] = useState("");
  
  // State for API data
  const [promotions, setPromotions] = useState([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);
  const [promotionsError, setPromotionsError] = useState(null);

  // Fetch recommendations from API
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoadingPromotions(true);
        setPromotionsError(null);
        
        const response = await fetch('/api/external/recommendations/top?limit=30');
        const result = await response.json();
        
        if (result.success && result.data?.data?.recommendations) {
          // Transform API data - only use available data, fill missing with "-"
          const transformedData = result.data.data.recommendations.map((item, index) => ({
            id: index + 1,
            product: item.nama_produk || "-",
            category: item.kategori_produk || "-", 
            sku: item.kode_sku || "-",
            normalPrice: item.harga_baseline || "-",
            normalPriceFormatted: item.harga_baseline_formatted || "-",
            discountAmount: item.rekomendasi_besaran_persen || "-",
            discountType: item.rekomendasi_detail || "-",
            discountPrice: calculateDiscountPrice(item.harga_baseline, item.rekomendasi_besaran_persen),
            startTime: formatDate(item.start_date),
            endTime: formatDate(item.end_date),
            duration: calculateDuration(item.start_date, item.end_date),
            potentialRevenue: item.rata_rata_uplift_profit_formatted || "-",
            status: "non aktif", // Default status
          }));
          
          setPromotions(transformedData);
        } else {
          setPromotions([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setPromotionsError(error.message);
        setPromotions([]);
      } finally {
        setIsLoadingPromotions(false);
      }
    };

    fetchRecommendations();
  }, []); // Only run once on component mount

  // Helper function to calculate duration between two dates
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate || startDate === "-" || endDate === "-") {
      return "-";
    }
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "-";
      }
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "1 hari";
      if (diffDays === 1) return "1 hari";
      return `${diffDays} hari`;
    } catch (error) {
      return "-";
    }
  };

  // Helper function to calculate discount price
  const calculateDiscountPrice = (baselinePrice, discountRate) => {
    if (!baselinePrice || !discountRate || baselinePrice === "-" || discountRate === "-") {
      return "-";
    }
    
    try {
      // Remove "Rp" and commas from formatted price, then convert to number
      const cleanPrice = typeof baselinePrice === 'string' 
        ? parseFloat(baselinePrice.replace(/[Rp\s,]/g, ''))
        : baselinePrice;
      
      // Remove "%" from discount rate and convert to decimal
      const cleanRate = typeof discountRate === 'string'
        ? parseFloat(discountRate.replace('%', '')) / 100
        : discountRate;
      
      if (isNaN(cleanPrice) || isNaN(cleanRate)) return "-";
      
      const discountPrice = cleanPrice * (1 - cleanRate);
      return Math.round(discountPrice);
    } catch (error) {
      return "-";
    }
  };

  // Helper function to format date to Indonesian format
  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      
      return date.toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch (error) {
      return "-";
    }
  };

  const analytics = getOverallAnalytics();
  const topProducts = getTopProducts();

  const categories = [
    "Makanan & Minuman",
    "Kebutuhan Rumah Tangga",
    "Kesehatan & Kecantikan",
    "Elektronik",
    "Pakaian & Aksesoris",
  ];

  const generateSalesChartData = () => {
    const baseData = [
      { label: "5k", value: 20 },
      { label: "10k", value: 25 },
      { label: "15k", value: 30 },
      { label: "20k", value: 35 },
      { label: "25k", value: 45 },
      { label: "30k", value: 55 },
      { label: "35k", value: 60 },
      { label: "40k", value: 70 },
      { label: "45k", value: 65 },
      { label: "50k", value: 60 },
      { label: "55k", value: 55 },
      { label: "60k", value: 45 },
    ];

    const periodMultiplier =
      {
        "1w": 0.7,
        "1m": 1.0,
        "3m": 1.3,
        "1y": 1.8,
        all: 2.0,
      }[selectedPeriod] || 1.0;

    const storeMultiplier = selectedStore === "all" ? 1.0 : 0.8;

    return baseData.map((point) => ({
      ...point,
      value: Math.min(
        100,
        Math.round(point.value * periodMultiplier * storeMultiplier)
      ),
    }));
  };

  const togglePromotionStatus = (promotionId) => {
    // Find the promotion to get current status
    const promotion = promotions.find(p => p.id === promotionId);
    if (!promotion) return;
    
    const currentStatus = promotion.status;
    const newStatus = currentStatus === "aktif" ? "non aktif" : "aktif";
    const action = newStatus === "aktif" ? "mengaktifkan" : "menonaktifkan";
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin ${action} promosi untuk "${promotion.product}"?\n\n` +
      `Status akan berubah dari "${currentStatus}" menjadi "${newStatus}".`
    );
    
    // Only update if user confirmed
    if (confirmed) {
      setPromotions(
        promotions.map((promo) =>
          promo.id === promotionId
            ? {
                ...promo,
                status: newStatus,
              }
            : promo
        )
      );
    }
  };

  const getFilteredPromotions = () => {
    let filtered = promotions;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((promotion) => {
        return promotion.category.toLowerCase().includes(selectedCategory.toLowerCase()) || 
               selectedCategory === "Makanan & Minuman";
      });
    }

    return filtered; // Show all data
  };

  const getStatusBadge = (status, promotionId) => {
    const isActive = status === "aktif";
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => togglePromotionStatus(promotionId)}
        className={`${
          isActive
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {isActive ? "Aktif" : "Non Aktif"}
      </Button>
    );
  };

  const getFilteredAnalytics = () => {
    let baseAnalytics = analytics;

    if (selectedStore !== "all") {
      const storeId = Number.parseInt(selectedStore);
      const storeAnalytics = analyticsData.byStore[storeId];
      baseAnalytics = {
        totalRevenue: storeAnalytics?.revenue || 0,
        totalTransactions: storeAnalytics?.transactions || 0,
        avgOrderValue: Math.round(
          (storeAnalytics?.revenue || 0) / (storeAnalytics?.transactions || 1)
        ),
        monthlyGrowth: storeAnalytics?.growth || 0,
      };
    }

    const periodMultiplier =
      {
        "1w": 0.25,
        "1m": 1.0,
        "3m": 3.0,
        "1y": 12.0,
        all: 15.0,
      }[selectedPeriod] || 1.0;

    return {
      totalRevenue: Math.round(baseAnalytics.totalRevenue * periodMultiplier),
      totalTransactions: Math.round(
        baseAnalytics.totalTransactions * periodMultiplier
      ),
      avgOrderValue: baseAnalytics.avgOrderValue,
      monthlyGrowth: baseAnalytics.monthlyGrowth,
    };
  };

  const getActivePromotions = () => {
    return promotions.filter(promotion => promotion.status === "aktif");
  };

  const getFilteredTopProducts = () => {
    let filtered = topProducts;

    if (selectedStore !== "all") {
      const storeMultiplier = 0.7;
      filtered = filtered.map((product) => ({
        ...product,
        quantity: Math.round(product.quantity * storeMultiplier),
      }));
    }

    const periodMultiplier =
      {
        "1w": 0.25,
        "1m": 1.0,
        "3m": 2.5,
        "1y": 10.0,
        all: 12.0,
      }[selectedPeriod] || 1.0;

    return filtered.map((product) => ({
      ...product,
      quantity: Math.round(product.quantity * periodMultiplier),
    }));
  };

  const filteredAnalytics = getFilteredAnalytics();
  const filteredPromotions = getFilteredPromotions();
  const activePromotions = getActivePromotions();
  const salesChartData = generateSalesChartData();
  const filteredTopProducts = getFilteredTopProducts();

  const handleChatSubmit = (e) => {
    e.preventDefault();
    console.log("Chat message:", chatInput);
    setChatInput("");
  };

  const getPeriodLabel = () => {
    const labels = {
      "1w": "minggu ini",
      "1m": "bulan ini",
      "3m": "3 bulan terakhir",
      "1y": "tahun ini",
      all: "sepanjang waktu",
    };
    return labels[selectedPeriod] || "periode terpilih";
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              {selectedStore === "all"
                ? `Analytics untuk semua toko - ${getPeriodLabel()}`
                : `Analytics untuk ${
                    stores.find((s) => s.id === Number.parseInt(selectedStore))
                      ?.name
                  } - ${getPeriodLabel()}`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Timeframe:</label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="All-time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1w">1 Minggu</SelectItem>
              <SelectItem value="1m">1 Bulan</SelectItem>
              <SelectItem value="3m">3 Bulan</SelectItem>
              <SelectItem value="1y">1 Tahun</SelectItem>
              <SelectItem value="all">All-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Toko:</label>
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categories:</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(filteredAnalytics.totalRevenue)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />+
                  {filteredAnalytics.monthlyGrowth.toFixed(1)}% vs last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Transactions
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(filteredAnalytics.totalTransactions)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  +9.2% vs last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Order Value
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(filteredAnalytics.avgOrderValue)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  +2.2% vs last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Promotions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activePromotions.length}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {activePromotions.length > 0 ? (
                    <>
                      <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                      {activePromotions.length} promotions running
                    </>
                  ) : (
                    <span className="text-orange-500">
                      No active promotions
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Insights
              </CardTitle>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                Cek Insight
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm text-blue-900">
                    {activePromotions.length > 0
                      ? `You have ${activePromotions.length} active promotions running. Consider monitoring their performance for optimization.`
                      : "No active promotions detected. Consider launching promotions for products with declining sales to boost revenue."}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 bg-transparent"
                >
                  Apa promosi terbaik sekarang?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 bg-transparent"
                >
                  Apa promosi sekarang?
                </Button>
              </div>

              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <Input
                  placeholder="Still got question?"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Promotion Recommendation</CardTitle>
            <Link href="/promotions">
              <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
                Lihat Detail
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPromotions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading recommendations...</span>
            </div>
          ) : promotionsError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Error loading recommendations:</p>
              <p className="text-sm text-gray-600 mb-4">{promotionsError}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recommendations available
            </div>
          ) : (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                      Kode SKU
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                      Nama Produk
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                      Harga Normal
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                      Besar Diskon
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                      Harga Diskon
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                      Jenis Diskon
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                      Durasi Diskon
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                      Prediksi Uplift Profit
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPromotions.map((product, index) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 text-sm">
                        {product.sku}
                      </td>
                      <td className="p-3 text-sm font-medium">
                        {product.product}
                      </td>
                      <td className="p-3 text-sm">
                        {product.normalPriceFormatted || "-"}
                      </td>
                      <td className="p-3 text-sm font-medium">
                        {product.discountAmount}
                      </td>
                      <td className="p-3 text-sm font-medium text-blue-600">
                        {product.discountPrice === "-" ? "-" : formatCurrency(product.discountPrice)}
                      </td>
                      <td className="p-3 text-sm">{product.discountType}</td>
                      <td className="p-3 text-sm">{product.duration}</td>
                      <td className="p-3 text-sm font-medium text-green-600">
                        {product.potentialRevenue}
                      </td>
                      <td className="p-3">
                        {getStatusBadge(product.status, product.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sales performance for {getPeriodLabel()}
            {selectedStore !== "all" &&
              ` - ${
                stores.find((s) => s.id === Number.parseInt(selectedStore))
                  ?.name
              }`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80 relative">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
            </div>
            <div className="ml-8 h-full flex items-end justify-between">
              {salesChartData.map((point, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 relative"
                >
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 ease-in-out relative"
                    style={{ height: `${point.value}%` }}
                  >
                    {point.value > 60 && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        {point.value}%
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-2">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
