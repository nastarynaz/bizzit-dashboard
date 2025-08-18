import { NextResponse } from 'next/server';
import externalAPIClient from '@/lib/api/external-api';
import { 
  createAPIResponse, 
  handleAPIError, 
  formatResponseData
} from '@/lib/helpers/api-helpers';

export async function GET(request) {
  try {
    // Call external API to get metadata/info
    const data = await externalAPIClient.getMetadata();
    
    // Format response
    const formattedData = formatResponseData(data, 'metadata');

    return NextResponse.json(
      createAPIResponse(formattedData, null, {
        endpoint: 'metadata'
      })
    );

  } catch (error) {
    const apiError = handleAPIError(error, 'Metadata API');
    
    return NextResponse.json(
      createAPIResponse(null, apiError),
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD(request) {
  try {
    const healthStatus = await externalAPIClient.healthCheck();
    
    if (healthStatus.status === 'healthy') {
      return new NextResponse(null, { status: 200 });
    } else {
      return new NextResponse(null, { status: 503 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}