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
  const [displayLimit, setDisplayLimit] = useState("50");

  // API State Management
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductsError(null);

        // Build URL with store filter if selected
        let url = "http://192.168.87.132:5000/api/data/products?limit=2000";
        if (selectedStore !== "all") {
          url += `&id_toko=${selectedStore}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.status === "success" && result.data) {
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
  }, [selectedStore]); // Add selectedStore as dependency

  const filteredProducts = products; // Products are already filtered by API call

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

  // Stock Status Distribution
  const stockStatusDistribution = {
    low: filteredProducts.filter((item) => item.stock <= 50).length,
    normal: filteredProducts.filter(
      (item) => item.stock > 50 && item.stock < 200
    ).length,
    high: filteredProducts.filter((item) => item.stock >= 200).length,
  };

  const totalProducts = filteredProducts.length;

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
          {/* Store Filter and Display Options */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Store Filter</label>
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Display Items</label>
              <Select value={displayLimit} onValueChange={setDisplayLimit}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Items to show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">Show 25 items</SelectItem>
                  <SelectItem value="50">Show 50 items</SelectItem>
                  <SelectItem value="100">Show 100 items</SelectItem>
                  <SelectItem value="200">Show 200 items</SelectItem>
                  <SelectItem value="all">Show all items</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  {selectedStore === "all"
                    ? "all stores"
                    : `store ${selectedStore}`}
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

          {/* Stock Status Distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Status Distribution</CardTitle>
                <CardDescription>
                  Overview of stock levels across all products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-sm font-medium">
                        Low Stock (≤50)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {stockStatusDistribution.low}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {totalProducts > 0
                          ? (
                              (stockStatusDistribution.low / totalProducts) *
                              100
                            ).toFixed(1)
                          : 0}
                        %)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-sm font-medium">
                        Normal Stock (51-199)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {stockStatusDistribution.normal}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {totalProducts > 0
                          ? (
                              (stockStatusDistribution.normal / totalProducts) *
                              100
                            ).toFixed(1)
                          : 0}
                        %)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm font-medium">
                        High Stock (≥200)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {stockStatusDistribution.high}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {totalProducts > 0
                          ? (
                              (stockStatusDistribution.high / totalProducts) *
                              100
                            ).toFixed(1)
                          : 0}
                        %)
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div className="h-full flex">
                        {stockStatusDistribution.low > 0 && (
                          <div
                            className="bg-red-500 h-full flex items-center justify-center text-xs font-medium text-white"
                            style={{
                              width: `${
                                totalProducts > 0
                                  ? (stockStatusDistribution.low /
                                      totalProducts) *
                                    100
                                  : 0
                              }%`,
                            }}
                          >
                            {stockStatusDistribution.low > 0 &&
                              totalProducts > 0 &&
                              (stockStatusDistribution.low / totalProducts) *
                                100 >=
                                10 &&
                              stockStatusDistribution.low}
                          </div>
                        )}
                        {stockStatusDistribution.normal > 0 && (
                          <div
                            className="bg-yellow-500 h-full flex items-center justify-center text-xs font-medium text-white"
                            style={{
                              width: `${
                                totalProducts > 0
                                  ? (stockStatusDistribution.normal /
                                      totalProducts) *
                                    100
                                  : 0
                              }%`,
                            }}
                          >
                            {stockStatusDistribution.normal > 0 &&
                              totalProducts > 0 &&
                              (stockStatusDistribution.normal / totalProducts) *
                                100 >=
                                10 &&
                              stockStatusDistribution.normal}
                          </div>
                        )}
                        {stockStatusDistribution.high > 0 && (
                          <div
                            className="bg-green-500 h-full flex items-center justify-center text-xs font-medium text-white"
                            style={{
                              width: `${
                                totalProducts > 0
                                  ? (stockStatusDistribution.high /
                                      totalProducts) *
                                    100
                                  : 0
                              }%`,
                            }}
                          >
                            {stockStatusDistribution.high > 0 &&
                              totalProducts > 0 &&
                              (stockStatusDistribution.high / totalProducts) *
                                100 >=
                                10 &&
                              stockStatusDistribution.high}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Analysis Summary</CardTitle>
                <CardDescription>
                  Key insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-semibold text-red-800">
                        Attention Required
                      </span>
                    </div>
                    <p className="text-xs text-red-700">
                      {stockStatusDistribution.low} products with low stock
                      levels need immediate restocking
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">
                        Well Stocked
                      </span>
                    </div>
                    <p className="text-xs text-green-700">
                      {stockStatusDistribution.high} products have high stock
                      levels and are well supplied
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">
                        Optimal Range
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      {stockStatusDistribution.normal} products are in the
                      normal stock range (51-199 units)
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">
                      Total Products: {totalProducts} | Total Stock Value: Rp{" "}
                      {formatNumber(totalStockValue)}
                    </p>
                  </div>
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
                {filteredProducts.length > 0 && (
                  <span className="ml-2 text-sm">
                    ({filteredProducts.length} products found)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="max-h-96 overflow-y-auto border rounded-md">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-background border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">
                          Product
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Brand
                        </th>
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
                      {(() => {
                        const itemsToShow =
                          displayLimit === "all"
                            ? filteredProducts.length
                            : parseInt(displayLimit);
                        return filteredProducts
                          .slice(0, itemsToShow)
                          .map((product) => (
                            <tr
                              key={product.id}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium">
                                    {product.name}
                                  </div>
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
                          ));
                      })()}
                    </tbody>
                  </table>
                </div>
                {(() => {
                  const itemsToShow =
                    displayLimit === "all"
                      ? filteredProducts.length
                      : parseInt(displayLimit);
                  return (
                    filteredProducts.length > itemsToShow && (
                      <div className="text-center mt-4 text-sm text-muted-foreground">
                        Showing first {itemsToShow} of {filteredProducts.length}{" "}
                        products
                      </div>
                    )
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
