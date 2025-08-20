"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Bot,
  Send,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  Brain
} from "lucide-react"

export default function AIApiTestPage() {
  const [inputText, setInputText] = useState("")
  const [selectedApi, setSelectedApi] = useState("gemini")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [responseTime, setResponseTime] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!inputText.trim()) {
      setError("Please enter some text to test")
      return
    }

    setIsLoading(true)
    setError("")
    setResponse("")
    setResponseTime(null)
    
    const startTime = Date.now()

    try {
      const endpoint = selectedApi === "gemini" ? "/api/test/gemini" : "/api/test/openai"
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
          apiType: selectedApi
        }),
      })

      const endTime = Date.now()
      setResponseTime(endTime - startTime)

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `HTTP error! status: ${res.status}`)
      }

      setResponse(data.response || data.message || "No response received")
    } catch (err) {
      console.error("API Error:", err)
      setError(err.message || "Failed to get response from API")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const clearAll = () => {
    setInputText("")
    setResponse("")
    setError("")
    setResponseTime(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI API Testing</h1>
            <p className="text-muted-foreground">Test Gemini and OpenAI APIs with custom text input</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              API Testing Input
            </CardTitle>
            <CardDescription>
              Enter your text and select an AI API to test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* API Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select AI API</label>
                <Select value={selectedApi} onValueChange={setSelectedApi}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose API" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Google Gemini API
                      </div>
                    </SelectItem>
                    <SelectItem value="openai">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        OpenAI API
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Message</label>
                <Textarea
                  placeholder="Enter your text here... (e.g., 'Explain quantum computing in simple terms')"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="text-xs text-muted-foreground">
                  {inputText.length} characters
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={isLoading || !inputText.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing {selectedApi === "gemini" ? "Gemini" : "OpenAI"}...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Test {selectedApi === "gemini" ? "Gemini" : "OpenAI"} API
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearAll}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Response Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedApi === "gemini" ? (
                  <Sparkles className="h-5 w-5 text-blue-600" />
                ) : (
                  <Brain className="h-5 w-5 text-green-600" />
                )}
                API Response
              </div>
              {responseTime && (
                <Badge variant="secondary" className="text-xs">
                  {responseTime}ms
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {selectedApi === "gemini" ? "Google Gemini" : "OpenAI"} API response will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            )}

            {response && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={selectedApi === "gemini" ? "default" : "secondary"}>
                    {selectedApi === "gemini" ? "Gemini Response" : "OpenAI Response"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="h-8"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="p-4 bg-gray-50 border rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {response}
                  </pre>
                </div>
              </div>
            )}

            {!response && !error && !isLoading && (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No response yet. Send a message to test the API.</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-600" />
                <p className="text-sm text-muted-foreground">
                  Waiting for {selectedApi === "gemini" ? "Gemini" : "OpenAI"} API response...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Information */}
      <Card>
        <CardHeader>
          <CardTitle>API Information</CardTitle>
          <CardDescription>Quick reference for the available AI APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Google Gemini API</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Google's latest AI model with advanced reasoning capabilities. 
                Good for text generation, analysis, and conversation.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-green-600" />
                <span className="font-medium">OpenAI API</span>
              </div>
              <p className="text-sm text-muted-foreground">
                OpenAI's GPT models for natural language processing. 
                Excellent for creative writing, code generation, and Q&A.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
