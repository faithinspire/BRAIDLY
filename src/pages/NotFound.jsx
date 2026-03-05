import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function NotFound() {
  return (
    <PageLayout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #7e22ce, #3b82f6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          404
        </h1>
        <p style={{
          fontSize: '1.5rem',
          marginBottom: '2rem',
          color: '#666',
        }}>
          Page Not Found
        </p>
        <Link
          to="/"
          className="btn btn-primary"
          style={{ width: 'auto', padding: '14px 40px', textDecoration: 'none', display: 'inline-block' }}
        >
          Go Home
        </Link>
      </div>
    </PageLayout>
  )
}
