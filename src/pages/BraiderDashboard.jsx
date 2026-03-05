import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/supabaseClient'
import PageLayout from '../components/PageLayout'
import './Dashboard.css'

export default function BraiderDashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          // Load bookings first
          const bookingsResult = await dbService.getBookings(user.id, 'braider')
          if (bookingsResult.error) throw new Error(bookingsResult.error)
          setBookings(bookingsResult.bookings || [])
          
          // Then load wallet
          const walletResult = await dbService.getBraiderWallet(user.id)
          if (walletResult.error) throw new Error(walletResult.error)
          setWallet(walletResult.wallet)
        }
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  return (
    <PageLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {profile?.full_name || 'Braider'}</h1>
            <p>Manage your bookings and earnings</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{bookings.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Wallet Balance</div>
            <div className="stat-value">${wallet?.wallet_balance?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Rating</div>
            <div className="stat-value">{profile?.rating || '0'}</div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <button onClick={() => navigate('/braider/booking')} className="action-card">
              <div className="action-icon">📅</div>
              <h3>My Bookings</h3>
              <p>View and manage appointments</p>
            </button>
            <button onClick={() => navigate('/braider/wallet')} className="action-card">
              <div className="action-icon">💳</div>
              <h3>Wallet</h3>
              <p>Manage earnings and withdrawals</p>
            </button>
            <button onClick={() => navigate('/braider/chat')} className="action-card">
              <div className="action-icon">💬</div>
              <h3>Messages</h3>
              <p>Chat with customers</p>
            </button>
            <button onClick={() => navigate('/profile')} className="action-card">
              <div className="action-icon">👤</div>
              <h3>My Profile</h3>
              <p>Update your profile</p>
            </button>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Bookings</h2>
          {loading ? (
            <p>Loading...</p>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <p>No bookings yet. Your customers will book with you soon!</p>
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
