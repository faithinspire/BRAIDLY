import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import '../../css/design-system.css'

export default function AdminAnalytics() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    growthRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      
      // Get total bookings
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
      
      // Get revenue
      const { data: completedBookings } = await supabase
        .from('bookings')
        .select('price, created_at')
        .eq('status', 'completed')
      
      const totalRevenue = completedBookings?.reduce((sum, b) => sum + (b.price || 0), 0) || 0
      
      // Calculate growth (last month vs this month)
      const thisMonth = new Date().getMonth()
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
      
      const thisMonthBookings = completedBookings?.filter(b => 
        new Date(b.created_at).getMonth() === thisMonth
      ).length || 0
      
      const lastMonthBookings = completedBookings?.filter(b => 
        new Date(b.created_at).getMonth() === lastMonth
      ).length || 0
      
      const growthRate = lastMonthBookings > 0 
        ? Math.round(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100)
        : 0
      
      setStats({
        totalUsers: usersCount || 0,
        totalBookings: bookingsCount || 0,
        totalRevenue,
        growthRate
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Platform Analytics</h1>
              <p>View detailed platform statistics and insights</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading analytics...</p>
            </div>
          ) : (
            <>
              <div className="stats-grid-4">
                <div className="stat-card stat-card-primary">
                  <div className="stat-icon"><i className="fas fa-users"></i></div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers.toLocaleString()}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="stat-card stat-card-success">
                  <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
                  <div className="stat-info">
                    <h3>{stats.totalBookings.toLocaleString()}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                <div className="stat-card stat-card-warning">
                  <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
                  <div className="stat-info">
                    <h3>${stats.totalRevenue.toLocaleString()}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
                <div className="stat-card stat-card-info">
                  <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
                  <div className="stat-info">
                    <h3>{stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%</h3>
                    <p>Growth Rate</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Analytics Dashboard</h2>
                <p>Real-time platform statistics from Supabase database.</p>
              </div>
            </>
          )}
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
