import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase, dbService } from '../services/supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialized, setInitialized] = useState(false)
  const initRef = useRef(false)

  // Check auth state on mount - ONLY ONCE
  useEffect(() => {
    // Prevent double initialization in Strict Mode
    if (initRef.current) return
    initRef.current = true

    let isMounted = true

    const checkAuth = async () => {
      try {
        // Check localStorage for mock auth
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          if (isMounted) {
            setUser(user)
            
            // Try to fetch profile
            try {
              const { profile: p } = await dbService.getProfile(user.id)
              if (isMounted && p) {
                setProfile(p)
              }
            } catch (e) {
              console.warn('Profile fetch error:', e)
            }
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (err) {
        console.error('Auth check error:', err)
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setInitialized(true)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const signup = async (email, password, fullName, role) => {
    setLoading(true)
    setError(null)
    try {
      const { user: newUser, error: signupError } = await dbService.signup(
        email,
        password,
        fullName,
        role
      )
      if (signupError) throw new Error(signupError)
      setUser(newUser)
      return { success: true, error: null }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { user: loginUser, error: loginError } = await dbService.login(
        email,
        password
      )
      if (loginError) throw new Error(loginError)
      setUser(loginUser)
      
      // WAIT for profile to be fetched with retries
      let profileData = null
      let attempts = 0
      const maxAttempts = 10
      
      while (!profileData && attempts < maxAttempts) {
        try {
          const { profile: p } = await dbService.getProfile(loginUser.id)
          if (p) {
            profileData = p
            setProfile(p)
            break
          }
        } catch (e) {
          console.warn(`Profile fetch attempt ${attempts + 1}/${maxAttempts}:`, e)
        }
        
        if (!profileData && attempts < maxAttempts - 1) {
          await new Promise(r => setTimeout(r, 200 * Math.pow(1.5, attempts)))
        }
        attempts++
      }
      
      if (!profileData) {
        throw new Error('Failed to load user profile after multiple attempts')
      }
      
      return { success: true, error: null }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error: logoutError } = await dbService.logout()
      if (logoutError) throw new Error(logoutError)
      setUser(null)
      setProfile(null)
      return { success: true, error: null }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    setLoading(true)
    setError(null)
    try {
      const { profile: updatedProfile, error: updateError } = await dbService.updateProfile(
        user.id,
        updates
      )
      if (updateError) throw new Error(updateError)
      setProfile(updatedProfile)
      return { success: true, error: null }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    initialized,
    signup,
    login,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
