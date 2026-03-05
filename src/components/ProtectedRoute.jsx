import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, initialized } = useAuth()

  // Wait for auth to initialize
  if (!initialized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Profile is required - don't allow access without it
  if (!profile) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Loading profile...</p>
      </div>
    )
  }

  // Role mismatch - redirect to correct dashboard based on actual role
  if (requiredRole && profile.role !== requiredRole) {
    const roleRedirects = {
      customer: '/customer/dashboard',
      braider: '/braider/dashboard',
      admin: '/admin/dashboard',
    }
    const destination = roleRedirects[profile.role] || '/login'
    return <Navigate to={destination} replace />
  }

  return children
}
