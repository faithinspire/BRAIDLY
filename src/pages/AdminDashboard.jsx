import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import Navbar from '../components/Navbar'
import ChatbotFooter from '../components/ChatbotFooter'
import AnimatedBackground from '../components/AnimatedBackground'
import './Dashboard.css'
import './DashboardExtras.css'
import '../../css/design-system.css'
import '../../css/blur-braids-background.css'
import '../../css/animated-background.css'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Get total users
      const { data: users } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      // Get active braiders
      const { data: braiders } = await supabase
        .from('braider_profiles')
        .select('*', { count: 'exact' })
        .eq('is_active', true)

      // Get total bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })

      // Get revenue data
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('total_amount, platform_fee')
        .in('status', ['completed', 'escrowed'])

      const totalRevenue = revenueData?.reduce((sum, booking) => 
        sum + (booking.total_amount || 0), 0) || 0
      const platformRevenue = revenueData?.reduce((sum, booking) => 
        sum + (booking.platform_fee || 0), 0) || 0

      setStats({
        totalUsers: users?.length || 0,
        activeBraiders: braiders?.length || 0,
        totalBookings: bookings?.length || 0,
        revenue: totalRevenue,
        platformRevenue: platformRevenue
      })

      // Get recent activity
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2)

      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('*, customer:profiles!bookings_customer_id_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(2)

      const { data: pendingVerifications } = await supabase
        .from('braider_profiles')
        .select('*, profiles!braider_profiles_user_id_fkey(full_name)')
        .eq('verification_status', 'pending')
        .limit(1)

      const activity = []

      // Add user registrations
      recentUsers?.forEach(user => {
        activity.push({
          type: 'user',
          message: `New user registered: ${user.full_name || 'New User'}`,
          time: getTimeAgo(user.created_at)
        })
      })

      // Add recent bookings
      recentBookings?.forEach(booking => {
        activity.push({
          type: 'booking',
          message: `New booking by ${booking.customer?.full_name || 'customer'}`,
          time: getTimeAgo(booking.created_at)
        })
      })

      // Add pending verifications
      pendingVerifications?.forEach(braider => {
        activity.push({
          type: 'verification',
          message: `Verification pending: ${braider.profiles?.full_name || 'Braider'}`,
          time: getTimeAgo(braider.created_at)
        })
      })

      setRecentActivity(activity.slice(0, 4))

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  const statsData = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers || '0', 
      icon: 'fa-users', 
      color: 'primary' 
    },
    { 
      label: 'Active Braiders', 
      value: stats.activeBraiders || '0', 
      icon: 'fa-user-check', 
      color: 'success' 
    },
    { 
      label: 'Total Bookings', 
      value: stats.totalBookings || '0', 
      icon: 'fa-calendar-check', 
      color: 'info' 
    },
    { 
      label: 'Revenue', 
      value: `$${(stats.revenue || 0).toFixed(2)}`, 
      icon: 'fa-dollar-sign', 
      color: 'warning' 
    }
  ]

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className="dashboard-page">
      <AnimatedBackground opacity={0.12} speed={5000} />
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.fullName}!</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {statsData.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className={`stat-icon stat-icon-${stat.color}`}>
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <div className="stat-content">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <section className="section">
            <h2>Recent Activity</h2>
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading activity...</p>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-bell"></i>
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="activity-item">
                    <div className="activity-icon">
                      <i className={`fas fa-${activity.type === 'user' ? 'user-plus' : 
                        activity.type === 'booking' ? 'calendar' : 
                        'check-circle'}`}></i>
                    </div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Admin Actions */}
          <section className="section">
            <h2>Admin Tools</h2>
            <div className="actions-grid">
              <button 
                className="action-card" 
                onClick={() => handleNavigation('/admin/users')}
              >
                <i className="fas fa-users-cog fa-2x"></i>
                <span>User Management</span>
              </button>
              <button 
                className="action-card"
                onClick={() => handleNavigation('/admin/verification')}
              >
                <i className="fas fa-user-shield fa-2x"></i>
                <span>Verifications</span>
              </button>
              <button 
                className="action-card"
                onClick={() => handleNavigation('/admin/disputes')}
              >
                <i className="fas fa-exclamation-triangle fa-2x"></i>
                <span>Disputes</span>
              </button>
              <button 
                className="action-card"
                onClick={() => handleNavigation('/admin/analytics')}
              >
                <i className="fas fa-chart-bar fa-2x"></i>
                <span>Analytics</span>
              </button>
              <button 
                className="action-card"
                onClick={() => handleNavigation('/admin/financial')}
              >
                <i className="fas fa-dollar-sign fa-2x"></i>
                <span>Financial</span>
              </button>
              <button 
                className="action-card"
                onClick={() => handleNavigation('/admin/settings')}
              >
                <i className="fas fa-shield-alt fa-2x"></i>
                <span>Security</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <ChatbotFooter />
    </div>
  )
}