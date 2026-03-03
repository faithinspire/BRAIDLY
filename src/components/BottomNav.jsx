import { Link, useLocation } from 'react-router-dom'
import './BottomNav.css'

export default function BottomNav() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '?')

  return (
    <nav className="bottom-nav">
      <Link 
        to="/customer/dashboard" 
        className={`bottom-nav-item ${isActive('/customer/dashboard') ? 'active' : ''}`}
      >
        <i className="fas fa-home"></i>
        <span>Home</span>
      </Link>

      <Link 
        to="/customer/bookings" 
        className={`bottom-nav-item ${isActive('/customer/bookings') ? 'active' : ''}`}
      >
        <i className="fas fa-calendar"></i>
        <span>Bookings</span>
      </Link>

      <Link 
        to="/customer/browse" 
        className={`bottom-nav-item ${isActive('/customer/browse') ? 'active' : ''}`}
      >
        <i className="fas fa-search"></i>
        <span>Browse</span>
      </Link>

      <Link 
        to="/customer/favorites" 
        className={`bottom-nav-item ${isActive('/customer/favorites') ? 'active' : ''}`}
      >
        <i className="fas fa-heart"></i>
        <span>Favorites</span>
      </Link>

      <Link 
        to="/customer/profile" 
        className={`bottom-nav-item ${isActive('/customer/profile') ? 'active' : ''}`}
      >
        <i className="fas fa-user"></i>
        <span>Profile</span>
      </Link>
    </nav>
  )
}
