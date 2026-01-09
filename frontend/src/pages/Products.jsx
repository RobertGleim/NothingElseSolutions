import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { FiFilter, FiGrid, FiList, FiChevronDown } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'
import './Products.css'

const Products = () => {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    sort: searchParams.get('sort') || 'newest'
  })

  const categories = [
    { value: '', label: 'All Products' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'gadgets', label: 'Gadgets' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'best-selling', label: 'Best Selling' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  useEffect(() => {
    loadProducts()
  }, [category, filters.sort])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      // Mock data for demo
      const mockProducts = [
        {
          id: '1',
          name: 'Wireless Bluetooth Earbuds Pro',
          price: 79.99,
          salePrice: 59.99,
          images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
          rating: 4.5,
          reviewCount: 128,
          category: 'electronics'
        },
        {
          id: '2',
          name: 'Smart Watch Series X',
          price: 299.99,
          images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400'],
          rating: 4.8,
          reviewCount: 256,
          category: 'electronics'
        },
        {
          id: '3',
          name: 'Portable Power Bank 20000mAh',
          price: 49.99,
          salePrice: 39.99,
          images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'],
          rating: 4.3,
          reviewCount: 89,
          category: 'accessories'
        },
        {
          id: '4',
          name: 'USB-C Hub 7-in-1',
          price: 59.99,
          images: ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400'],
          rating: 4.6,
          reviewCount: 167,
          category: 'accessories'
        },
        {
          id: '5',
          name: 'Mechanical Gaming Keyboard RGB',
          price: 129.99,
          salePrice: 99.99,
          images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400'],
          rating: 4.7,
          reviewCount: 203,
          category: 'gadgets'
        },
        {
          id: '6',
          name: 'Wireless Charging Pad',
          price: 29.99,
          images: ['https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=400'],
          rating: 4.4,
          reviewCount: 156,
          category: 'accessories'
        },
        {
          id: '7',
          name: 'Noise Cancelling Headphones',
          price: 249.99,
          salePrice: 199.99,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
          rating: 4.9,
          reviewCount: 312,
          category: 'electronics'
        },
        {
          id: '8',
          name: 'Smart LED Light Strip',
          price: 34.99,
          images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
          rating: 4.2,
          reviewCount: 98,
          category: 'gadgets'
        }
      ]

      let filtered = category 
        ? mockProducts.filter(p => p.category === category)
        : mockProducts

      // Sort
      switch (filters.sort) {
        case 'price-asc':
          filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
          break
        case 'price-desc':
          filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        default:
          break
      }

      setProducts(filtered)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSortChange = (value) => {
    setFilters(prev => ({ ...prev, sort: value }))
    setSearchParams({ sort: value })
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="products-header">
          <div className="products-title">
            <h1>{category ? categories.find(c => c.value === category)?.label : 'All Products'}</h1>
            <span className="products-count">{products.length} products</span>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className={`products-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-options">
                {categories.map(cat => (
                  <a 
                    key={cat.value}
                    href={cat.value ? `/products/${cat.value}` : '/products'}
                    className={`filter-option ${category === cat.value || (!category && !cat.value) ? 'active' : ''}`}
                  >
                    {cat.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-inputs">
                <input type="number" placeholder="Min" className="form-input" />
                <span>-</span>
                <input type="number" placeholder="Max" className="form-input" />
              </div>
            </div>

            <div className="filter-section">
              <h3>Rating</h3>
              <div className="filter-options">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="filter-checkbox">
                    <input type="checkbox" />
                    <span>{rating}+ Stars</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {/* Toolbar */}
            <div className="products-toolbar">
              <button 
                className="filter-toggle btn btn-secondary"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <FiFilter /> Filters
              </button>

              <div className="toolbar-right">
                <div className="sort-select">
                  <select 
                    value={filters.sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="form-select"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>

                <div className="view-toggle">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <FiGrid />
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className={`product-grid ${viewMode}`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton product-skeleton"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`product-grid ${viewMode}`}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Products
