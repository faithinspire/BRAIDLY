import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ThemeToggle from '../components/ThemeToggle'
import ChatbotFooter from '../components/ChatbotFooter'
import './DashboardStyles.css'

export default function BraiderDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    revenue: 0,
    rating: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'braider') {
      navigate('/login')
      return
    }
    loadDashboardData()
  }, [user, navigate])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // TODO: Fetch braider stats and bookings from Supabase
      setStats({
        totalBookings: 0,
        completedBookings: 0,
        revenue: 0,
        rating: 0
      })
      setRecentBookings([])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <h1>Welcome, {user?.fullName}!</h1>
            <p>Manage your bookings and grow your business</p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="dashboard-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-content">
                  <h3>Total Bookings</h3>
                  <p className="stat-value">{stats.totalBookings}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-content">
                  <h3>Completed</h3>
                  <p className="stat-value">{stats.completedBookings}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="stat-content">
                  <h3>Revenue</h3>
                  <p className="stat-value">${stats.revenue}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="stat-content">
                  <h3>Rating</h3>
                  <p className="stat-value">{stats.rating.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-actions">
          <div className="container">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/braider/profile" className="action-card">
                <i className="fas fa-user-edit"></i>
                <h3>Edit Profile</h3>
                <p>Update your information</p>
              </Link>
              <Link to="/braider/portfolio" className="action-card">
                <i className="fas fa-images"></i>
                <h3>Portfolio</h3>
                <p>Showcase your work</p>
              </Link>
              <Link to="/braider/schedule" className="action-card">
                <i className="fas fa-calendar"></i>
                <h3>Schedule</h3>
                <p>Manage availability</p>
              </Link>
              <Link to="/braider/reviews" className="action-card">
                <i className="fas fa-comments"></i>
                <h3>Reviews</h3>
                <p>View customer feedback</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="dashboard-content">
          <div className="container">
            <h2>Recent Bookings</h2>
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading bookings...</p>
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.customer_name}</td>
                        <td>{booking.service_type}</td>
                        <td>{new Date(booking.appointment_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`status status-${booking.status}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-calendar"></i>
                <h3>No bookings yet</h3>
                <p>Your bookings will appear here</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
