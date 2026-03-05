import React, { useState, useEffect, useRef } from 'react'
import { dbService } from '../services/supabaseClient'
import './AIChatbot.css'

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I am BRAIDLY AI Assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [braiders, setBraiders] = useState([])
  const messagesEndRef = useRef(null)

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('braidly_chat_history')
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (e) {
        console.error('Failed to load chat history:', e)
      }
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('braidly_chat_history', JSON.stringify(messages))
  }, [messages])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch braiders for search functionality
  useEffect(() => {
    const fetchBraiders = async () => {
      try {
        const { data, error } = await dbService.supabase
          .from('braiders')
          .select('id, full_name, location, specialties, rating')
          .limit(10)
        
        if (!error && data) {
          setBraiders(data)
        }
      } catch (e) {
        console.error('Failed to fetch braiders:', e)
      }
    }

    if (isOpen) {
      fetchBraiders()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInput('')
    setIsLoading(true)

    try {
      let response = await generateAIResponse(userMessage)
      setMessages(prev => [...prev, { type: 'bot', text: response }])
    } catch (error) {
      console.error('Error generating response:', error)
      setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (userInput) => {
    const lowerInput = userInput.toLowerCase()

    // Booking assistance
    if (lowerInput.includes('book') || lowerInput.includes('appointment')) {
      return 'I can help you book an appointment! Would you like to:\n1. Browse available braiders\n2. Search by location\n3. Search by style\n\nJust let me know your preference!'
    }

    // Location search
    if (lowerInput.includes('location') || lowerInput.includes('near me')) {
      const location = extractLocation(userInput)
      if (location) {
        const filtered = braiders.filter(b => b.location?.toLowerCase().includes(location.toLowerCase()))
        if (filtered.length > 0) {
          return `Found ${filtered.length} braiders in ${location}:\n${filtered.map(b => `• ${b.full_name} (Rating: ${b.rating || 'N/A'})`).join('\n')}`
        }
      }
      return 'We serve all 50 US states! Tell me your location and I can find braiders near you.'
    }

    // Style search
    if (lowerInput.includes('style') || lowerInput.includes('braid')) {
      const style = extractStyle(userInput)
      if (style) {
        const filtered = braiders.filter(b => b.specialties?.toLowerCase().includes(style.toLowerCase()))
        if (filtered.length > 0) {
          return `Found ${filtered.length} braiders specializing in ${style}:\n${filtered.map(b => `• ${b.full_name}`).join('\n')}`
        }
      }
      return 'What style are you looking for? (e.g., box braids, cornrows, twists, locs)'
    }

    // Pricing
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('how much')) {
      return 'Prices vary by braider and style. Most range from $50-$200 depending on complexity. You can view each braider\'s rates on their profile!'
    }

    // FAQ responses
    if (lowerInput.includes('payment') || lowerInput.includes('secure')) {
      return 'BRAIDLY uses secure payment processing with escrow protection. Your payment is held safely until the appointment is completed.'
    }

    if (lowerInput.includes('cancel') || lowerInput.includes('refund')) {
      return 'You can cancel appointments up to 24 hours before the scheduled time for a full refund. Contact support for assistance.'
    }

    if (lowerInput.includes('rating') || lowerInput.includes('review')) {
      return 'After each appointment, you can rate and review your braider. This helps other customers make informed decisions!'
    }

    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return 'Hello! Welcome to BRAIDLY. How can I assist you today? I can help with booking, finding braiders, or answering questions about our service.'
    }

    if (lowerInput.includes('help')) {
      return 'I can help you with:\n• Booking appointments\n• Finding braiders by location or style\n• Pricing information\n• Payment and refund policies\n• General questions about BRAIDLY\n\nWhat would you like to know?'
    }

    // Default response
    return 'That\'s a great question! For more specific information, please browse our braiders or contact support at support@braidly.com'
  }

  const extractLocation = (text) => {
    const locationKeywords = ['in ', 'near ', 'around ', 'at ']
    for (const keyword of locationKeywords) {
      const index = text.toLowerCase().indexOf(keyword)
      if (index !== -1) {
        return text.substring(index + keyword.length).split(/[,.]|and/)[0].trim()
      }
    }
    return null
  }

  const extractStyle = (text) => {
    const styles = ['box braids', 'cornrows', 'twists', 'locs', 'braids', 'weave', 'extensions']
    for (const style of styles) {
      if (text.toLowerCase().includes(style)) {
        return style
      }
    }
    return null
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-button"
        title="AI Assistant"
        aria-label="Open AI Assistant"
      >
        🤖
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <span>BRAIDLY AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-close"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.type}`}
              >
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="chatbot-input"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="chatbot-send"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
