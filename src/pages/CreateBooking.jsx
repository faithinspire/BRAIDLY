import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './Pages.css'

export default function CreateBooking() {
  const { braiderId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1) // 1: Service, 2: Date/Time, 3: Details, 4: Payment
  const [braider, setBraider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    serviceName: '',
    price: 0,
    duration: '',
    date: '',
    time: '',
    location: 'braider', // braider or customer
    address: '',
    notes: '',
    paymentMethod: 'card'
  })

  // Mock braider data
  const mockBraider = {
    id: 1,
    name: 'TashaBraids',
    image: '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_headsho.png',
    mobile: true,
    salon: true,
    services: [
      { id: 1, name: 'Box Braids (Small)', price: 150, duration: '4-5 hours' },
      { id: 2, name: 'Box Braids (Medium)', price: 120, duration: '3-4 hours' },
      { id: 3, name: 'Box Braids (Large)', price: 100, duration: '2-3 hours' },
      { id: 4, name: 'Knotless Braids (Small)', price: 200, duration: '5-6 hours' },
      { id: 5, name: 'Knotless Braids (Medium)', price: 170, duration: '4-5 hours' },
      { id: 6, name: 'Cornrows', price: 80, duration: '2-3 hours' },
      { id: 7, name: 'Kids Braids', price: 60, duration: '1-2 hours' }
    ],
    availability: {
      '2026-03-01': ['9:00 AM', '12:00 PM', '3:00 PM'],
      '2026-03-02': ['10:00 AM', '1:00 PM', '4:00 PM'],
      '2026-03-03': ['9:00 AM', '12:00 PM', '3:00 PM']
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBraider(mockBraider)
      setLoading(false)
    }, 500)
  }, [braiderId])

  const handleServiceSelect = (service) => {
    setBookingData({
      ...bookingData,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      duration: service.duration
    })
    setStep(2)
  }

  const handleDateTimeSelect = (date, time) => {
    setBookingData({
      ...bookingData,
      date,
      time
    })
    setStep(3)
  }

  const handleDetailsSubmit = (e) => {
    e.preventDefault()
    setStep(4)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    
    // TODO: Process payment with Stripe
    // TODO: Create booking in Supabase
    
    // Simulate API call
    setTimeout(() => {
      navigate('/customer/booking/confirm', {
        state: { bookingData, braider }
      })
    }, 1000)
  }

  const calculateTotal = () => {
    const subtotal = bookingData.price
    const serviceFee = subtotal * 0.05 // 5% service fee
    const total = subtotal + serviceFee
    return { subtotal, serviceFee, total }
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading booking...</p>
      </div>
    )
  }

  const { subtotal, serviceFee, total } = calculateTotal()

  return (
    <div className="page">
      <Navbar />
      
      <main className="page-content">
        <div className="container">
          <div className="booking-container">
            {/* Progress Steps */}
            <div className="booking-steps">
              <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Service</span>
              </div>
              <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Date & Time</span>
              </div>
              <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                <span className="step-number">3</span>
                <span className="step-label">Details</span>
              </div>
              <div className={`step ${step >= 4 ? 'active' : ''}`}>
                <span className="step-number">4</span>
                <span className="step-label">Payment</span>
              </div>
            </div>

            <div className="booking-content">
              {/* Braider Info Sidebar */}
              <div className="booking-sidebar">
                <div className="braider-summary">
                  <img src={braider.image} alt={braider.name} />
                  <h3>{braider.name}</h3>
                  {bookingData.serviceName && (
                    <>
                      <div className="booking-detail">
                        <strong>Service:</strong>
                        <span>{bookingData.serviceName}</span>
                      </div>
                      <div className="booking-detail">
                        <strong>Duration:</strong>
                        <span>{bookingData.duration}</span>
                      </div>
                      {bookingData.date && (
                        <div className="booking-detail">
                          <strong>Date:</strong>
                          <span>{bookingData.date}</span>
                        </div>
                      )}
                      {bookingData.time && (
                        <div className="booking-detail">
                          <strong>Time:</strong>
                          <span>{bookingData.time}</span>
                        </div>
                      )}
                      <div className="booking-price-summary">
                        <div className="price-row">
                          <span>Subtotal:</span>
                          <span>${subtotal}</span>
                        </div>
                        <div className="price-row">
                          <span>Service Fee:</span>
                          <span>${serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="price-row total">
                          <strong>Total:</strong>
                          <strong>${total.toFixed(2)}</strong>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="booking-main">
                {step === 1 && (
                  <div className="step-content">
                    <h2>Select a Service</h2>
                    <div className="services-list">
                      {braider.services.map((service) => (
                        <div
                          key={service.id}
                          className="service-card"
                          onClick={() => handleServiceSelect(service)}
                        >
                          <div className="service-info">
                            <h4>{service.name}</h4>
                            <p><i className="fas fa-clock"></i> {service.duration}</p>
                          </div>
                          <div className="service-price">
                            ${service.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-content">
                    <h2>Select Date & Time</h2>
                    <div className="datetime-picker">
                      {Object.entries(braider.availability).map(([date, times]) => (
                        <div key={date} className="date-section">
                          <h4>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                          <div className="time-slots">
                            {times.map((time, idx) => (
                              <button
                                key={idx}
                                className={`time-slot ${bookingData.date === date && bookingData.time === time ? 'selected' : ''}`}
                                onClick={() => handleDateTimeSelect(date, time)}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="step-content">
                    <h2>Booking Details</h2>
                    <form onSubmit={handleDetailsSubmit}>
                      <div className="form-group">
                        <label>Location</label>
                        <div className="radio-group">
                          {braider.salon && (
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="location"
                                value="braider"
                                checked={bookingData.location === 'braider'}
                                onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                              />
                              <span>Braider's Location</span>
                            </label>
                          )}
                          {braider.mobile && (
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="location"
                                value="customer"
                                checked={bookingData.location === 'customer'}
                                onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                              />
                              <span>My Location (Mobile Service)</span>
                            </label>
                          )}
                        </div>
                      </div>

                      {bookingData.location === 'customer' && (
                        <div className="form-group">
                          <label>Your Address</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your address"
                            value={bookingData.address}
                            onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                            required
                          />
                        </div>
                      )}

                      <div className="form-group">
                        <label>Special Notes (Optional)</label>
                        <textarea
                          className="form-textarea"
                          placeholder="Any special requests or notes for the braider..."
                          value={bookingData.notes}
                          onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                          rows="4"
                        ></textarea>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setStep(2)}
                        >
                          Back
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Continue to Payment
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {step === 4 && (
                  <div className="step-content">
                    <h2>Payment</h2>
                    <form onSubmit={handlePaymentSubmit}>
                      <div className="payment-info">
                        <i className="fas fa-shield-alt"></i>
                        <p>Your payment is protected by escrow. Funds will be held securely and released to the braider only after service completion.</p>
                      </div>

                      <div className="form-group">
                        <label>Payment Method</label>
                        <div className="radio-group">
                          <label className="radio-label">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="card"
                              checked={bookingData.paymentMethod === 'card'}
                              onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                            />
                            <span><i className="fas fa-credit-card"></i> Credit/Debit Card</span>
                          </label>
                          <label className="radio-label">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="apple"
                              checked={bookingData.paymentMethod === 'apple'}
                              onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                            />
                            <span><i className="fab fa-apple-pay"></i> Apple Pay</span>
                          </label>
                          <label className="radio-label">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="google"
                              checked={bookingData.paymentMethod === 'google'}
                              onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                            />
                            <span><i className="fab fa-google-pay"></i> Google Pay</span>
                          </label>
                        </div>
                      </div>

                      {bookingData.paymentMethod === 'card' && (
                        <>
                          <div className="form-group">
                            <label>Card Number</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Expiry Date</label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="MM/YY"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>CVV</label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="123"
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setStep(3)}
                        >
                          Back
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Confirm & Pay ${total.toFixed(2)}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
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
