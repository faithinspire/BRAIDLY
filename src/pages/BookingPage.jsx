import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/supabaseClient'
import PageLayout from '../components/PageLayout'
import './BookingPage.css'

export default function BookingPage() {
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    braiderId: '',
    appointmentDate: '',
    amount: '',
    notes: '',
  })

  useEffect(() => {
    loadBookings()
  }, [user, profile])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const { bookings: data, error: fetchError } = await dbService.getBookings(
        user?.id,
        profile?.role
      )
      if (fetchError) throw new Error(fetchError)
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBooking = async (e) => {
    e.preventDefault()
    if (!formData.braiderId || !formData.appointmentDate || !formData.amount) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const { booking, error: createError } = await dbService.createBooking(
        user?.id,
        formData.braiderId,
        formData.appointmentDate,
        parseFloat(formData.amount),
        formData.notes
      )
      if (createError) throw new Error(createError)

      setFormData({ braiderId: '', appointmentDate: '', amount: '', notes: '' })
      setShowForm(false)
      loadBookings()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const { error: updateError } = await dbService.updateBookingStatus(bookingId, newStatus)
      if (updateError) throw new Error(updateError)
      loadBookings()
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981'
      case 'completed':
        return '#3b82f6'
      case 'cancelled':
        return '#ef4444'
      default:
        return '#f59e0b'
    }
  }

  return (
    <PageLayout>
      <div className="booking-container">
          <div className="booking-header">
            <h1>Bookings</h1>
            {profile?.role === 'customer' && (
              <button
                className="btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'New Booking'}
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          {showForm && profile?.role === 'customer' && (
            <form className="booking-form" onSubmit={handleCreateBooking}>
              <div className="form-group">
                <label>Braider ID</label>
                <input
                  type="text"
                  value={formData.braiderId}
                  onChange={(e) => setFormData({ ...formData, braiderId: e.target.value })}
                  placeholder="Enter braider ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Appointment Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special requests..."
                  rows="3"
                />
              </div>

              <button type="submit" className="btn-primary">
                Create Booking
              </button>
            </form>
          )}

          {loading ? (
            <div className="loading">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <p>No bookings yet</p>
              {profile?.role === 'customer' && (
                <p>Create your first booking to get started</p>
              )}
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-info">
                    <div className="booking-row">
                      <span className="label">Booking ID:</span>
                      <span className="value">{booking.id.slice(0, 8)}...</span>
                    </div>
                    <div className="booking-row">
                      <span className="label">Date:</span>
                      <span className="value">
                        {new Date(booking.appointment_date).toLocaleString()}
                      </span>
                    </div>
                    <div className="booking-row">
                      <span className="label">Amount:</span>
                      <span className="value">${booking.amount.toFixed(2)}</span>
                    </div>
                    <div className="booking-row">
                      <span className="label">Status:</span>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </span>
                    </div>
                    {booking.notes && (
                      <div className="booking-row">
                        <span className="label">Notes:</span>
                        <span className="value">{booking.notes}</span>
                      </div>
                    )}
                  </div>

                  {profile?.role === 'braider' && booking.status === 'pending' && (
                    <div className="booking-actions">
                      <button
                        className="btn-success"
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {profile?.role === 'braider' && booking.status === 'confirmed' && (
                    <div className="booking-actions">
                      <button
                        className="btn-success"
                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                      >
                        Mark Complete
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
