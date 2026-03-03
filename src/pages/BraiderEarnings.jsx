import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { supabaseDB } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import '../../css/design-system.css'

export default function BraiderEarnings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('month')
  const [loading, setLoading] = useState(true)
  
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    thisWeek: 0,
    pendingPayout: 0,
    nextPayout: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completedBookings: 0,
    averageBooking: 0
  })

  const [transactions, setTransactions] = useState([])

  const [payoutMethod] = useState({
    type: 'bank',
    bankName: 'Bank Account',
    accountLast4: '****',
    verified: false
  })

  useEffect(() => {
    loadEarningsData()
  }, [user])

  const loadEarningsData = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      
      // Load earnings stats
      const stats = await supabaseDB.getBraiderEarningsStats(user.id)
      setEarnings(prev => ({
        ...prev,
        ...stats
      }))
      
      // Load transaction history
      const earningsData = await supabaseDB.getBraiderEarnings(user.id)
      setTransactions(earningsData.map(booking => ({
        id: booking.id,
        customer: booking.customer?.full_name || 'Customer',
        service: booking.service?.name || 'Service',
        date: booking.created_at,
        amount: booking.price || 0,
        status: booking.status,
        payoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })))
      
    } catch (error) {
      console.error('Error loading earnings:', error)
      alert('Error loading earnings. Please check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestPayout = () => {
    if (earnings.pendingPayout === 0) {
      alert('No funds available for payout')
      return
    }
    alert('Payout request submitted! Funds will be transferred on ' + earnings.nextPayout)
  }

  const handleUpdatePayoutMethod = () => {
    alert('Update payout method feature coming soon!')
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading earnings...</p>
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
              <h1>Earnings & Payouts</h1>
              <p>Track your income and manage payouts</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/braider/dashboard')}>
              <i className="fas fa-arrow-left"></i>
              Back to Dashboard
            </button>
          </div>

          {/* Earnings Summary */}
          <div className="stats-grid-4">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="stat-info">
                <h3>${earnings.totalEarnings.toLocaleString()}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
            <div className="stat-card stat-card-success">
              <div className="stat-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-info">
                <h3>${earnings.thisMonth.toLocaleString()}</h3>
                <p>This Month</p>
              </div>
            </div>
            <div className="stat-card stat-card-warning">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <h3>${earnings.pendingPayout.toLocaleString()}</h3>
                <p>Pending Payout</p>
              </div>
            </div>
            <div className="stat-card stat-card-info">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-info">
                <h3>${earnings.averageBooking}</h3>
                <p>Avg per Booking</p>
              </div>
            </div>
          </div>

          {/* Payout Info */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Next Payout</h2>
            </div>
            <div className="payout-card">
              <div className="payout-info">
                <div className="payout-amount">
                  <h3>${earnings.pendingPayout}</h3>
                  <p>Available for payout</p>
                </div>
                <div className="payout-date">
                  <i className="fas fa-calendar"></i>
                  <div>
                    <p className="payout-label">Scheduled for</p>
                    <p className="payout-value">{new Date(earnings.nextPayout).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
              <div className="payout-method">
                <div className="method-info">
                  <i className="fas fa-university"></i>
                  <div>
                    <p className="method-label">Payout Method</p>
                    <p className="method-value">{payoutMethod.bankName} ****{payoutMethod.accountLast4}</p>
                    {payoutMethod.verified && (
                      <span className="badge badge-success">
                        <i className="fas fa-check-circle"></i>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleUpdatePayoutMethod}>
                  Update Method
                </button>
              </div>
              <button className="btn btn-primary btn-block" onClick={handleRequestPayout}>
                <i className="fas fa-paper-plane"></i>
                Request Early Payout
              </button>
            </div>
          </section>

          {/* Time Range Filter */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              This Week
            </button>
            <button
              className={`filter-tab ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              This Month
            </button>
            <button
              className={`filter-tab ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              This Year
            </button>
          </div>

          {/* Transaction History */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Transaction History</h2>
              <button className="btn btn-secondary btn-sm">
                <i className="fas fa-download"></i>
                Export
              </button>
            </div>
            <div className="transactions-table">
              {transactions.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-receipt"></i>
                  <p>No transactions yet</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payout Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>{transaction.customer}</td>
                        <td>{transaction.service}</td>
                        <td className="amount">${transaction.amount}</td>
                        <td>
                          <span className={`status-badge status-${transaction.status}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td>{new Date(transaction.payoutDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Earnings Breakdown */}
          <div className="earnings-breakdown">
            <div className="breakdown-card">
              <h3>Earnings Breakdown</h3>
              <div className="breakdown-item">
                <span>Gross Earnings</span>
                <span className="breakdown-value">${earnings.thisMonth}</span>
              </div>
              <div className="breakdown-item">
                <span>Platform Fee (5%)</span>
                <span className="breakdown-value text-danger">-${(earnings.thisMonth * 0.05).toFixed(2)}</span>
              </div>
              <div className="breakdown-item">
                <span>Processing Fee (2.9%)</span>
                <span className="breakdown-value text-danger">-${(earnings.thisMonth * 0.029).toFixed(2)}</span>
              </div>
              <div className="breakdown-item breakdown-total">
                <span>Net Earnings</span>
                <span className="breakdown-value">${(earnings.thisMonth * 0.921).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
