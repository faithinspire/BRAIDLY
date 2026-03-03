import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import AnimatedBackground from '../components/AnimatedBackground'
import { heroTitleVariants, heroSubtitleVariants, heroButtonVariants } from '../animations/framerMotionAnimations'
import './Landing.css'

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (user) {
      const dashboardUrl = user.role === 'admin' 
        ? '/admin/dashboard'
        : user.role === 'braider'
        ? '/braider/dashboard'
        : '/customer/dashboard'
      
      navigate(dashboardUrl, { replace: true })
    }
  }, [user, navigate])

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <AnimatedBackground opacity={0.2} speed={5000} />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <motion.h1 
            variants={heroTitleVariants}
            initial="initial"
            animate="animate"
            className="landing-hero-title"
          >
            Find Your Perfect Braider
          </motion.h1>
          
          <motion.p 
            variants={heroSubtitleVariants}
            initial="initial"
            animate="animate"
            className="landing-hero-subtitle"
          >
            Connect with verified, professional braiders in your area. 
            Book appointments, secure payments, and get the style you deserve.
          </motion.p>
          
          <motion.div 
            variants={heroButtonVariants}
            initial="initial"
            animate="animate"
            className="landing-hero-buttons"
          >
            {user ? (
              <Link to={`/${user.role}/dashboard`} className="landing-btn landing-btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="landing-btn landing-btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="landing-btn landing-btn-secondary">
                  Login
                </Link>
              </>
            )}
          </motion.div>

          <div className="landing-trust-badges">
            <div className="landing-trust-badge">
              <i className="fas fa-shield-alt"></i>
              <span>Secure Payments</span>
            </div>
            <div className="landing-trust-badge">
              <i className="fas fa-user-check"></i>
              <span>Verified Professionals</span>
            </div>
            <div className="landing-trust-badge">
              <i className="fas fa-star"></i>
              <span>Top Rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Search & Discover</h3>
            <p>Find verified braiders near you with ratings, portfolios, and real-time availability</p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>Book & Pay Securely</h3>
            <p>Choose your style, select a time slot, and pay with escrow protection</p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <i className="fas fa-crown"></i>
            </div>
            <h3>Get Your Style</h3>
            <p>Enjoy professional service with payment released only after completion</p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h3>Escrow Protection</h3>
            <p>Funds held securely until service completion for your peace of mind</p>
          </div>
        </div>
      </section>

      {/* WhatsApp Chat Button */}
      <div className="whatsapp-chat">
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          <i className="fab fa-whatsapp"></i>
          <span>Chat with Admin</span>
        </a>
      </div>

      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
