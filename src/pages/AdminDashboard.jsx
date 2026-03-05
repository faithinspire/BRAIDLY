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
    totalBookings: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // In a real app, you'd fetch these from an admin endpoint
        // For now, we'll just set placeholder values
        setStats({
          totalUsers: 0,
          totalBookings: 0,
          totalRevenue: 0,
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
              onClick={() => navigate('/admin/dashboard')}
              className="braidly-btn braidly-btn-primary"
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              Refresh
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
              <div className="stat-icon">📅</div>
              <div className="stat-number">{stats.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-number">${stats.totalRevenue.toFixed(2)}</div>
              <div className="stat-label">Platform Revenue</div>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="nav-cards-grid">
            <div
              className="nav-card"
              onClick={() => navigate('/admin/dashboard')}
              style={{ cursor: 'pointer' }}
            >
              <div className="nav-card-icon">📊</div>
              <h3>Analytics</h3>
              <p>View platform analytics and reports</p>
            </div>
            <div
              className="nav-card"
              onClick={() => navigate('/admin/dashboard')}
              style={{ cursor: 'pointer' }}
            >
              <div className="nav-card-icon">👤</div>
              <h3>Users</h3>
              <p>Manage users and permissions</p>
            </div>
            <div
              className="nav-card"
              onClick={() => navigate('/admin/dashboard')}
              style={{ cursor: 'pointer' }}
            >
              <div className="nav-card-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Configure platform settings</p>
            </div>
            <div
              className="nav-card"
              onClick={() => navigate('/admin/chat')}
              style={{ cursor: 'pointer' }}
            >
              <div className="nav-card-icon">💬</div>
              <h3>Messages</h3>
              <p>View system messages and logs</p>
            </div>
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
                  <h4>Payment Gateway</h4>
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
