import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DemoUsers from './pages/DemoUsers'
import NotFound from './pages/NotFound'
import ProfilePage from './pages/ProfilePage'
import BrowseBraiders from './pages/BrowseBraiders'
import BraiderProfile from './pages/BraiderProfile'
import AdminDashboard from './pages/AdminDashboard'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import UsersDashboard from './pages/UsersDashboard'
import SettingsDashboard from './pages/SettingsDashboard'
import ChatPage from './pages/ChatPage'
import BookingPage from './pages/BookingPage'
import PaymentPage from './pages/PaymentPage'
import WalletPage from './pages/WalletPage'
import PageLayout from './components/PageLayout'
import './App.css'
import './pages/Dashboard.css'

// Inline CustomerDashboard component
function CustomerDashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  return (
    <PageLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome, {profile?.full_name || 'Customer'}</h1>
          <p>Find and book your favorite braiders</p>
        </div>
        <div className="action-grid">
          <button className="action-card" onClick={() => navigate('/customer/browse')}>
            <div className="action-icon">🔍</div>
            <h3>Browse Braiders</h3>
            <p>Find and book braiders</p>
          </button>
          <button className="action-card" onClick={() => navigate('/customer/booking')}>
            <div className="action-icon">📅</div>
            <h3>My Bookings</h3>
            <p>View your appointments</p>
          </button>
          <button className="action-card" onClick={() => navigate('/customer/chat')}>
            <div className="action-icon">💬</div>
            <h3>Messages</h3>
            <p>Chat with braiders</p>
          </button>
          <button className="action-card" onClick={() => navigate('/profile')}>
            <div className="action-icon">👤</div>
            <h3>My Profile</h3>
            <p>Update your profile</p>
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

// Inline BraiderDashboard component
function BraiderDashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [portfolio, setPortfolio] = useState([])

  useEffect(() => {
    // Load portfolio from localStorage
    const stored = localStorage.getItem(`portfolio_${user?.id}`)
    if (stored) {
      setPortfolio(JSON.parse(stored))
    }
  }, [user])

  const handlePortfolioUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newItem = {
          id: Date.now(),
          name: file.name,
          data: event.target.result,
          uploadedAt: new Date().toISOString()
        }
        const updated = [...portfolio, newItem]
        setPortfolio(updated)
        localStorage.setItem(`portfolio_${user?.id}`, JSON.stringify(updated))
      }
      reader.readAsDataURL(file)
    })
  }

  const deletePortfolioItem = (id) => {
    const updated = portfolio.filter(item => item.id !== id)
    setPortfolio(updated)
    localStorage.setItem(`portfolio_${user?.id}`, JSON.stringify(updated))
  }

  return (
    <PageLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome, {profile?.full_name || 'Braider'}</h1>
          <p>Manage your bookings and earnings</p>
        </div>
        <div className="action-grid">
          <button className="action-card" onClick={() => navigate('/braider/booking')}>
            <div className="action-icon">📅</div>
            <h3>My Bookings</h3>
            <p>View and manage appointments</p>
          </button>
          <button className="action-card" onClick={() => navigate('/braider/wallet')}>
            <div className="action-icon">💳</div>
            <h3>Wallet</h3>
            <p>Manage earnings and withdrawals</p>
          </button>
          <button className="action-card" onClick={() => navigate('/braider/chat')}>
            <div className="action-icon">💬</div>
            <h3>Messages</h3>
            <p>Chat with customers</p>
          </button>
          <button className="action-card" onClick={() => navigate('/profile')}>
            <div className="action-icon">👤</div>
            <h3>My Profile</h3>
            <p>Update your profile</p>
          </button>
        </div>

        <div className="dashboard-section" style={{ marginTop: '3rem' }}>
          <h2>📸 My Portfolio</h2>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #7e22ce, #3b82f6)',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              Upload Portfolio Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePortfolioUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {portfolio.length === 0 ? (
            <div className="empty-state">
              <p>No portfolio images yet. Upload your best work!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              {portfolio.map(item => (
                <div key={item.id} style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  <img src={item.data} alt={item.name} style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }} />
                  <button
                    onClick={() => deletePortfolioItem(item.id)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <PWAInstallPrompt />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/demo" element={<DemoUsers />} />

            {/* Customer Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/browse"
              element={
                <ProtectedRoute requiredRole="customer">
                  <BrowseBraiders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/braider/:id"
              element={
                <ProtectedRoute requiredRole="customer">
                  <BraiderProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <ProtectedRoute requiredRole="customer">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/chat"
              element={
                <ProtectedRoute requiredRole="customer">
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/booking"
              element={
                <ProtectedRoute requiredRole="customer">
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/payment"
              element={
                <ProtectedRoute requiredRole="customer">
                  <PaymentPage />
                </ProtectedRoute>
              }
            />

            {/* Braider Routes */}
            <Route
              path="/braider/dashboard"
              element={
                <ProtectedRoute requiredRole="braider">
                  <BraiderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/braider/profile"
              element={
                <ProtectedRoute requiredRole="braider">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/braider/chat"
              element={
                <ProtectedRoute requiredRole="braider">
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/braider/booking"
              element={
                <ProtectedRoute requiredRole="braider">
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/braider/wallet"
              element={
                <ProtectedRoute requiredRole="braider">
                  <WalletPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UsersDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <SettingsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/chat"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            {/* Profile Route (shared across roles) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
