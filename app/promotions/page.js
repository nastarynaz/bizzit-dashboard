"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Download } from "lucide-react"
import { formatCurrency } from "@/lib/database"

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState("recommendations")

  // Sample data for promotable products
  const promotableProducts = [
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
      status: "Direkomendasikan",
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
      status: "Direkomendasikan",
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
      status: "Direkomendasikan",
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
      status: "Direkomendasikan",
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
      status: "Direkomendasikan",
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
      status: "Direkomendasikan",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "Direkomendasikan":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Direkomendasikan</Badge>
      case "Aktif":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>
      case "Berakhir":
        return <Badge variant="secondary">Berakhir</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotion Management</h1>
          <p className="text-muted-foreground">Kelola promosi dan rekomendasi untuk meningkatkan penjualan</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="recommendations"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Rekomendasi Promosi
          </TabsTrigger>
          <TabsTrigger value="calendar">Kalender Promosi</TabsTrigger>
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
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">NO</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">PRODUK</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">KATEGORI</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">SKU</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">HARGA NORMAL</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">BESAR DISKON</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">TIPE DISKON</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">HARGA DISKON</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">WAKTU MULAI</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">WAKTU SELESAI</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">DURASI</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">POTENSIAL REVENUE</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotableProducts.map((product, index) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 text-sm">{index + 1}</td>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{product.product}</div>
                            <div className="text-sm text-muted-foreground">{product.category}</div>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{product.category}</td>
                        <td className="p-3 text-sm font-mono">{product.sku}</td>
                        <td className="p-3 text-sm">{formatCurrency(product.normalPrice)}</td>
                        <td className="p-3 text-sm font-medium">{product.discountAmount}</td>
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
                        <td className="p-3">{getStatusBadge(product.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kalender Promosi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Kalender promosi akan ditampilkan di sini</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promosi Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Daftar promosi yang sedang berjalan akan ditampilkan di sini
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
