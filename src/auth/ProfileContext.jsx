import { createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '../services/supabase'

const ProfileContext = createContext(null)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider')
  }
  return context
}

export const ProfileProvider = ({ children }) => {
  const [braiderProfile, setBraiderProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const loadBraiderProfile = useCallback(async (userId) => {
    if (!userId) return
    
    try {
      setProfileLoading(true)
      const { data, error } = await supabase
        .from('braider_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
      } else if (data) {
        setBraiderProfile(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  const updateBraiderProfile = useCallback(async (userId, profileData) => {
    if (!userId) return

    try {
      setProfileLoading(true)

      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('braider_profiles')
        .select('id')
        .eq('user_id', userId)
        .single()

      let error

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('braider_profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
        error = updateError
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('braider_profiles')
          .insert({
            user_id: userId,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        error = insertError
      }

      if (error) {
        throw new Error(error.message || 'Failed to save profile')
      }

      // Reload profile to confirm save
      await loadBraiderProfile(userId)
      return true
    } catch (error) {
      console.error('Update error:', error)
      throw error
    } finally {
      setProfileLoading(false)
    }
  }, [loadBraiderProfile])

  const value = {
    braiderProfile,
    profileLoading,
    loadBraiderProfile,
    updateBraiderProfile
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}
