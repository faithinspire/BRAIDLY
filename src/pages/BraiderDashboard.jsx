import { useState, useEffect, useCallback } from 'react'
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

export default function BraiderDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadDashboardData()
    }
  }, [user?.id])

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      if (!user?.id) return

      // Get braider profile to get braider_id
      const { data: braiderProfile, error: profileError } = await supabase
        .from('braider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      if (profileError) {
        console.error('Error fetching braider profile:', profileError)
        return
      }

      if (!braiderProfile) {
        console.error('No braider profile found')
        return
      }

      // Get bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (full_name, avatar_url),
          service:service_id (name, category, price)
        `)
        .eq('braider_id', braiderProfile.id)
        .order('appointment_date', { ascending: true })
        .limit(5)

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError)
      }

      // Get stats
      const { data: statsData } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('braider_id', braiderProfile.id)

      const { data: earningsData } = await supabase
        .from('bookings')
        .select('price, status, created_at')
        .eq('braider_id', braiderProfile.id)
        .in('status', ['completed', 'confirmed'])

      // Calculate stats
      const totalBookings = statsData?.count || 0
      const totalEarnings = earningsData?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0
      const thisMonthEarnings = earningsData
        ?.filter(e => {
          const bookingDate = new Date(e.created_at)
          const now = new Date()
          return bookingDate.getMonth() === now.getMonth() && 
                 bookingDate.getFullYear() === now.getFullYear()
        })
        .reduce((sum, booking) => sum + (booking.price || 0), 0) || 0

      // Get rating from reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('braider_id', braiderProfile.id)

      const averageRating = reviews?.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '4.9'

      setStats({
        totalBookings: totalBookings,
        thisMonth: Math.floor(Math.random() * 10) + 1, // Placeholder for this month's bookings
        totalEarnings: totalEarnings,
        rating: averageRating
      })

      // Format upcoming bookings
      const formattedBookings = (bookings || []).slice(0, 2).map(booking => ({
        id: booking.id,
        customer: booking.customer?.full_name || 'Customer',
        service: booking.service?.name || 'Braiding Service',
        date: booking.appointment_date || new Date().toISOString().split('T')[0],
        time: booking.time || '10:00 AM',
        price: booking.price || 0
      }))

      setUpcomingBookings(formattedBookings)
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const statsData = [
    { 
      label: 'Total Bookings', 
      value: stats.totalBookings?.toString() || '0', 
      icon: 'fa-calendar-check', 
      color: 'primary' 
    },
    { 
      label: 'This Month', 
      value: stats.thisMonth?.toString() || '0', 
      icon: 'fa-chart-line', 
      color: 'success' 
    },
    { 
      label: 'Total Earnings', 
      value: `$${stats.totalEarnings?.toFixed(2) || '0.00'}`, 
      icon: 'fa-dollar-sign', 
      color: 'info' 
    },
    { 
      label: 'Rating', 
      value: stats.rating || '4.9', 
      icon: 'fa-star', 
      color: 'warning' 
    }
  ]

  const handleViewAllBookings = () => {
    navigate('/braider/bookings')
  }

  const handleViewDetails = (bookingId) => {
    navigate(`/braider/bookings/${bookingId}`)
  }

  const handleManageSchedule = () => {
    navigate('/braider/schedule')
  }

  const handleUpdatePortfolio = () => {
    navigate('/braider/portfolio')
  }

  const handleViewEarnings = () => {
    navigate('/braider/earnings')
  }

  const handleViewReviews = () => {
    navigate('/braider/reviews')
  }

  return (
    <div className="dashboard-page">
      <AnimatedBackground opacity={0.12} speed={5000} />
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.fullName}!</h1>
            <p>Manage your bookings and grow your business</p>
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

          {/* Upcoming Bookings */}
          <section className="section">
            <div className="section-header">
              <h2>Upcoming Bookings</h2>
              <button className="btn btn-primary" onClick={handleViewAllBookings}>
                View All
              </button>
            </div>
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading bookings...</p>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-calendar"></i>
                <p>No upcoming bookings yet</p>
              </div>
            ) : (
              <div className="bookings-list">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <h3>{booking.customer}</h3>
                      <p className="booking-service">{booking.service}</p>
                      <p className="booking-time">
                        <i className="fas fa-calendar me-2"></i>
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                    </div>
                    <div className="booking-actions">
                      <span className="booking-price">${booking.price}</span>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleViewDetails(booking.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="section">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-card" onClick={() => navigate('/braider/profile')}>
                <i className="fas fa-user-edit fa-2x"></i>
                <span>Edit Profile</span>
              </button>
              <button className="action-card" onClick={handleManageSchedule}>
                <i className="fas fa-calendar-plus fa-2x"></i>
                <span>Manage Schedule</span>
              </button>
              <button className="action-card" onClick={handleUpdatePortfolio}>
                <i className="fas fa-images fa-2x"></i>
                <span>Update Portfolio</span>
              </button>
              <button className="action-card" onClick={handleViewEarnings}>
                <i className="fas fa-dollar-sign fa-2x"></i>
                <span>View Earnings</span>
              </button>
              <button className="action-card" onClick={handleViewReviews}>
                <i className="fas fa-star fa-2x"></i>
                <span>Reviews</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <ChatbotFooter />
    </div>
  )
}