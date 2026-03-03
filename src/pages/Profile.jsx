import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './Pages.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    avatar: '/assets/images/b_Professional_photo_o (3).png'
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    promotionalEmails: false,
    bookingReminders: true
  })

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setProfileData({
        ...profileData,
        phone: '(555) 123-4567',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      })
    }, 500)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target
    setPreferences(prev => ({ ...prev, [name]: checked }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      alert('Profile updated successfully!')
      // TODO: Update with Supabase
    }, 1000)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
      // TODO: Upload to Supabase storage
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <div className="page">
      <Navbar />
      
      <main className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>My Profile</h1>
            <p>Manage your account settings</p>
          </div>

          <div className="profile-container">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  <img src={profileData.avatar} alt="Profile" />
                  {isEditing && (
                    <label className="avatar-upload">
                      <i className="fas fa-camera"></i>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                <h2>{profileData.fullName}</h2>
                <p className="profile-email">{profileData.email}</p>
                <span className="profile-role-badge">
                  {user?.role === 'customer' ? 'Customer' : user?.role}
                </span>
              </div>

              {!isEditing ? (
                <div className="profile-info-view">
                  <div className="info-section">
                    <h3>Contact Information</h3>
                    <div className="info-item">
                      <i className="fas fa-phone"></i>
                      <div>
                        <label>Phone</label>
                        <p>{profileData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <label>Email</label>
                        <p>{profileData.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>Address</h3>
                    <div className="info-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <div>
                        <label>Location</label>
                        <p>
                          {profileData.address ? (
                            <>
                              {profileData.address}<br />
                              {profileData.city}, {profileData.state} {profileData.zipCode}
                            </>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="profile-edit-form">
                  <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled
                      />
                      <small>Email cannot be changed</small>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Address</h3>
                    <div className="form-group">
                      <label>Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="New York"
                        />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          name="state"
                          value={profileData.state}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="NY"
                          maxLength="2"
                        />
                      </div>
                      <div className="form-group">
                        <label>ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={profileData.zipCode}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-small"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Preferences Card */}
            <div className="preferences-card">
              <h3>Notification Preferences</h3>
              <div className="preferences-list">
                <label className="preference-item">
                  <div>
                    <strong>Email Notifications</strong>
                    <p>Receive booking updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange}
                    className="toggle-switch"
                  />
                </label>

                <label className="preference-item">
                  <div>
                    <strong>SMS Notifications</strong>
                    <p>Receive booking updates via text</p>
                  </div>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={preferences.smsNotifications}
                    onChange={handlePreferenceChange}
                    className="toggle-switch"
                  />
                </label>

                <label className="preference-item">
                  <div>
                    <strong>Booking Reminders</strong>
                    <p>Get reminders before appointments</p>
                  </div>
                  <input
                    type="checkbox"
                    name="bookingReminders"
                    checked={preferences.bookingReminders}
                    onChange={handlePreferenceChange}
                    className="toggle-switch"
                  />
                </label>

                <label className="preference-item">
                  <div>
                    <strong>Promotional Emails</strong>
                    <p>Receive special offers and promotions</p>
                  </div>
                  <input
                    type="checkbox"
                    name="promotionalEmails"
                    checked={preferences.promotionalEmails}
                    onChange={handlePreferenceChange}
                    className="toggle-switch"
                  />
                </label>
              </div>
            </div>

            {/* Account Actions */}
            <div className="account-actions-card">
              <h3>Account Actions</h3>
              <div className="action-buttons">
                <button className="action-btn">
                  <i className="fas fa-key"></i>
                  <div>
                    <strong>Change Password</strong>
                    <p>Update your account password</p>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </button>

                <button className="action-btn">
                  <i className="fas fa-credit-card"></i>
                  <div>
                    <strong>Payment Methods</strong>
                    <p>Manage saved payment methods</p>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </button>

                <button className="action-btn">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <strong>Privacy & Security</strong>
                    <p>Manage your privacy settings</p>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </button>

                <button className="action-btn danger" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <div>
                    <strong>Logout</strong>
                    <p>Sign out of your account</p>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </button>
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
