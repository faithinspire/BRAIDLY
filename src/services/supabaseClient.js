// Simple working mock auth - NO SUPABASE DEPENDENCY
const users = new Map()
const braiders = new Map()
const bookings = new Map()
const messages = new Map()

// Load data from localStorage
const loadData = () => {
  try {
    const storedUsers = localStorage.getItem('braidly_users')
    if (storedUsers) {
      const userList = JSON.parse(storedUsers)
      userList.forEach(u => users.set(u.email, u))
    }
    
    const storedBraiders = localStorage.getItem('braidly_braiders')
    if (storedBraiders) {
      const braiderList = JSON.parse(storedBraiders)
      braiderList.forEach(b => braiders.set(b.id, b))
    }
    
    const storedBookings = localStorage.getItem('braidly_bookings')
    if (storedBookings) {
      const bookingList = JSON.parse(storedBookings)
      bookingList.forEach(b => bookings.set(b.id, b))
    }
    
    const storedMessages = localStorage.getItem('braidly_messages')
    if (storedMessages) {
      const messageList = JSON.parse(storedMessages)
      messageList.forEach(m => messages.set(m.id, m))
    }
  } catch (e) {
    console.warn('Load data error:', e)
  }
}

// Save data to localStorage
const saveData = () => {
  try {
    localStorage.setItem('braidly_users', JSON.stringify(Array.from(users.values())))
    localStorage.setItem('braidly_braiders', JSON.stringify(Array.from(braiders.values())))
    localStorage.setItem('braidly_bookings', JSON.stringify(Array.from(bookings.values())))
    localStorage.setItem('braidly_messages', JSON.stringify(Array.from(messages.values())))
  } catch (e) {
    console.warn('Save data error:', e)
  }
}

loadData()

// Database Service - SIMPLE MOCK AUTH
export const dbService = {
  async signup(email, password, fullName, role) {
    try {
      if (!email || !password || !fullName) {
        throw new Error('Missing required fields')
      }

      if (users.has(email)) {
        throw new Error('Email already registered')
      }

      const user = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        email,
        password,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
      }

      users.set(email, user)
      saveData()

      return { user, error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { user: null, error: error.message }
    }
  },

  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const user = users.get(email)
      if (!user) {
        throw new Error('User not found')
      }

      if (user.password !== password) {
        throw new Error('Invalid password')
      }

      return { user, error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { user: null, error: error.message }
    }
  },

  async logout() {
    try {
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  async getProfile(userId) {
    return { profile: null, error: null }
  },

  async updateProfile(userId, updates) {
    return { profile: null, error: null }
  },

  async getBraiderProfile(userId) {
    return { braider: null, error: null }
  },

  async updateBraiderProfile(userId, updates) {
    return { braider: null, error: null }
  },

  async uploadAvatar(userId, file) {
    return { url: null, error: null }
  },

  async uploadPortfolio(braiderID, file) {
    return { url: null, error: null }
  },

  // Booking methods
  async createBooking(customerId, braiderId, appointmentDate, amount, notes = '') {
    try {
      const booking = {
        id: 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        customer_id: customerId,
        braider_id: braiderId,
        appointment_date: appointmentDate,
        amount,
        notes,
        status: 'pending',
        created_at: new Date().toISOString(),
      }
      bookings.set(booking.id, booking)
      saveData()
      return { booking, error: null }
    } catch (error) {
      return { booking: null, error: error.message }
    }
  },

  async getBookings(userId, role) {
    try {
      const bookingList = Array.from(bookings.values())
      let filtered = bookingList
      
      if (role === 'customer') {
        filtered = bookingList.filter(b => b.customer_id === userId)
      } else if (role === 'braider') {
        filtered = bookingList.filter(b => b.braider_id === userId)
      }
      
      return { bookings: filtered, error: null }
    } catch (error) {
      return { bookings: [], error: error.message }
    }
  },

  async getCustomerBookings(customerId) {
    try {
      const bookingList = Array.from(bookings.values())
      const filtered = bookingList.filter(b => b.customer_id === customerId)
      return { bookings: filtered, error: null }
    } catch (error) {
      return { bookings: [], error: error.message }
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const booking = bookings.get(bookingId)
      if (!booking) throw new Error('Booking not found')
      booking.status = status
      bookings.set(bookingId, booking)
      saveData()
      return { booking, error: null }
    } catch (error) {
      return { booking: null, error: error.message }
    }
  },

  // Payment methods
  async createPayment(bookingId, customerId, braiderId, amount) {
    try {
      const payment = {
        id: 'payment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        booking_id: bookingId,
        customer_id: customerId,
        braider_id: braiderId,
        amount,
        status: 'pending',
        created_at: new Date().toISOString(),
      }
      return { payment, error: null }
    } catch (error) {
      return { payment: null, error: error.message }
    }
  },

  async getPayments(userId, role) {
    return { payments: [], error: null }
  },

  async updatePaymentStatus(paymentId, status) {
    return { payment: null, error: null }
  },

  async releasePaymentToWallet(paymentId, braiderId, amount) {
    return { success: true, error: null }
  },

  async getBraiderWallet(braiderId) {
    return { wallet: null, error: null }
  },

  async withdrawFromWallet(braiderId, amount) {
    return { success: true, error: null }
  },

  // Message methods
  async sendMessage(senderId, recipientId, content) {
    try {
      const message = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        sender_id: senderId,
        receiver_id: recipientId,
        content,
        created_at: new Date().toISOString(),
      }
      messages.set(message.id, message)
      saveData()
      return { message, error: null }
    } catch (error) {
      return { message: null, error: error.message }
    }
  },

  async getMessages(userId, otherUserId) {
    try {
      const messageList = Array.from(messages.values())
      const filtered = messageList.filter(m => 
        (m.sender_id === userId && m.receiver_id === otherUserId) ||
        (m.sender_id === otherUserId && m.receiver_id === userId)
      )
      return { messages: filtered, error: null }
    } catch (error) {
      return { messages: [], error: error.message }
    }
  },

  async markMessageAsRead(messageId) {
    return { error: null }
  },
}

// Mock Supabase object for compatibility
dbService.supabase = {
  from: (table) => ({
    select: (columns) => ({
      or: (condition) => ({
        order: (column, options) => ({
          then: (callback) => {
            // Return mock data based on table
            if (table === 'messages') {
              const messageList = Array.from(messages.values())
              callback({ data: messageList, error: null })
            } else if (table === 'braiders') {
              const braiderList = Array.from(braiders.values())
              callback({ data: braiderList, error: null })
            }
            return Promise.resolve({ data: [], error: null })
          }
        }),
        then: (callback) => {
          if (table === 'messages') {
            const messageList = Array.from(messages.values())
            callback({ data: messageList, error: null })
          }
          return Promise.resolve({ data: [], error: null })
        }
      }),
      then: (callback) => {
        if (table === 'braiders') {
          const braiderList = Array.from(braiders.values())
          callback({ data: braiderList, error: null })
        }
        return Promise.resolve({ data: [], error: null })
      }
    }),
    insert: (data) => ({
      then: (callback) => {
        if (table === 'messages' && Array.isArray(data)) {
          data.forEach(msg => messages.set(msg.id || 'msg_' + Date.now(), msg))
          saveData()
        }
        callback({ data, error: null })
        return Promise.resolve({ data, error: null })
      }
    })
  })
}

export const supabase = null
