import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/supabaseClient'
import PageLayout from '../components/PageLayout'
import './WalletPage.css'

export default function WalletPage() {
  const { user, profile } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')

  useEffect(() => {
    if (profile?.role === 'braider') {
      loadWalletData()
    }
  }, [user, profile])

  const loadWalletData = async () => {
    try {
      setLoading(true)
      const { wallet: walletData, error: walletError } = await dbService.getBraiderWallet(user?.id)
      if (walletError) throw new Error(walletError)
      setWallet(walletData)

      const { payments: paymentData, error: paymentError } = await dbService.getPayments(
        user?.id,
        'braider'
      )
      if (paymentError) throw new Error(paymentError)
      setPayments(paymentData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setError('')
      setSuccess('')
      const amount = parseFloat(withdrawAmount)

      const { success: withdrawSuccess, error: withdrawError } = await dbService.withdrawFromWallet(
        user?.id,
        amount
      )
      if (withdrawError) throw new Error(withdrawError)

      setSuccess(`Successfully withdrew $${amount.toFixed(2)} from wallet!`)
      setWithdrawAmount('')
      setShowWithdraw(false)
      loadWalletData()
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981'
      case 'released':
        return '#3b82f6'
      case 'refunded':
        return '#f59e0b'
      case 'disputed':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  if (profile?.role !== 'braider') {
    return (
      <PageLayout>
        <div className="wallet-container">
          <div className="access-denied">
            <h1>Access Denied</h1>
            <p>Only braiders can access the wallet</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="wallet-container">
          <div className="wallet-header">
            <h1>Wallet</h1>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {loading ? (
            <div className="loading">Loading wallet...</div>
          ) : (
            <>
              <div className="wallet-balance-card">
                <div className="balance-content">
                  <div className="balance-label">Available Balance</div>
                  <div className="balance-amount">
                    ${wallet?.wallet_balance?.toFixed(2) || '0.00'}
                  </div>
                  <div className="balance-stats">
                    <div className="stat">
                      <span className="stat-label">Total Bookings</span>
                      <span className="stat-value">{wallet?.total_bookings || 0}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="btn-withdraw"
                  onClick={() => setShowWithdraw(!showWithdraw)}
                >
                  {showWithdraw ? 'Cancel' : 'Withdraw'}
                </button>
              </div>

              {showWithdraw && (
                <form className="withdraw-form" onSubmit={handleWithdraw}>
                  <div className="form-group">
                    <label>Withdrawal Amount</label>
                    <div className="input-group">
                      <span className="currency">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        max={wallet?.wallet_balance || 0}
                        required
                      />
                    </div>
                    <div className="input-hint">
                      Available: ${wallet?.wallet_balance?.toFixed(2) || '0.00'}
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    Withdraw Now
                  </button>
                </form>
              )}

              <div className="wallet-section">
                <h2>Payment History</h2>
                {payments.length === 0 ? (
                  <div className="empty-state">
                    <p>No payments yet</p>
                  </div>
                ) : (
                  <div className="payments-list">
                    {payments.map(payment => (
                      <div key={payment.id} className="payment-item">
                        <div className="payment-details">
                          <div className="payment-id">
                            {payment.id.slice(0, 8)}...
                          </div>
                          <div className="payment-date">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="payment-amount">
                          ${payment.amount.toFixed(2)}
                        </div>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(payment.status) }}
                        >
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
    </PageLayout>
  )
}
