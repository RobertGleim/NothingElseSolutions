import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUpload, FiX, FiPlus } from 'react-icons/fi'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import './ProductForm.css'

const AddProduct = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: 'electronics',
    sku: '',
    stock: '',
    isDigital: false,
    supplierUrl: '',
    supplierSource: '',
    images: [],
    features: [''],
    specifications: [{ key: '', value: '' }],
    // Social media fields
    socialTitle: '',
    socialDescription: '',
    hashtags: '',
    // Promo fields
    promoCode: '',
    promoDiscount: ''
  })

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'gadgets', label: 'Gadgets' },
    { value: 'digital', label: 'Digital Products' }
  ]

  const supplierSources = [
    { value: '', label: 'Select Supplier' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'printify', label: 'Printify' },
    { value: 'temu', label: 'Temu' },
    { value: 'aliexpress', label: 'AliExpress' },
    { value: 'other', label: 'Other' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // In production, upload to cloud storage
    const urls = files.map(f => URL.createObjectURL(f))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index][field] = value
    setFormData(prev => ({ ...prev, specifications: newSpecs }))
  }

  const addSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }))
  }

  const removeSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: formData.isDigital ? 999 : parseInt(formData.stock),
        features: formData.features.filter(f => f.trim()),
        specifications: formData.specifications.filter(s => s.key && s.value)
      }

      await adminAPI.createProduct(productData)
      toast.success('Product created successfully!')
      navigate('/admin/products')
    } catch (error) {
      toast.error('Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="product-form-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          {/* Basic Info */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sale Price</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  className="form-input"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isDigital"
                  checked={formData.isDigital}
                  onChange={handleChange}
                />
                <span>This is a digital product</span>
              </label>
            </div>

            {!formData.isDigital && (
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                />
              </div>
            )}
          </div>

          {/* Images */}
          <div className="form-section">
            <h2>Images</h2>
            
            <div className="image-upload-area">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="images" className="upload-label">
                <FiUpload />
                <span>Click to upload images</span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="image-preview-grid">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="image-preview">
                    <img src={img} alt={`Preview ${idx + 1}`} />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => removeImage(idx)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Supplier Info */}
          <div className="form-section">
            <h2>Supplier Information</h2>
            
            <div className="form-group">
              <label className="form-label">Supplier Source</label>
              <select
                name="supplierSource"
                value={formData.supplierSource}
                onChange={handleChange}
                className="form-select"
              >
                {supplierSources.map(src => (
                  <option key={src.value} value={src.value}>{src.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Supplier Product URL</label>
              <input
                type="url"
                name="supplierUrl"
                value={formData.supplierUrl}
                onChange={handleChange}
                className="form-input"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Features */}
          <div className="form-section">
            <h2>Features</h2>
            
            {formData.features.map((feature, idx) => (
              <div key={idx} className="array-input">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  className="form-input"
                  placeholder="Feature description"
                />
                {formData.features.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeFeature(idx)}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addFeature}>
              <FiPlus /> Add Feature
            </button>
          </div>

          {/* Specifications */}
          <div className="form-section">
            <h2>Specifications</h2>
            
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="spec-input">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="form-input"
                  placeholder="Specification name"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="form-input"
                  placeholder="Value"
                />
                {formData.specifications.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeSpec(idx)}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addSpec}>
              <FiPlus /> Add Specification
            </button>
          </div>

          {/* Social Media */}
          <div className="form-section full-width">
            <h2>Social Media (for Quick Posting)</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Social Title</label>
                <input
                  type="text"
                  name="socialTitle"
                  value={formData.socialTitle}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Catchy title for social media"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hashtags</label>
                <input
                  type="text"
                  name="hashtags"
                  value={formData.hashtags}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="#electronics #tech #deals"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Social Description</label>
              <textarea
                name="socialDescription"
                value={formData.socialDescription}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                placeholder="Description for social media posts"
              />
            </div>
          </div>

          {/* Promo */}
          <div className="form-section full-width">
            <h2>Promotional (Optional)</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Promo Code</label>
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="SAVE10"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Promo Discount (%)</label>
                <input
                  type="number"
                  name="promoDiscount"
                  value={formData.promoDiscount}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
