// External API Client for Bizzt Recommendation API
const BASE_URL = process.env.EXTERNAL_API_BASE_URL || 'http://localhost:5000';
const API_TIMEOUT = parseInt(process.env.EXTERNAL_API_TIMEOUT) || 10000;

class ExternalAPIClient {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      console.log(`[External API] Requesting: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[External API] Success: ${endpoint}`);
      return data;

    } catch (error) {
      console.error(`[External API] Error: ${endpoint}`, error.message);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      
      throw new Error(`External API request failed: ${error.message}`);
    }
  }

  // Business Metrics
  async getBusinessMetrics(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.period) queryParams.append('period', params.period);
    if (params.store_id) queryParams.append('store_id', params.store_id);
    
    const endpoint = `/api/metrics/business${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  // Dashboard Metrics
  async getDashboardMetrics(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.store_id) queryParams.append('store_id', params.store_id);
    
    const endpoint = `/api/metrics/dashboard${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  // Revenue Breakdown
  async getRevenueBreakdown(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.period) queryParams.append('period', params.period);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.store_id) queryParams.append('store_id', params.store_id);
    
    const endpoint = `/api/metrics/revenue${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  // Analytics Categories
  async getAnalyticsCategories(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    
    const endpoint = `/api/analytics/categories${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  // Analytics Events
  async getAnalyticsEvents() {
    return this.request('/api/analytics/events');
  }

  // Weekly Trends
  async getWeeklyTrends() {
    return this.request('/api/analytics/trends/weekly');
  }

  // Recommendations
  async getRecommendations(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    
    const endpoint = `/api/recommendations${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  // Recommendations Stats
  async getRecommendationsStats() {
    return this.request('/api/recommendations/stats');
  }

  // API Metadata/Info
  async getMetadata() {
    return this.request('/');
  }

  // Health Check
  async healthCheck() {
    try {
      const data = await this.getMetadata();
      return {
        status: 'healthy',
        service: data.service || 'Unknown',
        version: data.version || 'Unknown',
        timestamp: data.timestamp || new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Singleton instance
const externalAPIClient = new ExternalAPIClient();

export default externalAPIClient;