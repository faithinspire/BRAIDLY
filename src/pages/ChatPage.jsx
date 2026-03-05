import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/supabaseClient'
import PageLayout from '../components/PageLayout'
import './ChatPage.css'

export default function ChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadConversations()
  }, [user])

  const loadConversations = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (!user?.id) {
        setConversations([])
        return
      }

      const { data, error: fetchError } = await dbService.supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      if (!data || data.length === 0) {
        setConversations([])
        setLoading(false)
        return
      }

      const grouped = {}
      data.forEach(msg => {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
        if (!grouped[otherId]) {
          grouped[otherId] = []
        }
        grouped[otherId].push(msg)
      })

      setConversations(Object.entries(grouped).map(([id, msgs]) => ({
        id,
        lastMessage: msgs[0],
        messageCount: msgs.length,
      })))
    } catch (err) {
      console.error('Error loading conversations:', err)
      setError('Failed to load messages')
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      setError('')
      const { data, error: fetchError } = await dbService.supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      setMessages(data || [])
      setSelectedConversation(conversationId)
    } catch (err) {
      console.error('Error loading messages:', err)
      setError('Failed to load messages. Please try again.')
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      setError('')
      const { error: insertError } = await dbService.supabase
        .from('messages')
        .insert([{
          sender_id: user?.id,
          receiver_id: selectedConversation,
          content: newMessage,
          created_at: new Date().toISOString(),
        }])

      if (insertError) throw insertError

      setNewMessage('')
      await loadMessages(selectedConversation)
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message. Please try again.')
    }
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
          <div className="chat-sidebar">
            <h2>Messages</h2>
            {loading ? (
              <div className="loading">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">No conversations yet</div>
            ) : (
              <div className="conversations-list">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''}`}
                    onClick={() => loadMessages(conv.id)}
                  >
                    <div className="conversation-header">
                      <span className="user-id">{conv.id.slice(0, 8)}...</span>
                      <span className="message-count">{conv.messageCount}</span>
                    </div>
                    <div className="last-message">
                      {conv.lastMessage?.content?.slice(0, 30)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chat-main">
            {selectedConversation ? (
              <>
                <div className="chat-header">
                  <h3>Chat with {selectedConversation.slice(0, 8)}...</h3>
                </div>

                <div className="messages-list">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">{msg.content}</div>
                      <div className="message-time">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
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
                  <button onClick={sendMessage} className="send-btn">
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="no-conversation">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
      </div>
    </PageLayout>
  )
}
