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
      // TODO: Fetch products from API
      // const response = await productAPI.getAll({ category, sort: filters.sort })
      // setProducts(response.data.products || [])
      
      setProducts([])
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
