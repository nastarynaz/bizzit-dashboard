import { NextResponse } from "next/server"
import { stores } from "@/lib/database"

export async function GET() {
  // Mock POS status for all stores
  const storeStatuses = stores.map((store) => ({
    storeId: store.id,
    storeName: store.name,
    status: Math.random() > 0.2 ? "connected" : "disconnected",
    lastSync: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    transactionsToday: Math.floor(Math.random() * 150) + 50,
    syncErrors: Math.floor(Math.random() * 3),
  }))

  const summary = {
    totalStores: stores.length,
    connectedStores: storeStatuses.filter((s) => s.status === "connected").length,
    totalTransactions: storeStatuses.reduce((sum, s) => sum + s.transactionsToday, 0),
    totalErrors: storeStatuses.reduce((sum, s) => sum + s.syncErrors, 0),
    uptime: 99.9,
    lastUpdated: new Date().toISOString(),
  }

  return NextResponse.json({
    summary,
    stores: storeStatuses,
  })
}
