import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PublicNavbar from '../components/PublicNavbar'
import './Auth.css'

export default function DemoUsers() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Demo users that are pre-created
  const demoUsers = [
    {
      email: 'customer@demo.com',
      password: 'demo123',
      fullName: 'Demo Customer',
      role: 'customer',
      description: 'Browse and book braiders'
    },
    {
      email: 'braider@demo.com',
      password: 'demo123',
      fullName: 'Demo Braider',
      role: 'braider',
      description: 'Manage bookings and portfolio'
    }
  ]

  const createDemoUsers = async () => {
    setIsLoading(true)
    setMessage('Creating demo users...')

    try {
      // Get the mock users database from localStorage
      const stored = localStorage.getItem('mock_users_db')
      let users = stored ? JSON.parse(stored) : []

      // Create demo users if they don't exist
      demoUsers.forEach(demoUser => {
        const exists = users.some(u => u.email === demoUser.email)
        if (!exists) {
          const newUser = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            email: demoUser.email,
            password: demoUser.password,
            full_name: demoUser.fullName,
            role: demoUser.role,
            user_metadata: {
              full_name: demoUser.fullName,
              role: demoUser.role,
            }
          }
          users.push(newUser)
        }
      })

      // Save to localStorage
      localStorage.setItem('mock_users_db', JSON.stringify(users))
      setMessage('✅ Demo users created! You can now login with any of them.')
    } catch (error) {
      setMessage('❌ Error creating demo users: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (email, password, role) => {
    setIsLoading(true)
    setMessage('Logging in...')

    try {
      const { success, error } = await login(email, password)
      
      if (!success) {
        setMessage('❌ Login failed: ' + error)
        setIsLoading(false)
        return
      }

      setMessage('✅ Login successful! Redirecting...')
      await new Promise(r => setTimeout(r, 500))
      
      const destination = role === 'braider' ? '/braider/dashboard' : '/customer/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      setMessage('❌ Error: ' + err.message)
      setIsLoading(false)
    }
  }

  return (
    <>
      <PublicNavbar />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Demo Users</h1>
            <p>Quick access for testing BRAIDLY</p>

            {message && (
              <div className={message.includes('✅') ? 'success-message' : message.includes('❌') ? 'error-message' : 'info-message'}>
                {message}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={createDemoUsers}
                disabled={isLoading}
                className="submit-btn"
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {isLoading ? 'Creating...' : '🔧 Create Demo Users'}
              </button>
              <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                Creates demo accounts in your browser
              </p>
            </div>

            <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Quick Login</h3>
              
              {demoUsers.map((user) => (
                <div key={user.email} style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    padding: '12px', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {user.role === 'braider' ? '💇' : '👤'} {user.fullName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                      {user.description}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px' }}>
                      Email: {user.email}
                    </div>
                    <button
                      onClick={() => handleQuickLogin(user.email, user.password, user.role)}
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: user.role === 'braider' ? '#ff6b9d' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      {isLoading ? 'Loading...' : 'Login as ' + user.role}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ 
              marginTop: '20px', 
              padding: '12px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '8px',
              fontSize: '12px',
              color: '#666'
            }}>
              <strong>ℹ️ How it works:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Click "Create Demo Users" to set up test accounts</li>
                <li>Click "Login as customer" or "Login as braider" to test</li>
                <li>Demo users are stored in your browser's localStorage</li>
                <li>Each device/browser has its own demo users</li>
              </ul>
            </div>

            <p className="auth-footer" style={{ marginTop: '20px' }}>
              Want to create your own account? <a href="/signup" style={{ color: '#4CAF50', textDecoration: 'none' }}>Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
