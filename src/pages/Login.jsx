import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import './Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const backgroundImages = [
    '/assets/images/b_Professional_photo_o.png',
    '/assets/images/b_Professional_photo_o (1).png',
    '/assets/images/b_Professional_photo_o (2).png',
    '/assets/images/b_Professional_photo_o (3).png',
    '/assets/images/b_Long_box_braids_with.png',
    '/assets/images/b_Knotless_braids_hair.png',
    '/assets/images/b_Medium_knotless_brai.png'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      )
    }, 6000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      
      // Determine dashboard URL based on role
      const dashboardUrl = user.role === 'admin' 
        ? '/admin/dashboard'
        : user.role === 'braider'
        ? '/braider/dashboard'
        : '/customer/dashboard'
      
      // Navigate with replace to prevent going back to login
      navigate(dashboardUrl, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="auth-background">
        {backgroundImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Braiding style ${index + 1}`}
            className={`auth-background-image ${index === currentImageIndex ? 'active' : ''}`}
          />
        ))}
        <div className="auth-background-overlay"></div>
      </div>

      {/* Back to Home Link */}
      <Link to="/" className="auth-back-link">
        <i className="fas fa-arrow-left"></i>
        <span>Back to Home</span>
      </Link>

      {/* Login Form */}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <h1>Braidly</h1>
            <p>Welcome back! Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="auth-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-envelope auth-input-icon"></i>
                <input
                  type="email"
                  id="email"
                  className="auth-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-lock auth-input-icon"></i>
                <input
                  type="password"
                  id="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-loading"></span>
                  <span style={{ marginLeft: '0.5rem' }}>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
          </div>
        </div>
      </div>

      <ThemeToggle />
    </div>
  )
}
