/**
 * REAL-TIME INTEGRATION SERVICE
 * Handles real-time payment, booking, messaging, and portfolio updates
 * Production-grade implementation
 */

import { supabase } from './supabaseClient'

export class RealtimeIntegrationService {
  /**
   * Get braider full profile with portfolio and credentials
   */
  static async getBraiderFullProfile(braiderId) {
    try {
      // Get braider profile
      const { data: braider, error: braiderError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', braiderId)
        .single()

      if (braiderError) throw braiderError

      // Get braider portfolio
      const portfolio = await this.getBraiderPortfolio(braiderId)

      // Get braider payment credentials
      const paymentCredentials = await this.getBraiderPaymentCredentials(braiderId)

      // Get braider stats
      const stats = await this.getBraiderStats(braiderId)

      return {
        ...braider,
        portfolio,
        paymentCredentials,
        stats
      }
    } catch (err) {
      console.error('Error fetching braider profile:', err)
      throw err
    }
  }

  /**
   * Get braider portfolio images
   */
  static async getBraiderPortfolio(braiderId) {
    try {
      // Try to get from storage
      const { data: files, error } = await supabase
        .storage
        .from('braider-portfolios')
        .list(braiderId)

      if (error) {
        console.warn('Portfolio storage error:', error)
        return []
      }

      // Get signed URLs for each file
      const portfolio = await Promise.all(
        files.map(async (file) => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('braider-portfolios')
            .getPublicUrl(`${braiderId}/${file.name}`)

          return {
            id: file.id,
            name: file.name,
            url: publicUrl,
            uploadedAt: file.created_at
          }
        })
      )

      return portfolio
    } catch (err) {
      console.error('Error fetching portfolio:', err)
      return []
    }
  }

  /**
   * Get braider payment credentials for real-time payment
   */
  static async getBraiderPaymentCredentials(braiderId) {
    try {
      const { data, error } = await supabase
        .from('braider_payment_info')
        .select('*')
        .eq('braider_id', braiderId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data || {
        hourly_rate: 0,
        payment_methods: [],
        currency: 'USD',
        availability: {}
      }
    } catch (err) {
      console.error('Error fetching payment credentials:', err)
      return null
    }
  }

  /**
   * Get braider statistics
   */
  static async getBraiderStats(braiderId) {
    try {
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('braider_id', braiderId)

      if (bookingError) throw bookingError

      const { data: reviews, error: reviewError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('braider_id', braiderId)

      if (reviewError) throw reviewError

      const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0

      return {
        totalBookings: bookings?.length || 0,
        completedBookings: bookings?.filter(b => b.status === 'completed').length || 0,
        averageRating: avgRating,
        totalReviews: reviews?.length || 0
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
      return {
        totalBookings: 0,
        completedBookings: 0,
        averageRating: 0,
        totalReviews: 0
      }
    }
  }

  /**
   * Create real-time booking
   */
  static async createRealtimeBooking(bookingData) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          customer_id: bookingData.customerId,
          braider_id: bookingData.braiderId,
          appointment_date: bookingData.appointmentDate,
          duration_hours: bookingData.durationHours,
          service_type: bookingData.serviceType,
          amount: bookingData.amount,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Error creating booking:', err)
      throw err
    }
  }

  /**
   * Subscribe to real-time booking updates
   */
  static subscribeToBookingUpdates(bookingId, callback) {
    const subscription = supabase
      .from(`bookings:id=eq.${bookingId}`)
      .on('*', payload => {
        callback(payload.new)
      })
      .subscribe()

    return subscription
  }

  /**
   * Create real-time message
   */
  static async createRealtimeMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: messageData.senderId,
          recipient_id: messageData.recipientId,
          content: messageData.content,
          booking_id: messageData.bookingId,
          created_at: new Date().toISOString(),
          read: false
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Error creating message:', err)
      throw err
    }
  }

  /**
   * Subscribe to real-time messages
   */
  static subscribeToMessages(userId, callback) {
    const subscription = supabase
      .from(`messages:recipient_id=eq.${userId}`)
      .on('INSERT', payload => {
        callback(payload.new)
      })
      .subscribe()

    return subscription
  }

  /**
   * Get conversation history
   */
  static async getConversationHistory(userId, otherUserId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data.reverse()
    } catch (err) {
      console.error('Error fetching conversation:', err)
      return []
    }
  }

  /**
   * Process real-time payment
   */
  static async processRealtimePayment(paymentData) {
    try {
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([{
          customer_id: paymentData.customerId,
          braider_id: paymentData.braiderId,
          booking_id: paymentData.bookingId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          provider: paymentData.provider,
          payment_method: paymentData.paymentMethod,
          status: 'processing',
          metadata: paymentData.metadata,
          created_at: new Date().toISOString()
        }])
        .select()

      if (paymentError) throw paymentError

      // Create escrow
      const { data: escrow, error: escrowError } = await supabase
        .from('escrow_transactions')
        .insert([{
          payment_id: payment[0].id,
          customer_id: paymentData.customerId,
          braider_id: paymentData.braiderId,
          amount: paymentData.amount,
          status: 'held',
          held_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }])
        .select()

      if (escrowError) throw escrowError

      return { payment: payment[0], escrow: escrow[0] }
    } catch (err) {
      console.error('Error processing payment:', err)
      throw err
    }
  }

  /**
   * Subscribe to real-time payment updates
   */
  static subscribeToPaymentUpdates(paymentId, callback) {
    const subscription = supabase
      .from(`payments:id=eq.${paymentId}`)
      .on('UPDATE', payload => {
        callback(payload.new)
      })
      .subscribe()

    return subscription
  }

  /**
   * Get available time slots for braider
   */
  static async getAvailableTimeSlots(braiderId, date) {
    try {
      // Get braider availability
      const { data: availability, error: availError } = await supabase
        .from('braider_availability')
        .select('*')
        .eq('braider_id', braiderId)
        .eq('date', date)
        .single()

      if (availError && availError.code !== 'PGRST116') throw availError

      if (!availability) {
        return generateDefaultTimeSlots()
      }

      // Get booked slots
      const { data: bookings, error: bookError } = await supabase
        .from('bookings')
        .select('appointment_date, duration_hours')
        .eq('braider_id', braiderId)
        .eq('status', 'confirmed')

      if (bookError) throw bookError

      return generateAvailableSlots(availability, bookings)
    } catch (err) {
      console.error('Error fetching time slots:', err)
      return generateDefaultTimeSlots()
    }
  }

  /**
   * Update booking status in real-time
   */
  static async updateBookingStatus(bookingId, status) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Error updating booking:', err)
      throw err
    }
  }

  /**
   * Mark message as read
   */
  static async markMessageAsRead(messageId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Error marking message as read:', err)
      throw err
    }
  }
}

// Helper functions
function generateDefaultTimeSlots() {
  const slots = []
  for (let hour = 9; hour < 18; hour++) {
    slots.push({
      time: `${hour}:00`,
      available: true
    })
  }
  return slots
}

function generateAvailableSlots(availability, bookings) {
  const slots = []
  const bookedTimes = new Set()

  // Mark booked times
  bookings.forEach(booking => {
    const startHour = new Date(booking.appointment_date).getHours()
    for (let i = 0; i < booking.duration_hours; i++) {
      bookedTimes.add(startHour + i)
    }
  })

  // Generate available slots
  for (let hour = 9; hour < 18; hour++) {
    slots.push({
      time: `${hour}:00`,
      available: !bookedTimes.has(hour)
    })
  }

  return slots
}
