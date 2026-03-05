import { useState, useEffect } from 'react'
import './PWAInstallPrompt.css'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e)
      // Show install prompt
      setShowPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully')
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      deferredPrompt.prompt()
      
      // Wait for user to respond
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted PWA installation')
        setIsInstalled(true)
      } else {
        console.log('❌ User declined PWA installation')
      }
      
      // Clear the deferred prompt
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (err) {
      console.error('Error installing PWA:', err)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-content">
        <div className="pwa-icon">📱</div>
        <div className="pwa-text">
          <h3>Install Braidly App</h3>
          <p>Get quick access to book braiders and manage appointments</p>
        </div>
      </div>
      
      <div className="pwa-actions">
        <button className="pwa-btn-install" onClick={handleInstall}>
          Install
        </button>
        <button className="pwa-btn-dismiss" onClick={handleDismiss}>
          Not Now
        </button>
      </div>
    </div>
  )
}
