import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from './authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load auth state ONCE on mount
  useEffect(() => {
    const loadUser = () => {
      const savedUser = authService.getCurrentUser()
      setUser(savedUser)
      setLoading(false)
    }
    
    loadUser()
  }, [])

  const login = async (email, password) => {
    const userData = await authService.login(email, password)
    setUser(userData)
    return userData // Return the user data, not just success
  }

  const signup = async (email, password, fullName, phone, role) => {
    const result = await authService.signup(email, password, fullName, phone, role)
    // Auto-login after signup
    if (result.success) {
      const userData = await authService.login(email, password)
      setUser(userData)
    }
    return result
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
