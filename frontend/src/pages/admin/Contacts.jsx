import { useState, useEffect } from 'react'
import { FiMail, FiCheck, FiTrash2, FiMessageSquare, FiUser, FiClock } from 'react-icons/fi'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import './Admin.css'
import './Contacts.css'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      // TODO: Fetch contacts from API
      // const response = await adminAPI.getContacts()
      // setContacts(response.data.contacts || [])
      
      setContacts([])
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await adminAPI.updateContactStatus(contactId, newStatus)
      setContacts(contacts.map(c => 
        c.id === contactId ? { ...c, status: newStatus } : c
      ))
      toast.success('Status updated')
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      await adminAPI.deleteContact(id)
      setContacts(contacts.filter(c => c.id !== id))
      setSelectedContact(null)
      toast.success('Message deleted')
    } catch (error) {
      toast.error('Failed to delete message')
    }
  }

  const openContact = (contact) => {
    setSelectedContact(contact)
    if (contact.status === 'unread') {
      handleStatusChange(contact.id, 'read')
    }
  }

  const filteredContacts = contacts.filter(c => {
    if (filter === 'all') return true
    return c.status === filter
  })

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const colors = {
      unread: 'warning',
      read: 'primary',
      replied: 'success'
    }
    return colors[status]
  }

  const unreadCount = contacts.filter(c => c.status === 'unread').length

  return (
    <div className="admin-contacts">
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Contact Messages
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </h1>
      </div>

      <div className="contacts-layout">
        <div className="contacts-sidebar">
          <div className="filter-tabs vertical">
            {[
              { value: 'all', label: 'All Messages' },
              { value: 'unread', label: 'Unread' },
              { value: 'read', label: 'Read' },
              { value: 'replied', label: 'Replied' }
            ].map(tab => (
              <button
                key={tab.value}
                className={`filter-tab ${filter === tab.value ? 'active' : ''}`}
                onClick={() => setFilter(tab.value)}
              >
                {tab.label}
                {tab.value === 'unread' && unreadCount > 0 && (
                  <span className="count">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="contacts-list">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id}
                className={`contact-item ${contact.status === 'unread' ? 'unread' : ''} ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                onClick={() => openContact(contact)}
              >
                <div className="contact-avatar">
                  <FiUser />
                </div>
                <div className="contact-preview">
                  <div className="contact-header">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-date">{formatDate(contact.createdAt)}</span>
                  </div>
                  <div className="contact-subject">{contact.subject}</div>
                  <div className="contact-excerpt">
                    {contact.message.substring(0, 60)}...
                  </div>
                </div>
              </div>
            ))}

            {filteredContacts.length === 0 && (
              <div className="no-contacts">
                <FiMessageSquare />
                <p>No messages found</p>
              </div>
            )}
          </div>
        </div>

        <div className="contact-detail">
          {selectedContact ? (
            <>
              <div className="detail-header">
                <div className="detail-info">
                  <h2>{selectedContact.subject}</h2>
                  <div className="detail-meta">
                    <span><FiUser /> {selectedContact.name}</span>
                    <span><FiMail /> {selectedContact.email}</span>
                    <span><FiClock /> {formatDate(selectedContact.createdAt)}</span>
                  </div>
                </div>
                <div className="detail-actions">
                  <span className={`badge badge-${getStatusBadge(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(selectedContact.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="detail-body">
                <p>{selectedContact.message}</p>
              </div>

              <div className="detail-footer">
                <a 
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="btn btn-primary"
                  onClick={() => handleStatusChange(selectedContact.id, 'replied')}
                >
                  <FiMail /> Reply via Email
                </a>
                {selectedContact.status !== 'replied' && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleStatusChange(selectedContact.id, 'replied')}
                  >
                    <FiCheck /> Mark as Replied
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <FiMessageSquare />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Contacts
