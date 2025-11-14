'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  suggestions?: string[]
}

export default function ConciergeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "✨ Welcome to your personal AI travel concierge! I'm here to help you plan the perfect trip. What adventure are you dreaming of?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "Plan a 3-day trip to Istanbul",
        "Show me hidden gems in Dubai",
        "Best food experiences in Turkey",
        "Romantic getaway ideas"
      ]
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "🌍 I'd love to help you plan an amazing trip! Let me suggest some incredible experiences based on your interests. Istanbul offers a perfect blend of history and culture, while Dubai provides luxury and modern adventures.",
        isUser: false,
        timestamp: new Date(),
        suggestions: [
          "Tell me more about Istanbul",
          "Dubai luxury experiences",
          "Food recommendations",
          "Best time to visit"
        ]
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gradient-gold">AI Concierge</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
          Your personal travel assistant powered by AI
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="glass rounded-t-xl p-4 border-b border-border-light">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Travel Concierge</h3>
              <p className="text-sm text-accent">Always ready to help</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="glass rounded-none min-h-[400px] max-h-[500px] overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.isUser
                        ? 'bg-gradient-gold text-primary'
                        : 'bg-surface border border-border-light text-text-primary'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-3 py-2 text-sm bg-card hover:bg-surface border border-border-accent rounded-lg text-accent hover:text-accent-bright transition-colors"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-surface border border-border-light rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="glass rounded-b-xl p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
              placeholder="Ask me anything about travel..."
              className="flex-1 bg-card border border-border-light rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            />
            <motion.button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                inputText.trim()
                  ? 'bg-gradient-gold text-primary hover:shadow-gold'
                  : 'bg-surface text-text-muted cursor-not-allowed'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
