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

  // If no profile but user exists, create default profile
  if (!profile) {
    // If role is required, check user data
    if (requiredRole) {
      const userRole = user.role || 'customer'
      if (userRole !== requiredRole) {
        const roleRedirects = {
          customer: '/customer/dashboard',
          braider: '/braider/dashboard',
          admin: '/admin/dashboard',
        }
        return <Navigate to={roleRedirects[userRole] || '/login'} replace />
      }
    }
    // Allow access - profile will be created from user data
    return children
  }

  // Profile exists - check role if required
  if (requiredRole && profile.role !== requiredRole) {
    const roleRedirects = {
      customer: '/customer/dashboard',
      braider: '/braider/dashboard',
      admin: '/admin/dashboard',
    }
    return <Navigate to={roleRedirects[profile.role] || '/login'} replace />
  }

  return children
}
