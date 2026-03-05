import './WhatsAppButton.css'

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      title="Chat with us on WhatsApp"
    >
      <span className="whatsapp-icon">💬</span>
      <span className="whatsapp-text">WhatsApp</span>
    </a>
  )
}
