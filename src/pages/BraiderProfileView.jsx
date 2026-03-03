import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import '../../css/design-system.css'
import '../../css/blur-braids-background.css'

export default function BraiderProfileView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [braider, setBraider] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadBraiderProfile()
    }
  }, [id])

  const loadBraiderProfile = async () => {
    try {
      setLoading(true)
      
      // Get braider profile
      const { data: braiderData, error: braiderError } = await supabase
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
        .eq('id', id)
        .single()
      
      if (braiderError) {
        console.error('Error loading braider:', braiderError)
        return
      }

      setBraider(braiderData)

      // Get portfolio images
      const { data: portfolioData } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('braider_id', id)
        .order('created_at', { ascending: false })
        .limit(12)

      setPortfolio(portfolioData || [])

      // Get reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          customer:profiles!reviews_customer_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('braider_id', id)
        .order('created_at', { ascending: false })
        .limit(10)

      setReviews(reviewsData || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!braider) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <div className="container">
            <div className="empty-state">
              <i className="fas fa-user-slash"></i>
              <p>Braider not found</p>
              <button className="btn btn-primary" onClick={() => navigate('/customer/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          {/* Header */}
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate(-1)}
            style={{ marginBottom: '1.5rem' }}
          >
            <i className="fas fa-arrow-left"></i> Back
          </button>

          {/* Profile Card */}
          <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Avatar */}
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={braider.avatar_url || braider.profiles?.avatar_url || '/assets/images/braidly-logo.png'} 
                  alt={braider.profiles?.full_name}
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '3px solid var(--purple-accent)',
                    marginBottom: '1rem'
                  }}
                />
                {braider.verification_status === 'verified' && (
                  <div style={{ color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: '600' }}>
                    <i className="fas fa-check-circle"></i> Verified
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h1 style={{ marginBottom: '0.5rem' }}>{braider.profiles?.full_name || 'Professional Braider'}</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{braider.business_name}</p>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-star" style={{ color: 'var(--accent-amber)' }}></i>
                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{braider.rating || 5.0}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>({braider.total_reviews || 0} reviews)</span>
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>•</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{braider.total_bookings || 0} bookings</span>
                </div>

                {/* Bio */}
                <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{braider.bio || 'Professional braiding services'}</p>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Base Price</p>
                    <p style={{ fontWeight: '600', fontSize: '1.2rem' }}>${braider.base_price || 100}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Travel Radius</p>
                    <p style={{ fontWeight: '600', fontSize: '1.2rem' }}>{braider.travel_radius || 10} miles</p>
                  </div>
                </div>

                {/* Location */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Location</p>
                  <p style={{ fontWeight: '500' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem' }}></i>
                    {braider.city}, {braider.state} {braider.zip_code}
                  </p>
                </div>

                {/* Services */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  {braider.mobile_service && (
                    <span className="badge" style={{ background: 'var(--accent-green)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                      <i className="fas fa-car"></i> Mobile Service
                    </span>
                  )}
                  {braider.salon_service && (
                    <span className="badge" style={{ background: 'var(--accent-blue)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                      <i className="fas fa-store"></i> Salon Service
                    </span>
                  )}
                </div>

                {/* Contact */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href={`tel:${braider.phone || braider.profiles?.phone}`} className="btn btn-primary">
                    <i className="fas fa-phone"></i> Call
                  </a>
                  <a href={`mailto:${braider.profiles?.email}`} className="btn btn-secondary">
                    <i className="fas fa-envelope"></i> Email
                  </a>
                  <a 
                    href={`https://wa.me/${(braider.phone || braider.profiles?.phone || '').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ background: '#25D366', color: 'white', border: 'none' }}
                  >
                    <i className="fab fa-whatsapp"></i> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio */}
          {portfolio.length > 0 && (
            <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Portfolio</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {portfolio.map(image => (
                  <div key={image.id} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <img 
                      src={image.image_url} 
                      alt={image.caption}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(image.image_url, '_blank')}
                    />
                    <div style={{ padding: '0.75rem', background: 'var(--bg-card)' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.9rem' }}>{image.style_category}</p>
                      <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{image.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <section className="dashboard-section">
              <h2 style={{ marginBottom: '1.5rem' }}>Customer Reviews</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map(review => (
                  <div key={review.id} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <img 
                        src={review.customer?.avatar_url || '/assets/images/braidly-logo.png'} 
                        alt={review.customer?.full_name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <div>
                        <p style={{ margin: '0', fontWeight: '600' }}>{review.customer?.full_name}</p>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i}
                              className={`fas fa-star`}
                              style={{ color: i < review.rating ? 'var(--accent-amber)' : '#ddd', fontSize: '0.8rem' }}
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p style={{ margin: '0', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
