"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/database";

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState("recommendations");
  const [currentDate, setCurrentDate] = useState(new Date(2019, 9)); // October 2019
  const [calendarView, setCalendarView] = useState("Month");

  const [products, setProducts] = useState([
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
      status: "non aktif",
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
      status: "aktif",
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
      status: "non aktif",
    },
    {
      id: 6,
      product: "Sabun Mandi",
      category: "Kebersihan",
      sku: "SKU006",
      normalPrice: 8500,
      discountAmount: "25%",
      discountType: "Persentase",
      discountPrice: 6375,
      startTime: "25/12/2024",
      endTime: "10/01/2025",
      duration: "16 hari",
      potentialRevenue: 1500000,
      status: "aktif",
    },
  ]);

  const calendarEvents = [
    {
      id: 1,
      title: "Design Conference",
      date: 2,
      color: "bg-purple-200 text-purple-800",
    },
    {
      id: 2,
      title: "Weekend Festival",
      date: 16,
      color: "bg-pink-200 text-pink-800",
    },
    {
      id: 3,
      title: "Glastonbury Festival",
      date: 20,
      color: "bg-orange-200 text-orange-800",
      span: 2,
    },
    {
      id: 4,
      title: "Glastonbury Festival",
      date: 24,
      color: "bg-blue-200 text-blue-800",
    },
  ];

  const toggleStatus = (productId) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? {
              ...product,
              status: product.status === "aktif" ? "non aktif" : "aktif",
            }
          : product
      )
    );
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
    const event = calendarEvents.find(
      (e) => e.date === dayNumber && isCurrentMonth
    );

    return (
      <div
        key={day.toISOString()}
        className={`min-h-20 p-1 border border-gray-100 ${
          !isCurrentMonth ? "text-gray-300" : ""
        }`}
      >
        <div className="text-sm font-medium mb-1">{dayNumber}</div>
        {event && (
          <div className={`text-xs p-1 rounded ${event.color} truncate`}>
            {event.title}
          </div>
        )}
      </div>
    );
  };

  const renderProductTable = (productList, showStatusToggle = true) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              NO
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              PRODUK
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              KATEGORI
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              SKU
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              HARGA NORMAL
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              BESAR DISKON
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              TIPE DISKON
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              HARGA DISKON
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              WAKTU MULAI
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              WAKTU SELESAI
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              DURASI
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              POTENSIAL REVENUE
            </th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">
              STATUS
            </th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product, index) => (
            <tr key={product.id} className="border-b hover:bg-muted/50">
              <td className="p-3 text-sm">{index + 1}</td>
              <td className="p-3">
                <div>
                  <div className="font-medium">{product.product}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.category}
                  </div>
                </div>
              </td>
              <td className="p-3 text-sm">{product.category}</td>
              <td className="p-3 text-sm font-mono">{product.sku}</td>
              <td className="p-3 text-sm">
                {formatCurrency(product.normalPrice)}
              </td>
              <td className="p-3 text-sm font-medium">
                {product.discountAmount}
              </td>
              <td className="p-3 text-sm">{product.discountType}</td>
              <td className="p-3 text-sm font-medium text-blue-600">
                {formatCurrency(product.discountPrice)}
              </td>
              <td className="p-3 text-sm">{product.startTime}</td>
              <td className="p-3 text-sm">{product.endTime}</td>
              <td className="p-3 text-sm">{product.duration}</td>
              <td className="p-3 text-sm font-medium text-green-600">
                {formatCurrency(product.potentialRevenue)}
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
              <Button variant="outline" size="sm">
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
