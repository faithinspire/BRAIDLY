import { useLocation, useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function BraiderProfile() {
  const location = useLocation()
  const navigate = useNavigate()
  const braider = location.state?.braider

  if (!braider) {
    return (
      <PageLayout>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <h1 style={{ marginBottom: '2rem' }}>Braider Not Found</h1>
          <button
            onClick={() => navigate('/customer/browse')}
            className="btn btn-primary"
            style={{ width: 'auto', padding: '14px 40px' }}
          >
            Back to Browse
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/customer/browse')}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '1rem',
            }}
          >
            ← Back to Browse
          </button>

          {/* Header */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '100%',
                height: '300px',
                background: 'linear-gradient(135deg, #7e22ce 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '5rem',
                fontWeight: 'bold',
              }}
            >
              {braider.avatar_url ? (
                <img
                  src={braider.avatar_url}
                  alt={braider.full_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                braider.full_name?.charAt(0).toUpperCase()
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '2rem' }}>
              <h1 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '2rem' }}>
                {braider.full_name}
              </h1>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Rating</p>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#fbbf24' }}>
                    ★ {braider.rating || 0} ({braider.total_bookings || 0} bookings)
                  </p>
                </div>

                {braider.location && (
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Location</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                      📍 {braider.location}
                    </p>
                  </div>
                )}

                {braider.hourly_rate && (
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Rate</p>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#7e22ce' }}>
                      ${braider.hourly_rate}/hr
                    </p>
                  </div>
                )}
              </div>

              {braider.bio && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>About</h3>
                  <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
                    {braider.bio}
                  </p>
                </div>
              )}

              {braider.style && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Specialty</h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    💇 {braider.style}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #7e22ce 0%, #3b82f6 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                  }}
                >
                  Book Appointment
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#7e22ce',
                    border: '2px solid #7e22ce',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                  }}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>Portfolio</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  style={{
                    background: 'linear-gradient(135deg, #7e22ce 0%, #3b82f6 100%)',
                    borderRadius: '8px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem',
                  }}
                >
                  📸
                </div>
              ))}
            </div>
          </div>
        </div>
    </PageLayout>
  )
}
