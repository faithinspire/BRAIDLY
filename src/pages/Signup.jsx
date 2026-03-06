import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PublicNavbar from '../components/PublicNavbar'
import './Auth.css'

export default function Signup() {
  const navigate = useNavigate()
  const { signup, login } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    if (!fullName || !email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const { success: signupSuccess, error: signupError } = await signup(email, password, fullName, role)
      
      if (!signupSuccess) {
        setError(signupError || 'Signup failed. Please try again.')
        setIsLoading(false)
        return
      }

      setSuccess('Account created! Logging in...')
      
      setTimeout(async () => {
        try {
          const { success: loginSuccess, error: loginError } = await login(email, password)
          
          if (!loginSuccess) {
            setError(loginError || 'Auto-login failed. Please sign in manually.')
            setSuccess('')
            setIsLoading(false)
            return
          }

          await new Promise(r => setTimeout(r, 100))
          const destination = role === 'braider' ? '/braider/dashboard' : '/customer/dashboard'
          navigate(destination, { replace: true })
        } catch (err) {
          console.error('Auto-login error:', err)
          setError('Auto-login failed. Please sign in manually.')
          setSuccess('')
          setIsLoading(false)
        }
      }, 1000)
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'Signup failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <>
      <PublicNavbar />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Create Account</h1>
            <p>Join BRAIDLY and connect with professional braiders</p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

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

              <div className="form-group">
                <label>I am a...</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} disabled={isLoading}>
                  <option value="customer">Customer</option>
                  <option value="braider">Braider</option>
                </select>
              </div>

              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
