import { useState, useEffect } from 'react'
import { FiFacebook, FiInstagram, FiSend, FiImage, FiX, FiCheck } from 'react-icons/fi'
import { FaTiktok } from 'react-icons/fa'
import { adminAPI, productAPI } from '../../services/api'
import { toast } from 'react-toastify'
import './Admin.css'
import './SocialPost.css'

const SocialPost = () => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [platforms, setPlatforms] = useState({
    facebook: true,
    instagram: false,
    tiktok: false
  })
  const [postContent, setPostContent] = useState({
    title: '',
    description: '',
    hashtags: '',
    image: ''
  })
  const [isPosting, setIsPosting] = useState(false)
  const [recentPosts, setRecentPosts] = useState([])

  useEffect(() => {
    loadProducts()
    loadRecentPosts()
  }, [])

  const loadProducts = async () => {
    try {
      // Mock products
      setProducts([
        {
          id: '1',
          name: 'Wireless Bluetooth Earbuds Pro',
          price: 79.99,
          salePrice: 59.99,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
          socialTitle: '🎧 Premium Earbuds at Amazing Price!',
          socialDescription: 'Get crystal clear audio with our wireless earbuds!',
          hashtags: '#earbuds #wireless #audio #tech'
        },
        {
          id: '2',
          name: 'Smart Watch Series X',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
          socialTitle: '⌚ Stay Connected in Style',
          socialDescription: 'The ultimate smart watch for your lifestyle',
          hashtags: '#smartwatch #tech #fitness #wearable'
        }
      ])
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const loadRecentPosts = async () => {
    try {
      // Mock recent posts
      setRecentPosts([
        {
          id: '1',
          product: 'Wireless Earbuds Pro',
          platforms: ['facebook', 'instagram'],
          status: 'success',
          postedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          product: 'Smart Watch Series X',
          platforms: ['facebook'],
          status: 'success',
          postedAt: '2024-01-14T15:45:00Z'
        }
      ])
    } catch (error) {
      console.error('Error loading recent posts:', error)
    }
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setPostContent({
      title: product.socialTitle || product.name,
      description: product.socialDescription || '',
      hashtags: product.hashtags || '',
      image: product.image
    })
  }

  const handlePlatformToggle = (platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }))
  }

  const handlePost = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product')
      return
    }

    const activePlatforms = Object.entries(platforms)
      .filter(([_, active]) => active)
      .map(([platform]) => platform)

    if (activePlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    setIsPosting(true)

    try {
      // This would call your backend which triggers n8n workflow
      await adminAPI.createSocialPost({
        productId: selectedProduct.id,
        platforms: activePlatforms,
        content: postContent
      })

      toast.success(`Post scheduled to ${activePlatforms.join(', ')}!`)
      
      // Add to recent posts
      setRecentPosts(prev => [{
        id: Date.now().toString(),
        product: selectedProduct.name,
        platforms: activePlatforms,
        status: 'success',
        postedAt: new Date().toISOString()
      }, ...prev])

      // Reset form
      setSelectedProduct(null)
      setPostContent({ title: '', description: '', hashtags: '', image: '' })
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setIsPosting(false)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="social-post-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Social Media Post</h1>
      </div>

      <div className="social-post-grid">
        {/* Product Selection */}
        <div className="admin-card">
          <h3>1. Select Product</h3>
          <div className="product-select-list">
            {products.map(product => (
              <div 
                key={product.id}
                className={`product-select-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                onClick={() => handleProductSelect(product)}
              >
                <img src={product.image} alt={product.name} />
                <div className="product-select-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">
                    ${(product.salePrice || product.price).toFixed(2)}
                  </span>
                </div>
                {selectedProduct?.id === product.id && (
                  <FiCheck className="selected-check" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Post Content */}
        <div className="admin-card">
          <h3>2. Customize Content</h3>
          
          <div className="form-group">
            <label className="form-label">Post Title</label>
            <input
              type="text"
              value={postContent.title}
              onChange={(e) => setPostContent({ ...postContent, title: e.target.value })}
              className="form-input"
              placeholder="Catchy title for your post"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={postContent.description}
              onChange={(e) => setPostContent({ ...postContent, description: e.target.value })}
              className="form-textarea"
              rows="4"
              placeholder="Post description"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hashtags</label>
            <input
              type="text"
              value={postContent.hashtags}
              onChange={(e) => setPostContent({ ...postContent, hashtags: e.target.value })}
              className="form-input"
              placeholder="#electronics #deals #tech"
            />
          </div>

          {postContent.image && (
            <div className="post-image-preview">
              <img src={postContent.image} alt="Post preview" />
              <button 
                className="remove-image"
                onClick={() => setPostContent({ ...postContent, image: '' })}
              >
                <FiX />
              </button>
            </div>
          )}
        </div>

        {/* Platform Selection */}
        <div className="admin-card">
          <h3>3. Select Platforms</h3>
          
          <div className="platform-toggles">
            <button 
              className={`platform-btn facebook ${platforms.facebook ? 'active' : ''}`}
              onClick={() => handlePlatformToggle('facebook')}
            >
              <FiFacebook />
              <span>Facebook</span>
              {platforms.facebook && <FiCheck className="platform-check" />}
            </button>

            <button 
              className={`platform-btn instagram ${platforms.instagram ? 'active' : ''}`}
              onClick={() => handlePlatformToggle('instagram')}
            >
              <FiInstagram />
              <span>Instagram</span>
              {platforms.instagram && <FiCheck className="platform-check" />}
            </button>

            <button 
              className={`platform-btn tiktok ${platforms.tiktok ? 'active' : ''}`}
              onClick={() => handlePlatformToggle('tiktok')}
            >
              <FaTiktok />
              <span>TikTok</span>
              {platforms.tiktok && <FiCheck className="platform-check" />}
            </button>
          </div>

          <button 
            className="btn btn-primary post-btn"
            onClick={handlePost}
            disabled={isPosting || !selectedProduct}
          >
            <FiSend />
            {isPosting ? 'Posting...' : 'Post Now'}
          </button>
        </div>

        {/* Recent Posts */}
        <div className="admin-card recent-posts-card">
          <h3>Recent Posts</h3>
          
          {recentPosts.length === 0 ? (
            <p className="no-posts">No recent posts</p>
          ) : (
            <div className="recent-posts-list">
              {recentPosts.map(post => (
                <div key={post.id} className="recent-post-item">
                  <div className="post-info">
                    <span className="post-product">{post.product}</span>
                    <div className="post-platforms">
                      {post.platforms.map(p => (
                        <span key={p} className={`platform-badge ${p}`}>
                          {p === 'facebook' && <FiFacebook />}
                          {p === 'instagram' && <FiInstagram />}
                          {p === 'tiktok' && <FaTiktok />}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="post-meta">
                    <span className={`status-indicator ${post.status}`}></span>
                    <span className="post-date">{formatDate(post.postedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialPost
