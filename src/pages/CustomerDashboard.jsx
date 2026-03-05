import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/supabaseClient'
import PageLayout from '../components/PageLayout'
import './Dashboard.css'

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        if (user) {
          const data = await dbService.getCustomerBookings(user.id)
          setBookings(data || [])
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  return (
    <PageLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {profile?.full_name || 'Customer'}</h1>
            <p>Manage your bookings and find braiders</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{bookings.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Bookings</div>
            <div className="stat-value">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <button onClick={() => navigate('/customer/browse')} className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Browse Braiders</h3>
              <p>Find professional braiders</p>
            </button>
            <button onClick={() => navigate('/customer/booking')} className="action-card">
              <div className="action-icon">📅</div>
              <h3>My Bookings</h3>
              <p>View your appointments</p>
            </button>
            <button onClick={() => navigate(`/${profile?.role}/chat`)} className="action-card">
              <div className="action-icon">💬</div>
              <h3>Messages</h3>
              <p>Chat with braiders</p>
            </button>
            <button onClick={() => navigate('/profile')} className="action-card">
              <div className="action-icon">👤</div>
              <h3>My Profile</h3>
              <p>Update your profile</p>
            </button>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Your Bookings</h2>
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <p>Loading...</p>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <p>No bookings yet. Browse available braiders to get started!</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div>
                    <h4>Booking #{booking.id.slice(0, 8)}</h4>
                    <p>{new Date(booking.appointment_date).toLocaleDateString()}</p>
                  </div>
                  <div className={`status status-${booking.status}`}>{booking.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
