import { NextResponse } from 'next/server';
import externalAPIClient from '@/lib/api/external-api';
import { 
  createAPIResponse, 
  handleAPIError, 
  formatResponseData
} from '@/lib/helpers/api-helpers';

export async function GET(request) {
  try {
    // Call external API (no parameters needed)
    const data = await externalAPIClient.getAnalyticsEvents();
    
    // Format response
    const formattedData = formatResponseData(data, 'analytics_events');

    return NextResponse.json(
      createAPIResponse(formattedData, null, {
        endpoint: 'analytics_events'
      })
    );

  } catch (error) {
    const apiError = handleAPIError(error, 'Analytics Events API');
    
    return NextResponse.json(
      createAPIResponse(null, apiError),
      { status: 500 }
    );
  }
}