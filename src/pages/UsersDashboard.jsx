import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import './UsersDashboard.css'

export default function UsersDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const storedUsers = localStorage.getItem('braidly_users')
        const allUsers = storedUsers ? JSON.parse(storedUsers) : []
        setUsers(allUsers)
      } catch (err) {
        console.error('Error loading users:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter)

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updated = users.filter(u => u.id !== userId)
      setUsers(updated)
      localStorage.setItem('braidly_users', JSON.stringify(updated))
    }
  }

  const handleToggleStatus = (userId) => {
    const updated = users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    )
    setUsers(updated)
    localStorage.setItem('braidly_users', JSON.stringify(updated))
  }

  return (
    <PageLayout>
      <div className="users-container">
        <div className="users-header">
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1>Users Management</h1>
          <p>Manage platform users and permissions</p>
        </div>

        <div className="users-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Users ({users.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'customer' ? 'active' : ''}`}
              onClick={() => setFilter('customer')}
            >
              Customers ({users.filter(u => u.role === 'customer').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'braider' ? 'active' : ''}`}
              onClick={() => setFilter('braider')}
            >
              Braiders ({users.filter(u => u.role === 'braider').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'admin' ? 'active' : ''}`}
              onClick={() => setFilter('admin')}
            >
              Admins ({users.filter(u => u.role === 'admin').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className={`user-row ${user.status || 'active'}`}>
                    <td className="user-name">
                      <div className="user-avatar">{user.full_name?.charAt(0) || 'U'}</div>
                      {user.full_name}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status || 'active'}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <button 
                        className="action-btn toggle-btn"
                        onClick={() => handleToggleStatus(user.id)}
                        title={user.status === 'inactive' ? 'Activate' : 'Deactivate'}
                      >
                        {user.status === 'inactive' ? '✓' : '⊘'}
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="users-stats">
          <div className="stat-box">
            <h4>Total Users</h4>
            <p className="stat-number">{users.length}</p>
          </div>
          <div className="stat-box">
            <h4>Active Users</h4>
            <p className="stat-number">{users.filter(u => u.status !== 'inactive').length}</p>
          </div>
          <div className="stat-box">
            <h4>Inactive Users</h4>
            <p className="stat-number">{users.filter(u => u.status === 'inactive').length}</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
