import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { RealtimeIntegrationService } from '../services/realtimeIntegrationService'
import PageLayout from '../components/PageLayout'
import './BraiderProfileEnhanced.css'

export default function BraiderProfileEnhanced() {
  const { id: braiderId } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [braider, setBraider] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 1,
    serviceType: ''
  })
  const [availableSlots, setAvailableSlots] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  // Load braider profile
  useEffect(() => {
    loadBraiderProfile()
  }, [braiderId])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!braider) return

    const messageSubscription = RealtimeIntegrationService.subscribeToMessages(
      user?.id,
      (newMessage) => {
        if (newMessage.sender_id === braiderId) {
          setMessages(prev => [...prev, newMessage])
        }
      }
    )

    return () => {
      messageSubscription?.unsubscribe()
    }
  }, [braider, user?.id, braiderId])

  const loadBraiderProfile = async () => {
    try {
      setLoading(true)
      const fullProfile = await RealtimeIntegrationService.getBraiderFullProfile(braiderId)
      setBraider(fullProfile)
      setPortfolio(fullProfile.portfolio || [])
      
      // Load conversation history
      const history = await RealtimeIntegrationService.getConversationHistory(user?.id, braiderId)
      setMessages(history)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = async (e) => {
    const date = e.target.value
    setBookingData(prev => ({ ...prev, date }))

    // Load available time slots
    try {
      const slots = await RealtimeIntegrationService.getAvailableTimeSlots(braiderId, date)
      setAvailableSlots(slots)
    } catch (err) {
      console.error('Error loading slots:', err)
    }
  }

  const handleBooking = async () => {
    try {
      if (!bookingData.date || !bookingData.time || !bookingData.serviceType) {
        setError('Please fill all booking details')
        return
      }

      const appointmentDate = new Date(`${bookingData.date}T${bookingData.time}`)
      const amount = braider.paymentCredentials?.hourly_rate * bookingData.duration || 0

      const booking = await RealtimeIntegrationService.createRealtimeBooking({
        customerId: user?.id,
        braiderId,
        appointmentDate: appointmentDate.toISOString(),
        durationHours: bookingData.duration,
        serviceType: bookingData.serviceType,
        amount
      })

      // Proceed to payment
      setShowBookingModal(false)
      setShowPaymentModal(true)
    } catch (err) {
      setError(err.message)
    }
  }

  const handlePayment = async () => {
    try {
      const appointmentDate = new Date(`${bookingData.date}T${bookingData.time}`)
      const amount = braider.paymentCredentials?.hourly_rate * bookingData.duration || 0

      const { payment, escrow } = await RealtimeIntegrationService.processRealtimePayment({
        customerId: user?.id,
        braiderId,
        amount,
        currency: braider.paymentCredentials?.currency || 'USD',
        provider: paymentMethod,
        paymentMethod: 'card',
        metadata: {
          serviceType: bookingData.serviceType,
          duration: bookingData.duration
        }
      })

      // Subscribe to payment updates
      const subscription = RealtimeIntegrationService.subscribeToPaymentUpdates(
        payment.id,
        (updatedPayment) => {
          if (updatedPayment.status === 'completed') {
            setShowPaymentModal(false)
            setError('')
            alert('Payment successful! Your booking is confirmed.')
            loadBraiderProfile()
          }
        }
      )

      // Simulate payment processing
      setTimeout(() => {
        subscription?.unsubscribe()
      }, 5000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      await RealtimeIntegrationService.createRealtimeMessage({
        senderId: user?.id,
        recipientId: braiderId,
        content: newMessage
      })

      setNewMessage('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="loading-container">
          <p>Loading braider profile...</p>
        </div>
      </PageLayout>
    )
  }

  if (!braider) {
    return (
      <PageLayout>
        <div className="error-container">
          <h2>Braider Not Found</h2>
          <button onClick={() => navigate('/customer/browse')} className="btn-primary">
            Back to Browse
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="braider-profile-enhanced">
        {/* Header */}
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate('/customer/browse')}>
            ← Back
          </button>

          <div className="header-content">
            <div className="avatar-section">
              <div className="avatar">
                {braider.avatar_url ? (
                  <img src={braider.avatar_url} alt={braider.full_name} />
                ) : (
                  <div className="avatar-placeholder">
                    {braider.full_name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="info-section">
              <h1>{braider.full_name}</h1>
              <div className="stats">
                <div className="stat">
                  <span className="label">Rating</span>
                  <span className="value">★ {braider.stats?.averageRating || 0}</span>
                </div>
                <div className="stat">
                  <span className="label">Bookings</span>
                  <span className="value">{braider.stats?.totalBookings || 0}</span>
                </div>
                <div className="stat">
                  <span className="label">Rate</span>
                  <span className="value">${braider.paymentCredentials?.hourly_rate || 0}/hr</span>
                </div>
              </div>

              {braider.location && (
                <p className="location">📍 {braider.location}</p>
              )}

              {braider.bio && (
                <p className="bio">{braider.bio}</p>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={() => setShowBookingModal(true)}
              >
                📅 Book Now
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowMessageModal(true)}
              >
                💬 Message
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio ({portfolio.length})
          </button>
          <button
            className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {braider.style && (
                <div className="info-card">
                  <h3>Specialty</h3>
                  <p>💇 {braider.style}</p>
                </div>
              )}
              <div className="info-card">
                <h3>Availability</h3>
                <p>Available for bookings</p>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="portfolio-tab">
              {portfolio.length === 0 ? (
                <p className="empty-state">No portfolio images yet</p>
              ) : (
                <div className="portfolio-grid">
                  {portfolio.map(item => (
                    <div key={item.id} className="portfolio-item">
                      <img src={item.url} alt={item.name} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="messages-tab">
              <div className="messages-list">
                {messages.map(msg => (
                  <div key={msg.id} className={`message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}>
                    <p>{msg.content}</p>
                    <span className="timestamp">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Book Appointment</h2>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {availableSlots.length > 0 && (
                <div className="form-group">
                  <label>Time</label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                  >
                    <option value="">Select time</option>
                    {availableSlots.map(slot => (
                      <option key={slot.time} value={slot.time} disabled={!slot.available}>
                        {slot.time} {!slot.available && '(Booked)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Duration (hours)</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={bookingData.duration}
                  onChange={(e) => setBookingData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                />
              </div>

              <div className="form-group">
                <label>Service Type</label>
                <input
                  type="text"
                  value={bookingData.serviceType}
                  onChange={(e) => setBookingData(prev => ({ ...prev, serviceType: e.target.value }))}
                  placeholder="e.g., Box Braids, Knotless Braids"
                />
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowBookingModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleBooking} className="btn-primary">
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Payment Details</h2>
              <div className="payment-summary">
                <p>Amount: ${(braider.paymentCredentials?.hourly_rate * bookingData.duration).toFixed(2)}</p>
                <p>Duration: {bookingData.duration} hours</p>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="stripe">💳 Stripe</option>
                  <option value="paypal">🅿️ PayPal</option>
                  <option value="wise">💰 Wise</option>
                </select>
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowPaymentModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handlePayment} className="btn-primary">
                  Process Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </PageLayout>
  )
}
