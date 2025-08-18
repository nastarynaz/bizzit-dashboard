import { NextResponse } from 'next/server';
import externalAPIClient from '@/lib/api/external-api';
import { 
  createAPIResponse, 
  handleAPIError, 
  validateRequestParams,
  formatResponseData,
  prepareQueryParams
} from '@/lib/helpers/api-helpers';

export async function GET(request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const params = {
      limit: searchParams.get('limit')
    };

    // Clean parameters
    const cleanedParams = prepareQueryParams(params);

    // Validate parameters
    const validation = validateRequestParams(cleanedParams);
    if (!validation.isValid) {
      return NextResponse.json(
        createAPIResponse(null, {
          message: 'Invalid parameters',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }),
        { status: 400 }
      );
    }

    // Call external API
    const data = await externalAPIClient.getAnalyticsCategories(cleanedParams);
    
    // Format response
    const formattedData = formatResponseData(data, 'analytics_categories');

    return NextResponse.json(
      createAPIResponse(formattedData, null, {
        endpoint: 'analytics_categories',
        params: cleanedParams
      })
    );

  } catch (error) {
    const apiError = handleAPIError(error, 'Analytics Categories API');
    
    return NextResponse.json(
      createAPIResponse(null, apiError),
      { status: 500 }
    );
  }
}