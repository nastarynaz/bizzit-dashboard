// API Helper Functions

/**
 * Standardized API response format
 */
export function createAPIResponse(data = null, error = null, meta = {}) {
  return {
    success: !error,
    data: data,
    error: error ? {
      message: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN_ERROR',
      details: error.details || null
    } : null,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  };
}

/**
 * Handle API errors consistently
 */
export function handleAPIError(error, context = '') {
  console.error(`[API Error] ${context}:`, error);
  
  let errorMessage = 'An unexpected error occurred';
  let errorCode = 'UNKNOWN_ERROR';
  
  if (error.message) {
    if (error.message.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again.';
      errorCode = 'TIMEOUT_ERROR';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection.';
      errorCode = 'NETWORK_ERROR';
    } else if (error.message.includes('HTTP 404')) {
      errorMessage = 'Requested resource not found.';
      errorCode = 'NOT_FOUND';
    } else if (error.message.includes('HTTP 500')) {
      errorMessage = 'Server error. Please try again later.';
      errorCode = 'SERVER_ERROR';
    } else {
      errorMessage = error.message;
    }
  }
  
  return {
    message: errorMessage,
    code: errorCode,
    originalError: error.message
  };
}

// Export alias for backward compatibility
export const handleApiError = handleAPIError;

/**
 * Validate date parameters
 */
export function validateDateParams(params) {
  const errors = [];
  
  if (params.start_date) {
    const startDate = new Date(params.start_date);
    if (isNaN(startDate.getTime())) {
      errors.push('start_date must be a valid date (YYYY-MM-DD)');
    }
  }
  
  if (params.end_date) {
    const endDate = new Date(params.end_date);
    if (isNaN(endDate.getTime())) {
      errors.push('end_date must be a valid date (YYYY-MM-DD)');
    }
  }
  
  if (params.start_date && params.end_date) {
    const startDate = new Date(params.start_date);
    const endDate = new Date(params.end_date);
    if (startDate > endDate) {
      errors.push('start_date must be before end_date');
    }
  }
  
  return errors;
}

/**
 * Validate numeric parameters
 */
export function validateNumericParams(params) {
  const errors = [];
  
  if (params.limit !== undefined) {
    const limit = parseInt(params.limit);
    if (isNaN(limit) || limit < 1 || limit > 1000) {
      errors.push('limit must be a number between 1 and 1000');
    }
  }
  
  if (params.store_id !== undefined) {
    const storeId = parseInt(params.store_id);
    if (isNaN(storeId) || storeId < 1) {
      errors.push('store_id must be a positive number');
    }
  }
  
  return errors;
}

/**
 * Validate period parameter
 */
export function validatePeriodParam(period) {
  const validPeriods = ['daily', 'weekly', 'monthly'];
  if (period && !validPeriods.includes(period)) {
    return [`period must be one of: ${validPeriods.join(', ')}`];
  }
  return [];
}

/**
 * Sanitize and validate all request parameters
 */
export function validateRequestParams(params = {}) {
  const allErrors = [
    ...validateDateParams(params),
    ...validateNumericParams(params),
    ...validatePeriodParam(params.period)
  ];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

/**
 * Format response data for consistent output
 */
export function formatResponseData(rawData, endpoint = '') {
  if (!rawData) {
    return null;
  }
  
  // Add metadata about the data source
  return {
    ...rawData,
    _meta: {
      source: 'external_api',
      endpoint: endpoint,
      retrieved_at: new Date().toISOString(),
      version: process.env.EXTERNAL_API_VERSION || '2.0.0'
    }
  };
}

/**
 * Get default date range (current month)
 */
export function getDefaultDateRange() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    start_date: startOfMonth.toISOString().split('T')[0],
    end_date: endOfMonth.toISOString().split('T')[0]
  };
}

/**
 * Clean and prepare query parameters
 */
export function prepareQueryParams(params = {}) {
  const cleaned = {};
  
  // Remove undefined/null values
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      cleaned[key] = params[key];
    }
  });
  
  return cleaned;
}