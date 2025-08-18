import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export const metadata = {
  title: "Minimarket Sales Dashboard",
  description: "Dashboard penjualan untuk 7 toko minimarket UMKM",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
