import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'
import ProfilePage from './pages/ProfilePage'
import CustomerDashboard from './pages/CustomerDashboard'
import BrowseBraiders from './pages/BrowseBraiders'
import BraiderProfile from './pages/BraiderProfile'
import BraiderDashboard from './pages/BraiderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ChatPage from './pages/ChatPage'
import BookingPage from './pages/BookingPage'
import PaymentPage from './pages/PaymentPage'
import WalletPage from './pages/WalletPage'
import './App.css'

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
