import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import './SettingsDashboard.css'

export default function SettingsDashboard() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    platformName: 'Braidly',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    maxBookingDays: 30,
    commissionRate: 15,
    platformFee: 2.5,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('braidly_settings')
    if (stored) {
      setSettings(JSON.parse(stored))
    }
  }, [])

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('braidly_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <PageLayout>
      <div className="settings-container">
        <div className="settings-header">
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1>Platform Settings</h1>
          <p>Configure platform settings and preferences</p>
        </div>

        {saved && (
          <div className="success-message">
            ✓ Settings saved successfully
          </div>
        )}

        <div className="settings-grid">
          {/* General Settings */}
          <div className="settings-section">
            <h2>General Settings</h2>
            
            <div className="setting-item">
              <label>Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="setting-input"
              />
            </div>

            <div className="setting-item">
              <label>Maintenance Mode</label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  id="maintenance"
                />
                <label htmlFor="maintenance" className="toggle-label">
                  {settings.maintenanceMode ? 'ON' : 'OFF'}
                </label>
              </div>
              <p className="setting-description">
                When enabled, only admins can access the platform
              </p>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section">
            <h2>Notification Settings</h2>
            
            <div className="setting-item">
              <label>Email Notifications</label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  id="email-notif"
                />
                <label htmlFor="email-notif" className="toggle-label">
                  {settings.emailNotifications ? 'ON' : 'OFF'}
                </label>
              </div>
            </div>

            <div className="setting-item">
              <label>SMS Notifications</label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                  id="sms-notif"
                />
                <label htmlFor="sms-notif" className="toggle-label">
                  {settings.smsNotifications ? 'ON' : 'OFF'}
                </label>
              </div>
            </div>
          </div>

          {/* Booking Settings */}
          <div className="settings-section">
            <h2>Booking Settings</h2>
            
            <div className="setting-item">
              <label>Max Booking Days in Advance</label>
              <input
                type="number"
                value={settings.maxBookingDays}
                onChange={(e) => handleChange('maxBookingDays', parseInt(e.target.value))}
                className="setting-input"
                min="1"
                max="365"
              />
              <p className="setting-description">
                Maximum days in advance customers can book
              </p>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="settings-section">
            <h2>Financial Settings</h2>
            
            <div className="setting-item">
              <label>Commission Rate (%)</label>
              <input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
                className="setting-input"
                min="0"
                max="100"
                step="0.1"
              />
              <p className="setting-description">
                Platform commission on each booking
              </p>
            </div>

            <div className="setting-item">
              <label>Platform Fee ($)</label>
              <input
                type="number"
                value={settings.platformFee}
                onChange={(e) => handleChange('platformFee', parseFloat(e.target.value))}
                className="setting-input"
                min="0"
                step="0.01"
              />
              <p className="setting-description">
                Fixed platform fee per transaction
              </p>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={handleSave}>
            💾 Save Settings
          </button>
          <button className="reset-btn" onClick={() => window.location.reload()}>
            ↻ Reset
          </button>
        </div>

        <div className="settings-info">
          <h3>ℹ️ Information</h3>
          <ul>
            <li>All settings are stored locally and will persist across sessions</li>
            <li>Changes take effect immediately after saving</li>
            <li>Commission rate applies to all braider earnings</li>
            <li>Platform fee is charged per transaction</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}
