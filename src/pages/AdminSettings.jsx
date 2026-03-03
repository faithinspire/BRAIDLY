import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import '../../css/design-system.css'

export default function AdminSettings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [settings, setSettings] = useState({
    platformFee: 5,
    minBookingAmount: 50,
    maxBookingAmount: 500,
    verificationRequired: true,
    autoApproveBookings: false
  })

  const handleSave = () => {
    alert('✅ Settings saved successfully!')
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Platform Settings</h1>
              <p>Configure platform-wide settings</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
          </div>

          <div className="dashboard-section">
            <h2>General Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Platform Fee (%)</label>
                <input 
                  type="number" 
                  value={settings.platformFee}
                  onChange={(e) => setSettings({...settings, platformFee: e.target.value})}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Minimum Booking Amount ($)</label>
                <input 
                  type="number" 
                  value={settings.minBookingAmount}
                  onChange={(e) => setSettings({...settings, minBookingAmount: e.target.value})}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Maximum Booking Amount ($)</label>
                <input 
                  type="number" 
                  value={settings.maxBookingAmount}
                  onChange={(e) => setSettings({...settings, maxBookingAmount: e.target.value})}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.verificationRequired}
                    onChange={(e) => setSettings({...settings, verificationRequired: e.target.checked})}
                  />
                  Require braider verification
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.autoApproveBookings}
                    onChange={(e) => setSettings({...settings, autoApproveBookings: e.target.checked})}
                  />
                  Auto-approve bookings
                </label>
              </div>
              <button className="btn btn-primary" onClick={handleSave}>
                <i className="fas fa-save"></i> Save Settings
              </button>
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
