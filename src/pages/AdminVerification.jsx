import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './SoftTheme.css'

export default function AdminVerification() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVerifications()
  }, [])

  const loadVerifications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('braider_profiles')
        .select(`
          *,
          profiles!braider_profiles_user_id_fkey (full_name, email, avatar_url)
        `)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setVerifications(data || [])
    } catch (error) {
      console.error('Error loading verifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('braider_profiles')
        .update({ verification_status: 'verified' })
        .eq('id', id)
      
      if (error) throw error
      alert(`✅ Verification approved!`)
      loadVerifications()
    } catch (error) {
      console.error('Error approving:', error)
      alert('Error approving verification')
    }
  }

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection:')
    if (reason) {
      try {
        const { error } = await supabase
          .from('braider_profiles')
          .update({ 
            verification_status: 'rejected'
          })
          .eq('id', id)
        
        if (error) throw error
        alert(`❌ Verification rejected`)
        loadVerifications()
      } catch (error) {
        console.error('Error rejecting:', error)
        alert('Error rejecting verification')
      }
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Braider Verifications</h1>
              <p>Review and approve braider verification requests</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
          </div>

          <div className="dashboard-section">
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading verifications...</p>
              </div>
            ) : verifications.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-check-circle"></i>
                <p>No pending verifications</p>
              </div>
            ) : (
              <div className="verifications-list">
                {verifications.map((verification) => (
                  <div key={verification.id} className="verification-card">
                    <div className="verification-braider">
                      <img 
                        src={verification.profiles?.avatar_url || '/assets/images/braidly-logo.png'} 
                        alt={verification.profiles?.full_name || 'Braider'}
                        onError={(e) => e.target.src = '/assets/images/braidly-logo.png'}
                      />
                      <div>
                        <h4>{verification.profiles?.full_name || 'Braider'}</h4>
                        <p>{verification.profiles?.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="verification-details">
                      <div className="verification-info">
                        <i className="fas fa-calendar"></i>
                        <span>Submitted: {new Date(verification.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="verification-info">
                        <i className="fas fa-file-alt"></i>
                        <span>Pending review</span>
                      </div>
                    </div>
                    <div className="verification-actions">
                      <button className="btn btn-success btn-sm" onClick={() => handleApprove(verification.id)}>
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleReject(verification.id)}>
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
