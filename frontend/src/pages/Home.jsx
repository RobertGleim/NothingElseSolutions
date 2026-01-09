import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiRefreshCw } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'
import './Home.css'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [digitalProducts, setDigitalProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      // For demo, using mock data
      const mockProducts = [
        {
          id: '1',
          name: 'Wireless Bluetooth Earbuds Pro',
          price: 79.99,
          salePrice: 59.99,
          images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
          rating: 4.5,
          reviewCount: 128,
          badge: 'Hot'
        },
        {
          id: '2',
          name: 'Smart Watch Series X',
          price: 299.99,
          salePrice: null,
          images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400'],
          rating: 4.8,
          reviewCount: 256
        },
        {
          id: '3',
          name: 'Portable Power Bank 20000mAh',
          price: 49.99,
          salePrice: 39.99,
          images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'],
          rating: 4.3,
          reviewCount: 89
        },
        {
          id: '4',
          name: 'USB-C Hub 7-in-1',
          price: 59.99,
          images: ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400'],
          rating: 4.6,
          reviewCount: 167,
          badge: 'New'
        }
      ]

      const mockDigital = [
        {
          id: 'd1',
          name: 'n8n Automation Pack - E-commerce',
          price: 29.99,
          images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'],
          rating: 5.0,
          reviewCount: 42,
          isDigital: true
        },
        {
          id: 'd2',
          name: 'Social Media Scheduler Templates',
          price: 19.99,
          images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
          rating: 4.7,
          reviewCount: 31,
          isDigital: true
        }
      ]

      setFeaturedProducts(mockProducts)
      setBestSellers(mockProducts.slice(0, 4))
      setDigitalProducts(mockDigital)
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: FiShield, title: 'Secure Payment', desc: '100% protected' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated support' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day returns' }
  ]

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', path: '/products/electronics' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', path: '/products/accessories' },
    { name: 'Gadgets', image: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=400', path: '/products/gadgets' },
    { name: 'Digital', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', path: '/digital' }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover <span className="text-gradient">Premium</span> Tech & Digital Solutions
            </h1>
            <p className="hero-subtitle">
              Quality electronics, innovative gadgets, and powerful automation templates. 
              Everything you need, nothing else.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/digital" className="btn btn-outline btn-lg">
                Digital Products
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-glow"></div>
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" 
              alt="Featured Product"
            />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-item">
                <Icon className="feature-icon" />
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.name} to={cat.path} className="category-card">
                <img src={cat.image} alt={cat.name} />
                <div className="category-overlay">
                  <h3>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          {isLoading ? (
            <div className="product-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton product-skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Digital Products Banner */}
      <section className="digital-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-text">
              <span className="banner-label">Digital Downloads</span>
              <h2>n8n Automation Templates</h2>
              <p>
                Supercharge your business with our premium automation workflows. 
                Ready-to-use templates for e-commerce, social media, and more.
              </p>
              <Link to="/digital" className="btn btn-primary">
                Explore Digital Products <FiArrowRight />
              </Link>
            </div>
            <div className="banner-products">
              {digitalProducts.slice(0, 2).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Best Sellers</h2>
            <Link to="/products?sort=best-selling" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="product-grid">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Newsletter</h2>
            <p>Get exclusive deals, new product alerts, and automation tips delivered to your inbox.</p>
            <form className="cta-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
