import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import './Header.css'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="Nothing Else Solutions" />
          <span className="header-brand-name">Nothing Else Solutions</span>
        </Link>

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
          </div>

          <div className="mobile-nav-divider"></div>

          <NavLink to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
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
        </div>
      </div>
    </header>
  )
}

export default Header
