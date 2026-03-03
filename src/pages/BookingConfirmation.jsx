import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './Pages.css'

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { bookingData, braider } = location.state || {}

  useEffect(() => {
    if (!bookingData || !braider) {
      navigate('/customer/dashboard')
    }
  }, [bookingData, braider, navigate])

  if (!bookingData || !braider) {
    return null
  }

  const bookingId = `BRD-${Date.now().toString().slice(-8)}`

  return (
    <div className="page">
      <Navbar />
      
      <main className="page-content">
        <div className="container">
          <div className="confirmation-container">
            <div className="confirmation-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            
            <h1>Booking Confirmed!</h1>
            <p className="confirmation-subtitle">
              Your appointment has been successfully booked. You'll receive a confirmation email shortly.
            </p>

            <div className="confirmation-card">
              <div className="confirmation-header">
                <h3>Booking Details</h3>
                <span className="booking-id">#{bookingId}</span>
              </div>

              <div className="confirmation-details">
                <div className="detail-row">
                  <div className="detail-label">Braider</div>
                  <div className="detail-value">
                    <img src={braider.image} alt={braider.name} className="detail-avatar" />
                    <span>{braider.name}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Service</div>
                  <div className="detail-value">{bookingData.serviceName}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Date</div>
                  <div className="detail-value">
                    {new Date(bookingData.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Time</div>
                  <div className="detail-value">{bookingData.time}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">{bookingData.duration}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Location</div>
                  <div className="detail-value">
                    {bookingData.location === 'braider' ? "Braider's Location" : bookingData.address}
                  </div>
                </div>

                {bookingData.notes && (
                  <div className="detail-row">
                    <div className="detail-label">Notes</div>
                    <div className="detail-value">{bookingData.notes}</div>
                  </div>
                )}

                <div className="detail-row total">
                  <div className="detail-label">Total Paid</div>
                  <div className="detail-value">${(bookingData.price * 1.05).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="confirmation-info">
              <div className="info-card">
                <i className="fas fa-shield-alt"></i>
                <h4>Payment Protected</h4>
                <p>Your payment is held securely in escrow and will be released to the braider after service completion.</p>
              </div>

              <div className="info-card">
                <i className="fas fa-bell"></i>
                <h4>Reminders Sent</h4>
                <p>You'll receive email and SMS reminders 24 hours and 1 hour before your appointment.</p>
              </div>

              <div className="info-card">
                <i className="fas fa-calendar-times"></i>
                <h4>Cancellation Policy</h4>
                <p>Free cancellation up to 24 hours before appointment. Cancel anytime from your bookings page.</p>
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/customer/bookings')}
              >
                View My Bookings
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigate('/customer/dashboard')}
              >
                Back to Dashboard
              </button>
            </div>

            <div className="confirmation-footer">
              <p>Need help? Contact our support team at support@braidly.com or use the chatbot below.</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
