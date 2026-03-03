import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../services/supabase'
import { uploadPortfolioImage } from '../services/uploadService'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import '../../css/design-system.css'
import '../../css/animated-background.css'

export default function BraiderPortfolio() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const [portfolio, setPortfolio] = useState([])

  const styles = ['all', 'Box Braids', 'Knotless Braids', 'Cornrows', 'Twists', 'Kids Braids']

  useEffect(() => {
    if (user?.id) {
      loadPortfolio()
    }
  }, [user?.id])

  const loadPortfolio = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      
      // Get braider profile id first
      const { data: braiderProfile, error: braiderError } = await supabase
        .from('braider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      if (braiderError) {
        console.error('Error loading braider profile:', braiderError)
        setPortfolio([])
        return
      }

      // Get portfolio images
      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('braider_id', braiderProfile.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error loading portfolio:', error)
        setPortfolio([])
      } else {
        setPortfolio(data || [])
      }
    } catch (error) {
      console.error('Error loading portfolio:', error)
      setPortfolio([])
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const filteredPortfolio = selectedStyle === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.style_category === selectedStyle)

  const handleUploadPhoto = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return
      
      setUploading(true)
      setUploadError('')
      setSuccessMessage('')
      
      try {
        // Get braider profile ID
        const { data: braiderProfile, error: profileError } = await supabase
          .from('braider_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (profileError || !braiderProfile) {
          throw new Error('Braider profile not found')
        }

        let successCount = 0
        let errorCount = 0
        
        for (const file of files) {
          try {
            const result = await uploadPortfolioImage(
              user.id,
              file,
              file.name.split('.')[0] || 'Portfolio image',
              selectedStyle === 'all' ? 'Box Braids' : selectedStyle,
              (progress) => {
                console.log(`Upload progress: ${progress}%`)
              }
            )
            
            if (result.success) {
              // Save to database
              const { error: saveError } = await supabase
                .from('portfolio_images')
                .insert({
                  braider_id: braiderProfile.id,
                  image_url: result.url,
                  caption: result.caption,
                  style_category: result.category
                })

              if (!saveError) {
                successCount++
              } else {
                errorCount++
              }
            } else {
              errorCount++
            }
          } catch (fileError) {
            console.error('File upload error:', fileError)
            errorCount++
          }
        }
        
        if (successCount > 0) {
          setSuccessMessage(`✅ Successfully uploaded ${successCount} photo(s)!${errorCount > 0 ? ` (${errorCount} failed)` : ''}`)
          setTimeout(() => setSuccessMessage(''), 3000)
          loadPortfolio()
        } else {
          setUploadError('❌ Failed to upload photos')
        }
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError(`❌ Upload failed: ${error.message}`)
      } finally {
        setUploading(false)
      }
    }
    
    input.click()
  }

  const handleDeletePhoto = async (id) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        // Delete from database
        const { error } = await supabase
          .from('portfolio_images')
          .delete()
          .eq('id', id)
        
        if (error) {
          console.error('Delete error:', error)
          throw error
        }
        
        // Remove from local state
        setPortfolio(prev => prev.filter(item => item.id !== id))
        
        alert('✅ Photo deleted successfully!')
      } catch (error) {
        console.error('Error deleting photo:', error)
        alert('❌ Failed to delete photo. Please try again.')
      }
    }
  }

  const handleEditPhoto = (id) => {
    console.log('Edit photo:', id)
    alert('Edit photo feature will be implemented in the next update.')
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading portfolio...</p>
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
          <div className="dashboard-header">
            <div>
              <h1>Portfolio Management</h1>
              <p>Showcase your best work</p>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-primary" 
                onClick={handleUploadPhoto}
                disabled={uploading}
              >
                <i className="fas fa-upload"></i>
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/braider/dashboard')}>
                <i className="fas fa-arrow-left"></i>
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid-3">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-images"></i>
              </div>
              <div className="stat-info">
                <h3>{portfolio.length}</h3>
                <p>Total Photos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-heart"></i>
              </div>
              <div className="stat-info">
                <h3>{portfolio.reduce((sum, item) => sum + (item.likes || 0), 0)}</h3>
                <p>Total Likes</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-eye"></i>
              </div>
              <div className="stat-info">
                <h3>{portfolio.reduce((sum, item) => sum + (item.views || 0), 0)}</h3>
                <p>Profile Views</p>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              {successMessage}
            </div>
          )}
          {uploadError && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              {uploadError}
            </div>
          )}

          {/* Filters */}
          <div className="portfolio-filters">
            <div className="style-filters">
              {styles.map((style) => (
                <button
                  key={style}
                  className={`filter-btn ${selectedStyle === style ? 'active' : ''}`}
                  onClick={() => setSelectedStyle(style)}
                >
                  {style === 'all' ? 'All Styles' : style}
                </button>
              ))}
            </div>
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>

          {/* Portfolio Grid */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Your Portfolio</h2>
              <p>{filteredPortfolio.length} photos</p>
            </div>
            {filteredPortfolio.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-images"></i>
                <p>No portfolio images yet. Upload your first photo!</p>
                <button 
                  className="btn btn-primary" 
                  onClick={handleUploadPhoto}
                  disabled={uploading}
                >
                  <i className="fas fa-upload"></i>
                  {uploading ? 'Uploading...' : 'Upload Photos'}
                </button>
              </div>
            ) : (
              <div className={`portfolio-${viewMode}`}>
                {filteredPortfolio.map((item) => (
                  <div key={item.id} className="portfolio-item">
                    <div className="portfolio-image">
                      <img 
                        src={item.image_url || '/assets/images/braidly-logo.png'} 
                        alt={item.caption || 'Portfolio image'} 
                        onError={(e) => e.target.src = '/assets/images/braidly-logo.png'}
                      />
                      <div className="portfolio-overlay">
                        <button className="overlay-btn" onClick={() => handleEditPhoto(item.id)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="overlay-btn" onClick={() => handleDeletePhoto(item.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="portfolio-info">
                      <div className="portfolio-header">
                        <h4>{item.style_category || 'Uncategorized'}</h4>
                        <span className="portfolio-likes">
                          <i className="fas fa-heart"></i>
                          {item.likes || 0}
                        </span>
                      </div>
                      <p className="portfolio-description">{item.caption || 'No description'}</p>
                      <p className="portfolio-date">
                        <i className="fas fa-calendar"></i>
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Upload Tips */}
          <section className="dashboard-section">
            <div className="tips-card">
              <h3>
                <i className="fas fa-lightbulb"></i>
                Portfolio Tips
              </h3>
              <ul className="tips-list">
                <li>
                  <i className="fas fa-check"></i>
                  Use high-quality, well-lit photos
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Show different angles and styles
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Add detailed descriptions
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Update regularly with new work
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Tag styles correctly for better visibility
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}