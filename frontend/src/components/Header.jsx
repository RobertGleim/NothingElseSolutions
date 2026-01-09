import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSettings } from 'react-icons/fi'
import './Header.css'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const categories = [
    { path: '/products/electronics', label: 'Electronics' },
    { path: '/products/accessories', label: 'Accessories' },
    { path: '/products/gadgets', label: 'Gadgets' },
    { path: '/digital', label: 'Digital Products' },
  ]

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <img src="/logo.png" alt="Nothing Else Solutions" />
        </Link>

        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Navigation */}
        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <div className="nav-dropdown">
            <span className="nav-link dropdown-trigger">Shop</span>
            <div className="dropdown-menu">
              <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
                All Products
              </NavLink>
              {categories.map(cat => (
                <NavLink key={cat.path} to={cat.path} onClick={() => setMobileMenuOpen(false)}>
                  {cat.label}
                </NavLink>
              ))}
            </div>
          </div>
          <NavLink to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            About
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-dropdown">
              <button className="action-btn user-btn">
                <FiUser />
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </button>
              <div className="dropdown-menu">
                {isAdmin && (
                  <NavLink to="/admin/dashboard" className="admin-link">
                    <FiSettings /> Admin Panel
                  </NavLink>
                )}
                <NavLink to="/member/dashboard">Dashboard</NavLink>
                <NavLink to="/member/orders">My Orders</NavLink>
                <NavLink to="/member/wishlist">Wishlist</NavLink>
                <button onClick={handleLogout} className="logout-link">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="action-btn">
              <FiUser />
            </Link>
          )}

          <Link to="/member/wishlist" className="action-btn">
            <FiHeart />
          </Link>

          <Link to="/cart" className="action-btn cart-btn">
            <FiShoppingCart />
            {getCartCount() > 0 && (
              <span className="cart-count">{getCartCount()}</span>
            )}
          </Link>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
