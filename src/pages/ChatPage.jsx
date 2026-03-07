import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/supabaseClient'
import PageLayout from '../components/PageLayout'
import './ChatPage.css'

export default function ChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (!user?.id) {
        setConversations([])
        return
      }

      // Load all users
      const storedUsers = localStorage.getItem('braidly_users')
      const users = storedUsers ? JSON.parse(storedUsers) : []
      const otherUsers = users.filter(u => u.id !== user.id)
      setAllUsers(otherUsers)

      // Load messages
      const storedMessages = localStorage.getItem('braidly_messages')
      const allMessages = storedMessages ? JSON.parse(storedMessages) : []
      
      // Group messages by conversation
      const grouped = {}
      allMessages.forEach(msg => {
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
          if (!grouped[otherId]) {
            grouped[otherId] = []
          }
          grouped[otherId].push(msg)
        }
      })

      // Create conversation list with user info
      const convList = Object.entries(grouped).map(([userId, msgs]) => {
        const otherUser = users.find(u => u.id === userId)
        return {
          id: userId,
          user: otherUser,
          messages: msgs,
          lastMessage: msgs[msgs.length - 1],
          messageCount: msgs.length,
        }
      })

      // Sort by most recent message
      convList.sort((a, b) => {
        const timeA = new Date(a.lastMessage?.created_at || 0)
        const timeB = new Date(b.lastMessage?.created_at || 0)
        return timeB - timeA
      })

      setConversations(convList)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      setError('')
      const storedMessages = localStorage.getItem('braidly_messages')
      const allMessages = storedMessages ? JSON.parse(storedMessages) : []
      
      const filtered = allMessages.filter(msg =>
        (msg.sender_id === user?.id && msg.receiver_id === conversationId) ||
        (msg.sender_id === conversationId && msg.receiver_id === user?.id)
      )
      
      // Sort by date
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      
      setMessages(filtered)
      setSelectedConversation(conversationId)
      
      // Find user info
      const selectedUserData = allUsers.find(u => u.id === conversationId)
      setSelectedUser(selectedUserData)
    } catch (err) {
      console.error('Error loading messages:', err)
      setError('Failed to load messages')
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      setError('')
      const { error: sendError } = await dbService.sendMessage(
        user?.id,
        selectedConversation,
        newMessage
      )

      if (sendError) throw new Error(sendError)

      setNewMessage('')
      await loadMessages(selectedConversation)
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message')
    }
  }

  const startNewConversation = (userId) => {
    loadMessages(userId)
  }

  return (
    <PageLayout>
      <div className="chat-container">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button className="close-btn" onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="chat-layout">
          {/* Sidebar */}
          <div className="chat-sidebar">
            <div className="sidebar-header">
              <h2>Messages</h2>
              <span className="user-count">{conversations.length}</span>
            </div>

            {loading ? (
              <div className="loading">Loading conversations...</div>
            ) : (
              <>
                {/* Existing Conversations */}
                {conversations.length > 0 && (
                  <div className="conversations-section">
                    <h3 className="section-title">Conversations</h3>
                    <div className="conversations-list">
                      {conversations.map(conv => (
                        <div
                          key={conv.id}
                          className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''}`}
                          onClick={() => loadMessages(conv.id)}
                        >
                          <div className="conversation-avatar">
                            {conv.user?.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="conversation-info">
                            <div className="conversation-name">
                              {conv.user?.full_name || 'Unknown'}
                            </div>
                            <div className="conversation-preview">
                              {conv.lastMessage?.content?.slice(0, 40)}...
                            </div>
                          </div>
                          <div className="conversation-meta">
                            <span className="message-count">{conv.messageCount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Users */}
                {allUsers.length > 0 && (
                  <div className="users-section">
                    <h3 className="section-title">Start Chat</h3>
                    <div className="users-list">
                      {allUsers.map(u => {
                        const hasConversation = conversations.some(c => c.id === u.id)
                        if (hasConversation) return null
                        return (
                          <div
                            key={u.id}
                            className="user-item"
                            onClick={() => startNewConversation(u.id)}
                          >
                            <div className="user-avatar">
                              {u.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                              <div className="user-name">{u.full_name}</div>
                              <div className="user-role">{u.role}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {conversations.length === 0 && allUsers.length === 0 && (
                  <div className="empty-state">
                    <p>No users available to chat with</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="chat-main">
            {selectedConversation && selectedUser ? (
              <>
                <div className="chat-header">
                  <div className="header-user-info">
                    <div className="header-avatar">
                      {selectedUser.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{selectedUser.full_name}</h3>
                      <p className="user-role-badge">{selectedUser.role}</p>
                    </div>
                  </div>
                </div>

                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
                      >
                        <div className="message-bubble">
                          <div className="message-content">{msg.content}</div>
                          <div className="message-time">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-input-area">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="chat-input"
                  />
                  <button 
                    onClick={sendMessage} 
                    className="send-btn"
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="no-conversation">
                <div className="empty-icon">💬</div>
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
