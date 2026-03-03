import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabaseDB } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import '../../css/design-system.css'

export default function BraiderReviews() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filterRating, setFilterRating] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [loading, setLoading] = useState(true)
  
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
    responseRate: 0
  })

  useEffect(() => {
    loadReviews()
  }, [user])

  const loadReviews = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const data = await supabaseDB.getReviews(user.id)
      
      setReviews(data.map(r => ({
        id: r.id,
        customer: {
          name: r.customer?.full_name || 'Customer',
          avatar: r.customer?.avatar_url || '/assets/images/braidly-logo.png'
        },
        rating: r.rating,
        date: r.created_at,
        service: r.service_name || 'Service',
        comment: r.comment,
        response: r.response,
        helpful: r.helpful_count || 0
      })))
      
      // Calculate stats
      const totalReviews = data.length
      const avgRating = totalReviews > 0 
        ? data.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0
      
      const ratingCounts = {
        fiveStars: data.filter(r => r.rating === 5).length,
        fourStars: data.filter(r => r.rating === 4).length,
        threeStars: data.filter(r => r.rating === 3).length,
        twoStars: data.filter(r => r.rating === 2).length,
        oneStars: data.filter(r => r.rating === 1).length
      }
      
      const responsesCount = data.filter(r => r.response).length
      const responseRate = totalReviews > 0 ? (responsesCount / totalReviews) * 100 : 0
      
      setStats({
        averageRating: avgRating.toFixed(1),
        totalReviews,
        ...ratingCounts,
        responseRate: Math.round(responseRate)
      })
      
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = filterRating === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filterRating))

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date)
    } else if (sortBy === 'rating') {
      return b.rating - a.rating
    } else {
      return b.helpful - a.helpful
    }
  })

  const handleRespondToReview = (reviewId) => {
    const response = prompt('Enter your response:')
    if (response) {
      console.log('Responding to review:', reviewId, response)
      alert('Response posted successfully!')
    }
  }

  const handleReportReview = (reviewId) => {
    if (confirm('Are you sure you want to report this review?')) {
      console.log('Reporting review:', reviewId)
      alert('Review reported. Our team will review it shortly.')
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading reviews...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Reviews Management</h1>
              <p>View and respond to customer reviews</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/braider/dashboard')}>
              <i className="fas fa-arrow-left"></i>
              Back to Dashboard
            </button>
          </div>

          {/* Stats Overview */}
          <div className="reviews-stats">
            <div className="rating-summary">
              <div className="rating-score">
                <h2>{stats.averageRating}</h2>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <p>{stats.totalReviews} reviews</p>
              </div>
              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats[`${['one', 'two', 'three', 'four', 'five'][rating - 1]}Stars`]
                  const percentage = (count / stats.totalReviews) * 100
                  return (
                    <div key={rating} className="rating-bar">
                      <span className="rating-label">{rating} ★</span>
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="rating-count">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="response-stats">
              <div className="stat-item">
                <i className="fas fa-reply"></i>
                <div>
                  <h3>{stats.responseRate}%</h3>
                  <p>Response Rate</p>
                </div>
              </div>
              <div className="stat-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h3>2 hours</h3>
                  <p>Avg Response Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="reviews-filters">
            <div className="filter-group">
              <label>Filter by Rating:</label>
              <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Customer Reviews</h2>
              <p>{sortedReviews.length} reviews</p>
            </div>
            {sortedReviews.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-star"></i>
                <p>No reviews yet</p>
              </div>
            ) : (
              <div className="reviews-list">
                {sortedReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-customer">
                      <img 
                        src={review.customer.avatar} 
                        alt={review.customer.name}
                        onError={(e) => e.target.src = '/assets/images/braidly-logo.png'}
                      />
                      <div>
                        <h4>{review.customer.name}</h4>
                        <p className="review-service">{review.service}</p>
                      </div>
                    </div>
                    <div className="review-meta">
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                      <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="review-content">
                    <p>{review.comment}</p>
                  </div>
                  {review.response && (
                    <div className="review-response">
                      <div className="response-header">
                        <i className="fas fa-reply"></i>
                        <span>Your Response</span>
                      </div>
                      <p>{review.response}</p>
                    </div>
                  )}
                  <div className="review-footer">
                    <div className="review-helpful">
                      <i className="fas fa-thumbs-up"></i>
                      <span>{review.helpful} found this helpful</span>
                    </div>
                    <div className="review-actions">
                      {!review.response && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleRespondToReview(review.id)}
                        >
                          <i className="fas fa-reply"></i>
                          Respond
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleReportReview(review.id)}
                      >
                        <i className="fas fa-flag"></i>
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </section>

          {/* Tips */}
          <section className="dashboard-section">
            <div className="tips-card">
              <h3>
                <i className="fas fa-lightbulb"></i>
                Review Response Tips
              </h3>
              <ul className="tips-list">
                <li>
                  <i className="fas fa-check"></i>
                  Respond to all reviews, especially negative ones
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Thank customers for positive feedback
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Address concerns professionally
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Keep responses brief and friendly
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Respond within 24-48 hours
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
