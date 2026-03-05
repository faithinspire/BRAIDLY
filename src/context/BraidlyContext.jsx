import { createContext, useContext, useState } from 'react'

const BraidlyContext = createContext()

// DEPRECATED: This context is no longer used
// All data operations now use AuthContext + supabaseClient services
// Keeping minimal structure for backward compatibility only

export function BraidlyProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = (notification) => {
    const newNotif = {
      id: `n${Date.now()}`,
      ...notification,
      createdAt: new Date(),
    }
    setNotifications([...notifications, newNotif])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id))
    }, 5000)
  }

  const value = {
    notifications,
    addNotification,
  }

  return (
    <BraidlyContext.Provider value={value}>
      {children}
    </BraidlyContext.Provider>
  )
}

export function useBraidly() {
  const context = useContext(BraidlyContext)
  if (!context) {
    throw new Error('useBraidly must be used within BraidlyProvider')
  }
  return context
}
