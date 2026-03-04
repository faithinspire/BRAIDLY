import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useProfile } from '../auth/ProfileContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { uploadAvatar } from '../services/uploadService'
import { braiderProfileSchema } from '../schemas/validationSchemas'
import { useFormValidation } from '../hooks/useFormValidation'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/Button'
import FormField from '../components/FormField'
import '../../css/design-system.css'
import '../../css/animated-background.css'

export default function BraiderProfile() {
  const { user } = useAuth()
  const { braiderProfile, updateBraiderProfile, loadBraiderProfile } = useProfile()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')
  const [uploadError, setUploadError] = useState('')

  const initialValues = {
    business_name: '',
    bio: '',
    phone: '',
    city: '',
    state: '',
    zip_code: '',
    address: '',
    base_price: 100,
    travel_radius: 10,
    mobile_service: true,
    salon_service: false,
    salon_name: '',
    salon_address: '',
    avatar_url: ''
  }

  const { 
    values, 
    errors, 
    touched, 
    isSubmitting, 
    submitError,
    handleChange, 
    handleBlur, 
    handleSubmit,
    getFieldProps,
    getFieldError,
    setValues
  } = useFormValidation(initialValues, braiderProfileSchema, handleSaveProfile)

  useEffect(() => {
    if (user?.id) {
      loadBraiderProfile(user.id).then(() => {
        setLoading(false)
      }).catch((error) => {
        console.error('Failed to load profile:', error)
        setLoading(false)
      })
    }
  }, [user?.id, loadBraiderProfile])

  // Update form values when profile loads
  useEffect(() => {
    if (braiderProfile) {
      setValues({
        business_name: braiderProfile.business_name || '',
        bio: braiderProfile.bio || '',
        phone: braiderProfile.phone || '',
        city: braiderProfile.city || '',
        state: braiderProfile.state || '',
        zip_code: braiderProfile.zip_code || '',
        address: braiderProfile.address || '',
        base_price: braiderProfile.base_price || 100,
        travel_radius: braiderProfile.travel_radius || 10,
        mobile_service: braiderProfile.mobile_service !== false,
        salon_service: braiderProfile.salon_service === true,
        salon_name: braiderProfile.salon_name || '',
        salon_address: braiderProfile.salon_address || '',
        avatar_url: braiderProfile.avatar_url || ''
      })
    }
  }, [braiderProfile, setValues])

  async function handleSaveProfile(validatedData) {
    try {
      await updateBraiderProfile(user.id, {
        business_name: validatedData.business_name,
        bio: validatedData.bio,
        phone: validatedData.phone,
        city: validatedData.city,
        state: validatedData.state,
        zip_code: validatedData.zip_code,
        address: validatedData.address,
        base_price: validatedData.base_price,
        travel_radius: validatedData.travel_radius,
        mobile_service: validatedData.mobile_service,
        salon_service: validatedData.salon_service,
        salon_name: validatedData.salon_name,
        salon_address: validatedData.salon_address
      })

      setSuccessMessage('✅ Profile saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Save error:', error)
      throw new Error(`Failed to save profile: ${error.message}`)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadProgress(0)
      setUploadError('')

      const filePath = `${user.id}/avatar.png`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update both profiles and braider_profiles tables
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id)

      if (profileUpdateError) {
        console.warn('Warning updating profiles table:', profileUpdateError)
      }

      const { error: braiderUpdateError } = await supabase
        .from('braider_profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user.id)

      if (braiderUpdateError) {
        console.warn('Warning updating braider_profiles table:', braiderUpdateError)
      }

      setValues(prev => ({ ...prev, avatar_url: data.publicUrl }))
      setSuccessMessage('✅ Avatar uploaded successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(`❌ Failed to save avatar: ${error.message}`)
    } finally {
      setUploadProgress(0)
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

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <h1>My Braider Profile</h1>
            <p>Complete your profile so customers can find you</p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            {submitError && (
              <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
                {submitError}
              </div>
            )}

            {/* Avatar Section */}
            <section className="dashboard-section" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <img 
                  src={values.avatar_url || '/assets/images/braidly-logo.png'} 
                  alt="Avatar"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--color-primary-600)'
                  }}
                />
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ marginBottom: '1rem', width: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--color-neutral-200)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-primary-600), var(--color-primary-700))',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
              <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                <i className="fas fa-camera"></i> Upload Avatar
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload}
                  disabled={isSubmitting}
                  style={{ display: 'none' }}
                />
              </label>
            </section>

            {/* Profile Form */}
            <form onSubmit={handleSubmit}>
              <section className="dashboard-section">
                <h2>Business Information</h2>
                
                <FormField
                  label="Business Name"
                  name="business_name"
                  type="text"
                  placeholder="Your business name"
                  required
                  {...getFieldProps('business_name')}
                  error={getFieldError('business_name')}
                  touched={touched.business_name}
                  icon={<i className="fas fa-store"></i>}
                />

                <FormField
                  label="Bio"
                  name="bio"
                  type="textarea"
                  placeholder="Tell customers about yourself and your services"
                  required
                  rows={4}
                  maxLength={500}
                  {...getFieldProps('bio')}
                  error={getFieldError('bio')}
                  touched={touched.bio}
                  hint="Describe your experience, specialties, and what makes you unique"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    required
                    {...getFieldProps('phone')}
                    error={getFieldError('phone')}
                    touched={touched.phone}
                    icon={<i className="fas fa-phone"></i>}
                  />
                  <FormField
                    label="Base Price ($)"
                    name="base_price"
                    type="number"
                    placeholder="100"
                    required
                    min="10"
                    max="500"
                    step="10"
                    {...getFieldProps('base_price')}
                    error={getFieldError('base_price')}
                    touched={touched.base_price}
                    icon={<i className="fas fa-dollar-sign"></i>}
                  />
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Location</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <FormField
                    label="City"
                    name="city"
                    type="text"
                    placeholder="New York"
                    required
                    {...getFieldProps('city')}
                    error={getFieldError('city')}
                    touched={touched.city}
                    icon={<i className="fas fa-map-marker-alt"></i>}
                  />
                  <FormField
                    label="State"
                    name="state"
                    type="text"
                    placeholder="NY"
                    required
                    {...getFieldProps('state')}
                    error={getFieldError('state')}
                    touched={touched.state}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <FormField
                    label="Zip Code"
                    name="zip_code"
                    type="text"
                    placeholder="10001"
                    required
                    {...getFieldProps('zip_code')}
                    error={getFieldError('zip_code')}
                    touched={touched.zip_code}
                  />
                  <FormField
                    label="Travel Radius (miles)"
                    name="travel_radius"
                    type="number"
                    placeholder="10"
                    required
                    min="0"
                    max="100"
                    step="1"
                    {...getFieldProps('travel_radius')}
                    error={getFieldError('travel_radius')}
                    touched={touched.travel_radius}
                    icon={<i className="fas fa-road"></i>}
                  />
                </div>

                <FormField
                  label="Address"
                  name="address"
                  type="text"
                  placeholder="123 Main Street"
                  required
                  {...getFieldProps('address')}
                  error={getFieldError('address')}
                  touched={touched.address}
                  icon={<i className="fas fa-home"></i>}
                />

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Services</h3>

                <div style={{ marginBottom: '1rem' }}>
                  <FormField
                    label="Mobile Service (I come to customers)"
                    name="mobile_service"
                    type="checkbox"
                    {...getFieldProps('mobile_service')}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <FormField
                    label="Salon Service (Customers come to me)"
                    name="salon_service"
                    type="checkbox"
                    {...getFieldProps('salon_service')}
                  />
                </div>

                {values.salon_service && (
                  <>
                    <FormField
                      label="Salon Name"
                      name="salon_name"
                      type="text"
                      placeholder="Your salon name"
                      {...getFieldProps('salon_name')}
                      error={getFieldError('salon_name')}
                      touched={touched.salon_name}
                      icon={<i className="fas fa-spa"></i>}
                    />

                    <FormField
                      label="Salon Address"
                      name="salon_address"
                      type="text"
                      placeholder="Salon address"
                      {...getFieldProps('salon_address')}
                      error={getFieldError('salon_address')}
                      touched={touched.salon_address}
                      icon={<i className="fas fa-map-pin"></i>}
                    />
                  </>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      flex: '1 1 auto',
                      minWidth: '150px',
                      padding: '0.75rem 2rem',
                      height: '48px',
                      background: 'linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-save"></i>
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                  </button>
                  <Button 
                    variant="secondary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    onClick={() => navigate('/braider/dashboard')}
                    icon="fas fa-arrow-left"
                  >
                    Back
                  </Button>
                </div>
              </section>
            </form>
          </div>
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
