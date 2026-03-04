import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import gsap from 'gsap'
import { useAuth } from '../auth/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // GSAP animation for logo
    gsap.from('.navbar-brand-text', {
      opacity: 0,
      y: -30,
      duration: 1.2,
      ease: 'power4.out'
    })
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-text">BRAIDLY</span>
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <span className="navbar-user">Welcome, {user.fullName}!</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
