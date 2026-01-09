import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  FiHeart, FiShoppingCart, FiShare2, FiTruck, 
  FiShield, FiRefreshCw, FiStar, FiMinus, FiPlus,
  FiChevronRight
} from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'
import { toast } from 'react-toastify'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    setIsLoading(true)
    try {
      // Mock data
      const mockProduct = {
        id,
        name: 'Wireless Bluetooth Earbuds Pro',
        price: 79.99,
        salePrice: 59.99,
        description: 'Experience premium sound quality with our Wireless Bluetooth Earbuds Pro. Featuring advanced noise cancellation, crystal-clear audio, and up to 30 hours of battery life with the charging case. Perfect for music, calls, and everything in between.',
        features: [
          'Active Noise Cancellation',
          '30-hour battery life with case',
          'IPX5 water resistance',
          'Touch controls',
          'Bluetooth 5.2',
          'Fast wireless charging'
        ],
        specifications: {
          'Brand': 'TechPro',
          'Model': 'EP-500',
          'Connectivity': 'Bluetooth 5.2',
          'Battery': '6 hours (earbuds), 24 hours (case)',
          'Water Resistance': 'IPX5',
          'Weight': '5.4g per earbud'
        },
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
          'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600',
          'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600'
        ],
        rating: 4.5,
        reviewCount: 128,
        inStock: true,
        supplierUrl: 'https://amazon.com/example',
        category: 'electronics'
      }

      const mockReviews = [
        {
          id: '1',
          user: 'John D.',
          rating: 5,
          date: '2025-01-05',
          title: 'Amazing sound quality!',
          content: 'These earbuds exceeded my expectations. The noise cancellation is fantastic and battery life is exactly as advertised.'
        },
        {
          id: '2',
          user: 'Sarah M.',
          rating: 4,
          date: '2025-01-02',
          title: 'Great value for money',
          content: 'Very comfortable to wear for long periods. Only minor issue is the touch controls can be a bit sensitive.'
        }
      ]

      const mockRelated = [
        {
          id: '2',
          name: 'Smart Watch Series X',
          price: 299.99,
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
        }
      ]

      setProduct(mockProduct)
      setReviews(mockReviews)
      setRelatedProducts(mockRelated)
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          url
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="skeleton" style={{ height: '600px' }}></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Product not found</h2>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    )
  }

  const discount = product.salePrice 
    ? Math.round((1 - product.salePrice / product.price) * 100) 
    : 0

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <Link to="/products">Products</Link>
          <FiChevronRight />
          <Link to={`/products/${product.category}`}>{product.category}</Link>
          <FiChevronRight />
          <span>{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="product-main">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
              {discount > 0 && <span className="discount-badge">-{discount}%</span>}
            </div>
            <div className="thumbnail-list">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={i < Math.floor(product.rating) ? 'filled' : ''} 
                  />
                ))}
              </div>
              <span>{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="product-price">
              {product.salePrice ? (
                <>
                  <span className="sale-price">${product.salePrice.toFixed(2)}</span>
                  <span className="original-price">${product.price.toFixed(2)}</span>
                  <span className="save-text">Save ${(product.price - product.salePrice).toFixed(2)}</span>
                </>
              ) : (
                <span className="current-price">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            {/* Quantity & Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)}><FiMinus /></button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}><FiPlus /></button>
              </div>
              
              <button className="btn btn-primary btn-lg add-cart-btn" onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
              
              <button 
                className={`action-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                onClick={handleWishlistToggle}
              >
                <FiHeart />
              </button>
              
              <button className="action-btn" onClick={handleShare}>
                <FiShare2 />
              </button>
            </div>

            {/* Benefits */}
            <div className="product-benefits">
              <div className="benefit">
                <FiTruck /> Free shipping on orders over $50
              </div>
              <div className="benefit">
                <FiShield /> 1 year warranty included
              </div>
              <div className="benefit">
                <FiRefreshCw /> 30-day return policy
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <p>{product.description}</p>
                <h4>Features</h4>
                <ul className="features-list">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-pane">
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-user">{review.user}</div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={i < review.rating ? 'filled' : ''} />
                          ))}
                        </div>
                        <div className="review-date">{review.date}</div>
                      </div>
                      <h4 className="review-title">{review.title}</h4>
                      <p className="review-content">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <section className="related-products">
          <h2>Related Products</h2>
          <div className="product-grid">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductDetail
