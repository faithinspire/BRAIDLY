import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

// Pages
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import CustomerDashboard from '../pages/CustomerDashboard'
import BraiderDashboard from '../pages/BraiderDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import Bookings from '../pages/Bookings'
import Favorites from '../pages/Favorites'
import History from '../pages/History'
import Profile from '../pages/Profile'
import BrowseBraiders from '../pages/BrowseBraiders'
import BraiderProfile from '../pages/BraiderProfile'
import CreateBooking from '../pages/CreateBooking'
import BookingConfirmation from '../pages/BookingConfirmation'
import BraiderSchedule from '../pages/BraiderSchedule'
import BraiderEarnings from '../pages/BraiderEarnings'
import BraiderPortfolio from '../pages/BraiderPortfolio'
import BraiderReviews from '../pages/BraiderReviews'
import BraiderBookings from '../pages/BraiderBookings'
import BraiderProfilePage from '../pages/BraiderProfile'
import BraiderProfileView from '../pages/BraiderProfileView'
import AdminUsers from '../pages/AdminUsers'
import AdminDisputes from '../pages/AdminDisputes'
import AdminAnalytics from '../pages/AdminAnalytics'
import AdminVerification from '../pages/AdminVerification'
import AdminFinancial from '../pages/AdminFinancial'
import AdminSettings from '../pages/AdminSettings'
import TestSupabase from '../pages/TestSupabase'

export const router = createBrowserRouter(
  [
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/test-supabase',
    element: <TestSupabase />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/customer/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <CustomerDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/browse',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <BrowseBraiders />
      </ProtectedRoute>
    )
  },
  {
    path: '/braider/view/:id',
    element: <BraiderProfileView />
  },
  {
    path: '/customer/braider/:id',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <BraiderProfile />
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/book/:braiderId',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <CreateBooking />
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/booking/confirm',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <BookingConfirmation />
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/bookings',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <Bookings />
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/favorites',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <Favorites />
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/history',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <History />
      </ProtectedRoute>
    )
  },
  {
    path: '/customer/profile',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/braider/profile',
    element: (
      <ProtectedRoute allowedRoles={['braider']}>
        <BraiderProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/braider/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['braider']}>
        <BraiderDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/braider/schedule',
    element: (
      <ProtectedRoute allowedRoles={['braider']}>
        <BraiderSchedule />
      </ProtectedRoute>
    )
  },
  {
    path: '/braider/earnings',
    element: (
      <ProtectedRoute allowedRoles={['braider']}>
        <BraiderEarnings />
      </ProtectedRoute>
    )
  },
  {
    path: '/braider/portfolio',
    element: (
      <ProtectedRoute allowedRoles={['braider']}>
        <BraiderPortfolio />
      </ProtectedRoute>
    )
  },
  {
    path: '/braider/reviews',
    element: (
      <ProtectedRoute allowedRoles={['braider']}>
        <BraiderReviews />
      </ProtectedRoute>
    )
  },
  {
    path: '/braider/bookings',
    element: (
      <ProtectedRoute allowedRoles={['braider']}>
        <BraiderBookings />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminUsers />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/verification',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminVerification />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/disputes',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDisputes />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/analytics',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminAnalytics />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/financial',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminFinancial />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/settings',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminSettings />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
],
{
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}
)

