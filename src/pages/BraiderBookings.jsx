import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabaseDB } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import '../../css/design-system.css'

export default function BraiderBookings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    loadBookings()
  }, [user])

  const loadBookings = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const data = await supabaseDB.getBookings(user.id, 'braider')
      
      setBookings(data.map(b => ({
        id: b.id,
        customer: {
          name: b.customer?.full_name || 'Customer',
          avatar: b.customer?.avatar_url || '/assets/images/braidly-logo.png',
          phone: b.customer?.phone || 'N/A',
          email: b.customer?.email || 'N/A'
        },
        service: b.service?.name || 'Service',
        date: b.booking_date,
        time: b.booking_time,
        duration: `${Math.floor(b.duration_minutes / 60)} hours`,
        price: b.total_amount || 0,
        status: b.status,
        location: b.address || 'Your Location',
        notes: b.notes || ''
      })))
      
    } catch (error) {
      console.error('Error loading bookings:', error)
      alert('Error loading bookings. Please check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filterStatus)

  const handleAcceptBooking = async (bookingId) => {
    try {
      setUpdating(true)
      await supabaseDB.updateBooking(bookingId, { status: 'confirmed' })
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'confirmed' } : b
      ))
      alert('✅ Booking accepted!')
      setSelectedBooking(null)
    } catch (error) {
      console.error('Error accepting booking:', error)
      alert('❌ Failed to accept booking. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeclineBooking = async (bookingId) => {
    const reason = prompt('Please provide a reason for declining:')
    if (reason) {
      try {
        setUpdating(true)
        await supabaseDB.updateBooking(bookingId, { 
          status: 'cancelled',
          cancellation_reason: reason
        })
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ))
        alert('✅ Booking declined. Customer has been notified.')
        setSelectedBooking(null)
      } catch (error) {
        console.error('Error declining booking:', error)
        alert('❌ Failed to decline booking. Please try again.')
      } finally {
        setUpdating(false)
      }
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        setUpdating(true)
        await supabaseDB.updateBooking(bookingId, { status: 'cancelled' })
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ))
        alert('✅ Booking cancelled. Customer has been notified.')
        setSelectedBooking(null)
      } catch (error) {
        console.error('Error cancelling booking:', error)
        alert('❌ Failed to cancel booking. Please try again.')
      } finally {
        setUpdating(false)
      }
    }
  }

  const handleRescheduleBooking = (bookingId) => {
    alert('Reschedule feature coming soon!')
  }

  const handleContactCustomer = (phone) => {
    if (phone && phone !== 'N/A') {
      window.location.href = `tel:${phone}`
    } else {
      alert('Phone number not available')
    }
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading bookings...</p>
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
              <h1>Bookings Management</h1>
              <p>Manage all your appointments</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/braider/dashboard')}>
              <i className="fas fa-arrow-left"></i>
              Back to Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-info">
                <h3>{bookings.filter(b => b.status === 'confirmed').length}</h3>
                <p>Confirmed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <h3>{bookings.filter(b => b.status === 'pending').length}</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{bookings.filter(b => b.status === 'completed').length}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="stat-info">
                <h3>${bookings.reduce((sum, b) => sum + b.price, 0)}</h3>
                <p>Total Value</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All ({bookings.length})
            </button>
            <button
              className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending ({bookings.filter(b => b.status === 'pending').length})
            </button>
            <button
              className={`filter-tab ${filterStatus === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('confirmed')}
            >
              Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
            </button>
            <button
              className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed ({bookings.filter(b => b.status === 'completed').length})
            </button>
          </div>

          {/* Bookings List */}
          <section className="dashboard-section">
            {filteredBookings.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-calendar-times"></i>
                <p>No bookings found</p>
              </div>
            ) : (
              <div className="bookings-list">
                {filteredBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-customer">
                      <img 
                        src={booking.customer.avatar} 
                        alt={booking.customer.name}
                        onError={(e) => e.target.src = '/assets/images/braidly-logo.png'}
                      />
                      <div>
                        <h4>{booking.customer.name}</h4>
                        <p>{booking.service}</p>
                      </div>
                    </div>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div className="booking-info">
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="booking-info">
                      <i className="fas fa-clock"></i>
                      <span>{booking.time}</span>
                    </div>
                    <div className="booking-info">
                      <i className="fas fa-hourglass-half"></i>
                      <span>{booking.duration}</span>
                    </div>
                    <div className="booking-info">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{booking.location}</span>
                    </div>
                    <div className="booking-info">
                      <i className="fas fa-dollar-sign"></i>
                      <span>${booking.price}</span>
                    </div>
                  </div>
                  <div className="booking-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <i className="fas fa-eye"></i>
                      View Details
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleContactCustomer(booking.customer.phone)}
                    >
                      <i className="fas fa-phone"></i>
                      Contact
                    </button>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAcceptBooking(booking.id)}
                          disabled={updating}
                        >
                          <i className="fas fa-check"></i>
                          Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeclineBooking(booking.id)}
                          disabled={updating}
                        >
                          <i className="fas fa-times"></i>
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleRescheduleBooking(booking.id)}
                          disabled={updating}
                        >
                          <i className="fas fa-calendar-alt"></i>
                          Reschedule
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={updating}
                        >
                          <i className="fas fa-times"></i>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}
          </section>
        </div>
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button className="modal-close" onClick={() => setSelectedBooking(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="booking-detail-section">
                <h3>Customer Information</h3>
                <div className="detail-row">
                  <img src={selectedBooking.customer.avatar} alt={selectedBooking.customer.name} className="detail-avatar" />
                  <div>
                    <p><strong>{selectedBooking.customer.name}</strong></p>
                    <p>{selectedBooking.customer.email}</p>
                    <p>{selectedBooking.customer.phone}</p>
                  </div>
                </div>
              </div>
              <div className="booking-detail-section">
                <h3>Service Details</h3>
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
                <div className="detail-row">
                  <span>Price:</span>
                  <span className="price">${selectedBooking.price}</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span className={`status-badge status-${selectedBooking.status}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
              {selectedBooking.notes && (
                <div className="booking-detail-section">
                  <h3>Customer Notes</h3>
                  <p>{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleContactCustomer(selectedBooking.customer.phone)}
              >
                <i className="fas fa-phone"></i>
                Contact Customer
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
