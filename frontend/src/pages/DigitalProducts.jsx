import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { FiDownload, FiZap, FiCode, FiBox } from 'react-icons/fi'
import './DigitalProducts.css'

const DigitalProducts = () => {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { value: 'all', label: 'All Digital', icon: FiBox },
    { value: 'n8n', label: 'n8n Templates', icon: FiZap },
    { value: 'templates', label: 'Templates', icon: FiCode },
    { value: 'other', label: 'Other', icon: FiDownload }
  ]

  useEffect(() => {
    loadProducts()
  }, [category])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      // Mock data
      const mockProducts = [
        {
          id: 'd1',
          name: 'n8n E-commerce Automation Pack',
          price: 49.99,
          salePrice: 29.99,
          images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'],
          rating: 5.0,
          reviewCount: 42,
          isDigital: true,
          category: 'n8n',
          description: 'Complete automation workflow pack for e-commerce stores. Includes order processing, inventory sync, and customer notifications.'
        },
        {
          id: 'd2',
          name: 'Social Media Scheduler Workflows',
          price: 29.99,
          images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
          rating: 4.7,
          reviewCount: 31,
          isDigital: true,
          category: 'n8n',
          description: 'Automate your social media posting across Facebook, Instagram, and TikTok.'
        },
        {
          id: 'd3',
          name: 'Lead Generation Automation',
          price: 39.99,
          images: ['https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400'],
          rating: 4.8,
          reviewCount: 28,
          isDigital: true,
          category: 'n8n',
          description: 'Capture leads, enrich data, and sync with your CRM automatically.'
        },
        {
          id: 'd4',
          name: 'Customer Support Bot Template',
          price: 24.99,
          images: ['https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400'],
          rating: 4.5,
          reviewCount: 19,
          isDigital: true,
          category: 'templates',
          description: 'AI-powered customer support automation with ticket routing and auto-responses.'
        }
      ]

      const filtered = category === 'all' 
        ? mockProducts 
        : mockProducts.filter(p => p.category === category)
      
      setProducts(filtered)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="digital-page">
      <div className="container">
        {/* Hero */}
        <div className="digital-hero">
          <div className="digital-hero-content">
            <span className="hero-badge">Digital Downloads</span>
            <h1>Premium <span className="text-gradient">Digital Products</span></h1>
            <p>
              Supercharge your workflow with our n8n automation templates, 
              digital tools, and more. Instant download, lifetime access.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="digital-categories">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`category-btn ${category === cat.value ? 'active' : ''}`}
              onClick={() => setCategory(cat.value)}
            >
              <cat.icon />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="product-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton product-skeleton"></div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Benefits */}
        <div className="digital-benefits">
          <h2>Why Choose Our Digital Products?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <FiDownload className="benefit-icon" />
              <h3>Instant Download</h3>
              <p>Get immediate access to your purchase after payment</p>
            </div>
            <div className="benefit-card">
              <FiZap className="benefit-icon" />
              <h3>Ready to Use</h3>
              <p>Pre-built templates that work out of the box</p>
            </div>
            <div className="benefit-card">
              <FiCode className="benefit-icon" />
              <h3>Fully Customizable</h3>
              <p>Modify and adapt to your specific needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DigitalProducts
