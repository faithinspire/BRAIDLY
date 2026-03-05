import React from 'react'

export default function WhatsAppChat() {
  const phoneNumber = '1234567890' // Replace with actual WhatsApp number
  const message = 'Hi, I am interested in BRAIDLY services'

  const handleWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <button
      onClick={handleWhatsApp}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#25D366',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        zIndex: 999,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      title="Chat on WhatsApp"
    >
      💬
    </button>
  )
}
