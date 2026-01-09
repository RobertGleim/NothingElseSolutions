import { Link } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import './Cart.css'

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FiShoppingBag className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-product">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <Link to={`/product/${item.id}`} className="item-name">
                      {item.name}
                    </Link>
                    {item.isDigital && <span className="digital-badge">Digital</span>}
                  </div>
                </div>

                <div className="item-price">
                  ${(item.salePrice || item.price).toFixed(2)}
                </div>

                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <FiPlus />
                  </button>
                </div>

                <div className="item-total">
                  ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                </div>

                <button 
                  className="item-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <div className="cart-actions">
              <Link to="/products" className="btn btn-secondary">
                Continue Shopping
              </Link>
              <button className="btn btn-secondary" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{getCartTotal() >= 50 ? 'Free' : '$4.99'}</span>
            </div>

            <div className="promo-input">
              <input type="text" placeholder="Promo code" className="form-input" />
              <button className="btn btn-secondary">Apply</button>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>${(getCartTotal() + (getCartTotal() >= 50 ? 0 : 4.99)).toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
              Proceed to Checkout <FiArrowRight />
            </Link>

            <div className="secure-checkout">
              <span>🔒 Secure checkout powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
