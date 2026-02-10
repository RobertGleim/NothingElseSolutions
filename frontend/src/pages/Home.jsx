import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiDownload, FiShield, FiHeadphones, FiZap, FiCode, FiCpu, FiLayers, FiGlobe } from 'react-icons/fi'
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
      // TODO: Fetch products from API
      // const response = await productAPI.getAll()
      // setFeaturedProducts(response.data.featured || [])
      // setBestSellers(response.data.bestSellers || [])
      // setDigitalProducts(response.data.products || [])
      
      setFeaturedProducts([])
      setBestSellers([])
      setDigitalProducts([])
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: FiDownload, title: 'Instant Download', desc: 'Immediate access' },
    { icon: FiShield, title: 'Secure Payment', desc: '100% protected' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated support' },
    { icon: FiZap, title: 'Ready to Use', desc: 'Pre-built templates' }
  ]

  const categories = [
    { name: 'n8n Templates', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', path: '/products/n8n' },
    { name: 'Templates', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', path: '/products/templates' },
    { name: 'Automation', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400', path: '/products/automation' },
    { name: 'All Digital', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400', path: '/products' }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover <span className="text-gradient">Premium</span> Digital Solutions
            </h1>
            <p className="hero-subtitle">
              Powerful automation templates, n8n workflows, and digital tools. 
              Everything you need to automate your business, nothing else.
            </p>
            {/* <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary btn-lg">
                Browse Products <FiArrowRight />
              </Link>
              <Link to="/products/n8n" className="btn btn-outline btn-lg">
                n8n Templates
              </Link>
            </div> */}
          </div>
          <div className="hero-image">
            <div className="hero-glow"></div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600" 
              alt="Automation Templates"
            />
          </div>
        </div>
      </section>

      {/* Custom Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-badge">Custom Solutions</span>
            <h2>Build Something <span className="text-gradient">Amazing</span></h2>
            <p>Need something unique? Let's create a custom solution tailored to your business needs.</p>
          </div>

          <div className="services-grid">
            {/* Custom Website Card */}
            <div className="service-card">
              <div className="service-card-glow website-glow"></div>
              <div className="service-icon">
                <FiGlobe />
              </div>
              <h3>Custom Website Development</h3>
              <p className="service-description">
                Get a stunning, modern website built from scratch. From sleek landing pages to 
                full-featured e-commerce platforms, we bring your vision to life.
              </p>
              <div className="service-features">
                <div className="service-feature">
                  <FiCode /> React & Modern Tech Stack
                </div>
                <div className="service-feature">
                  <FiLayers /> Responsive Design
                </div>
                <div className="service-feature">
                  <FiShield /> Secure & Scalable
                </div>
              </div>
              <div className="service-skills">
                <span>React</span>
                <span>Node.js</span>
                <span>Python</span>
                <span>PostgreSQL</span>
                <span>AWS</span>
              </div>
              <Link to="/inquiry?service=website" className="btn btn-primary service-btn">
                Start Your Project <FiArrowRight />
              </Link>
            </div>

            {/* Custom Automation Card */}
            <div className="service-card">
              <div className="service-card-glow automation-glow"></div>
              <div className="service-icon automation-icon">
                <FiCpu />
              </div>
              <h3>Custom Automation & AI Agents</h3>
              <p className="service-description">
                Streamline your business with intelligent automation workflows and AI agents. 
                Save time, reduce errors, and scale your operations effortlessly.
              </p>
              <div className="service-features">
                <div className="service-feature">
                  <FiZap /> n8n & Workflow Automation
                </div>
                <div className="service-feature">
                  <FiCpu /> AI-Powered Agents
                </div>
                <div className="service-feature">
                  <FiLayers /> API Integrations
                </div>
              </div>
              <div className="service-skills">
                <span>n8n</span>
                <span>AI/ML</span>
                <span>Python</span>
                <span>APIs</span>
                <span>ChatGPT</span>
              </div>
              <Link to="/inquiry?service=automation" className="btn btn-primary service-btn">
                Automate Your Business <FiArrowRight />
              </Link>
            </div>
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
      {/* <section className="section categories-section">
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
      </section> */}

      {/* Featured Products */}
      {/* <section className="section">
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
      </section> */}

      {/* n8n Templates Banner */}
      {/* <section className="digital-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-text">
              <span className="banner-label">Most Popular</span>
              <h2>n8n Automation Templates</h2>
              <p>
                Supercharge your business with our premium automation workflows. 
                Ready-to-use templates for e-commerce, social media, and more.
              </p>
              <Link to="/products/n8n" className="btn btn-primary">
                Explore n8n Templates <FiArrowRight />
              </Link>
            </div>
            <div className="banner-products">
              {digitalProducts.slice(0, 2).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Best Sellers */}
      {/* <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Best Sellers</h2>
            <Link to="/products" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="product-grid">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <div className="cta-glow cta-glow-2"></div>
        <div className="container">
          <div className="cta-content">
            <span className="cta-badge">Let's Work Together</span>
            <h2>Ready to Transform Your <span className="text-gradient">Business</span>?</h2>
            <p className="cta-description">
              Whether you need a custom website, automation workflow, or AI solution — 
              I'm here to help bring your ideas to life.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary btn-lg cta-btn-primary">
                Get in Touch <FiArrowRight />
              </Link>
              <Link to="/inquiry" className="btn btn-outline btn-lg cta-btn-secondary">
                Start a Project
              </Link>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <FiZap /> Fast Response
              </div>
              <div className="cta-feature">
                <FiShield /> Quality Guaranteed
              </div>
              <div className="cta-feature">
                <FiHeadphones /> Free Consultation
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
