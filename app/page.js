"use client";

import { useState } from "react";
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
} from "lucide-react";
import {
  stores,
  getOverallAnalytics,
  getTopProducts,
  formatCurrency,
  formatNumber,
  analyticsData,
} from "@/lib/database";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("1w");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chatInput, setChatInput] = useState("");

  const [promotions, setPromotions] = useState([
    {
      id: 1,
      product: "Indomie Goreng",
      category: "Makanan",
      sku: "SKU001",
      normalPrice: 3500,
      discountAmount: "15%",
      discountType: "Persentase",
      discountPrice: 2975,
      startTime: "01/12/2024",
      endTime: "15/12/2024",
      duration: "14 hari",
      potentialRevenue: 2500000,
      status: "non aktif",
    },
    {
      id: 2,
      product: "Aqua 600ml",
      category: "Minuman",
      sku: "SKU002",
      normalPrice: 3000,
      discountAmount: "10%",
      discountType: "Persentase",
      discountPrice: 2700,
      startTime: "05/12/2024",
      endTime: "20/12/2024",
      duration: "15 hari",
      potentialRevenue: 1800000,
      status: "non aktif",
    },
    {
      id: 3,
      product: "Beras Premium 5kg",
      category: "Sembako",
      sku: "SKU003",
      normalPrice: 65000,
      discountAmount: "8%",
      discountType: "Persentase",
      discountPrice: 59800,
      startTime: "10/12/2024",
      endTime: "31/12/2024",
      duration: "21 hari",
      potentialRevenue: 5200000,
      status: "aktif",
    },
    {
      id: 4,
      product: "Minyak Goreng 1L",
      category: "Sembako",
      sku: "SKU004",
      normalPrice: 18000,
      discountAmount: "12%",
      discountType: "Persentase",
      discountPrice: 15840,
      startTime: "15/12/2024",
      endTime: "30/12/2024",
      duration: "15 hari",
      potentialRevenue: 3100000,
      status: "non aktif",
    },
    {
      id: 5,
      product: "Susu UHT 1L",
      category: "Minuman",
      sku: "SKU005",
      normalPrice: 15000,
      discountAmount: "20%",
      discountType: "Persentase",
      discountPrice: 12000,
      startTime: "20/12/2024",
      endTime: "05/01/2025",
      duration: "16 hari",
      potentialRevenue: 2800000,
      status: "aktif",
    },
  ]);

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
    setPromotions(
      promotions.map((promotion) =>
        promotion.id === promotionId
          ? {
              ...promotion,
              status: promotion.status === "aktif" ? "non aktif" : "aktif",
            }
          : promotion
      )
    );
  };

  const getFilteredPromotions = () => {
    let filtered = promotions;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((promotion) => {
        const categoryMap = {
          "Makanan & Minuman": ["Makanan", "Minuman"],
          "Kebutuhan Rumah Tangga": ["Sembako", "Kebersihan"],
        };
        const matchingCategories = categoryMap[selectedCategory] || [
          selectedCategory,
        ];
        return matchingCategories.includes(promotion.category);
      });
    }

    if (selectedStore !== "all") {
      // For demo purposes, we'll show all promotions regardless of store
      // In a real app, you'd filter based on store-specific inventory
    }

    return filtered.slice(0, 5); // Show top 5
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
    return getFilteredPromotions().filter(
      (promotion) => promotion.status === "aktif"
    );
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    No
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Nama Produk
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Harga Normal
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Besar Diskon
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Harga Diskon
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Jenis Diskon
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Durasi Diskon
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions.map((product, index) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 text-sm">{index + 1}</td>
                    <td className="p-3 text-sm font-medium">
                      {product.product}
                    </td>
                    <td className="p-3 text-sm">
                      {formatCurrency(product.normalPrice)}
                    </td>
                    <td className="p-3 text-sm font-medium">
                      {product.discountAmount}
                    </td>
                    <td className="p-3 text-sm font-medium text-blue-600">
                      {formatCurrency(product.discountPrice)}
                    </td>
                    <td className="p-3 text-sm">{product.discountType}</td>
                    <td className="p-3 text-sm">{product.duration}</td>
                    <td className="p-3">
                      {getStatusBadge(product.status, product.id)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
