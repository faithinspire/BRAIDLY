import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './Pages.css'

export default function BrowseBraiders() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [braiders, setBraiders] = useState([])
  const [filteredBraiders, setFilteredBraiders] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [filters, setFilters] = useState({
    location: '',
    style: searchParams.get('style') || '',
    minRating: 0,
    maxPrice: 500,
    availability: 'all',
    mobile: false,
    salon: false
  })

  // Mock data - replace with real Supabase data
  const mockBraiders = [
    {
      id: 1,
      name: 'TashaBraids',
      rating: 4.9,
      reviews: 127,
      distance: '2.3 miles',
      price: 120,
      image: '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_headsho.png',
      verified: true,
      mobile: true,
      salon: false,
      styles: ['box-braids', 'knotless', 'cornrows'],
      bio: 'Professional braider with 10+ years experience',
      availability: 'available'
    },
    {
      id: 2,
      name: 'Stylist Keisha',
      rating: 5.0,
      reviews: 89,
      distance: '1.8 miles',
      price: 150,
      image: '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_portrai.png',
      verified: true,
      mobile: true,
      salon: true,
      styles: ['knotless', 'twists', 'kids'],
      bio: 'Award-winning stylist specializing in knotless braids',
      availability: 'available'
    },
    {
      id: 3,
      name: "Braid's Beauty",
      rating: 4.7,
      reviews: 203,
      distance: '3.1 miles',
      price: 95,
      image: '/assets/images/gpt-image-1.5-high-fidelity_a_Professional_headsho.png',
      verified: true,
      mobile: false,
      salon: true,
      styles: ['box-braids', 'cornrows', 'twists'],
      bio: 'Full-service salon with multiple stylists',
      availability: 'available'
    },
    {
      id: 4,
      name: 'Natural Beauty Braids',
      rating: 4.8,
      reviews: 156,
      distance: '2.7 miles',
      price: 110,
      image: '/assets/images/b_Professional_photo_o.png',
      verified: true,
      mobile: true,
      salon: false,
      styles: ['knotless', 'kids', 'twists'],
      bio: 'Gentle braiding techniques for all hair types',
      availability: 'available'
    },
    {
      id: 5,
      name: 'Elite Braiding Studio',
      rating: 4.9,
      reviews: 178,
      distance: '4.2 miles',
      price: 180,
      image: '/assets/images/b_Professional_photo_o (1).png',
      verified: true,
      mobile: false,
      salon: true,
      styles: ['box-braids', 'knotless', 'cornrows', 'twists'],
      bio: 'Premium braiding services in luxury salon',
      availability: 'busy'
    },
    {
      id: 6,
      name: 'Quick Braids Express',
      rating: 4.6,
      reviews: 92,
      distance: '1.5 miles',
      price: 85,
      image: '/assets/images/b_Professional_photo_o (2).png',
      verified: true,
      mobile: true,
      salon: false,
      styles: ['cornrows', 'twists'],
      bio: 'Fast and affordable braiding services',
      availability: 'available'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBraiders(mockBraiders)
      setFilteredBraiders(mockBraiders)
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, braiders])

  const applyFilters = () => {
    let filtered = [...braiders]

    // Filter by style
    if (filters.style) {
      filtered = filtered.filter(b => b.styles.includes(filters.style))
    }

    // Filter by rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(b => b.rating >= filters.minRating)
    }

    // Filter by price
    filtered = filtered.filter(b => b.price <= filters.maxPrice)

    // Filter by mobile/salon
    if (filters.mobile) {
      filtered = filtered.filter(b => b.mobile)
    }
    if (filters.salon) {
      filtered = filtered.filter(b => b.salon)
    }

    setFilteredBraiders(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleViewProfile = (braiderId) => {
    navigate(`/customer/braider/${braiderId}`)
  }

  const handleBookNow = (braiderId) => {
    navigate(`/customer/book/${braiderId}`)
  }

  const toggleFavorite = (braiderId) => {
    // TODO: Implement favorite toggle with Supabase
    console.log('Toggle favorite:', braiderId)
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Finding braiders near you...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar />
      
      <main className="page-content">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <h1>Browse Braiders</h1>
            <p>{filteredBraiders.length} braiders found</p>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filters-row">
              <div className="filter-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Style</label>
                <select
                  value={filters.style}
                  onChange={(e) => handleFilterChange('style', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Styles</option>
                  <option value="box-braids">Box Braids</option>
                  <option value="knotless">Knotless</option>
                  <option value="cornrows">Cornrows</option>
                  <option value="twists">Twists</option>
                  <option value="kids">Kids Braids</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                  className="filter-select"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.8">4.8+ Stars</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Max Price: ${filters.maxPrice}</label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                  className="filter-range"
                />
              </div>
            </div>

            <div className="filters-row">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.mobile}
                  onChange={(e) => handleFilterChange('mobile', e.target.checked)}
                />
                <span>Mobile Service</span>
              </label>

              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.salon}
                  onChange={(e) => handleFilterChange('salon', e.target.checked)}
                />
                <span>Salon Location</span>
              </label>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={`braiders-${viewMode}`}>
            {filteredBraiders.map((braider) => (
              <div key={braider.id} className="braider-card">
                <div className="braider-image">
                  <img src={braider.image} alt={braider.name} />
                  {braider.verified && (
                    <span className="badge-verified">
                      <i className="fas fa-check-circle"></i>
                    </span>
                  )}
                  <button
                    className="btn-favorite"
                    onClick={() => toggleFavorite(braider.id)}
                  >
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="braider-info">
                  <h3>{braider.name}</h3>
                  <div className="rating">
                    <i className="fas fa-star"></i>
                    <span>{braider.rating} ({braider.reviews} reviews)</span>
                  </div>
                  <p className="bio">{braider.bio}</p>
                  <p className="location">
                    <i className="fas fa-map-marker-alt"></i>
                    {braider.distance}
                  </p>
                  <div className="braider-badges">
                    {braider.mobile && (
                      <span className="badge badge-success">Mobile</span>
                    )}
                    {braider.salon && (
                      <span className="badge badge-secondary">Salon</span>
                    )}
                  </div>
                  <div className="braider-footer">
                    <span className="price">From ${braider.price}</span>
                    <div className="braider-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleViewProfile(braider.id)}
                      >
                        View Profile
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBookNow(braider.id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBraiders.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search fa-3x"></i>
              <h3>No braiders found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
