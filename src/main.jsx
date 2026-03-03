import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// PWA Install Prompt Handler
let deferredPrompt

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ PWA Install Prompt Available')
  e.preventDefault()
  deferredPrompt = e
  
  // Show install button/prompt
  const installButton = document.getElementById('pwa-install-btn')
  if (installButton) {
    installButton.style.display = 'block'
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log(`User response to the install prompt: ${outcome}`)
        deferredPrompt = null
        installButton.style.display = 'none'
      }
    })
  }
})

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA App Installed Successfully')
  deferredPrompt = null
  const installButton = document.getElementById('pwa-install-btn')
  if (installButton) {
    installButton.style.display = 'none'
  }
})
