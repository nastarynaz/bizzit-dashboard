# AI API Testing Page

## Overview
A dedicated page for testing Google Gemini API and OpenAI API with custom text input and real-time responses.

## Features
- ✅ **Dual API Support**: Test both Gemini and OpenAI APIs
- ✅ **Real-time Testing**: Send text and get immediate responses
- ✅ **Response Time Tracking**: See how fast each API responds
- ✅ **Copy Response**: Easy copy-to-clipboard functionality
- ✅ **Error Handling**: Clear error messages and troubleshooting tips
- ✅ **API Key Management**: Secure environment variable configuration

## Setup Instructions

### 1. Get API Keys

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

#### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Google Gemini API Key
GEMINI_API_KEY=your_actual_gemini_key_here

# OpenAI API Key
OPENAI_API_KEY=your_actual_openai_key_here
```

### 3. Restart Development Server

After adding the API keys, restart your development server:

```bash
npm run dev
```

## Usage

1. **Navigate to AI API Testing**: Click "AI API Testing" in the sidebar
2. **Select API**: Choose between Gemini or OpenAI
3. **Enter Text**: Type your message or question
4. **Send Request**: Click the test button
5. **View Response**: See the AI's response with timing information
6. **Copy Response**: Use the copy button to copy the response

## Example Prompts to Test

### General Questions
- "Explain quantum computing in simple terms"
- "What are the benefits of renewable energy?"
- "How does machine learning work?"

### Creative Writing
- "Write a short story about a robot learning to paint"
- "Create a haiku about technology"
- "Write a product description for a smart coffee maker"

### Code Generation
- "Write a Python function to calculate factorial"
- "Create a JavaScript function to validate email addresses"
- "Generate SQL query to find top 5 customers by sales"

### Business Analysis
- "Analyze the pros and cons of remote work"
- "What are key metrics for e-commerce success?"
- "Suggest marketing strategies for a new mobile app"

## API Information

### Google Gemini
- **Model**: gemini-pro
- **Strengths**: Advanced reasoning, multilingual, latest Google AI
- **Use Cases**: Analysis, reasoning, creative writing, conversation

### OpenAI
- **Model**: gpt-3.5-turbo
- **Strengths**: Natural language, code generation, creative tasks
- **Use Cases**: Text generation, Q&A, code writing, creative content

## Troubleshooting

### "API Key Missing" Error
- Check your `.env.local` file exists
- Verify the API key variable names are correct
- Restart your development server

### "API Error" Response
- Verify your API keys are valid
- Check your internet connection
- Ensure you have API credits (for OpenAI)

### Slow Responses
- API response times vary based on:
  - Text length and complexity
  - API server load
  - Your internet connection
  - Geographic location

## Security Notes

- ⚠️ **Never commit API keys to version control**
- ✅ **Use environment variables only**
- ✅ **Add `.env.local` to `.gitignore`**
- ✅ **Keep API keys secure and private**
- ✅ **Monitor API usage and costs**

## Page Location
- **URL**: `/ai-api-test`
- **File**: `app/ai-api-test/page.js`
- **API Routes**: 
  - `app/api/test/gemini/route.js`
  - `app/api/test/openai/route.js`
