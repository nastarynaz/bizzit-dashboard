import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if Gemini API key is available
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.',
          response: 'API Key Missing: To use Gemini API, you need to:\n1. Get an API key from https://makersuite.google.com/app/apikey\n2. Add GEMINI_API_KEY=your_key_here to your .env.local file\n3. Restart your development server'
        },
        { status: 200 }
      )
    }

    // Initialize the Gemini AI client
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Try different models in order of preference
    const models = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro'
    ]
    
    let lastError = null
    
    for (const modelName of models) {
      try {
        console.log(`Trying Gemini model: ${modelName}`)
        
        const model = genAI.getGenerativeModel({ model: modelName })
        
        const result = await model.generateContent(message)
        const response = await result.response
        const text = response.text()
        
        if (text) {
          return NextResponse.json({
            response: text,
            success: true,
            apiUsed: 'gemini',
            model: modelName
          })
        }
        
      } catch (modelError) {
        console.error(`Error with model ${modelName}:`, modelError.message)
        lastError = modelError
        continue
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error('All Gemini models failed to respond')

  } catch (error) {
    console.error('Gemini API Error:', error)
    
    const errorMessage = error.message || 'Failed to get response from Gemini API'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        response: `Error: ${errorMessage}\n\nTroubleshooting:\n1. Check your GEMINI_API_KEY in .env.local\n2. Ensure you have internet connection\n3. Verify your API key is valid at https://aistudio.google.com/app/apikey\n4. Make sure you have enabled the Generative Language API\n\nTried models: gemini-1.5-flash, gemini-1.5-pro, gemini-pro`
      },
      { status: 200 }
    )
  }
}
