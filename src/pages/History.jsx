import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './Pages.css'

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')

  // Mock history data
  const mockHistory = [
    {
      id: 1,
      bookingId: 'BRD-12345679',
      braider: {
        id: 2,
        name: 'Stylist Keisha',
        image: '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_portrai.png'
      },
      service: 'Knotless Braids (Small)',
      date: '2026-02-20',
      time: '2:00 PM',
      price: 200,
      totalPaid: 210,
      review: {
        rating: 5,
        comment: 'Absolutely amazing! Best braids I\'ve ever had.'
      }
    },
    {
      id: 2,
      bookingId: 'BRD-12345680',
      braider: {
        id: 3,
        name: 'Braid\'s Beauty',
        image: '/assets/images/gpt-image-1.5-high-fidelity_a_Professional_headsho.png'
      },
      service: 'Cornrows',
      date: '2026-01-10',
      time: '11:00 AM',
      price: 80,
      totalPaid: 84,
      review: {
        rating: 5,
        comment: 'Amazing work! Very professional.'
      }
    },
    {
      id: 3,
      bookingId: 'BRD-12345677',
      braider: {
        id: 1,
        name: 'TashaBraids',
        image: '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_headsho.png'
      },
      service: 'Box Braids (Medium)',
      date: '2025-12-15',
      time: '10:00 AM',
      price: 120,
      totalPaid: 126,
      review: {
        rating: 4,
        comment: 'Great service, very satisfied!'
      }
    },
    {
      id: 4,
      bookingId: 'BRD-12345676',
      braider: {
        id: 4,
        name: 'Natural Beauty Braids',
        image: '/assets/images/b_Professional_photo_o.png'
      },
      service: 'Twists',
      date: '2025-11-20',
      time: '3:00 PM',
      price: 100,
      totalPaid: 105,
      review: null
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHistory(mockHistory)
      setLoading(false)
    }, 500)
  }, [])

  const years = ['all', ...new Set(history.map(h => new Date(h.date).getFullYear()))]

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.braider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = selectedYear === 'all' || 
                       new Date(item.date).getFullYear().toString() === selectedYear
    return matchesSearch && matchesYear
  })

  const totalSpent = history.reduce((sum, item) => sum + item.totalPaid, 0)
  const totalBookings = history.length

  const handleViewReceipt = (booking) => {
    // TODO: Generate and download receipt
    console.log('View receipt for:', booking.bookingId)
    alert(`Receipt for ${booking.bookingId} will be downloaded`)
  }

  const handleRebook = (booking) => {
    navigate(`/customer/book/${booking.braider.id}`)
  }

  const handleLeaveReview = (bookingId) => {
    // TODO: Open review modal
    console.log('Leave review for:', bookingId)
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading history...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar />
      
      <main className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>Booking History</h1>
            <p>{totalBookings} completed booking{totalBookings !== 1 ? 's' : ''}</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-info">
                <h3>{totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="stat-info">
                <h3>${totalSpent.toFixed(2)}</h3>
                <p>Total Spent</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-info">
                <h3>{history.filter(h => h.review).length}</h3>
                <p>Reviews Left</p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="history-filters">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by braider or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="year-select"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year === 'all' ? 'All Years' : year}
                </option>
              ))}
            </select>
          </div>

          {/* History List */}
          <div className="history-list">
            {filteredHistory.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-header">
                  <div className="history-braider">
                    <img src={item.braider.image} alt={item.braider.name} />
                    <div>
                      <h3>{item.braider.name}</h3>
                      <p className="booking-id">#{item.bookingId}</p>
                    </div>
                  </div>
                  <div className="history-date">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <div className="history-details">
                  <div className="history-detail">
                    <i className="fas fa-cut"></i>
                    <span>{item.service}</span>
                  </div>
                  <div className="history-detail">
                    <i className="fas fa-clock"></i>
                    <span>{item.time}</span>
                  </div>
                  <div className="history-detail">
                    <i className="fas fa-dollar-sign"></i>
                    <span>${item.totalPaid}</span>
                  </div>
                </div>

                {item.review && (
                  <div className="history-review">
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < item.review.rating ? 'filled' : ''}`}
                        ></i>
                      ))}
                    </div>
                    <p className="review-comment">{item.review.comment}</p>
                  </div>
                )}

                <div className="history-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewReceipt(item)}
                  >
                    <i className="fas fa-receipt"></i>
                    Receipt
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleRebook(item)}
                  >
                    <i className="fas fa-redo"></i>
                    Book Again
                  </button>
                  {!item.review && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleLeaveReview(item.id)}
                    >
                      <i className="fas fa-star"></i>
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="no-results">
              <i className="fas fa-history fa-3x"></i>
              <h3>No history found</h3>
              <p>
                {searchTerm || selectedYear !== 'all'
                  ? 'Try adjusting your filters'
                  : 'You haven\'t completed any bookings yet'}
              </p>
              {!searchTerm && selectedYear === 'all' && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/customer/browse')}
                >
                  Browse Braiders
                </button>
              )}
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
