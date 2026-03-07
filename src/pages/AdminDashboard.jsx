import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/supabaseClient'
import PageLayout from '../components/PageLayout'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBraiders: 0,
    totalBookings: 0,
    totalMessages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load real stats from localStorage
        const storedUsers = localStorage.getItem('braidly_users')
        const users = storedUsers ? JSON.parse(storedUsers) : []
        
        const storedBookings = localStorage.getItem('braidly_bookings')
        const bookings = storedBookings ? JSON.parse(storedBookings) : []
        
        const storedMessages = localStorage.getItem('braidly_messages')
        const messages = storedMessages ? JSON.parse(storedMessages) : []
        
        const braiders = users.filter(u => u.role === 'braider')
        
        setStats({
          totalUsers: users.length,
          totalBraiders: braiders.length,
          totalBookings: bookings.length,
          totalMessages: messages.length,
        })
      } catch (err) {
        console.error('Error loading stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <PageLayout>
      <div className="admin-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">System administration and platform monitoring</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="refresh-btn"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💇</div>
            <div className="stat-number">{stats.totalBraiders}</div>
            <div className="stat-label">Braiders</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-number">{stats.totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-number">{stats.totalMessages}</div>
            <div className="stat-label">Messages</div>
          </div>
        </div>

        {/* Navigation Cards - LARGE RESPONSIVE BUTTONS */}
        <div className="admin-action-grid">
          <button
            className="admin-action-card"
            onClick={() => navigate('/admin/analytics')}
          >
            <div className="admin-action-icon">📊</div>
            <h3>Analytics</h3>
            <p>View platform analytics and reports</p>
          </button>
          <button
            className="admin-action-card"
            onClick={() => navigate('/admin/users')}
          >
            <div className="admin-action-icon">👥</div>
            <h3>Users</h3>
            <p>Manage users and permissions</p>
          </button>
          <button
            className="admin-action-card"
            onClick={() => navigate('/admin/settings')}
          >
            <div className="admin-action-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure platform settings</p>
          </button>
          <button
            className="admin-action-card"
            onClick={() => navigate('/admin/chat')}
          >
            <div className="admin-action-icon">💬</div>
            <h3>Messages</h3>
            <p>View system messages and logs</p>
          </button>
        </div>

        {/* System Status Section */}
        <div className="status-section">
          <h2 className="section-title">System Status</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
              <p>Loading system status...</p>
            </div>
          ) : (
            <div className="status-grid">
              <div className="status-card">
                <div className="status-indicator online" />
                <h4>Database</h4>
                <p>Connected</p>
              </div>
              <div className="status-card">
                <div className="status-indicator online" />
                <h4>Authentication</h4>
                <p>Active</p>
              </div>
              <div className="status-card">
                <div className="status-indicator online" />
                <h4>Chat System</h4>
                <p>Connected</p>
              </div>
              <div className="status-card">
                <div className="status-indicator online" />
                <h4>Storage</h4>
                <p>Available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
