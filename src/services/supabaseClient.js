import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Retry logic for transient failures
const retryOperation = async (operation, maxRetries = 3, delayMs = 100) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries - 1) throw error
      if (error.message?.includes('AbortError') || error.message?.includes('timeout')) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)))
      } else {
        throw error
      }
    }
  }
}

// Database Service
export const dbService = {
  // Auth
  async signup(email, password, fullName, role) {
    try {
      // Validate inputs
      if (!email || !password || !fullName) {
        throw new Error('Missing required fields')
      }

      // Step 1: Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          }
        }
      })

      if (error) {
        // Handle specific Supabase errors
        if (error.message?.includes('already registered')) {
          throw new Error('This email is already registered')
        } else if (error.message?.includes('invalid')) {
          throw new Error('Invalid email or password format')
        } else if (error.status === 400) {
          throw new Error('Invalid request. Please check your information.')
        }
        throw error
      }

      if (!data.user) {
        throw new Error('User creation failed')
      }

      const userId = data.user.id

      // Step 2: Create profile
      const { error: profileErr } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email,
            full_name: fullName,
            role,
          },
        ])
      
      if (profileErr) {
        console.error('Profile creation failed:', profileErr)
        throw new Error(`Profile creation failed: ${profileErr.message}`)
      }

      // Step 3: Create role-specific record immediately
      if (role === 'braider') {
        const { error: braiderErr } = await supabase
          .from('braiders')
          .insert([{ id: userId }])
        
        if (braiderErr) {
          console.error('Braider record creation failed:', braiderErr)
          throw new Error(`Braider record creation failed: ${braiderErr.message}`)
        }
      } else if (role === 'customer') {
        const { error: customerErr } = await supabase
          .from('customers')
          .insert([{ id: userId }])
        
        if (customerErr) {
          console.error('Customer record creation failed:', customerErr)
          throw new Error(`Customer record creation failed: ${customerErr.message}`)
        }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { user: null, error: error.message || 'Signup failed' }
    }
  },

  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  async getProfile(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          throw new Error('Profile not found')
        } else if (error.message?.includes('permission')) {
          // RLS denied
          throw new Error('Permission denied - not authenticated')
        }
        throw error
      }
      
      if (!data) {
        throw new Error('Profile data is empty')
      }
      
      return { profile: data, error: null }
    } catch (error) {
      console.error('getProfile error:', error)
      return { profile: null, error: error.message }
    }
  },

  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      if (error) throw error
      return { profile: data, error: null }
    } catch (error) {
      return { profile: null, error: error.message }
    }
  },

  async getBraiderProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('braiders')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      return { braider: data, error: null }
    } catch (error) {
      return { braider: null, error: error.message }
    }
  },

  async updateBraiderProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('braiders')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      if (error) throw error
      return { braider: data, error: null }
    } catch (error) {
      return { braider: null, error: error.message }
    }
  },

  // Storage
  async uploadAvatar(userId, file) {
    try {
      const fileName = `${userId}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })
      if (error) throw error

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return { url: data.publicUrl, error: null }
    } catch (error) {
      return { url: null, error: error.message }
    }
  },

  async uploadPortfolio(braiderID, file) {
    try {
      const fileName = `${braiderID}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage
        .from('portfolios')
        .upload(fileName, file)
      if (error) throw error

      const { data } = supabase.storage
        .from('portfolios')
        .getPublicUrl(fileName)

      return { url: data.publicUrl, error: null }
    } catch (error) {
      return { url: null, error: error.message }
    }
  },

  // Bookings
  async createBooking(customerId, braiderId, appointmentDate, amount, notes = '') {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          customer_id: customerId,
          braider_id: braiderId,
          appointment_date: appointmentDate,
          amount,
          notes,
          status: 'pending',
        }])
        .select()
        .single()
      if (error) throw error
      return { booking: data, error: null }
    } catch (error) {
      return { booking: null, error: error.message }
    }
  },

  async getBookings(userId, role) {
    try {
      let query = supabase.from('bookings').select('*')
      
      if (role === 'customer') {
        query = query.eq('customer_id', userId)
      } else if (role === 'braider') {
        query = query.eq('braider_id', userId)
      }
      
      const { data, error } = await query.order('appointment_date', { ascending: false })
      if (error) throw error
      return { bookings: data || [], error: null }
    } catch (error) {
      return { bookings: [], error: error.message }
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single()
      if (error) throw error
      return { booking: data, error: null }
    } catch (error) {
      return { booking: null, error: error.message }
    }
  },

  // Payments
  async createPayment(bookingId, customerId, braiderId, amount) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          booking_id: bookingId,
          customer_id: customerId,
          braider_id: braiderId,
          amount,
          status: 'pending',
        }])
        .select()
        .single()
      if (error) throw error
      return { payment: data, error: null }
    } catch (error) {
      return { payment: null, error: error.message }
    }
  },

  async getPayments(userId, role) {
    try {
      let query = supabase.from('payments').select('*')
      
      if (role === 'customer') {
        query = query.eq('customer_id', userId)
      } else if (role === 'braider') {
        query = query.eq('braider_id', userId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return { payments: data || [], error: null }
    } catch (error) {
      return { payments: [], error: error.message }
    }
  },

  async updatePaymentStatus(paymentId, status) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', paymentId)
        .select()
        .single()
      if (error) throw error
      return { payment: data, error: null }
    } catch (error) {
      return { payment: null, error: error.message }
    }
  },

  async releasePaymentToWallet(paymentId, braiderId, amount) {
    try {
      // Step 1: Update payment status to 'released'
      await retryOperation(async () => {
        const { error: paymentError } = await supabase
          .from('payments')
          .update({ status: 'released' })
          .eq('id', paymentId)
        if (paymentError) throw paymentError
      })

      // Step 2: Fetch current wallet balance
      const { data: braider, error: fetchError } = await supabase
        .from('braiders')
        .select('wallet_balance')
        .eq('id', braiderId)
        .single()
      if (fetchError) throw fetchError

      // Step 3: Update wallet balance with new amount
      const newBalance = (braider.wallet_balance || 0) + amount
      await retryOperation(async () => {
        const { error: updateError } = await supabase
          .from('braiders')
          .update({ wallet_balance: newBalance })
          .eq('id', braiderId)
        if (updateError) throw updateError
      })

      return { success: true, error: null }
    } catch (error) {
      console.error('Release payment error:', error)
      return { success: false, error: error.message }
    }
  },

  async getBraiderWallet(braiderId) {
    try {
      const { data, error } = await supabase
        .from('braiders')
        .select('wallet_balance, total_bookings')
        .eq('id', braiderId)
        .single()
      if (error) throw error
      return { wallet: data, error: null }
    } catch (error) {
      return { wallet: null, error: error.message }
    }
  },

  async withdrawFromWallet(braiderId, amount) {
    try {
      // Step 1: Fetch current balance
      const { data: braider, error: fetchError } = await supabase
        .from('braiders')
        .select('wallet_balance')
        .eq('id', braiderId)
        .single()
      if (fetchError) throw fetchError

      // Step 2: Validate sufficient balance
      if (braider.wallet_balance < amount) {
        throw new Error('Insufficient wallet balance')
      }

      // Step 3: Update balance (sequential operation)
      const newBalance = braider.wallet_balance - amount
      await retryOperation(async () => {
        const { error: updateError } = await supabase
          .from('braiders')
          .update({ wallet_balance: newBalance })
          .eq('id', braiderId)
        if (updateError) throw updateError
      })

      return { success: true, error: null }
    } catch (error) {
      console.error('Withdraw error:', error)
      return { success: false, error: error.message }
    }
  },

  // Messages (for chat)
  async sendMessage(senderId, recipientId, content) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: senderId,
          recipient_id: recipientId,
          content,
        }])
        .select()
        .single()
      if (error) throw error
      return { message: data, error: null }
    } catch (error) {
      return { message: null, error: error.message }
    }
  },

  async getMessages(userId, otherUserId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
        .order('created_at', { ascending: true })
      if (error) throw error
      return { messages: data || [], error: null }
    } catch (error) {
      return { messages: [], error: error.message }
    }
  },

  async markMessageAsRead(messageId) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  supabase,
}
