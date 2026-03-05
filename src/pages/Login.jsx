import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PublicNavbar from '../components/PublicNavbar'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, profile } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const { success, error: loginError } = await login(email, password)
      
      if (!success) {
        setError(loginError || 'Login failed')
        setIsLoading(false)
        return
      }

      // Wait for profile to be available (login() now waits for it)
      // Give a small delay to ensure state is updated
      await new Promise(r => setTimeout(r, 100))
      
      // Check if profile is loaded
      if (!profile) {
        setError('Failed to load user profile. Please try again.')
        setIsLoading(false)
        return
      }

      // Redirect based on user role
      const userRole = profile.role || 'customer'
      const destination = userRole === 'braider' ? '/braider/dashboard' : 
                         userRole === 'admin' ? '/admin/dashboard' : 
                         '/customer/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <>
      <PublicNavbar />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Welcome Back</h1>
            <p>Sign in to your BRAIDLY account</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
