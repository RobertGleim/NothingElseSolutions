import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { FiPackage, FiHeart, FiUser, FiShoppingBag } from 'react-icons/fi'
import './Member.css'

const Dashboard = () => {
  const { user } = useAuth()
  const { wishlistItems } = useWishlist()

  const stats = [
    { icon: FiShoppingBag, label: 'Orders', value: '0', link: '/member/orders' },
    { icon: FiHeart, label: 'Wishlist', value: wishlistItems.length.toString(), link: '/member/wishlist' },
    { icon: FiPackage, label: 'In Transit', value: '0', link: '/member/orders' }
  ]

  return (
    <div className="member-page">
      <div className="container">
        <div className="member-header">
          <div className="member-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="member-info">
            <h1>Welcome, {user?.name || 'User'}!</h1>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map(stat => (
            <Link key={stat.label} to={stat.link} className="stat-card">
              <stat.icon className="stat-icon" />
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <h2>Recent Orders</h2>
            <div className="empty-state">
              <FiPackage className="empty-icon" />
              <p>No orders yet</p>
              <Link to="/products" className="btn btn-primary">Start Shopping</Link>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/products" className="action-card">
                <FiShoppingBag />
                <span>Browse Products</span>
              </Link>
              <Link to="/member/wishlist" className="action-card">
                <FiHeart />
                <span>View Wishlist</span>
              </Link>
              <Link to="/member/orders" className="action-card">
                <FiPackage />
                <span>Track Orders</span>
              </Link>
              <Link to="/contact" className="action-card">
                <FiUser />
                <span>Get Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
