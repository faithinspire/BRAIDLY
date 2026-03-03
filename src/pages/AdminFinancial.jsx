import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabase } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './SoftTheme.css'

export default function AdminFinancial() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    platformFees: 0,
    thisMonthRevenue: 0,
    growth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFinancialData()
  }, [])

  const loadFinancialData = async () => {
    try {
      setLoading(true)
      
      // Get completed bookings
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (full_name),
          braider:braider_id (user_id)
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) throw error
      
      // Calculate stats
      const totalRevenue = bookings?.reduce((sum, b) => sum + (b.price || 0), 0) || 0
      const platformFees = totalRevenue * 0.05 // 5% platform fee
      
      const thisMonth = new Date().getMonth()
      const thisMonthRevenue = bookings?.filter(b => 
        new Date(b.created_at).getMonth() === thisMonth
      ).reduce((sum, b) => sum + (b.price || 0), 0) || 0
      
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
      const lastMonthRevenue = bookings?.filter(b => 
        new Date(b.created_at).getMonth() === lastMonth
      ).reduce((sum, b) => sum + (b.price || 0), 0) || 0
      
      const growth = lastMonthRevenue > 0 
        ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : 0
      
      setStats({
        totalRevenue,
        platformFees,
        thisMonthRevenue,
        growth
      })
      
      setTransactions(bookings || [])
    } catch (error) {
      console.error('Error loading financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Financial Management</h1>
              <p>Track platform revenue and transactions</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading financial data...</p>
            </div>
          ) : (
            <>
              <div className="stats-grid-4">
                <div className="stat-card stat-card-success">
                  <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
                  <div className="stat-info">
                    <h3>${stats.totalRevenue.toLocaleString()}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
                <div className="stat-card stat-card-primary">
                  <div className="stat-icon"><i className="fas fa-coins"></i></div>
                  <div className="stat-info">
                    <h3>${stats.platformFees.toLocaleString()}</h3>
                    <p>Platform Fees</p>
                  </div>
                </div>
                <div className="stat-card stat-card-warning">
                  <div className="stat-icon"><i className="fas fa-calendar"></i></div>
                  <div className="stat-info">
                    <h3>${stats.thisMonthRevenue.toLocaleString()}</h3>
                    <p>This Month</p>
                  </div>
                </div>
                <div className="stat-card stat-card-info">
                  <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
                  <div className="stat-info">
                    <h3>{stats.growth > 0 ? '+' : ''}{stats.growth}%</h3>
                    <p>Growth</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Recent Transactions</h2>
                {transactions.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-receipt"></i>
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="transactions-list">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="transaction-card">
                        <div className="transaction-info">
                          <h4>{transaction.customer?.full_name || 'Customer'} → {transaction.braider?.full_name || 'Braider'}</h4>
                          <p>{new Date(transaction.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="transaction-amount">
                          <p><strong>${transaction.price || 0}</strong></p>
                          <p className="fee">Fee: ${((transaction.price || 0) * 0.05).toFixed(2)}</p>
                        </div>
                        <span className={`status-badge status-${transaction.status}`}>{transaction.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
