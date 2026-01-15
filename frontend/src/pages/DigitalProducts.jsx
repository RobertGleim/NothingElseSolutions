import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { FiDownload, FiZap, FiCode, FiBox, FiCpu } from 'react-icons/fi'
import './DigitalProducts.css'

const DigitalProducts = () => {
  const { category: urlCategory } = useParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(urlCategory || 'all')
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { value: 'all', label: 'All Products', icon: FiBox },
    { value: 'n8n', label: 'n8n Templates', icon: FiZap },
    { value: 'templates', label: 'Templates', icon: FiCode },
    { value: 'automation', label: 'Automation', icon: FiCpu },
    { value: 'other', label: 'Other', icon: FiDownload }
  ]

  useEffect(() => {
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory)
    }
  }, [urlCategory])

  useEffect(() => {
    loadProducts()
  }, [category])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      // TODO: Fetch products from API
      // const response = await productAPI.getAll({ category })
      // setProducts(response.data.products || [])
      
      setProducts([])
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
