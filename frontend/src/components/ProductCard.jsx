import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const {
    id,
    name,
    price,
    salePrice,
    images,
    image,
    rating,
    reviewCount,
    isDigital,
    badge
  } = product

  const displayImage = images?.[0] || image
  const inWishlist = isInWishlist(id)
  const discount = salePrice ? Math.round((1 - salePrice / price) * 100) : 0

  const handleWishlistClick = (e) => {
    e.preventDefault()
    if (inWishlist) {
      removeFromWishlist(id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
  }

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-image-wrapper">
        <img src={displayImage} alt={name} className="product-image" />
        
        {badge && <span className="product-badge">{badge}</span>}
        {discount > 0 && <span className="product-discount">-{discount}%</span>}
        {isDigital && <span className="product-digital">Digital</span>}
        
        <button 
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistClick}
        >
          <FiHeart />
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        
        {rating && (
          <div className="product-rating">
            <FiStar className="star-icon" />
            <span>{rating.toFixed(1)}</span>
            {reviewCount && <span className="review-count">({reviewCount})</span>}
          </div>
        )}

        <div className="product-price-row">
          <div className="product-prices">
            {salePrice ? (
              <>
                <span className="sale-price">${salePrice.toFixed(2)}</span>
                <span className="original-price">${price.toFixed(2)}</span>
              </>
            ) : (
              <span className="current-price">${price.toFixed(2)}</span>
            )}
          </div>
          
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
