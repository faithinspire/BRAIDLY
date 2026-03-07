import { createContext, useContext, useState, useEffect } from 'react'
import { dbService } from '../services/supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialized, setInitialized] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('braidly_current_user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setProfile({
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
        })
      }
    } catch (e) {
      console.warn('Load user error:', e)
    } finally {
      setInitialized(true)
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
      setProfile({
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
      })
      
      // Store in localStorage
      localStorage.setItem('braidly_current_user', JSON.stringify(newUser))
      
      setLoading(false)
      return { success: true, error: null }
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message)
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { user: loginUser, error: loginError } = await dbService.login(email, password)
      if (loginError) throw new Error(loginError)
      
      setUser(loginUser)
      setProfile({
        id: loginUser.id,
        email: loginUser.email,
        full_name: loginUser.full_name,
        role: loginUser.role,
      })
      
      // Store in localStorage
      localStorage.setItem('braidly_current_user', JSON.stringify(loginUser))
      
      setLoading(false)
      return { success: true, error: null }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message)
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      setUser(null)
      setProfile(null)
      localStorage.removeItem('braidly_current_user')
      setLoading(false)
      return { success: true, error: null }
    } catch (err) {
      setError(err.message)
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const updateProfile = async (updates) => {
    setLoading(true)
    try {
      const updated = { ...profile, ...updates }
      setProfile(updated)
      setLoading(false)
      return { success: true, error: null }
    } catch (err) {
      setError(err.message)
      setLoading(false)
      return { success: false, error: err.message }
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
