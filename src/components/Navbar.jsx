import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './Navbar.css'
import '../../css/navbar-bold.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="container navbar-content">
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
