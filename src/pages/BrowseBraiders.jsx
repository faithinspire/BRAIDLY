import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dbService } from '../services/supabaseClient'
import BraiderCard from '../components/BraiderCard'
import PageLayout from '../components/PageLayout'

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
]

export default function BrowseBraiders() {
  const navigate = useNavigate()
  const [braiders, setBraiders] = useState([])
  const [filteredBraiders, setFilteredBraiders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    location: '',
    rating: '',
    style: '',
  })

  useEffect(() => {
    loadBraiders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [braiders, filters])

  const loadBraiders = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await dbService.supabase
        .from('braiders')
        .select('*')
      if (fetchError) throw fetchError
      setBraiders(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = braiders

    if (filters.location) {
      filtered = filtered.filter(b => b.location?.includes(filters.location))
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter(b => (b.rating || 0) >= minRating)
    }

    if (filters.style) {
      filtered = filtered.filter(b => b.style?.toLowerCase().includes(filters.style.toLowerCase()))
    }

    setFilteredBraiders(filtered)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleBraiderClick = (braider) => {
    navigate(`/braider/${braider.id}`, { state: { braider } })
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              background: 'linear-gradient(135deg, #7e22ce, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 0.5rem 0'
            }}>
              Browse Braiders
            </h1>
            <p style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>
              Find the perfect braider for your style
            </p>
          </div>

          {/* Filters */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Location
              </label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                }}
              >
                <option value="">All Locations</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Minimum Rating
              </label>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                }}
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Style
              </label>
              <input
                type="text"
                name="style"
                placeholder="e.g., Box Braids"
                value={filters.style}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fee', color: '#c33', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
              Loading braiders...
            </div>
          )}

          {/* Results */}
          {!loading && filteredBraiders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
              No braiders found. Try adjusting your filters.
            </div>
          )}

          {/* Grid */}
          {!loading && filteredBraiders.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {filteredBraiders.map(braider => (
                <BraiderCard
                  key={braider.id}
                  braider={braider}
                  onClick={() => handleBraiderClick(braider)}
                />
              ))}
            </div>
          )}
        </div>
    </PageLayout>
  )
}
