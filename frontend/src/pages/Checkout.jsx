import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderAPI } from '../services/api'
import { toast } from 'react-toastify'
import { FiLock, FiCreditCard, FiTruck, FiUser } from 'react-icons/fi'
import './Checkout.css'

const Checkout = () => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    saveInfo: false
  })

  const hasPhysicalProducts = cartItems.some(item => !item.isDigital)
  const subtotal = getCartTotal()
  const shipping = hasPhysicalProducts && subtotal < 50 ? 4.99 : 0
  const total = subtotal + shipping

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      // Create payment intent
      const { data } = await orderAPI.createPaymentIntent({
        amount: Math.round(total * 100),
        currency: 'usd'
      })

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: 'US'
              }
            }
          }
        }
      )

      if (error) {
        toast.error(error.message)
      } else if (paymentIntent.status === 'succeeded') {
        // Create order
        await orderAPI.create({
          items: cartItems,
          shippingAddress: formData,
          total,
          paymentIntentId: paymentIntent.id
        })

        clearCart()
        toast.success('Order placed successfully!')
        navigate('/member/orders')
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#6B6B80',
        },
        backgroundColor: 'transparent'
      },
      invalid: {
        color: '#FF3D57',
      },
    },
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="checkout-section">
              <div className="section-header">
                <FiUser className="section-icon" />
                <h2>Contact Information</h2>
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {hasPhysicalProducts && (
              <div className="checkout-section">
                <div className="section-header">
                  <FiTruck className="section-icon" />
                  <h2>Shipping Address</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="United States">United States</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="checkout-section">
              <div className="section-header">
                <FiCreditCard className="section-icon" />
                <h2>Payment</h2>
              </div>
              <div className="card-element-wrapper">
                <CardElement options={cardElementOptions} />
              </div>
              <p className="payment-secure">
                <FiLock /> Your payment information is encrypted and secure
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg place-order-btn"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-image">
                    <img src={item.image} alt={item.name} />
                    <span className="item-qty">{item.quantity}</span>
                  </div>
                  <div className="summary-item-info">
                    <span className="summary-item-name">{item.name}</span>
                    {item.isDigital && <span className="digital-badge">Digital</span>}
                  </div>
                  <span className="summary-item-price">
                    ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
