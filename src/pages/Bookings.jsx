import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './Pages.css'

export default function Bookings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, completed, cancelled
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Mock bookings data
  const mockBookings = [
    {
      id: 1,
      bookingId: 'BRD-12345678',
      braider: {
        name: 'TashaBraids',
        image: '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_headsho.png',
        phone: '(555) 123-4567'
      },
      service: 'Box Braids (Medium)',
      date: '2026-03-15',
      time: '10:00 AM',
      duration: '3-4 hours',
      price: 120,
      status: 'upcoming',
      location: 'Braider\'s Location',
      notes: 'Please use synthetic hair'
    },
    {
      id: 2,
      bookingId: 'BRD-12345679',
      braider: {
        name: 'Stylist Keisha',
        image: '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_portrai.png',
        phone: '(555) 234-5678'
      },
      service: 'Knotless Braids (Small)',
      date: '2026-02-20',
      time: '2:00 PM',
      duration: '5-6 hours',
      price: 200,
      status: 'completed',
      location: 'Mobile Service',
      notes: '',
      review: null
    },
    {
      id: 3,
      bookingId: 'BRD-12345680',
      braider: {
        name: 'Braid\'s Beauty',
        image: '/assets/images/gpt-image-1.5-high-fidelity_a_Professional_headsho.png',
        phone: '(555) 345-6789'
      },
      service: 'Cornrows',
      date: '2026-01-10',
      time: '11:00 AM',
      duration: '2-3 hours',
      price: 80,
      status: 'completed',
      location: 'Salon',
      notes: '',
      review: {
        rating: 5,
        comment: 'Amazing work! Very professional.'
      }
    },
    {
      id: 4,
      bookingId: 'BRD-12345681',
      braider: {
        name: 'Natural Beauty Braids',
        image: '/assets/images/b_Professional_photo_o.png',
        phone: '(555) 456-7890'
      },
      service: 'Kids Braids',
      date: '2026-02-05',
      time: '3:00 PM',
      duration: '1-2 hours',
      price: 60,
      status: 'cancelled',
      location: 'Mobile Service',
      notes: 'Cancelled due to schedule conflict'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 500)
  }, [])

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'status-upcoming'
      case 'completed': return 'status-completed'
      case 'cancelled': return 'status-cancelled'
      default: return ''
    }
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleCancelBooking = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      // TODO: Implement cancellation with Supabase
      console.log('Cancel booking:', bookingId)
      setShowModal(false)
    }
  }

  const handleReschedule = (bookingId) => {
    // TODO: Implement reschedule
    console.log('Reschedule booking:', bookingId)
    navigate(`/customer/book/${selectedBooking.braider.id}`)
  }

  const handleLeaveReview = (bookingId) => {
    // TODO: Implement review modal
    console.log('Leave review for:', bookingId)
  }

  const handleRebook = (booking) => {
    navigate(`/customer/book/${booking.braider.id}`)
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar />
      
      <main className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>My Bookings</h1>
            <p>{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({bookings.length})
            </button>
            <button
              className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({bookings.filter(b => b.status === 'upcoming').length})
            </button>
            <button
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({bookings.filter(b => b.status === 'completed').length})
            </button>
            <button
              className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>

          {/* Bookings List */}
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-braider">
                    <img src={booking.braider.image} alt={booking.braider.name} />
                    <div>
                      <h3>{booking.braider.name}</h3>
                      <p className="booking-id">#{booking.bookingId}</p>
                    </div>
                  </div>
                  <span className={`booking-status ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="booking-detail">
                    <i className="fas fa-cut"></i>
                    <span>{booking.service}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-calendar"></i>
                    <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-clock"></i>
                    <span>{booking.time} ({booking.duration})</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{booking.location}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-dollar-sign"></i>
                    <span>${booking.price}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View Details
                  </button>
                  
                  {booking.status === 'upcoming' && (
                    <>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleReschedule(booking.id)}
                      >
                        Reschedule
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'completed' && !booking.review && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleLeaveReview(booking.id)}
                    >
                      Leave Review
                    </button>
                  )}
                  
                  {booking.status === 'completed' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleRebook(booking)}
                    >
                      Book Again
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="no-results">
              <i className="fas fa-calendar-times fa-3x"></i>
              <h3>No bookings found</h3>
              <p>You don't have any {filter !== 'all' ? filter : ''} bookings</p>
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

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Braider Information</h4>
                <div className="detail-row">
                  <span>Name:</span>
                  <span>{selectedBooking.braider.name}</span>
                </div>
                <div className="detail-row">
                  <span>Phone:</span>
                  <span>{selectedBooking.braider.phone}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Appointment Details</h4>
                <div className="detail-row">
                  <span>Service:</span>
                  <span>{selectedBooking.service}</span>
                </div>
                <div className="detail-row">
                  <span>Date:</span>
                  <span>{new Date(selectedBooking.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>Time:</span>
                  <span>{selectedBooking.time}</span>
                </div>
                <div className="detail-row">
                  <span>Duration:</span>
                  <span>{selectedBooking.duration}</span>
                </div>
                <div className="detail-row">
                  <span>Location:</span>
                  <span>{selectedBooking.location}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Payment</h4>
                <div className="detail-row">
                  <span>Service Price:</span>
                  <span>${selectedBooking.price}</span>
                </div>
                <div className="detail-row">
                  <span>Service Fee:</span>
                  <span>${(selectedBooking.price * 0.05).toFixed(2)}</span>
                </div>
                <div className="detail-row total">
                  <strong>Total Paid:</strong>
                  <strong>${(selectedBooking.price * 1.05).toFixed(2)}</strong>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="detail-section">
                  <h4>Notes</h4>
                  <p>{selectedBooking.notes}</p>
                </div>
              )}

              {selectedBooking.review && (
                <div className="detail-section">
                  <h4>Your Review</h4>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${i < selectedBooking.review.rating ? 'filled' : ''}`}
                      ></i>
                    ))}
                  </div>
                  <p>{selectedBooking.review.comment}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
