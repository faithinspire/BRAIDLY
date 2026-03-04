import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import { ProfileProvider } from '../auth/ProfileContext'
import { router } from './router'

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App
