import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import './AnalyticsDashboard.css'

export default function AnalyticsDashboard() {
  const navigate = useNavigate()

  return (
    <PageLayout>
      <div className="analytics-container">
        <div className="analytics-header">
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1>Platform Analytics</h1>
          <p>Real-time platform statistics and insights</p>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Total Revenue</h3>
            <div className="analytics-value">$0.00</div>
            <p className="analytics-label">This Month</p>
          </div>

          <div className="analytics-card">
            <h3>Active Users</h3>
            <div className="analytics-value">0</div>
            <p className="analytics-label">Online Now</p>
          </div>

          <div className="analytics-card">
            <h3>Completed Bookings</h3>
            <div className="analytics-value">0</div>
            <p className="analytics-label">This Month</p>
          </div>

          <div className="analytics-card">
            <h3>Average Rating</h3>
            <div className="analytics-value">4.5</div>
            <p className="analytics-label">Stars</p>
          </div>
        </div>

        <div className="analytics-section">
          <h2>User Growth</h2>
          <div className="chart-placeholder">
            <p>📊 Chart visualization coming soon</p>
          </div>
        </div>

        <div className="analytics-section">
          <h2>Booking Trends</h2>
          <div className="chart-placeholder">
            <p>📈 Trend analysis coming soon</p>
          </div>
        </div>

        <div className="analytics-section">
          <h2>Top Braiders</h2>
          <div className="table-placeholder">
            <p>🏆 Top performers list coming soon</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
