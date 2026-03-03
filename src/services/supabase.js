import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseDB = {
  // Get user profile
  async getUser(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1)
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  },

  // Update user profile
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .limit(1)
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  },

  // Get braider profile
  async getBraiderProfile(userId) {
    const { data, error } = await supabase
      .from('braider_profiles')
      .select('*')
      .eq('user_id', userId)
      .limit(1)
    
    if (error && error.code !== 'PGRST116') throw error
    return data && data.length > 0 ? data[0] : null
  },

  // Update braider profile
  async updateBraiderProfile(userId, updates) {
    const { data, error } = await supabase
      .from('braider_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .limit(1)
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  },

  // Upload avatar - DEPRECATED: Use uploadService instead
  async uploadAvatar(userId, file) {
    console.warn('⚠️ supabaseDB.uploadAvatar is deprecated. Use uploadService.uploadAvatar instead.')
    throw new Error('Use uploadService.uploadAvatar instead')
  },

  // Upload portfolio image - DEPRECATED: Use uploadService instead
  async uploadPortfolioImage(userId, file, caption, styleCategory) {
    console.warn('⚠️ supabaseDB.uploadPortfolioImage is deprecated. Use uploadService.uploadPortfolioImage instead.')
    throw new Error('Use uploadService.uploadPortfolioImage instead')
  },

  // Get portfolio images
  async getPortfolioImages(userId) {
    try {
      const { data: braiderProfile, error: profileError } = await supabase
        .from('braider_profiles')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (profileError || !braiderProfile || braiderProfile.length === 0) {
        return []
      }

      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('braider_id', braiderProfile[0].id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching portfolio:', error.message)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Portfolio fetch error:', error.message)
      return []
    }
  },

  // Get gallery images
  async getGalleryImages(limit = 12) {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select(`
          *,
          braider:braider_profiles!gallery_images_braider_id_fkey (
            user_id,
            profiles!braider_profiles_user_id_fkey (full_name)
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Gallery fetch error:', error.message)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Gallery error:', error.message)
      return []
    }
  },

  // Get braiders
  async getBraiders(filters = {}) {
    try {
      let query = supabase
        .from('braider_profiles')
        .select(`
          *,
          profiles!braider_profiles_user_id_fkey (
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('is_active', true)

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }

      if (filters.minRating) {
        query = query.gte('rating', filters.minRating)
      }

      const { data, error } = await query.order('rating', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Braiders fetch error:', error.message)
      return []
    }
  },

  // Get single braider
  async getBraider(braiderId) {
    try {
      const { data, error } = await supabase
        .from('braider_profiles')
        .select(`
          *,
          profiles!braider_profiles_user_id_fkey (
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('id', braiderId)
        .limit(1)

      if (error) throw error
      return data && data.length > 0 ? data[0] : null
    } catch (error) {
      console.error('Braider fetch error:', error.message)
      return null
    }
  },

  // Get braider earnings stats
  async getBraiderEarningsStats(userId) {
    try {
      const { data: braiderProfile, error: profileError } = await supabase
        .from('braider_profiles')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (profileError || !braiderProfile || braiderProfile.length === 0) {
        return {
          totalEarned: 0,
          thisMonth: 0,
          pendingPayout: 0,
          avgPerBooking: 0
        }
      }

      // Get all completed bookings for this braider
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('braider_id', braiderProfile[0].id)
        .eq('status', 'completed')

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError.message)
        return {
          totalEarned: 0,
          thisMonth: 0,
          pendingPayout: 0,
          avgPerBooking: 0
        }
      }

      const allBookings = bookings || []
      const totalEarned = allBookings.reduce((sum, b) => sum + (b.price || 0), 0)
      const avgPerBooking = allBookings.length > 0 ? totalEarned / allBookings.length : 0

      // Get this month's earnings
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const thisMonthEarnings = allBookings
        .filter(b => new Date(b.created_at) >= thisMonthStart)
        .reduce((sum, b) => sum + (b.price || 0), 0)

      // Get pending payouts (completed but not yet paid out)
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('braider_id', braiderProfile[0].id)
        .eq('status', 'completed')

      const paidAmount = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0)
      const pendingPayout = totalEarned - paidAmount

      return {
        totalEarned: Math.round(totalEarned * 100) / 100,
        thisMonth: Math.round(thisMonthEarnings * 100) / 100,
        pendingPayout: Math.round(pendingPayout * 100) / 100,
        avgPerBooking: Math.round(avgPerBooking * 100) / 100
      }
    } catch (error) {
      console.error('Error calculating earnings stats:', error.message)
      return {
        totalEarned: 0,
        thisMonth: 0,
        pendingPayout: 0,
        avgPerBooking: 0
      }
    }
  },

  // Get braider earnings history
  async getBraiderEarnings(userId) {
    try {
      const { data: braiderProfile, error: profileError } = await supabase
        .from('braider_profiles')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (profileError || !braiderProfile || braiderProfile.length === 0) {
        return []
      }

      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (full_name),
          service:service_id (name)
        `)
        .eq('braider_id', braiderProfile[0].id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (bookingsError) {
        console.error('Error fetching earnings history:', bookingsError.message)
        return []
      }

      return bookings || []
    } catch (error) {
      console.error('Error fetching braider earnings:', error.message)
      return []
    }
  }
}
