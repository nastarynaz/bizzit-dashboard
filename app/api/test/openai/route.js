import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.',
          response: 'API Key Missing: To use OpenAI API, you need to:\n1. Get an API key from https://platform.openai.com/api-keys\n2. Add OPENAI_API_KEY=your_key_here to your .env.local file\n3. Restart your development server'
        },
        { status: 200 }
      )
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await openaiResponse.json()
    
    // Extract the response text
    const responseText = data.choices?.[0]?.message?.content || 'No response generated'

    return NextResponse.json({
      response: responseText,
      success: true,
      apiUsed: 'openai',
      usage: data.usage
    })

  } catch (error) {
    console.error('OpenAI API Error:', error)
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to get response from OpenAI API',
        response: `Error: ${error.message}\n\nTroubleshooting:\n1. Check your OPENAI_API_KEY in .env.local\n2. Ensure you have internet connection\n3. Verify your API key is valid at https://platform.openai.com/\n4. Check if you have sufficient API credits`
      },
      { status: 200 }
    )
  }
}
