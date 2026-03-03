import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../auth/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import './Auth.css'

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: 'customer'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const { signup } = useAuth()
  const navigate = useNavigate()

  const backgroundImages = [
    '/backgrounds/bg1.jpg',
    '/backgrounds/bg2.jpg',
    '/backgrounds/bg3.jpg',
    '/backgrounds/bg4.jpg',
    '/backgrounds/bg5.jpg'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      )
    }, 6000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  useEffect(() => {
    // GSAP animation for logo
    gsap.from('.auth-logo h1', {
      opacity: 0,
      y: -40,
      duration: 1.5,
      ease: 'power4.out'
    })
    
    gsap.from('.auth-logo p', {
      opacity: 0,
      y: -20,
      duration: 1.5,
      delay: 0.3,
      ease: 'power4.out'
    })
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      await signup(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone,
        formData.role
      )
      
      // Redirect to appropriate dashboard based on role
      const dashboardUrl = formData.role === 'braider' 
        ? '/braider/dashboard' 
        : '/customer/dashboard'
      
      navigate(dashboardUrl)
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
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

      {/* Signup Form */}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <h1>BRAIDLY</h1>
            <p>Create your account and get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="auth-form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-user auth-input-icon"></i>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="auth-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-envelope auth-input-icon"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="auth-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-phone auth-input-icon"></i>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="auth-input"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="role">I am a...</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-user-tag auth-input-icon"></i>
                <select
                  id="role"
                  name="role"
                  className="auth-select"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="customer">Customer</option>
                  <option value="braider">Braider</option>
                </select>
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-lock auth-input-icon"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="auth-input"
                  placeholder="Create a password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-lock auth-input-icon"></i>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="auth-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                  <span style={{ marginLeft: '0.5rem' }}>Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>

      <ThemeToggle />
    </div>
  )
}
