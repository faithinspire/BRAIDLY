import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabaseDB } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import '../../css/design-system.css'

export default function BraiderSchedule() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '18:00' },
    tuesday: { enabled: true, start: '09:00', end: '18:00' },
    wednesday: { enabled: true, start: '09:00', end: '18:00' },
    thursday: { enabled: true, start: '09:00', end: '18:00' },
    friday: { enabled: true, start: '09:00', end: '18:00' },
    saturday: { enabled: true, start: '10:00', end: '16:00' },
    sunday: { enabled: false, start: '10:00', end: '16:00' }
  })

  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    loadScheduleData()
  }, [user])

  const loadScheduleData = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      
      // Load availability
      const availabilityData = await supabaseDB.getBraiderAvailability(user.id)
      if (availabilityData) {
        setAvailability(availabilityData.schedule || availability)
      }
      
      // Load upcoming appointments
      const bookings = await supabaseDB.getBookings(user.id, 'braider')
      const upcoming = bookings.filter(b => 
        b.status === 'confirmed' || b.status === 'pending'
      ).slice(0, 5)
      
      setAppointments(upcoming.map(b => ({
        id: b.id,
        customer: b.customer?.full_name || 'Customer',
        service: b.service_name || 'Service',
        date: b.booking_date,
        time: b.booking_time,
        duration: b.duration || '2-3 hours',
        status: b.status
      })))
      
    } catch (error) {
      console.error('Error loading schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const handleSaveAvailability = async () => {
    if (!user?.id) return
    
    try {
      setSaving(true)
      await supabaseDB.updateBraiderAvailability(user.id, { schedule: availability })
      alert('✅ Availability updated successfully!')
    } catch (error) {
      console.error('Error saving availability:', error)
      alert('❌ Failed to save availability. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleBlockTime = () => {
    alert('Block time slot feature coming soon!')
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading schedule...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Schedule Management</h1>
              <p>Manage your availability and appointments</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={handleBlockTime}>
                <i className="fas fa-ban"></i>
                Block Time
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/braider/dashboard')}>
                <i className="fas fa-arrow-left"></i>
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`btn ${viewMode === 'week' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('week')}
            >
              Week View
            </button>
            <button
              className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('month')}
            >
              Month View
            </button>
          </div>

          {/* Weekly Availability */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Weekly Availability</h2>
              <button className="btn btn-primary btn-sm" onClick={handleSaveAvailability} disabled={saving}>
                <i className="fas fa-save"></i>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            <div className="availability-grid">
              {Object.entries(availability).map(([day, schedule]) => (
                <div key={day} className="availability-day">
                  <div className="day-header">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) => handleAvailabilityChange(day, 'enabled', e.target.checked)}
                      />
                      <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                    </label>
                  </div>
                  {schedule.enabled && (
                    <div className="day-times">
                      <div className="time-input">
                        <label>Start</label>
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        />
                      </div>
                      <div className="time-input">
                        <label>End</label>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  {!schedule.enabled && (
                    <p className="day-closed">Closed</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Appointments */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Upcoming Appointments</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/braider/bookings')}>
                View All Bookings
              </button>
            </div>
            <div className="appointments-calendar">
              {appointments.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-calendar"></i>
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                appointments.map((appointment) => (
                <div key={appointment.id} className="calendar-appointment">
                  <div className="appointment-date">
                    <div className="date-badge">
                      <span className="date-day">{new Date(appointment.date).getDate()}</span>
                      <span className="date-month">
                        {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                  </div>
                  <div className="appointment-details">
                    <h4>{appointment.customer}</h4>
                    <p className="appointment-service">{appointment.service}</p>
                    <div className="appointment-meta">
                      <span>
                        <i className="fas fa-clock"></i>
                        {appointment.time}
                      </span>
                      <span>
                        <i className="fas fa-hourglass-half"></i>
                        {appointment.duration}
                      </span>
                    </div>
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
              )}
            </div>
          </section>

          {/* Quick Stats */}
          <div className="stats-grid-3">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-info">
                <h3>{appointments.filter(a => a.status === 'confirmed').length}</h3>
                <p>Confirmed This Week</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <h3>{appointments.filter(a => a.status === 'pending').length}</h3>
                <p>Pending Requests</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-info">
                <h3>32</h3>
                <p>Available Hours</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
