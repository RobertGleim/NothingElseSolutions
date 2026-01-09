import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiExternalLink } from 'react-icons/fi'
import { orderAPI } from '../../services/api'
import './Member.css'

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders()
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success'
      case 'shipped': return 'primary'
      case 'processing': return 'warning'
      case 'cancelled': return 'error'
      default: return 'primary'
    }
  }

  if (isLoading) {
    return (
      <div className="member-page">
        <div className="container">
          <h1 className="page-title">Order History</h1>
          <div className="skeleton" style={{ height: '200px' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="member-page">
      <div className="container">
        <h1 className="page-title">Order History</h1>

        {orders.length === 0 ? (
          <div className="empty-state large">
            <FiPackage className="empty-icon" />
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <span className="label">Order</span>
                    <span className="value">#{order.id}</span>
                  </div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <span className={`badge badge-${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-value">${order.total.toFixed(2)}</span>
                  </div>
                  {order.trackingUrl && (
                    <a 
                      href={order.trackingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Track Order <FiExternalLink />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory
