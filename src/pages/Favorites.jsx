import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './Pages.css'

export default function Favorites() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent') // recent, rating, price

  // Mock favorites data
  const mockFavorites = [
    {
      id: 1,
      braiderId: 1,
      name: 'TashaBraids',
      rating: 4.9,
      reviews: 127,
      distance: '2.3 miles',
      price: 120,
      image: '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_headsho.png',
      verified: true,
      mobile: true,
      salon: false,
      addedDate: '2026-02-20'
    },
    {
      id: 2,
      braiderId: 2,
      name: 'Stylist Keisha',
      rating: 5.0,
      reviews: 89,
      distance: '1.8 miles',
      price: 150,
      image: '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_portrai.png',
      verified: true,
      mobile: true,
      salon: true,
      addedDate: '2026-02-15'
    },
    {
      id: 3,
      braiderId: 4,
      name: 'Natural Beauty Braids',
      rating: 4.8,
      reviews: 156,
      distance: '2.7 miles',
      price: 110,
      image: '/assets/images/b_Professional_photo_o.png',
      verified: true,
      mobile: true,
      salon: false,
      addedDate: '2026-02-10'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFavorites(mockFavorites)
      setLoading(false)
    }, 500)
  }, [])

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'price':
        return a.price - b.price
      case 'recent':
      default:
        return new Date(b.addedDate) - new Date(a.addedDate)
    }
  })

  const handleRemoveFavorite = (favoriteId) => {
    if (confirm('Remove this braider from your favorites?')) {
      setFavorites(favorites.filter(f => f.id !== favoriteId))
      // TODO: Implement with Supabase
    }
  }

  const handleViewProfile = (braiderId) => {
    navigate(`/customer/braider/${braiderId}`)
  }

  const handleBookNow = (braiderId) => {
    navigate(`/customer/book/${braiderId}`)
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading favorites...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar />
      
      <main className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>My Favorites</h1>
            <p>{favorites.length} favorite braider{favorites.length !== 1 ? 's' : ''}</p>
          </div>

          {favorites.length > 0 && (
            <div className="sort-section">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="recent">Recently Added</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>
          )}

          {/* Favorites Grid */}
          <div className="favorites-grid">
            {sortedFavorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card">
                <div className="favorite-image">
                  <img src={favorite.image} alt={favorite.name} />
                  {favorite.verified && (
                    <span className="badge-verified">
                      <i className="fas fa-check-circle"></i>
                    </span>
                  )}
                  <button
                    className="btn-remove-favorite"
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    title="Remove from favorites"
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
                
                <div className="favorite-info">
                  <h3>{favorite.name}</h3>
                  <div className="rating">
                    <i className="fas fa-star"></i>
                    <span>{favorite.rating} ({favorite.reviews} reviews)</span>
                  </div>
                  <p className="location">
                    <i className="fas fa-map-marker-alt"></i>
                    {favorite.distance}
                  </p>
                  
                  <div className="favorite-badges">
                    {favorite.mobile && (
                      <span className="badge badge-success">Mobile</span>
                    )}
                    {favorite.salon && (
                      <span className="badge badge-secondary">Salon</span>
                    )}
                  </div>

                  <div className="favorite-footer">
                    <span className="price">From ${favorite.price}</span>
                    <div className="favorite-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleViewProfile(favorite.braiderId)}
                      >
                        View Profile
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBookNow(favorite.braiderId)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {favorites.length === 0 && (
            <div className="no-results">
              <i className="fas fa-heart fa-3x"></i>
              <h3>No favorites yet</h3>
              <p>Start adding braiders to your favorites to see them here</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/customer/browse')}
              >
                Browse Braiders
              </button>
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
