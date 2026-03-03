// INTELLIGENT CHATBOT SERVICE
// Context-aware responses for Braidly platform

export class ChatbotService {
  constructor() {
    this.conversationHistory = []
    this.userContext = null
  }

  setUserContext(user) {
    this.userContext = user
  }

  async sendMessage(message) {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    })

    // Generate response based on context and intent
    const response = await this.generateResponse(message)

    // Add bot response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    })

    return response
  }

  async generateResponse(message) {
    const lowerMessage = message.toLowerCase()

    // Greeting detection
    if (this.isGreeting(lowerMessage)) {
      return this.getGreetingResponse()
    }

    // Booking intent
    if (this.isBookingIntent(lowerMessage)) {
      return this.getBookingResponse()
    }

    // Search/Find braider intent
    if (this.isSearchIntent(lowerMessage)) {
      return this.getSearchResponse()
    }

    // Pricing intent
    if (this.isPricingIntent(lowerMessage)) {
      return this.getPricingResponse()
    }

    // Payment/Escrow intent
    if (this.isPaymentIntent(lowerMessage)) {
      return this.getPaymentResponse()
    }

    // Cancellation intent
    if (this.isCancellationIntent(lowerMessage)) {
      return this.getCancellationResponse()
    }

    // Verification intent
    if (this.isVerificationIntent(lowerMessage)) {
      return this.getVerificationResponse()
    }

    // Help intent
    if (this.isHelpIntent(lowerMessage)) {
      return this.getHelpResponse()
    }

    // Default response
    return this.getDefaultResponse()
  }

  // Intent detection methods
  isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
    return greetings.some(greeting => message.includes(greeting))
  }

  isBookingIntent(message) {
    const keywords = ['book', 'appointment', 'schedule', 'reserve', 'make a booking']
    return keywords.some(keyword => message.includes(keyword))
  }

  isSearchIntent(message) {
    const keywords = ['find', 'search', 'look for', 'braider', 'near me', 'location']
    return keywords.some(keyword => message.includes(keyword))
  }

  isPricingIntent(message) {
    const keywords = ['price', 'cost', 'how much', 'fee', 'charge', 'payment']
    return keywords.some(keyword => message.includes(keyword))
  }

  isPaymentIntent(message) {
    const keywords = ['pay', 'payment', 'escrow', 'secure', 'refund', 'money']
    return keywords.some(keyword => message.includes(keyword))
  }

  isCancellationIntent(message) {
    const keywords = ['cancel', 'cancellation', 'refund', 'change booking']
    return keywords.some(keyword => message.includes(keyword))
  }

  isVerificationIntent(message) {
    const keywords = ['verify', 'verified', 'background check', 'safe', 'trust']
    return keywords.some(keyword => message.includes(keyword))
  }

  isHelpIntent(message) {
    const keywords = ['help', 'support', 'how to', 'how do i', 'question']
    return keywords.some(keyword => message.includes(keyword))
  }

  // Response generation methods
  getGreetingResponse() {
    const greetings = [
      `Hello! 👋 Welcome to Braidly! I'm here to help you find the perfect braider or answer any questions you have.`,
      `Hi there! 😊 I'm your Braidly assistant. How can I help you today?`,
      `Hey! Welcome to Braidly! Looking for a braider or need help with something?`
    ]
    return this.getRandomResponse(greetings)
  }

  getBookingResponse() {
    if (this.userContext?.role === 'customer') {
      return `Great! To book an appointment:\n\n1. Browse braiders in your area\n2. View their portfolios and reviews\n3. Select your preferred style and time\n4. Complete secure payment\n\nWould you like me to help you find braiders near you?`
    }
    return `To book an appointment:\n\n1. Create a customer account or login\n2. Search for braiders in your area\n3. Choose your style and preferred time\n4. Make a secure payment\n\nShall I guide you through the process?`
  }

  getSearchResponse() {
    return `I can help you find the perfect braider! 🔍\n\nYou can search by:\n• Location (city, zip code)\n• Style (box braids, knotless, cornrows, etc.)\n• Rating (4+ stars recommended)\n• Availability\n\nWhat's your location?`
  }

  getPricingResponse() {
    return `Pricing varies by:\n\n💰 Style complexity\n📏 Hair length\n⏱️ Time required\n📍 Location\n⭐ Braider experience\n\nTypical ranges:\n• Box Braids: $150-$300\n• Knotless Braids: $200-$400\n• Cornrows: $80-$150\n• Twists: $100-$250\n\nEach braider sets their own prices. You'll see exact pricing when browsing profiles!`
  }

  getPaymentResponse() {
    return `💳 Secure Payment with Escrow Protection:\n\n✅ Your payment is held securely\n✅ Released only after service completion\n✅ Full refund if braider cancels\n✅ Dispute resolution available\n✅ No hidden fees\n\nWe accept:\n• Credit/Debit cards\n• Apple Pay\n• Google Pay\n\nYour money is safe with us!`
  }

  getCancellationResponse() {
    return `Cancellation Policy:\n\n👤 Customer Cancellation:\n• 24+ hours before: Full refund\n• 12-24 hours: 50% refund\n• Less than 12 hours: No refund\n\n💇 Braider Cancellation:\n• Full refund automatically\n• Priority rebooking assistance\n\nNeed to cancel a booking? I can help with that!`
  }

  getVerificationResponse() {
    return `🛡️ Safety First!\n\nAll braiders undergo:\n✅ ID verification\n✅ Background checks\n✅ Portfolio review\n✅ Customer reviews\n✅ Rating system\n\nOnly verified professionals can accept bookings. Your safety is our priority!`
  }

  getHelpResponse() {
    return `I can help you with:\n\n📅 Booking appointments\n🔍 Finding braiders\n💰 Pricing information\n💳 Payment & escrow\n⭐ Reviews & ratings\n🛡️ Safety & verification\n❌ Cancellations\n\nWhat would you like to know more about?`
  }

  getDefaultResponse() {
    const responses = [
      `I'm here to help! Could you tell me more about what you're looking for?`,
      `I'd love to assist you! Are you looking to book a braider, or do you have a question about our services?`,
      `Let me help you with that! Are you interested in finding a braider or learning more about how Braidly works?`
    ]
    return this.getRandomResponse(responses)
  }

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  clearHistory() {
    this.conversationHistory = []
  }

  getHistory() {
    return this.conversationHistory
  }
}

// Singleton instance
export const chatbot = new ChatbotService()
