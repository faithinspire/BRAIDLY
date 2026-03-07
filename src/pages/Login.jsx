import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PublicNavbar from '../components/PublicNavbar'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
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

      // Wait longer for state to update, then redirect
      await new Promise(r => setTimeout(r, 500))
      
      // Get the user role from localStorage to redirect correctly
      const storedUser = localStorage.getItem('braidly_current_user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        const destination = userData.role === 'braider' ? '/braider/dashboard' : 
                           userData.role === 'admin' ? '/admin/dashboard' : 
                           '/customer/dashboard'
        navigate(destination, { replace: true })
      } else {
        navigate('/customer/dashboard', { replace: true })
      }
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
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
