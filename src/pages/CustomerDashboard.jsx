import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ThemeToggle from '../components/ThemeToggle'
import ChatbotFooter from '../components/ChatbotFooter'
import './DashboardStyles.css'

export default function CustomerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedHairStyle, setSelectedHairStyle] = useState(null)
  const [braiders, setBraiders] = useState([])
  const [hairStyles, setHairStyles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadHairStyles()
    loadBraiders()
  }, [user, navigate])

  const loadHairStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('hair_styles')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) {
        console.error('Error loading hair styles:', error)
        setHairStyles([])
      } else {
        setHairStyles(data || [])
      }
    } catch (error) {
      console.error('Error loading hair styles:', error)
      setHairStyles([])
    }
  }

  const loadBraiders = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('braider_profiles')
        .select('*')
        .eq('is_active', true)

      if (searchLocation) {
        query = query.or(`city.ilike.%${searchLocation}%,state.ilike.%${searchLocation}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading braiders:', error)
        setBraiders([])
      } else {
        setBraiders(data || [])
      }
    } catch (error) {
      console.error('Error loading braiders:', error)
      setBraiders([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadBraiders()
  }

  const handleHairStyleClick = (hairStyle) => {
    setSelectedHairStyle(hairStyle)
    // Filter braiders who offer this style
    // TODO: Implement braider filtering by hair style specialties
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <h1>Find Your Perfect Braider</h1>
            <p>Discover talented braiders in your area and book your style</p>
          </div>
        </section>

        {/* Hair Styles Gallery */}
        <section className="dashboard-content">
          <div className="container">
            <h2 style={{ marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 800 }}>
              Browse Hair Styles
            </h2>
            {hairStyles.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
              }}>
                {hairStyles.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => handleHairStyleClick(style)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      transform: selectedHairStyle?.id === style.id ? 'scale(1.05)' : 'scale(1)',
                      border: selectedHairStyle?.id === style.id ? '3px solid #7e22ce' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)'
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = selectedHairStyle?.id === style.id ? 'scale(1.05)' : 'scale(1)'
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '200px',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)'
                    }}>
                      <img
                        src={style.image_url}
                        alt={style.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 700 }}>
                        {style.name}
                      </h3>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                        {style.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                        <span style={{ color: '#7e22ce', fontWeight: 600 }}>
                          ${style.price_range_min} - ${style.price_range_max}
                        </span>
                        <span style={{ color: '#9ca3af' }}>
                          {style.estimated_time_minutes} min
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Loading hair styles...</p>
              </div>
            )}
          </div>
        </section>

        {/* Search Section */}
        <section className="dashboard-search">
          <div className="container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-grid">
                <div className="search-field">
                  <label htmlFor="location">Location</label>
                  <div className="input-wrapper">
                    <i className="fas fa-map-marker-alt"></i>
                    <input
                      type="text"
                      id="location"
                      placeholder="Enter city or zip code"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>

                <button type="submit" className="search-btn">
                  <i className="fas fa-search"></i>
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Braiders Grid */}
        <section className="dashboard-content">
          <div className="container">
            <h2 style={{ marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 800 }}>
              {selectedHairStyle ? `Braiders offering ${selectedHairStyle.name}` : 'Available Braiders'}
            </h2>
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading braiders...</p>
              </div>
            ) : braiders.length > 0 ? (
              <div className="braiders-grid">
                {braiders.map((braider) => (
                  <div key={braider.id} className="braider-card">
                    <div className="braider-image">
                      <img
                        src={braider.avatar_url || '/assets/images/braidly-logo.png'}
                        alt={braider.business_name}
                      />
                      <div className="braider-rating">
                        <i className="fas fa-star"></i>
                        <span>{braider.rating || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="braider-info">
                      <h3>{braider.business_name}</h3>
                      <p className="braider-location">
                        <i className="fas fa-map-marker-alt"></i>
                        {braider.city}, {braider.state}
                      </p>
                      <p className="braider-bio">{braider.bio}</p>
                      <div className="braider-footer">
                        <span className="price">${braider.base_price}</span>
                        <button className="book-btn">Book Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-search"></i>
                <h3>No braiders found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
