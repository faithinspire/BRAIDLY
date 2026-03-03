import { useState, useEffect, useRef } from 'react'
import { supabase } from '../services/supabase'

const US_CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
  'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
  'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
  'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
  'Mesa, AZ', 'Kansas City, MO', 'Atlanta, GA', 'Long Beach, CA', 'Omaha, NE',
  'Raleigh, NC', 'Miami, FL', 'Virginia Beach, VA', 'Oakland, CA', 'Minneapolis, MN',
  'Tulsa, OK', 'Arlington, TX', 'New Orleans, LA', 'Wichita, KS', 'Cleveland, OH'
]

export default function LocationSearch({ onLocationSelect, placeholder = "Enter your location" }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [braiderLocations, setBraiderLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    loadBraiderLocations()
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadBraiderLocations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('braider_profiles')
        .select('city, state')
        .eq('is_active', true)
        .not('city', 'is', null)
        .not('state', 'is', null)
      
      if (error) {
        console.error('Error loading braider locations:', error)
        return
      }

      // Get unique city/state combinations
      const uniqueLocations = [...new Set(
        data
          .filter(item => item.city && item.state)
          .map(item => `${item.city}, ${item.state}`)
      )]
      
      setBraiderLocations(uniqueLocations)
    } catch (error) {
      console.error('Error loading locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim() === '') {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Combine US cities and braider locations
    const allLocations = [...new Set([...US_CITIES, ...braiderLocations])]
    
    const filtered = allLocations.filter(location =>
      location.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10) // Limit to 10 suggestions

    setSuggestions(filtered)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (location) => {
    setQuery(location)
    setShowSuggestions(false)
    if (onLocationSelect) {
      onLocationSelect(location)
    }
  }

  const handleInputFocus = () => {
    if (query.trim() === '') {
      // Show popular locations when empty
      setSuggestions([...US_CITIES.slice(0, 5), ...braiderLocations.slice(0, 5)])
      setShowSuggestions(true)
    } else {
      handleInputChange({ target: { value: query } })
    }
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowSuggestions(false)
      if (onLocationSelect) {
        onLocationSelect(query)
      }
    }
  }

  return (
    <div className="location-search-wrapper" ref={wrapperRef}>
      <div className="search-bar">
        <i className="fas fa-map-marker-alt"></i>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="search-input"
          autoComplete="off"
        />
        {loading && (
          <i className="fas fa-spinner fa-spin" style={{ marginLeft: '10px' }}></i>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          <div className="suggestions-header">
            <small>Select a location</small>
          </div>
          {suggestions.map((location, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(location)}
            >
              <i className="fas fa-map-marker-alt"></i>
              <span>{location}</span>
              {braiderLocations.includes(location) && (
                <span className="badge badge-success badge-sm">Braiders Available</span>
              )}
            </div>
          ))}
          {suggestions.length === 0 && query && (
            <div className="suggestion-item no-results">
              <i className="fas fa-search"></i>
              <span>No locations found for "{query}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}