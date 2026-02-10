import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSettings, FiSun, FiMoon } from 'react-icons/fi'
import './Header.css'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { getCartCount } = useCart()
  const { isDarkMode, toggleTheme } = useTheme()
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
    { path: '/products/n8n', label: 'n8n Templates' },
    { path: '/products/templates', label: 'Templates' },
    { path: '/products/automation', label: 'Automation' },
    { path: '/products/other', label: 'Other Digital' },
  ]

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="Nothing Else Solutions" />
          <span className="header-brand-name">Nothing Else Solutions</span>
        </Link>

        {/* FUTURE VERSION - Search Bar */}
        {/* <form className="header-search" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form> */}

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navigation - moves to mobile menu on small screens */}
        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          {/* Mobile Header inside nav */}
          <div className="mobile-nav-header">
            <Link to="/" className="mobile-logo" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="Nothing Else Solutions" />
              <span className="mobile-brand-name">Nothing Else Solutions</span>
            </Link>
            <button 
              className="mobile-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          {/* Mobile Actions - shown only in mobile menu */}
          <div className="mobile-actions">
            <button 
              className="mobile-action-btn theme-toggle"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/member/dashboard" className="mobile-action-btn" onClick={() => setMobileMenuOpen(false)}>
                  <FiUser />
                  <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="mobile-action-btn admin" onClick={() => setMobileMenuOpen(false)}>
                    <FiSettings />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" className="mobile-action-btn" onClick={() => setMobileMenuOpen(false)}>
                <FiUser />
                <span>Login</span>
              </Link>
            )}

            {/* FUTURE VERSION - Wishlist & Cart */}
            {/* <Link to="/member/wishlist" className="mobile-action-btn" onClick={() => setMobileMenuOpen(false)}>
              <FiHeart />
              <span>Wishlist</span>
            </Link>

            <Link to="/cart" className="mobile-action-btn" onClick={() => setMobileMenuOpen(false)}>
              <FiShoppingCart />
              <span>Cart {getCartCount() > 0 && `(${getCartCount()})`}</span>
            </Link> */}
          </div>

          <div className="mobile-nav-divider"></div>

          <NavLink to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          {/* FUTURE VERSION - Shop Dropdown */}
          {/* <div className="nav-dropdown">
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
          </div> */}
          <div className="nav-dropdown">
            <span className="nav-link dropdown-trigger">Services</span>
            <div className="dropdown-menu">
              <NavLink to="/inquiry?service=website" onClick={() => setMobileMenuOpen(false)}>
                Custom Website
              </NavLink>
              <NavLink to="/inquiry?service=automation" onClick={() => setMobileMenuOpen(false)}>
                Automation & AI
              </NavLink>
            </div>
          </div>
          <NavLink to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            About
          </NavLink>

          {/* Logout button at bottom for authenticated users */}
          {isAuthenticated && (
            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-logout-btn">
              Logout
            </button>
          )}
        </nav>

        {/* Desktop Actions - hidden on mobile */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button 
            className="action-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* {isAuthenticated ? (
            <div className="user-dropdown">
              <button className="action-btn user-btn">
                <FiUser />
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </button> */}
              {/* <div className="dropdown-menu">
                {isAdmin && (
                  <NavLink to="/admin/dashboard" className="admin-link">
                    <FiSettings /> Admin Panel
                  </NavLink>
                )}
                <NavLink to="/member/dashboard">Dashboard</NavLink> */}
                {/* FUTURE VERSION - Orders & Wishlist */}
                {/* <NavLink to="/member/orders">My Orders</NavLink>
                <NavLink to="/member/wishlist">Wishlist</NavLink> */}
                {/* <button onClick={handleLogout} className="logout-link">
                  Logout
                </button>
              </div> */}
            {/* </div>
          ) : (
            <Link to="/login" className="action-btn">
              <FiUser />
            </Link>
          )} */}

          {/* FUTURE VERSION - Wishlist & Cart */}
          {/* <Link to="/member/wishlist" className="action-btn">
            <FiHeart />
          </Link>

          <Link to="/cart" className="action-btn cart-btn">
            <FiShoppingCart />
            {getCartCount() > 0 && (
              <span className="cart-count">{getCartCount()}</span>
            )}
          </Link> */}
        </div>
      </div>
    </header>
  )
}

export default Header
