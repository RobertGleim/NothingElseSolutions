import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiTrash2, FiShare2, FiCopy } from 'react-icons/fi'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'
import './Member.css'

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, generateShareLink, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [shareUrl, setShareUrl] = useState('')
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    const url = await generateShareLink()
    if (url) {
      setShareUrl(url)
    }
    setIsSharing(false)
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard!')
  }

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => addToCart(item))
    toast.success('All items added to cart!')
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="member-page">
        <div className="container">
          <h1 className="page-title">My Wishlist</h1>
          <div className="empty-state large">
            <FiHeart className="empty-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist and share them with friends.</p>
            <Link to="/products" className="btn btn-primary">Explore Products</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="member-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Wishlist ({wishlistItems.length} items)</h1>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleShare} disabled={isSharing}>
              <FiShare2 /> {isSharing ? 'Generating...' : 'Share Wishlist'}
            </button>
            <button className="btn btn-primary" onClick={handleAddAllToCart}>
              <FiShoppingCart /> Add All to Cart
            </button>
          </div>
        </div>

        {shareUrl && (
          <div className="share-url-box">
            <input type="text" value={shareUrl} readOnly className="form-input" />
            <button className="btn btn-primary" onClick={copyShareLink}>
              <FiCopy /> Copy
            </button>
          </div>
        )}

        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <Link to={`/product/${item.id}`} className="wishlist-image">
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="wishlist-info">
                <Link to={`/product/${item.id}`} className="wishlist-name">
                  {item.name}
                </Link>
                <div className="wishlist-price">
                  {item.salePrice ? (
                    <>
                      <span className="sale">${item.salePrice.toFixed(2)}</span>
                      <span className="original">${item.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>${item.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="wishlist-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => addToCart(item)}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wishlist-footer">
          <button className="btn btn-secondary" onClick={clearWishlist}>
            Clear Wishlist
          </button>
        </div>
      </div>
    </div>
  )
}

export default Wishlist
