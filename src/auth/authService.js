import { supabase } from '../services/supabase'

const AUTH_KEY = 'braidly_user'

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error loading user:', error)
      return null
    }
  },

  saveUser(userData) {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    } catch (error) {
      console.error('Error saving user:', error)
    }
  },

  clearUser() {
    localStorage.removeItem(AUTH_KEY)
  },

  async login(email, password) {
    try {
      console.log('🔐 Login attempt:', email)

      // Step 1: Authenticate
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password
      })

      if (authError) {
        console.error('❌ Auth error:', authError.message)
        throw new Error(authError.message || 'Login failed')
      }

      if (!authData.user) {
        throw new Error('No user data returned')
      }

      console.log('✅ Auth successful, fetching profile...')

      // Step 2: Fetch profile (ONE attempt, no retries)
      let profile = null
      try {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .limit(1)

        if (!profileError && profiles && profiles.length > 0) {
          profile = profiles[0]
          console.log('✅ Profile fetched successfully')
        } else if (profileError) {
          console.warn('⚠️ Profile fetch error:', profileError.message)
        } else {
          console.warn('⚠️ Profile not found')
        }
      } catch (err) {
        console.warn('⚠️ Could not fetch profile:', err.message)
      }

      // Step 3: If profile doesn't exist, try to create it (but don't fail if RLS blocks it)
      if (!profile) {
        console.log('⚠️ Profile not found, attempting to create...')
        try {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: authData.user.email,
              full_name: authData.user.user_metadata?.full_name || 'User',
              phone: authData.user.user_metadata?.phone || '',
              role: authData.user.user_metadata?.role || 'customer',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (insertError) {
            console.warn('⚠️ Profile creation blocked by RLS:', insertError.message)
            // Don't throw - RLS is blocking but user is authenticated
          } else {
            console.log('✅ Profile created successfully')
          }
        } catch (err) {
          console.warn('⚠️ Profile creation error:', err.message)
          // Don't throw - continue anyway
        }

        // Use auth metadata as fallback profile data
        profile = {
          id: authData.user.id,
          email: authData.user.email,
          full_name: authData.user.user_metadata?.full_name || 'User',
          phone: authData.user.user_metadata?.phone || '',
          role: authData.user.user_metadata?.role || 'customer',
          avatar_url: ''
        }
      }

      // Step 4: Return user data
      const userData = {
        id: authData.user.id,
        email: profile.email || authData.user.email,
        fullName: profile.full_name || 'User',
        phone: profile.phone || '',
        role: profile.role || 'customer',
        avatarUrl: profile.avatar_url || ''
      }

      this.saveUser(userData)
      console.log('✅ Login successful')
      return userData
    } catch (error) {
      console.error('💥 Login error:', error.message)
      throw error
    }
  },

  async signup(email, password, fullName, phone, role) {
    try {
      console.log('📝 Signup attempt:', email, 'Role:', role)

      if (!email || !password || !fullName) {
        throw new Error('Email, password, and name are required')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      const cleanEmail = email.toLowerCase().trim()
      const cleanRole = role || 'customer'

      // Step 1: Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: cleanRole
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      })

      if (authError) {
        console.error('❌ Signup error:', authError.message)
        throw new Error(authError.message || 'Signup failed')
      }

      if (!authData.user) {
        throw new Error('User creation failed')
      }

      const userId = authData.user.id
      console.log('✅ Auth user created:', userId)

      // Step 2: Wait for trigger to create profile (database handles it)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Step 3: Try to verify profile was created, but don't fail if it doesn't exist yet
      let profileExists = false
      try {
        const { data: profileCheck, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .limit(1)

        if (!checkError && profileCheck && profileCheck.length > 0) {
          profileExists = true
          console.log('✅ Profile auto-created by trigger')
        } else {
          console.warn('⚠️ Profile not found in database')
        }
      } catch (err) {
        console.warn('⚠️ Could not verify profile:', err.message)
      }

      // Step 4: If profile doesn't exist, try to create it manually (but don't fail if RLS blocks it)
      if (!profileExists) {
        try {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: cleanEmail,
              full_name: fullName,
              phone: phone,
              role: cleanRole,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (insertError) {
            console.warn('⚠️ Profile creation blocked by RLS:', insertError.message)
            // Don't throw - RLS is blocking but user is authenticated
            // Profile will be created by trigger or admin
          } else {
            console.log('✅ Profile created manually')
          }
        } catch (err) {
          console.warn('⚠️ Manual profile creation error:', err.message)
          // Don't throw - continue anyway
        }
      }

      const userData = {
        id: userId,
        email: cleanEmail,
        fullName: fullName,
        phone: phone,
        role: cleanRole,
        avatarUrl: ''
      }

      this.saveUser(userData)
      console.log('✅ Signup complete - user authenticated')

      return {
        success: true,
        user: userData,
        message: 'Account created successfully!'
      }
    } catch (error) {
      console.error('💥 Signup error:', error.message)
      throw error
    }
  },

  async logout() {
    try {
      await supabase.auth.signOut()
      this.clearUser()
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
      this.clearUser()
    }
  },

  getDashboardUrl(role) {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'braider':
        return '/braider/dashboard'
      default:
        return '/customer/dashboard'
    }
  },

  async checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return !!session
    } catch (error) {
      console.error('Auth check error:', error)
      return false
    }
  }
}
