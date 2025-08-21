"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function APIDebugPage() {
  const [testResults, setTestResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const testEndpoints = [
    {
      name: "Health Check",
      url: "https://bizzit-compfest-2025-api.onrender.com/health"
    },
    {
      name: "Business Metrics (Direct)",
      url: "https://bizzit-compfest-2025-api.onrender.com/api/metrics/business?start_date=2025-02-22&end_date=2025-02-28&period=weekly"
    },
    {
      name: "Business Metrics (via Internal API)",
      url: "/api/external/analytics/business?start_date=2025-02-22&end_date=2025-02-28&period=weekly"
    },
    {
      name: "Revenue Metrics (via Internal API)",
      url: "/api/external/analytics/revenue?start_date=2025-02-22&end_date=2025-02-28&period=daily"
    }
  ]

  const testEndpoint = async (endpoint) => {
    const startTime = Date.now()
    try {
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })

      const endTime = Date.now()
      const duration = endTime - startTime

      let data = null
      let contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      return {
        name: endpoint.name,
        url: endpoint.url,
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
        duration: `${duration}ms`,
        contentType,
        data: typeof data === 'string' ? data.substring(0, 500) : JSON.stringify(data).substring(0, 500),
        error: null
      }

    } catch (error) {
      return {
        name: endpoint.name,
        url: endpoint.url,
        status: 'ERROR',
        statusText: error.message,
        success: false,
        duration: `${Date.now() - startTime}ms`,
        contentType: null,
        data: null,
        error: error.message
      }
    }
  }

  const runAllTests = async () => {
    setIsLoading(true)
    setTestResults([])
    
    const results = []
    
    for (const endpoint of testEndpoints) {
      console.log(`Testing: ${endpoint.name}`)
      const result = await testEndpoint(endpoint)
      results.push(result)
      setTestResults([...results])
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsLoading(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">API Debug & Testing</h1>
            <p className="text-muted-foreground">Diagnose API connectivity issues</p>
          </div>
          <Button onClick={runAllTests} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Run All Tests'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {testResults.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className={`flex items-center justify-between ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.name}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.status}
                  </span>
                  <span className="text-xs text-gray-500">{result.duration}</span>
                </div>
              </CardTitle>
              <CardDescription className="font-mono text-xs break-all">
                {result.url}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Status:</strong> {result.statusText}</div>
                {result.contentType && <div><strong>Content-Type:</strong> {result.contentType}</div>}
                {result.error && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded">
                    <strong className="text-red-800">Error:</strong> {result.error}
                  </div>
                )}
                {result.data && (
                  <div>
                    <strong>Response Preview:</strong>
                    <pre className="mt-1 p-2 bg-gray-50 border rounded text-xs overflow-x-auto">
                      {result.data}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {testResults.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Click "Run All Tests" to start API diagnostics</p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Running API tests...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
