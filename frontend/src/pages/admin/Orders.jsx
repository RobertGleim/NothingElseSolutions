import { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiEye, FiTruck, FiCheck, FiX } from 'react-icons/fi'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import './Admin.css'
import './Orders.css'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      // Mock data
      setOrders([
        {
          id: 'ORD-001',
          customer: { name: 'John Doe', email: 'john@example.com' },
          items: [
            { name: 'Wireless Earbuds Pro', qty: 2, price: 59.99 }
          ],
          total: 119.98,
          status: 'processing',
          shippingAddress: '123 Main St, New York, NY 10001',
          createdAt: '2024-01-15T10:30:00Z',
          paymentMethod: 'card'
        },
        {
          id: 'ORD-002',
          customer: { name: 'Jane Smith', email: 'jane@example.com' },
          items: [
            { name: 'Smart Watch Series X', qty: 1, price: 299.99 }
          ],
          total: 299.99,
          status: 'shipped',
          shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
          trackingNumber: '1Z999AA10123456784',
          createdAt: '2024-01-14T15:45:00Z',
          paymentMethod: 'card'
        },
        {
          id: 'ORD-003',
          customer: { name: 'Bob Wilson', email: 'bob@example.com' },
          items: [
            { name: 'n8n Automation Pack', qty: 1, price: 29.99 }
          ],
          total: 29.99,
          status: 'delivered',
          createdAt: '2024-01-13T09:15:00Z',
          paymentMethod: 'card',
          isDigital: true
        }
      ])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
      toast.success('Order status updated')
      setSelectedOrder(null)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'primary',
      shipped: 'accent',
      delivered: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'primary'
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || o.status === filter
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <span className="order-count">{orders.length} total orders</span>
      </div>

      <div className="orders-toolbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-tabs">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>
                  <div className="customer-info">
                    <span className="customer-name">{order.customer.name}</span>
                    <span className="customer-email">{order.customer.email}</span>
                  </div>
                </td>
                <td>
                  <span className="item-count">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </span>
                </td>
                <td className="order-total">${order.total.toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="order-date">{formatDate(order.createdAt)}</td>
                <td>
                  <button 
                    className="action-btn view"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="empty-table">
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal order-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order {selectedOrder.id}</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="order-detail-grid">
                <div className="order-detail-section">
                  <h3>Customer</h3>
                  <p>{selectedOrder.customer.name}</p>
                  <p>{selectedOrder.customer.email}</p>
                </div>

                {!selectedOrder.isDigital && (
                  <div className="order-detail-section">
                    <h3>Shipping Address</h3>
                    <p>{selectedOrder.shippingAddress}</p>
                    {selectedOrder.trackingNumber && (
                      <p className="tracking">
                        Tracking: <strong>{selectedOrder.trackingNumber}</strong>
                      </p>
                    )}
                  </div>
                )}

                <div className="order-detail-section">
                  <h3>Items</h3>
                  <ul className="order-items-list">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx}>
                        <span>{item.name} x {item.qty}</span>
                        <span>${(item.price * item.qty).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="order-total-row">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-detail-section">
                  <h3>Update Status</h3>
                  <div className="status-buttons">
                    {['processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                      <button
                        key={status}
                        className={`status-btn ${selectedOrder.status === status ? 'active' : ''}`}
                        onClick={() => handleStatusChange(selectedOrder.id, status)}
                        disabled={selectedOrder.status === status}
                      >
                        {status === 'processing' && <FiTruck />}
                        {status === 'shipped' && <FiTruck />}
                        {status === 'delivered' && <FiCheck />}
                        {status === 'cancelled' && <FiX />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
