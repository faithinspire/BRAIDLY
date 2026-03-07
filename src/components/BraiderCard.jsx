export default function BraiderCard({ braider, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(0)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Portfolio Preview or Avatar */}
      <div
        style={{
          width: '100%',
          height: '200px',
          background: 'linear-gradient(135deg, #7e22ce 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '3rem',
          fontWeight: 'bold',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {braider.portfolio && braider.portfolio.length > 0 ? (
          <>
            <img
              src={braider.portfolio[0].data}
              alt={braider.full_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {braider.portfolioCount > 1 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
              }}>
                +{braider.portfolioCount - 1} more
              </div>
            )}
          </>
        ) : (
          braider.full_name?.charAt(0).toUpperCase()
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.2rem' }}>
          {braider.full_name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ color: '#fbbf24', marginRight: '0.5rem' }}>★</span>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            {(braider.rating || 0).toFixed(1)} rating
          </span>
        </div>

        {braider.location && (
          <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
            📍 {braider.location}
          </p>
        )}

        {braider.style && (
          <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
            💇 {braider.style}
          </p>
        )}

        {braider.portfolioCount > 0 && (
          <p style={{ margin: '0.5rem 0', color: '#7e22ce', fontSize: '0.9rem', fontWeight: '600' }}>
            📸 {braider.portfolioCount} portfolio images
          </p>
        )}

        {braider.price && (
          <p style={{ margin: '0.75rem 0 0 0', color: '#7e22ce', fontWeight: '600', fontSize: '1rem' }}>
            ${Math.round(braider.price)}/session
          </p>
        )}
      </div>
    </div>
  )
}
