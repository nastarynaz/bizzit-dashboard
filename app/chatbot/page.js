"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { MessageCircle, Send, Bot, User } from "lucide-react"
import { useState } from "react"

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: "Halo! Saya adalah asisten AI untuk dashboard minimarket Anda. Bagaimana saya bisa membantu hari ini?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages([...messages, newMessage])
    setInputMessage("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        message:
          "Terima kasih atas pertanyaan Anda. Saya sedang memproses informasi untuk memberikan jawaban yang tepat.",
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Chatbot Assistant</h1>
          <p className="text-muted-foreground">Tanyakan apapun tentang data penjualan dan operasional toko Anda</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <CardTitle>Chat Assistant</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4 mb-4 max-h-96 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {msg.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`flex-1 max-w-xs ${msg.type === "user" ? "text-right" : ""}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ketik pesan Anda..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
