import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import './SharedWishlist.css'

const SharedWishlist = () => {
  const { shareId } = useParams()
  const [wishlistData, setWishlistData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { getSharedWishlist } = useWishlist()
  const { addToCart } = useCart()

  useEffect(() => {
    loadWishlist()
  }, [shareId])

  const loadWishlist = async () => {
    try {
      const data = await getSharedWishlist(shareId)
      setWishlistData(data)
    } catch (error) {
      console.error('Error loading shared wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="shared-wishlist-page">
        <div className="container">
          <div className="skeleton" style={{ height: '400px' }}></div>
        </div>
      </div>
    )
  }

  if (!wishlistData) {
    return (
      <div className="shared-wishlist-page">
        <div className="container">
          <div className="not-found">
            <FiHeart className="not-found-icon" />
            <h2>Wishlist not found</h2>
            <p>This wishlist may have been removed or the link is invalid.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="shared-wishlist-page">
      <div className="container">
        <div className="shared-header">
          <div className="shared-user">
            <FiUser className="user-icon" />
            <span>{wishlistData.userName}'s Wishlist</span>
          </div>
          <h1>Shared Wishlist</h1>
          <p>{wishlistData.items.length} items</p>
        </div>

        <div className="shared-items-grid">
          {wishlistData.items.map(item => (
            <div key={item.id} className="shared-item">
              <Link to={`/product/${item.id}`} className="shared-item-image">
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="shared-item-info">
                <Link to={`/product/${item.id}`} className="shared-item-name">
                  {item.name}
                </Link>
                <div className="shared-item-price">
                  ${(item.salePrice || item.price).toFixed(2)}
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(item)}
                >
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SharedWishlist
