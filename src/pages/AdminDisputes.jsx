import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './SoftTheme.css'

export default function AdminDisputes() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDisputes()
  }, [])

  const loadDisputes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (full_name),
          braider:braider_id (user_id)
        `)
        .eq('status', 'cancelled')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setDisputes(data || [])
    } catch (error) {
      console.error('Error loading disputes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (id) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'resolved' })
        .eq('id', id)
      
      if (error) throw error
      alert(`✅ Dispute marked as resolved`)
      loadDisputes()
    } catch (error) {
      console.error('Error resolving dispute:', error)
      alert('Error resolving dispute')
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Dispute Management</h1>
              <p>Review and resolve customer disputes</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
          </div>

          <div className="dashboard-section">
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading disputes...</p>
              </div>
            ) : disputes.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-check-circle"></i>
                <p>No active disputes</p>
              </div>
            ) : (
              <div className="disputes-list">
                {disputes.map((dispute) => (
                  <div key={dispute.id} className="dispute-card">
                    <div className="dispute-header">
                      <h4>Dispute #{dispute.id}</h4>
                      <span className={`status-badge status-${dispute.status}`}>{dispute.status}</span>
                    </div>
                    <div className="dispute-details">
                      <p><strong>Customer:</strong> {dispute.customer?.full_name || 'N/A'}</p>
                      <p><strong>Braider:</strong> {dispute.braider?.full_name || 'N/A'}</p>
                      <p><strong>Reason:</strong> {dispute.notes || 'No reason provided'}</p>
                      <p><strong>Amount:</strong> ${dispute.price || 0}</p>
                      <p><strong>Date:</strong> {new Date(dispute.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="dispute-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleResolve(dispute.id)}>
                        <i className="fas fa-check"></i> Resolve
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
