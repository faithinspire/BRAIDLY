import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './GlobalFooter.css'

export default function GlobalFooter() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  // Hide footer on landing, login, signup pages
  const hiddenRoutes = ['/', '/login', '/signup', '/demo']
  if (hiddenRoutes.includes(location.pathname)) {
    return null
  }

  // Determine user role for footer content
  const isCustomer = profile?.role === 'customer'
  const isBraider = profile?.role === 'braider'
  const isAdmin = profile?.role === 'admin'

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <footer className="global-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <img src="/assets/images/braidly-logo.svg" alt="BRAIDLY" />
            </div>
            <p className="footer-tagline">Professional Braiding Services Platform</p>
            <div className="footer-social">
              <a href="#" className="social-link" title="Facebook">f</a>
              <a href="#" className="social-link" title="Twitter">𝕏</a>
              <a href="#" className="social-link" title="Instagram">📷</a>
              <a href="#" className="social-link" title="LinkedIn">in</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={() => handleNavigation('/profile')}>My Profile</a></li>
              <li><a href="#" onClick={() => handleNavigation('/customer/browse')}>Browse Services</a></li>
              <li><a href="#" onClick={() => handleNavigation('/customer/booking')}>My Bookings</a></li>
              <li><a href="#" onClick={() => handleNavigation('/customer/chat')}>Messages</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@braidly.com">Contact Support</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Report Issue</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Compliance</a></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="footer-section">
            <h4 className="footer-title">Payment Methods</h4>
            <div className="payment-methods">
              <span className="payment-badge">💳 Stripe</span>
              <span className="payment-badge">🅿️ PayPal</span>
              <span className="payment-badge">💰 Wise</span>
              <span className="payment-badge">🏦 Bank</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; 2026 BRAIDLY. All rights reserved.</p>
            <p className="footer-version">v2.0 | International Edition</p>
          </div>
          <div className="footer-bottom-right">
            <span className="footer-status">🟢 All Systems Operational</span>
            <span className="footer-security">🔒 SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
