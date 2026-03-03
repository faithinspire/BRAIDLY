import { useState, useEffect } from 'react'
import '../../css/animated-background.css'

export default function AnimatedBackground({ opacity = 0.15, speed = 5000 }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const braiderImages = [
    '/assets/images/gemini-3-pro-image-preview-2k_b_Hero_Background_Imag.png',
    '/assets/images/gemini-3-pro-image-preview-2k_b_Braider_Working_Imag.png',
    '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_headsho.png',
    '/assets/images/gemini-3-pro-image-preview-2k_b_Professional_portrai.png',
    '/assets/images/gpt-image-1.5-high-fidelity_a_Hero_Background_Imag.png',
    '/assets/images/gpt-image-1.5-high-fidelity_a_Braider_Working_Imag.png',
    '/assets/images/b_Professional_photo_o.png',
    '/assets/images/b_Long_box_braids_with.png',
    '/assets/images/a_Long_box_braids_with.jpeg',
    '/assets/images/a_Knotless_braids_hair.jpeg'
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
            alt={`Braider ${index + 1}`}
            className={`animated-bg-image ${index === currentImageIndex ? 'active' : ''}`}
            loading="lazy"
          />
        ))}
      </div>
      <div className="animated-background-overlay"></div>
    </div>
  )
}
