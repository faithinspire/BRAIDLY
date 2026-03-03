import { useState } from 'react'
import { supabase } from '../services/supabase'

export default function TestSupabase() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      // Test 1: Check Supabase client
      setResult(prev => prev + '\n✅ Supabase client initialized')
      
      // Test 2: Try to query profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (error) {
        setResult(prev => prev + '\n❌ Database query failed: ' + error.message)
      } else {
        setResult(prev => prev + '\n✅ Database connection successful')
      }
      
      // Test 3: Check auth
      const { data: { session } } = await supabase.auth.getSession()
      setResult(prev => prev + '\n✅ Auth client working')
      setResult(prev => prev + '\nSession: ' + (session ? 'Active' : 'None'))
      
      // Test 4: Try signup
      setResult(prev => prev + '\n\n📝 Testing signup...')
      const testEmail = `test${Date.now()}@example.com`
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'Test123456',
        options: {
          data: {
            full_name: 'Test User',
            role: 'customer'
          }
        }
      })
      
      if (signupError) {
        setResult(prev => prev + '\n❌ Signup failed: ' + signupError.message)
      } else {
        setResult(prev => prev + '\n✅ Signup successful!')
        setResult(prev => prev + '\nUser ID: ' + signupData.user?.id)
        setResult(prev => prev + '\nEmail confirmed: ' + (signupData.user?.email_confirmed_at ? 'Yes' : 'No'))
      }
      
    } catch (error) {
      setResult(prev => prev + '\n💥 Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Supabase Connection Test</h1>
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      <pre style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace'
      }}>
        {result || 'Click button to test connection'}
      </pre>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd', borderRadius: '4px' }}>
        <h3>Environment Variables:</h3>
        <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || '❌ NOT SET'}</p>
        <p>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET'}</p>
      </div>
    </div>
  )
}
