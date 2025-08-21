"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Package, AlertTriangle, RefreshCw, Plus, Loader2 } from "lucide-react";
import { formatNumber, getStockStatus } from "@/lib/utils-format";

const stores = [
  { id: 1, name: "Store 1" },
  { id: 2, name: "Store 2" },
  { id: 3, name: "Store 3" },
  { id: 4, name: "Store 4" },
  { id: 5, name: "Store 5" },
  { id: 6, name: "Store 6" },
  { id: 7, name: "Store 7" },
];

export default function StockManagement() {
  const [selectedStore, setSelectedStore] = useState("all");

  // API State Management
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true)
        setProductsError(null)
        
        const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL || process.env.EXTERNAL_API_BASE_URL || 'http://localhost:5000'
        const response = await fetch(`${baseUrl}/api/data/products?limit=1000`)
        const result = await response.json()
        
        if (result.status === 'success' && result.data) {
          // Transform API data to match component expectations
          const transformedProducts = result.data.map((item) => ({
            id: item.id_produk,
            name: item.nama_produk,
            sku: item.kode_sku,
            category: item.kategori_produk,
            brand: item.brand,
            stock: item.stock,
            storeId: item.id_toko,
            hargaBeli: item.harga_beli,
            hargaJual: item.harga_jual,
            margin: item.margin,
            expireDate: item.expire_date,
          }));

          setProducts(transformedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductsError(error.message);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedStore === "all"
      ? products
      : products.filter((p) => p.storeId.toString() === selectedStore);

  const totalStockValue = filteredProducts.reduce(
    (sum, item) => sum + item.stock * item.hargaBeli,
    0
  );
  const lowStockCount = filteredProducts.filter(
    (item) => item.stock <= 50
  ).length;
  const totalItems = filteredProducts.reduce(
    (sum, item) => sum + item.stock,
    0
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Stock Management
            </h1>
            <p className="text-muted-foreground">
              Inventory control and optimization across all stores
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Stock
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Stock
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoadingProducts ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        </div>
      ) : productsError ? (
        <div className="text-center py-20">
          <p className="text-red-500 mb-2">Error loading products:</p>
          <p className="text-sm text-gray-600 mb-4">{productsError}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            Retry
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No Products Found
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            No product data available. Make sure the API is running and
            accessible.
          </p>
          <Button onClick={() => window.location.reload()} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      ) : (
        <>
          {/* Store Filter */}
          <div className="mb-4">
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Stock Value
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {formatNumber(totalStockValue)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Across{" "}
                  {selectedStore === "all" ? "all stores" : "selected store"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Items
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(totalItems)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Units in stock
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockCount}</div>
                <div className="text-xs text-red-600">Need attention</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredProducts.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Active products
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products Inventory</CardTitle>
              <CardDescription>
                Current stock levels for all products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Brand</th>
                      <th className="text-right py-3 px-4 font-medium">
                        Stock
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Store ID
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Buy Price
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Sell Price
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.slice(0, 50).map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.sku}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {product.category}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {product.brand}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {product.stock}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          {product.storeId}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          Rp {formatNumber(product.hargaBeli)}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          Rp {formatNumber(product.hargaJual)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              product.stock <= 50
                                ? "destructive"
                                : product.stock >= 200
                                ? "default"
                                : "secondary"
                            }
                          >
                            {product.stock <= 50
                              ? "Low"
                              : product.stock >= 200
                              ? "High"
                              : "Normal"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length > 50 && (
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Showing first 50 of {filteredProducts.length} products
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
