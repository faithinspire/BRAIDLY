import { Link } from 'react-router-dom'
import './PublicNavbar.css'

export default function PublicNavbar() {
  return (
    <nav className="public-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">B</span>
          <span className="logo-text">BRAIDLY</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/signup" className="nav-btn signup-btn">Sign Up</Link>
        </div>
      </div>
    </nav>
  )
}
