import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/supabaseClient'
import { validateCardDetails, formatCardNumber, formatExpiryDate, getCardType, maskCardNumber } from '../services/stripeService'
import PageLayout from '../components/PageLayout'
import './PaymentPage.css'

export default function PaymentPage() {
  const { user, profile } = useAuth()
  const [payments, setPayments] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardErrors, setCardErrors] = useState({})
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  useEffect(() => {
    loadData()
  }, [user, profile])

  const loadData = async () => {
    try {
      setLoading(true)
      const { payments: paymentData, error: paymentError } = await dbService.getPayments(
        user?.id,
        profile?.role
      )
      if (paymentError) throw new Error(paymentError)
      setPayments(paymentData)

      if (profile?.role === 'customer') {
        const { bookings: bookingData, error: bookingError } = await dbService.getBookings(
          user?.id,
          'customer'
        )
        if (bookingError) throw new Error(bookingError)
        setBookings(bookingData.filter(b => b.status === 'confirmed'))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    
    if (!selectedBooking) {
      setError('Please select a booking')
      return
    }

    // Validate card details
    const validation = validateCardDetails(
      formData.cardNumber,
      formData.expiryDate,
      formData.cvv
    )

    if (!validation.isValid) {
      setCardErrors({ general: validation.errors.join(', ') })
      setError('Please fix card validation errors')
      return
    }

    setCardErrors({})
    setError('')
    setSuccess('')
    setIsProcessing(true)

    try {
      // In production, you would:
      // 1. Create a payment intent on your backend
      // 2. Use Stripe.js to tokenize the card (never send raw card data)
      // 3. Confirm the payment with the token
      // 4. Update your database with the payment status

      // For now, we'll create a payment record and mark it as pending
      // The actual Stripe integration should happen on your backend
      
      const { payment, error: paymentError } = await dbService.createPayment(
        selectedBooking.id,
        user?.id,
        selectedBooking.braider_id,
        selectedBooking.amount
      )
      
      if (paymentError) throw new Error(paymentError)

      // In production, call your backend to process with Stripe
      // const stripeResult = await createPaymentIntent(selectedBooking.amount)
      // Then confirm with Stripe token

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update payment status to completed
      const { error: updateError } = await dbService.updatePaymentStatus(payment.id, 'completed')
      if (updateError) throw new Error(updateError)

      setSuccess(`Payment of $${selectedBooking.amount.toFixed(2)} processed successfully!`)
      setFormData({ cardNumber: '', expiryDate: '', cvv: '' })
      setSelectedBooking(null)
      setShowForm(false)
      loadData()
    } catch (err) {
      console.error('Payment error:', err)
      setError(err.message || 'Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData({ ...formData, cardNumber: formatted })
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value)
    setFormData({ ...formData, expiryDate: formatted })
  }

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setFormData({ ...formData, cvv: value })
  }

  const handleReleasePayment = async (paymentId, braiderId, amount) => {
    try {
      setError('')
      const { error: releaseError } = await dbService.releasePaymentToWallet(
        paymentId,
        braiderId,
        amount
      )
      if (releaseError) throw new Error(releaseError)
      setSuccess('Payment released to braider wallet!')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981'
      case 'released':
        return '#3b82f6'
      case 'refunded':
        return '#f59e0b'
      case 'disputed':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  return (
    <PageLayout>
      <div className="payment-container">
          <div className="payment-header">
            <h1>Payments</h1>
            {profile?.role === 'customer' && (
              <button
                className="btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Make Payment'}
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {showForm && profile?.role === 'customer' && (
            <div className="payment-form-container">
              <div className="booking-selector">
                <h3>Select Booking</h3>
                {bookings.length === 0 ? (
                  <p className="no-bookings">No confirmed bookings available</p>
                ) : (
                  <div className="bookings-grid">
                    {bookings.map(booking => (
                      <div
                        key={booking.id}
                        className={`booking-option ${selectedBooking?.id === booking.id ? 'selected' : ''}`}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="booking-amount">${booking.amount.toFixed(2)}</div>
                        <div className="booking-date">
                          {new Date(booking.appointment_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedBooking && (
                <form className="payment-form" onSubmit={handlePayment}>
                  {cardErrors.general && (
                    <div className="error-message">{cardErrors.general}</div>
                  )}

                  <div className="form-group">
                    <label>Card Number</label>
                    <div className="card-input-wrapper">
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        disabled={isProcessing}
                        required
                      />
                      {formData.cardNumber && (
                        <span className="card-type">{getCardType(formData.cardNumber)}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        disabled={isProcessing}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={handleCVVChange}
                        placeholder="123"
                        maxLength="4"
                        disabled={isProcessing}
                        required
                      />
                    </div>
                  </div>

                  <div className="payment-summary">
                    <div className="summary-row">
                      <span>Amount:</span>
                      <span>${selectedBooking.amount.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Date:</span>
                      <span>{new Date(selectedBooking.appointment_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="security-notice">
                    🔒 Your card information is secure and encrypted
                  </div>

                  <button type="submit" className="btn-primary" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Process Payment'}
                  </button>
                </form>
              )}
            </div>
          )}

          {loading ? (
            <div className="loading">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="empty-state">
              <p>No payments yet</p>
              {profile?.role === 'customer' && (
                <p>Make a payment to get started</p>
              )}
            </div>
          ) : (
            <div className="payments-list">
              {payments.map(payment => (
                <div key={payment.id} className="payment-card">
                  <div className="payment-info">
                    <div className="payment-row">
                      <span className="label">Payment ID:</span>
                      <span className="value">{payment.id.slice(0, 8)}...</span>
                    </div>
                    <div className="payment-row">
                      <span className="label">Amount:</span>
                      <span className="value">${payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="payment-row">
                      <span className="label">Status:</span>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(payment.status) }}
                      >
                        {payment.status}
                      </span>
                    </div>
                    <div className="payment-row">
                      <span className="label">Date:</span>
                      <span className="value">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {profile?.role === 'braider' && payment.status === 'completed' && (
                    <div className="payment-actions">
                      <button
                        className="btn-success"
                        onClick={() => handleReleasePayment(payment.id, user?.id, payment.amount)}
                      >
                        Release to Wallet
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
    </PageLayout>
  )
}
