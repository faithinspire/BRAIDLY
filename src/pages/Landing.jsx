import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ThemeToggle'
import AIChatbot from '../components/AIChatbot'
import WhatsAppChat from '../components/WhatsAppChat'
import './Landing.css'

export default function Landing() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Local images from assets
  const backgroundImages = [
    '/assets/images/b_Professional_photo_o.png',
    '/assets/images/b_Professional_photo_o (1).png',
    '/assets/images/b_Professional_photo_o (2).png',
    '/assets/images/b_Professional_photo_o (3).png',
    '/assets/images/gpt-image-1.5-high-fidelity_a_Braider_Working_Imag.png',
    '/assets/images/gpt-image-1.5-high-fidelity_a_Professional_headsho.png',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="animated-bg-container">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`bg-slide ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="bg-overlay" />
      </div>

      {/* Theme Toggle */}
      <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="landing-hero">
        <div className="hero-content">
          <div className="logo-section">
            <img src="/assets/images/braidly-logo.svg" alt="BRAIDLY" className="logo" />
          </div>
          
          <h1 className="hero-title">Connect with Professional Braiders</h1>
          <p className="hero-subtitle">
            Book appointments, view portfolios, and get the perfect braids
          </p>
          
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="landing-features">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Find Braiders</h3>
            <p>Browse professional braiders with ratings and portfolios</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Booking</h3>
            <p>Schedule appointments at your convenience</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Secure Payments</h3>
            <p>Safe payment processing with escrow protection</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Ratings & Reviews</h3>
            <p>Read reviews from other customers</p>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />

      {/* WhatsApp Chat */}
      <WhatsAppChat />

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2026 BRAIDLY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
