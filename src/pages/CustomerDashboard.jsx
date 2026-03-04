import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
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
  const [braiders, setBraiders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadBraiders()
  }, [user, navigate])

  const loadBraiders = async () => {
    setLoading(true)
    try {
      // TODO: Fetch braiders from Supabase
      setBraiders([])
    } catch (error) {
      console.error('Error loading braiders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // TODO: Implement search functionality
    loadBraiders()
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <h1>Find Your Perfect Braider</h1>
            <p>Discover talented braiders in your area</p>
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

                <div className="search-field">
                  <label htmlFor="service">Service Type</label>
                  <div className="input-wrapper">
                    <i className="fas fa-scissors"></i>
                    <select
                      id="service"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="search-select"
                    >
                      <option value="all">All Services</option>
                      <option value="box-braids">Box Braids</option>
                      <option value="knotless">Knotless Braids</option>
                      <option value="cornrows">Cornrows</option>
                      <option value="twists">Twists</option>
                      <option value="kids">Kids Braids</option>
                    </select>
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
