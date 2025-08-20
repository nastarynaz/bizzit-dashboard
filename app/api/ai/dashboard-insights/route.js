import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request) {
  try {
    const { message, context, conversationHistory } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'Gemini API key not configured',
          response: 'API Key Missing: Please configure GEMINI_API_KEY in your environment variables.'
        },
        { status: 200 }
      )
    }

    // Build comprehensive context from dashboard data
    const dashboardContext = context ? `
DASHBOARD CONTEXT (Current Data):
=================================

## Key Metrics:
- Total Revenue: ${context.analytics?.totalRevenue || 'N/A'}
- Total Transactions: ${context.analytics?.totalTransactions || 'N/A'}
- Average Order Value: ${context.analytics?.avgOrderValue || 'N/A'}
- Revenue Growth: ${context.analytics?.revenueGrowth || 'N/A'}%
- Transaction Growth: ${context.analytics?.transactionsGrowth || 'N/A'}%
- AOV Growth: ${context.analytics?.aovGrowth || 'N/A'}%

## Store & Period Settings:
- Selected Store: ${context.selectedStore === 'all' ? 'All Stores' : `Store ${context.selectedStore}`}
- Time Period: ${context.selectedPeriod || 'N/A'}
- Sales Chart Period: ${context.salesChartPeriod || 'N/A'}

## Product Recommendations:
${context.promotions && context.promotions.length > 0 
  ? context.promotions.slice(0, 10).map((promo, index) => 
    `${index + 1}. ${promo.product} - ${promo.category} 
    - Normal Price: ${promo.normalPriceFormatted}
    - Discount: ${promo.discountAmount}
    - Potential Revenue: ${promo.potentialRevenue}
    - Status: ${promo.status}`
  ).join('\n')
  : 'No recommendations available'
}

## Sales Chart Data:
${context.salesChartData && context.salesChartData.length > 0
  ? context.salesChartData.slice(0, 7).map((point, index) =>
    `${point.label}: ${point.displayValue}M revenue, ${point.transactions} transactions`
  ).join('\n')
  : 'No sales data available'
}

## Active Promotions:
- Active Promotions Count: ${context.activePromotions?.length || 0}

` : 'No dashboard context provided';

    // Build conversation history
    const conversationContext = conversationHistory && conversationHistory.length > 0
      ? `\nCONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.type}: ${msg.message}`).join('\n')}\n`
      : '';

    // Create comprehensive prompt
    const fullPrompt = `
You are a business intelligence assistant for a retail dashboard system. 
Analyze the current dashboard data and provide insights based on the user's question.

${dashboardContext}
${conversationContext}

USER QUESTION: ${message}

Please provide a helpful, data-driven response based on the current dashboard context. 
If the user is asking about trends, performance, or recommendations, reference the actual data provided above.
Be specific with numbers and actionable insights.
Respond in Indonesian language.
`;

    const genAI = new GoogleGenerativeAI(apiKey)
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
    
    let lastError = null
    
    for (const modelName of models) {
      try {
        console.log(`Trying Gemini model: ${modelName}`)
        
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        const text = response.text()
        
        if (text) {
          return NextResponse.json({
            response: text,
            success: true,
            apiUsed: 'gemini',
            model: modelName,
            contextUsed: !!context
          })
        }
        
      } catch (modelError) {
        console.error(`Error with model ${modelName}:`, modelError.message)
        lastError = modelError
        continue
      }
    }
    
    throw lastError || new Error('All Gemini models failed to respond')

  } catch (error) {
    console.error('Dashboard AI Error:', error)
    
    return NextResponse.json(
      { 
        error: error.message,
        response: `Error: ${error.message}\n\nTroubleshooting:\n1. Check your GEMINI_API_KEY in .env.local\n2. Ensure you have internet connection\n3. Verify your API key is valid at https://aistudio.google.com/app/apikey`
      },
      { status: 200 }
    )
  }
}
