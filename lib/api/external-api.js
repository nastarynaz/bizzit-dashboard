// External API Client for Bizzt Recommendation API
const BASE_URL = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL || process.env.EXTERNAL_API_BASE_URL || 'http://localhost:5000';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_EXTERNAL_API_TIMEOUT || process.env.EXTERNAL_API_TIMEOUT) || 30000; // Increased timeout for hosted API

class ExternalAPIClient {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  async request(endpoint, options = {}) {
    // Ensure proper URL construction
    const baseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseURL}${cleanEndpoint}`;
    
    const config = {
      method: 'GET',
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Retry logic for hosted APIs that may be sleeping
    const maxRetries = 3;
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[External API] Requesting: ${url} (Attempt ${attempt}/${maxRetries})`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.error(`[External API] HTTP Error: ${response.status} ${response.statusText}`, errorText);
          
          // If it's a server error and we have retries left, continue
          if (response.status >= 500 && attempt < maxRetries) {
            console.log(`[External API] Server error, retrying in ${attempt * 2}s...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            continue;
          }
          
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error(`[External API] Invalid content type: ${contentType}`, text);
          throw new Error(`Expected JSON response, got: ${contentType}`);
        }

        const data = await response.json();
        console.log(`[External API] Success: ${endpoint}`);
        return data;

      } catch (error) {
        lastError = error;
        console.error(`[External API] Error (Attempt ${attempt}): ${endpoint}`, error.message);
        
        if (error.name === 'AbortError') {
          console.log(`[External API] Request timeout, retrying...`);
        } else if (error.message.includes('Failed to fetch')) {
          console.log(`[External API] Network error, retrying...`);
        } else {
          // Non-retryable error, break immediately
          break;
        }
        
        // Wait before retry (except on last attempt)
        if (attempt < maxRetries) {
          const delay = attempt * 3000; // Progressive delay
          console.log(`[External API] Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // All retries failed
    console.error(`[External API] All ${maxRetries} attempts failed for: ${endpoint}`);
    
    if (lastError.name === 'AbortError') {
      throw new Error(`Request timeout after ${this.timeout}ms (tried ${maxRetries} times)`);
    }
    
    if (lastError.message.includes('Failed to fetch')) {
      throw new Error(`Network error: Unable to connect to ${url}. API server may be sleeping or unreachable. (tried ${maxRetries} times)`);
    }
    
    throw new Error(`External API request failed: ${lastError.message}`);
  }

  // Business Metrics
  async getBusinessMetrics(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.period) queryParams.append("period", params.period);
    if (params.store_id) queryParams.append("store_id", params.store_id);

    const endpoint = `/api/metrics/business${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this.request(endpoint);
  }

  // Dashboard Metrics
  async getDashboardMetrics(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.store_id) queryParams.append("store_id", params.store_id);

    const endpoint = `/api/metrics/dashboard${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this.request(endpoint);
  }

  // Revenue Breakdown
  async getRevenueBreakdown(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.period) queryParams.append("period", params.period);
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.store_id) queryParams.append("store_id", params.store_id);

    const endpoint = `/api/metrics/revenue${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this.request(endpoint);
  }

  // Analytics Categories
  async getAnalyticsCategories(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit);

    const endpoint = `/api/analytics/categories${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this.request(endpoint);
  }

  // Analytics Events
  async getAnalyticsEvents() {
    return this.request("/api/analytics/events");
  }

  // Weekly Trends
  async getWeeklyTrends() {
    return this.request("/api/analytics/trends/weekly");
  }

  // Recommendations
  async getRecommendations(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit);

    const endpoint = `/api/recommendations${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this.request(endpoint);
  }

  // Recommendations Stats
  async getRecommendationsStats() {
    return this.request("/api/recommendations/stats");
  }

  // Business Metrics
  async getBusinessMetrics(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.period) queryParams.append("period", params.period);
    if (params.store_id) queryParams.append("store_id", params.store_id);

    const endpoint = `/api/metrics/business${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this.request(endpoint);
  }

  // Dashboard Metrics
  async getDashboardMetrics(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.store_id) queryParams.append("store_id", params.store_id);

    const endpoint = `/api/metrics/dashboard${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this.request(endpoint);
  }

  // Revenue Breakdown
  async getRevenueBreakdown(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.period) queryParams.append("period", params.period);
    if (params.store_id) queryParams.append("store_id", params.store_id);

    const endpoint = `/api/metrics/revenue${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this.request(endpoint);
  }

  // Analytics Weekly Trends
  async getAnalyticsWeekly(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.period) queryParams.append("period", params.period);
    if (params.store_id) queryParams.append("store_id", params.store_id);

    const endpoint = `/api/analytics/trends/weekly${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return this.request(endpoint);
  }

  // API Metadata/Info
  async getMetadata() {
    return this.request("/");
  }

  // Health Check
  async healthCheck() {
    try {
      const data = await this.getMetadata();
      return {
        status: "healthy",
        service: data.service || "Unknown",
        version: data.version || "Unknown",
        timestamp: data.timestamp || new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Singleton instance
const externalAPIClient = new ExternalAPIClient();

export default externalAPIClient;
