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
    const data = await externalAPIClient.getRecommendationsStats();
    
    // Format response
    const formattedData = formatResponseData(data, 'statistics');

    return NextResponse.json(
      createAPIResponse(formattedData, null, {
        endpoint: 'statistics'
      })
    );

  } catch (error) {
    const apiError = handleAPIError(error, 'Recommendations Stats API');
    
    return NextResponse.json(
      createAPIResponse(null, apiError),
      { status: 500 }
    );
  }
}