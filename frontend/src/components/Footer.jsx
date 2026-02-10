import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail } from 'react-icons/fi'
import { newsletterAPI } from '../services/api'
import { toast } from 'react-toastify'
import './Footer.css'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    try {
      await newsletterAPI.subscribe(email)
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-brand-header">
              <img src="/logo.png" alt="Nothing Else Solutions" className="footer-logo" />
              <span className="footer-brand-name">Nothing Else Solutions</span>
            </div>
            <p className="footer-description">
              Your one-stop shop for quality Websites and n8n automation.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="YouTube"><FiYoutube /></a>
            </div>
          </div>

          {/* Right Side Links Container */}
          <div className="footer-links-container">
            {/* Quick Links */}
            <div className="footer-links">
              <h4>Quick Links</h4>
              {/* <Link to="/products">All Products</Link> */}
              {/* <Link to="/digital">Digital Products</Link> */}
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>

            {/* Customer Service */}
            <div className="footer-links">
              <h4>Customer Service</h4>
              <Link to="/faq">FAQ</Link>
              {/* <Link to="/shipping">Shipping Info</Link> */}
              {/* <Link to="/returns">Returns Policy</Link> */}
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>

          {/* Newsletter */}
          {/* <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to get updates on new products and special offers.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="newsletter-input-group">
                <FiMail className="newsletter-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div> */}
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Nothing Else Solutions. All rights reserved.</p>
          <div className="footer-payments">
            <img 
              src="/stripe-badge.png" 
              alt="Powered by Stripe" 
              className="stripe-badge" 
              style={{ height: '100px', width: 'auto' }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
