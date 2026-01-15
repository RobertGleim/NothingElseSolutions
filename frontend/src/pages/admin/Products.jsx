import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi'
import { adminAPI, productAPI } from '../../services/api'
import { toast } from 'react-toastify'
import './Admin.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      // TODO: Fetch products from API
      // const response = await adminAPI.getProducts()
      // setProducts(response.data.products || [])
      
      setProducts([])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await adminAPI.deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
      toast.success('Product deleted')
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || p.category === filter || (filter === 'digital' && p.isDigital)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <Link to="/admin/products/add" className="btn btn-primary">
          <FiPlus /> Add Product
        </Link>
      </div>

      <div className="products-toolbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-box">
          <FiFilter />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Products</option>
            <option value="n8n">n8n Templates</option>
            <option value="templates">Templates</option>
            <option value="automation">Automation</option>
            <option value="other">Other Digital</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <span className="product-name">{product.name}</span>
                      {product.isDigital && <span className="digital-tag">Digital</span>}
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>
                  {product.salePrice ? (
                    <div>
                      <span className="sale-price">${product.salePrice.toFixed(2)}</span>
                      <span className="original-price">${product.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span>${product.price.toFixed(2)}</span>
                  )}
                </td>
                <td>
                  <span className={product.stock < 10 ? 'low-stock' : ''}>
                    {product.isDigital ? '∞' : product.stock}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${product.status === 'active' ? 'success' : 'warning'}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link 
                      to={`/admin/products/edit/${product.id}`} 
                      className="action-btn edit"
                    >
                      <FiEdit2 />
                    </Link>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="empty-table">
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
