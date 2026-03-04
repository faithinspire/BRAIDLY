import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ThemeToggle from '../components/ThemeToggle'
import ChatbotFooter from '../components/ChatbotFooter'
import './DashboardStyles.css'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBraiders: 0,
    totalBookings: 0,
    totalRevenue: 0
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    loadAdminData()
  }, [user, navigate])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // TODO: Fetch admin stats from Supabase
      setStats({
        totalUsers: 0,
        totalBraiders: 0,
        totalBookings: 0,
        totalRevenue: 0
      })
      setRecentUsers([])
    } catch (error) {
      console.error('Error loading admin data:', error)
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
            <h1>Admin Dashboard</h1>
            <p>Manage platform users and monitor activity</p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="dashboard-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-value">{stats.totalUsers}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-scissors"></i>
                </div>
                <div className="stat-content">
                  <h3>Total Braiders</h3>
                  <p className="stat-value">{stats.totalBraiders}</p>
                </div>
              </div>

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
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-content">
                  <h3>Total Revenue</h3>
                  <p className="stat-value">${stats.totalRevenue}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Actions */}
        <section className="dashboard-actions">
          <div className="container">
            <h2>Management</h2>
            <div className="actions-grid">
              <Link to="/admin/users" className="action-card">
                <i className="fas fa-user-cog"></i>
                <h3>Users</h3>
                <p>Manage all users</p>
              </Link>
              <Link to="/admin/braiders" className="action-card">
                <i className="fas fa-user-check"></i>
                <h3>Braiders</h3>
                <p>Verify braiders</p>
              </Link>
              <Link to="/admin/bookings" className="action-card">
                <i className="fas fa-list-check"></i>
                <h3>Bookings</h3>
                <p>Monitor bookings</p>
              </Link>
              <Link to="/admin/analytics" className="action-card">
                <i className="fas fa-chart-bar"></i>
                <h3>Analytics</h3>
                <p>View reports</p>
              </Link>
              <Link to="/admin/disputes" className="action-card">
                <i className="fas fa-exclamation-circle"></i>
                <h3>Disputes</h3>
                <p>Handle disputes</p>
              </Link>
              <Link to="/admin/settings" className="action-card">
                <i className="fas fa-cog"></i>
                <h3>Settings</h3>
                <p>Platform settings</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Users */}
        <section className="dashboard-content">
          <div className="container">
            <h2>Recent Users</h2>
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading users...</p>
              </div>
            ) : recentUsers.length > 0 ? (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.full_name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
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
                <i className="fas fa-users"></i>
                <h3>No users yet</h3>
                <p>Users will appear here</p>
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
