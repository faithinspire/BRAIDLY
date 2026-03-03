import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabaseDB } from '../services/supabase'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ChatbotFooter from '../components/ChatbotFooter'
import ThemeToggle from '../components/ThemeToggle'
import './SoftTheme.css'
import './Pages.css'
import '../../css/design-system.css'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await supabaseDB.getAllUsers()
      setUsers(data.map(u => ({
        id: u.id,
        name: u.full_name || 'User',
        email: u.email,
        role: u.role || 'customer',
        status: u.is_active === false ? 'suspended' : 'active',
        joinedDate: u.created_at,
        totalBookings: 0, // TODO: Add booking count
        avatar: u.avatar_url || '/assets/images/braidly-logo.png'
      })))
    } catch (error) {
      console.error('Error loading users:', error)
      alert('Error loading users. Please check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSuspend = async (userId) => {
    if (confirm('Are you sure you want to suspend this user?')) {
      try {
        setUpdating(true)
        await supabaseDB.suspendUser(userId)
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'suspended' } : u
        ))
        alert('✅ User suspended successfully')
      } catch (error) {
        console.error('Error suspending user:', error)
        alert('❌ Failed to suspend user')
      } finally {
        setUpdating(false)
      }
    }
  }

  const handleActivate = async (userId) => {
    try {
      setUpdating(true)
      await supabaseDB.activateUser(userId)
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: 'active' } : u
      ))
      alert('✅ User activated successfully')
    } catch (error) {
      console.error('Error activating user:', error)
      alert('❌ Failed to activate user')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setUpdating(true)
        await supabaseDB.deleteUser(userId)
        setUsers(prev => prev.filter(u => u.id !== userId))
        alert('✅ User deleted successfully')
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('❌ Failed to delete user')
      } finally {
        setUpdating(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading users...</p>
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
              <h1>User Management</h1>
              <p>Manage all platform users</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left"></i>
              Back to Dashboard
            </button>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="filter-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="braider">Braiders</option>
              <option value="admin">Admins</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Stats */}
          <div className="stats-grid-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user"></i>
              </div>
              <div className="stat-info">
                <h3>{users.filter(u => u.role === 'customer').length}</h3>
                <p>Customers</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="stat-info">
                <h3>{users.filter(u => u.role === 'braider').length}</h3>
                <p>Braiders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-ban"></i>
              </div>
              <div className="stat-info">
                <h3>{users.filter(u => u.status === 'suspended').length}</h3>
                <p>Suspended</p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>All Users ({filteredUsers.length})</h2>
            </div>
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-users"></i>
                <p>No users found</p>
              </div>
            ) : (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Bookings</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              onError={(e) => e.target.src = '/assets/images/braidly-logo.png'}
                            />
                            <div>
                              <strong>{user.name}</strong>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${user.status}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{new Date(user.joinedDate).toLocaleDateString()}</td>
                        <td>{user.totalBookings}</td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-icon" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                            {user.status === 'active' ? (
                              <button 
                                className="btn-icon btn-warning" 
                                title="Suspend"
                                onClick={() => handleSuspend(user.id)}
                                disabled={updating}
                              >
                                <i className="fas fa-ban"></i>
                              </button>
                            ) : (
                              <button 
                                className="btn-icon btn-success" 
                                title="Activate"
                                onClick={() => handleActivate(user.id)}
                                disabled={updating}
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}
                            <button 
                              className="btn-icon btn-danger" 
                              title="Delete"
                              onClick={() => handleDelete(user.id)}
                              disabled={updating}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      <BottomNav />
      <ThemeToggle />
      <ChatbotFooter />
    </div>
  )
}
