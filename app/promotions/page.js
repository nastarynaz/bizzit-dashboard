"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/database";

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState("recommendations");
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date (today)
  const [calendarView, setCalendarView] = useState("Month");

  // State for API data
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Fetch recommendations from API
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoadingProducts(true);
        setProductsError(null);
        
        const response = await fetch('/api/external/recommendations/top?limit=50');
        const result = await response.json();
        
        if (result.success && result.data?.data?.recommendations) {
          // Transform API data - use same logic as overview page
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
          
          setProducts(transformedData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setProductsError(error.message);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchRecommendations();
  }, []); // Only run once on component mount

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

  // Generate calendar events from active promotions
  const generateCalendarEvents = () => {
    const activeProducts = products.filter(product => product.status === "aktif");
    const events = [];
    
    activeProducts.forEach(product => {
      // Parse start and end dates
      const startDate = product.startTime !== "-" ? parseDate(product.startTime) : null;
      const endDate = product.endTime !== "-" ? parseDate(product.endTime) : null;
      
      if (startDate && startDate.getMonth() === currentDate.getMonth() && startDate.getFullYear() === currentDate.getFullYear()) {
        events.push({
          id: `start-${product.id}`,
          title: `${product.product} (Mulai)`,
          date: startDate.getDate(),
          color: "bg-green-200 text-green-800",
          type: "start",
          product: product
        });
      }
      
      if (endDate && endDate.getMonth() === currentDate.getMonth() && endDate.getFullYear() === currentDate.getFullYear()) {
        events.push({
          id: `end-${product.id}`,
          title: `${product.product} (Selesai)`,
          date: endDate.getDate(),
          color: "bg-red-200 text-red-800",
          type: "end",
          product: product
        });
      }
      
      // Show active promotion period
      if (startDate && endDate) {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
        // Check if promotion spans across current month
        if ((startDate.getFullYear() < currentYear || 
            (startDate.getFullYear() === currentYear && startDate.getMonth() <= currentMonth)) &&
            (endDate.getFullYear() > currentYear || 
            (endDate.getFullYear() === currentYear && endDate.getMonth() >= currentMonth))) {
          
          // Add event for active promotion in current month
          const startDay = startDate.getMonth() === currentMonth ? startDate.getDate() : 1;
          const endDay = endDate.getMonth() === currentMonth ? endDate.getDate() : new Date(currentYear, currentMonth + 1, 0).getDate();
          
          for (let day = startDay; day <= endDay; day++) {
            events.push({
              id: `active-${product.id}-${day}`,
              title: `${product.product}`,
              date: day,
              color: "bg-blue-200 text-blue-800",
              type: "active",
              product: product
            });
          }
        }
      }
    });
    
    return events;
  };

  // Helper function to parse Indonesian date format (DD/MM/YYYY)
  const parseDate = (dateString) => {
    if (!dateString || dateString === "-") return null;
    
    try {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const toggleStatus = (productId) => {
    // Find the product to get current status
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentStatus = product.status;
    const newStatus = currentStatus === "aktif" ? "non aktif" : "aktif";
    const action = newStatus === "aktif" ? "mengaktifkan" : "menonaktifkan";
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin ${action} promosi untuk "${product.product}"?\n\n` +
      `Status akan berubah dari "${currentStatus}" menjadi "${newStatus}".`
    );
    
    // Only update if user confirmed
    if (confirmed) {
      setProducts(
        products.map((prod) =>
          prod.id === productId
            ? {
                ...prod,
                status: newStatus,
              }
            : prod
        )
      );
    }
  };

  const activeProducts = products.filter(
    (product) => product.status === "aktif"
  );
  const recommendedProducts = products.filter(
    (product) => product.status === "non aktif"
  );

  const getStatusBadge = (status, productId) => {
    const isActive = status === "aktif";
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleStatus(productId)}
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

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateObj));
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return days;
  };

  const renderCalendarDay = (day) => {
    const dayNumber = day.getDate();
    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
    const calendarEvents = generateCalendarEvents();
    const dayEvents = calendarEvents.filter(
      (e) => e.date === dayNumber && isCurrentMonth
    );

    // Check if this is today
    const today = new Date();
    const isToday = day.toDateString() === today.toDateString();

    return (
      <div
        key={day.toISOString()}
        className={`min-h-24 p-1 border border-gray-100 ${
          !isCurrentMonth ? "text-gray-300 bg-gray-50" : "bg-white"
        } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
      >
        <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600 font-bold" : ""}`}>
          {dayNumber}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event, index) => (
            <div 
              key={event.id} 
              className={`text-xs p-1 rounded ${event.color} truncate`}
              title={`${event.title} - ${event.product?.category || ''}`}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-gray-500 p-1">
              +{dayEvents.length - 3} lainnya
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProductTable = (productList, showStatusToggle = true) => {
    if (isLoadingProducts) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading recommendations...</span>
        </div>
      );
    }

    if (productsError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Error loading recommendations:</p>
          <p className="text-sm text-gray-600 mb-4">{productsError}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            size="sm"
          >
            Retry
          </Button>
        </div>
      );
    }

    if (productList.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No recommendations available
        </div>
      );
    }

    return (
      <div className="overflow-x-auto h-[calc(100vh-400px)] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b">
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                KODE SKU
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                PRODUK
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                KATEGORI
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                HARGA NORMAL
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                BESAR DISKON
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                TIPE DISKON
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                HARGA DISKON
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                WAKTU MULAI
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                WAKTU SELESAI
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                DURASI
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                PREDIKSI UPLIFT PROFIT
              </th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground bg-white">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product, index) => (
              <tr key={product.id} className="border-b hover:bg-muted/50">
                <td className="p-3 text-sm">
                  {product.sku}
                </td>
                <td className="p-3">
                  <div>
                    <div className="font-medium">{product.product}</div>
                  </div>
                </td>
                <td className="p-3 text-sm">{product.category}</td>
                <td className="p-3 text-sm">
                  {product.normalPriceFormatted || "-"}
                </td>
                <td className="p-3 text-sm font-medium">
                  {product.discountAmount}
                </td>
                <td className="p-3 text-sm">{product.discountType}</td>
                <td className="p-3 text-sm font-medium text-blue-600">
                  {product.discountPrice === "-" ? "-" : formatCurrency(product.discountPrice)}
                </td>
                <td className="p-3 text-sm">{product.startTime}</td>
                <td className="p-3 text-sm">{product.endTime}</td>
                <td className="p-3 text-sm">{product.duration}</td>
                <td className="p-3 text-sm font-medium text-green-600">
                  {product.potentialRevenue}
                </td>
                <td className="p-3">
                  {showStatusToggle ? (
                    getStatusBadge(product.status, product.id)
                  ) : (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Aktif
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Promotion Management
          </h1>
          <p className="text-muted-foreground">
            Kelola promosi dan rekomendasi untuk meningkatkan penjualan
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="recommendations"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Rekomendasi Promosi
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Kalender Promosi
          </TabsTrigger>
          <TabsTrigger value="active">Promosi Aktif</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Produk yang Dapat Dipromosikan</CardTitle>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>{renderProductTable(recommendedProducts)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-1">
                {["Day", "Week", "Month"].map((view) => (
                  <Button
                    key={view}
                    variant={calendarView === view ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCalendarView(view)}
                    className={
                      calendarView === view ? "bg-blue-500 text-white" : ""
                    }
                  >
                    {view}
                  </Button>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b">
                  {["MON", "TUE", "WED", "THE", "FRI", "SAT", "SUN"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-3 text-center font-medium text-sm bg-gray-50 border-r last:border-r-0"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7">
                  {generateCalendarDays().map(renderCalendarDay)}
                </div>
              </CardContent>
            </Card>

            {/* Calendar Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Keterangan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-200 border border-green-300"></div>
                    <span className="text-sm">Mulai Promosi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-200 border border-blue-300"></div>
                    <span className="text-sm">Periode Promosi Aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-200 border border-red-300"></div>
                    <span className="text-sm">Selesai Promosi</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Produk yang Dapat Dipromosikan</CardTitle>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>{renderProductTable(products)}</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promosi Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              {activeProducts.length > 0 ? (
                renderProductTable(activeProducts, false)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada promosi yang aktif
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
