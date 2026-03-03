import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseDB } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import LocationSearch from '../components/LocationSearch'
import AnimatedBackground from '../components/AnimatedBackground'
import '../../css/design-system.css'
import '../../css/blur-braids-background.css'
import '../../css/animated-background.css'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [featuredBraiders, setFeaturedBraiders] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [galleryLoading, setGalleryLoading] = useState(true)

  useEffect(() => {
    loadFeaturedBraiders()
    loadGalleryImages()
  }, [])

  const loadFeaturedBraiders = async () => {
    try {
      setLoading(true)
      
      // Load real braiders from database
      const { data, error } = await supabase
        .from('braider_profiles')
        .select(`
          *,
          profiles!braider_profiles_user_id_fkey (
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(6)
      
      if (error) {
        console.error('Error loading braiders:', error)
        setFeaturedBraiders([])
      } else {
        setFeaturedBraiders(data || [])
      }
    } catch (error) {
      console.error('Error loading braiders:', error)
      setFeaturedBraiders([])
    } finally {
      setLoading(false)
    }
  }

  const loadGalleryImages = async () => {
    try {
      setGalleryLoading(true)
      
      // Use the new service function to get gallery images
      const galleryData = await supabaseDB.getGalleryImages(12)
      
      if (galleryData && galleryData.length > 0) {
        setGalleryImages(galleryData)
      } else {
        // Fallback to static images if no gallery images
        setGalleryImages(getStaticGalleryImages())
      }
    } catch (error) {
      console.error('Error loading gallery:', error)
      setGalleryImages(getStaticGalleryImages())
    } finally {
      setGalleryLoading(false)
    }
  }

  const getStaticGalleryImages = () => {
    return [
      {
        id: 1,
        image_url: '/assets/images/a_Classic_medium-lengt.jpeg',
        caption: 'Classic Medium Length Braids',
        style_category: 'Box Braids',
        braider: { profiles: { full_name: 'Professional Braider' } }
      },
      {
        id: 2,
        image_url: '/assets/images/a_Close-up_of_beautifu.jpeg',
        caption: 'Close-up Beautiful Braids',
        style_category: 'Knotless Braids',
        braider: { profiles: { full_name: 'Professional Braider' } }
      },
      {
        id: 3,
        image_url: '/assets/images/a_Knotless_braids_hair.jpeg',
        caption: 'Knotless Braids Hairstyle',
        style_category: 'Knotless Braids',
        braider: { profiles: { full_name: 'Professional Braider' } }
      },
      {
        id: 4,
        image_url: '/assets/images/a_Long_box_braids_with.jpeg',
        caption: 'Long Box Braids with Beads',
        style_category: 'Box Braids',
        braider: { profiles: { full_name: 'Professional Braider' } }
      },
      {
        id: 5,
        image_url: '/assets/images/a_Long_jumbo_box_braid.jpeg',
        caption: 'Long Jumbo Box Braids',
        style_category: 'Box Braids',
        braider: { profiles: { full_name: 'Professional Braider' } }
      },
      {
        id: 6,
        image_url: '/assets/images/a_Long_knotless_braids.jpeg',
        caption: 'Long Knotless Braids',
        style_category: 'Knotless Braids',
        braider: { profiles: { full_name: 'Professional Braider' } }
      },
      {
        id: 7,
        image_url: '/assets/images/a_Medium_knotless_brai.jpeg',
        caption: 'Medium Knotless Braids',
        style_category: 'Knotless Braids',
        braider: { profiles: { full_name: 'Professional Braider' } }
      },
      {
        id: 8,
        image_url: '/assets/images/a_Portrait_of_Black_fe.jpeg',
        caption: 'Portrait Braid Style',
        style_category: 'Cornrows',
        braider: { profiles: { full_name: 'Professional Braider' } }
      },
      {
        id: 9,
        image_url: '/assets/images/a_Professional_photo_o.jpeg',
        caption: 'Professional Braiding Work',
        style_category: 'Box Braids',
        braider: { profiles: { full_name: 'Professional Braider' } }
      }
    ]
  }

  const styles = [
    { name: 'Box Braids', icon: 'fa-crown', path: '/customer/browse?style=box-braids' },
    { name: 'Knotless', icon: 'fa-star', path: '/customer/browse?style=knotless' },
    { name: 'Kids Braids', icon: 'fa-child', path: '/customer/browse?style=kids' },
    { name: 'Cornrows', icon: 'fa-gem', path: '/customer/browse?style=cornrows' },
    { name: 'Twists', icon: 'fa-magic', path: '/customer/browse?style=twists' },
    { name: 'More', icon: 'fa-ellipsis-h', path: '/customer/browse' }
  ]

  const handleViewProfile = (braiderId) => {
    console.log('Viewing braider profile:', braiderId)
    navigate(`/braider/view/${braiderId}`)
  }

  const handleBrowseAll = () => {
    console.log('Browsing all braiders')
    navigate('/customer/browse')
  }

  const handleLocationSelect = (location) => {
    console.log('Location selected:', location)
    // Filter braiders by location
    navigate(`/customer/browse?location=${encodeURIComponent(location)}`)
  }

  const handleStyleClick = (path) => {
    console.log('Navigating to style:', path)
    navigate(path)
  }

  return (
    <div className="dashboard-page">
      <AnimatedBackground opacity={0.12} speed={5000} />
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.fullName}!</h1>
            <p>Find your next perfect style</p>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <LocationSearch 
              onLocationSelect={handleLocationSelect}
              placeholder="Enter city or zip code"
            />
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search style or braider..." 
                className="search-input"
                onFocus={handleBrowseAll}
              />
            </div>
          </div>

          {/* Popular Styles */}
          <section className="styles-section">
            <h2>Popular Styles</h2>
            <div className="styles-grid">
              {styles.map((style, idx) => (
                <div 
                  key={idx} 
                  className="style-card"
                  onClick={() => handleStyleClick(style.path)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className={`fas ${style.icon}`}></i>
                  <p>{style.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Hairstyle Gallery */}
          <section className="gallery-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Hairstyle Gallery</h2>
              <button className="btn btn-secondary" onClick={handleBrowseAll}>
                View More Styles
              </button>
            </div>
            {galleryLoading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading gallery...</p>
              </div>
            ) : (
              <div className="gallery-grid">
                {galleryImages.map((image) => (
                  <div key={image.id} className="gallery-item">
                    <div className="gallery-image">
                      <img 
                        src={image.image_url} 
                        alt={image.caption || 'Hairstyle'} 
                        onError={(e) => e.target.src = '/assets/images/braidly-logo.png'}
                      />
                      <div className="gallery-overlay">
                        <span className="gallery-category">{image.style_category}</span>
                        <span className="gallery-braider">
                          <i className="fas fa-user"></i>
                          {image.braider?.profiles?.full_name || 'Professional Braider'}
                        </span>
                      </div>
                    </div>
                    <div className="gallery-info">
                      <p className="gallery-caption">{image.caption || 'Beautiful Hairstyle'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Featured Braiders */}
          <section className="braiders-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Featured Braiders Near You</h2>
              <button className="btn btn-secondary" onClick={handleBrowseAll}>
                View All
              </button>
            </div>
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading braiders...</p>
              </div>
            ) : featuredBraiders.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-users"></i>
                <p>No braiders available yet. Check back soon!</p>
                <button className="btn btn-primary" onClick={handleBrowseAll}>
                  Browse All
                </button>
              </div>
            ) : (
              <div className="braiders-grid">
                {featuredBraiders.map((braider) => (
                  <div key={braider.id} className="braider-card">
                    <div className="braider-image">
                      <img 
                        src={braider.profiles?.avatar_url || '/assets/images/braidly-logo.png'} 
                        alt={braider.profiles?.full_name || 'Braider'} 
                        onError={(e) => e.target.src = '/assets/images/braidly-logo.png'}
                      />
                      {braider.verification_status !== 'unverified' && (
                        <span className="badge-verified">
                          <i className="fas fa-check-circle"></i>
                        </span>
                      )}
                      <button className="btn-favorite">
                        <i className="far fa-heart"></i>
                      </button>
                    </div>
                    <div className="braider-info">
                      <h3>{braider.profiles?.full_name || 'Professional Braider'}</h3>
                      <div className="rating">
                        <i className="fas fa-star"></i>
                        <span>{braider.rating || 5.0} ({braider.total_reviews || 0})</span>
                      </div>
                      <p className="location">
                        <i className="fas fa-map-marker-alt"></i>
                        {braider.city || 'Location not set'}
                      </p>
                      <div className="braider-footer">
                        <span className="price">From ${braider.base_price || 100}</span>
                        {braider.mobile_service && (
                          <span className="badge badge-success">Mobile</span>
                        )}
                        {braider.salon_service && (
                          <span className="badge badge-secondary">Salon</span>
                        )}
                      </div>
                      <button 
                        className="btn btn-primary btn-block mt-2"
                        onClick={() => handleViewProfile(braider.id)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* WhatsApp Chat Button */}
      <div className="whatsapp-chat">
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          <i className="fab fa-whatsapp"></i>
          <span>Chat with Admin</span>
        </a>
      </div>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}