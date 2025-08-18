'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const API_ENDPOINTS = [
  {
    id: 'metadata',
    name: 'API Metadata',
    endpoint: '/api/external/metadata',
    method: 'GET',
    description: 'Get API information and health status',
    params: []
  },
  {
    id: 'dashboard',
    name: 'Dashboard Metrics',
    endpoint: '/api/external/analytics/dashboard',
    method: 'GET',
    description: 'Get all dashboard metrics',
    params: ['start_date', 'end_date', 'store_id']
  },
  {
    id: 'business',
    name: 'Business Metrics',
    endpoint: '/api/external/analytics/business',
    method: 'GET',
    description: 'Get business metrics (Revenue, Transactions, AOV)',
    params: ['start_date', 'end_date', 'period', 'store_id']
  },
  {
    id: 'revenue',
    name: 'Revenue Breakdown',
    endpoint: '/api/external/analytics/revenue',
    method: 'GET',
    description: 'Get revenue breakdown by period',
    params: ['period', 'start_date', 'end_date', 'store_id']
  },
  {
    id: 'categories',
    name: 'Categories Analytics',
    endpoint: '/api/external/analytics/categories',
    method: 'GET',
    description: 'Get category performance analytics',
    params: ['limit']
  },
  {
    id: 'events',
    name: 'Events Analytics',
    endpoint: '/api/external/analytics/events',
    method: 'GET',
    description: 'Get transaction analytics per event',
    params: []
  },
  {
    id: 'weekly',
    name: 'Weekly Trends',
    endpoint: '/api/external/analytics/trends/weekly',
    method: 'GET',
    description: 'Get weekly transaction volume trends',
    params: []
  },
  {
    id: 'recommendations',
    name: 'Recommendations',
    endpoint: '/api/external/recommendations/top',
    method: 'GET',
    description: 'Get product recommendations',
    params: ['limit']
  },
  {
    id: 'stats',
    name: 'Recommendations Stats',
    endpoint: '/api/external/recommendations/stats',
    method: 'GET',
    description: 'Get recommendations statistics',
    params: []
  }
];

export default function ExternalAPITestPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [params, setParams] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleParamChange = (paramName, value) => {
    setParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const testEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Build query string
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const url = `${selectedEndpoint.endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      console.log('Testing endpoint:', url);

      const res = await fetch(url);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data
      });

    } catch (err) {
      setError({
        message: err.message,
        type: 'FETCH_ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    setLoading(true);
    const results = [];

    for (const endpoint of API_ENDPOINTS) {
      try {
        const res = await fetch(endpoint.endpoint);
        const data = await res.json();
        results.push({
          endpoint: endpoint.name,
          status: res.status,
          success: res.ok,
          data: data
        });
      } catch (err) {
        results.push({
          endpoint: endpoint.name,
          status: 0,
          success: false,
          error: err.message
        });
      }
    }

    setResponse({ allResults: results });
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">External API Testing</h1>
          <p className="text-muted-foreground">
            Test integration with Bizzt Recommendation API (localhost:5000)
          </p>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList>
            <TabsTrigger value="single">Single Endpoint</TabsTrigger>
            <TabsTrigger value="batch">Batch Test</TabsTrigger>
          </TabsList>

          {/* Single Endpoint Testing */}
          <TabsContent value="single" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Endpoint Configuration</CardTitle>
                  <CardDescription>
                    Select an endpoint and configure parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Endpoint Selection */}
                  <div className="space-y-2">
                    <Label>API Endpoint</Label>
                    <Select 
                      value={selectedEndpoint.id} 
                      onValueChange={(value) => {
                        const endpoint = API_ENDPOINTS.find(e => e.id === value);
                        setSelectedEndpoint(endpoint);
                        setParams({});
                        setResponse(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {API_ENDPOINTS.map((endpoint) => (
                          <SelectItem key={endpoint.id} value={endpoint.id}>
                            {endpoint.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Endpoint Details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{selectedEndpoint.method}</Badge>
                      <code className="text-sm bg-muted p-1 rounded">
                        {selectedEndpoint.endpoint}
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedEndpoint.description}
                    </p>
                  </div>

                  <Separator />

                  {/* Parameters */}
                  {selectedEndpoint.params.length > 0 && (
                    <div className="space-y-3">
                      <Label>Parameters</Label>
                      {selectedEndpoint.params.map((param) => (
                        <div key={param} className="space-y-1">
                          <Label className="text-sm font-normal">{param}</Label>
                          {param === 'period' ? (
                            <Select 
                              value={params[param] || ''} 
                              onValueChange={(value) => handleParamChange(param, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : param.includes('date') ? (
                            <Input
                              type="date"
                              value={params[param] || ''}
                              onChange={(e) => handleParamChange(param, e.target.value)}
                              placeholder={`Enter ${param}`}
                            />
                          ) : (
                            <Input
                              type={param === 'limit' || param === 'store_id' ? 'number' : 'text'}
                              value={params[param] || ''}
                              onChange={(e) => handleParamChange(param, e.target.value)}
                              placeholder={`Enter ${param}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      onClick={testEndpoint} 
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? 'Testing...' : 'Test Endpoint'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setParams({});
                        setResponse(null);
                        setError(null);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Right Panel - Response */}
              <Card>
                <CardHeader>
                  <CardTitle>Response</CardTitle>
                  <CardDescription>
                    API response data and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading && (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-md">
                      <h4 className="font-medium text-red-800">Error</h4>
                      <p className="text-sm text-red-600">{error.message}</p>
                    </div>
                  )}

                  {response && !loading && (
                    <div className="space-y-4">
                      {/* Status */}
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={response.status === 200 ? "default" : "destructive"}
                        >
                          {response.status} {response.statusText}
                        </Badge>
                      </div>

                      {/* Response Data */}
                      <div className="border rounded-md">
                        <pre className="p-4 text-sm overflow-auto max-h-96 bg-muted">
                          {JSON.stringify(response.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {!response && !loading && !error && (
                    <div className="text-center text-muted-foreground py-8">
                      Configure parameters and click "Test Endpoint" to see response
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Batch Testing */}
          <TabsContent value="batch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch API Testing</CardTitle>
                <CardDescription>
                  Test all API endpoints at once to check connectivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={testAllEndpoints} disabled={loading}>
                    {loading ? 'Testing All Endpoints...' : 'Test All Endpoints'}
                  </Button>

                  {response?.allResults && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Results:</h4>
                      {response.allResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <span className="font-medium">{result.endpoint}</span>
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.success ? `✓ ${result.status}` : `✗ ${result.error || result.status}`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
