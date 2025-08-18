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
    const data = await externalAPIClient.getDashboardMetrics(cleanedParams);
    
    // Format response
    const formattedData = formatResponseData(data, 'dashboard_metrics');

    return NextResponse.json(
      createAPIResponse(formattedData, null, {
        endpoint: 'dashboard_metrics',
        params: cleanedParams
      })
    );

  } catch (error) {
    const apiError = handleAPIError(error, 'Dashboard Metrics API');
    
    return NextResponse.json(
      createAPIResponse(null, apiError),
      { status: 500 }
    );
  }
}
