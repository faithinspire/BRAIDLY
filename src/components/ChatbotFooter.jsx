import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../auth/AuthContext'
import { chatbot } from '../services/chatbotService'
import './ChatbotFooter.css'

function ChatbotFooter() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! 👋 I\'m your Braidly assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      chatbot.setUserContext(user)
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(async () => {
      try {
        const response = await chatbot.sendMessage(inputMessage)
        const botMessage = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } catch (error) {
        console.error('Chatbot error:', error)
        const errorMessage = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again!',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    }, 1000)
  }

  const quickActions = [
    { icon: 'fa-search', text: 'Find Braiders', message: 'Help me find braiders near me' },
    { icon: 'fa-calendar', text: 'Book Now', message: 'How do I book an appointment?' },
    { icon: 'fa-dollar-sign', text: 'Pricing', message: 'How much does it cost?' },
    { icon: 'fa-shield-alt', text: 'Safety', message: 'How do you verify braiders?' }
  ]

  const handleQuickAction = (message) => {
    setInputMessage(message)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'}`}></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h4>Braidly Assistant</h4>
                <span className="chatbot-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.role === 'assistant' && (
                  <div className="message-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                )}
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="message-avatar user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-message bot-message">
                <div className="message-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="chatbot-quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.message)}
                >
                  <i className={`fas ${action.icon}`}></i>
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputMessage.trim() || isTyping}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatbotFooter
