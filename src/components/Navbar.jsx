import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, profile, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const { success } = await logout()
      if (success) {
        navigate('/', { replace: true })
      } else {
        setIsLoggingOut(false)
      }
    } catch (err) {
      console.error('Logout error:', err)
      setIsLoggingOut(false)
    }
  }

  const getDashboardLink = () => {
    if (!user) return null
    switch (profile?.role) {
      case 'braider':
        return '/braider/dashboard'
      case 'admin':
        return '/admin/dashboard'
      default:
        return '/customer/dashboard'
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">B</span>
          <span className="logo-text">BRAIDLY</span>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {!user ? (
            <>
              <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
              <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Sign In</Link>
              <Link to="/signup" className="nav-btn signup-btn" onClick={closeMobileMenu}>Sign Up</Link>
            </>
          ) : (
            <>
              <Link to={getDashboardLink()} className="nav-link" onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>Profile</Link>
              <Link to={`/${profile?.role}/chat`} className="nav-link" onClick={closeMobileMenu}>Messages</Link>
              <button
                onClick={() => {
                  handleLogout()
                  closeMobileMenu()
                }}
                disabled={isLoggingOut}
                className="nav-btn logout-btn"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
