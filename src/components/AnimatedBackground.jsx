import { useState, useEffect } from 'react'
import '../../css/animated-background.css'

export default function AnimatedBackground({ opacity = 0.15, speed = 5000 }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const braiderImages = [
    '/backgrounds/bg1.jpg',
    '/backgrounds/bg2.jpg',
    '/backgrounds/bg3.jpg',
    '/backgrounds/bg4.jpg',
    '/backgrounds/bg5.jpg',
    '/backgrounds/bg6.jpg',
    '/backgrounds/bg7.jpg'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % braiderImages.length
      )
    }, speed)

    return () => clearInterval(interval)
  }, [braiderImages.length, speed])

  return (
    <div className="animated-background" style={{ '--bg-opacity': opacity }}>
      <div className="animated-background-container">
        {braiderImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Braider background ${index + 1}`}
            className={`animated-bg-image ${index === currentImageIndex ? 'active' : ''}`}
            loading="lazy"
          />
        ))}
      </div>
      <div className="animated-background-overlay"></div>
    </div>
  )
}
