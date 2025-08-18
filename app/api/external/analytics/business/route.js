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
      start_date: searchParams.get('start_date'),
      end_date: searchParams.get('end_date'),
      period: searchParams.get('period'),
      store_id: searchParams.get('store_id')
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
    const data = await externalAPIClient.getBusinessMetrics(cleanedParams);
    
    // Format response
    const formattedData = formatResponseData(data, 'business_metrics');

    return NextResponse.json(
      createAPIResponse(formattedData, null, {
        endpoint: 'business_metrics',
        params: cleanedParams
      })
    );

  } catch (error) {
    const apiError = handleAPIError(error, 'Business Metrics API');
    
    return NextResponse.json(
      createAPIResponse(null, apiError),
      { status: 500 }
    );
  }
}