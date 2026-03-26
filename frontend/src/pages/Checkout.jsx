// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// // Stripe removed — checkout is handled via Stripe Dashboard/invoice links
// import { useCart } from '../context/CartContext'
// import { useAuth } from '../context/AuthContext'
// import { orderAPI } from '../services/api'
// import { toast } from 'react-toastify'
// import { FiLock, FiCreditCard, FiUser } from 'react-icons/fi'
// import './Checkout.css'

// const Checkout = () => {
//   const navigate = useNavigate()
//   const { cartItems, getCartTotal, clearCart } = useCart()
//   const { isAuthenticated, user } = useAuth()
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState({
//     email: user?.email || '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'United States',
//     phone: '',
//     saveInfo: false
//   })

//   const subtotal = getCartTotal()
//   const shipping = 0 // shipping handled by Checkout if required
//   const total = subtotal

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     // Payments/invoicing are handled from the Stripe dashboard.
//     toast.info('We will email an invoice. Please complete payment via the Stripe invoice link.')
//     // Optionally create an order record and send invoice manually from dashboard.
//     try {
//       await orderAPI.create({
//         items: cartItems,
//         name: `${formData.firstName} ${formData.lastName}`,
//         email: formData.email,
//         subtotal: getCartTotal(),
//         shippingAddress: {
//           address: formData.address,
//           city: formData.city,
//           state: formData.state,
//           postal_code: formData.zipCode,
//           country: formData.country
//         }
//       })
//       clearCart()
//       navigate('/success')
//     } catch (err) {
//       console.error(err)
//       toast.error('Failed to create order. Please try again.')
//     }
//   }

//   const cardElementOptions = {
//     style: {
//       base: {
//         fontSize: '16px',
//         color: '#ffffff',
//         '::placeholder': {
//           color: '#6B6B80',
//         },
//         backgroundColor: 'transparent'
//       },
//       invalid: {
//         color: '#FF3D57',
//       },
//     },
//   }

//   return (
//     <div className="checkout-page">
//       <div className="container">
//         <h1 className="page-title">Checkout</h1>

//         <div className="checkout-layout">
//           <form className="checkout-form" onSubmit={handleSubmit}>
//             {/* Contact Information */}
//             <div className="checkout-section">
//               <div className="section-header">
//                 <FiUser className="section-icon" />
//                 <h2>Contact Information</h2>
//               </div>
//               <div className="form-grid">
//                 <div className="form-group full-width">
//                   <label className="form-label">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="form-input"
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">First Name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     className="form-input"
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Last Name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     className="form-input"
//                     required
//                   />
//                 </div>
//                 <div className="form-group full-width">
//                   <label className="form-label">Phone</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="form-input"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Payment */}
//             <div className="checkout-section">
//               <div className="section-header">
//                 <FiCreditCard className="section-icon" />
//                 <h2>Payment</h2>
//               </div>
//               <p>
//                 Payments are handled via Stripe invoices. After placing your order we'll create an invoice in the Stripe dashboard and email you a secure payment link.
//               </p>
//             </div>

//             <button 
//               type="submit" 
//               className="btn btn-primary btn-lg place-order-btn"
//             >
//               Place Order
//             </button>
//           </form>

//           {/* Order Summary */}
//           <div className="order-summary">
//             <h3>Order Summary</h3>
            
//             <div className="summary-items">
//               {cartItems.map(item => (
//                 <div key={item.id} className="summary-item">
//                   <div className="summary-item-image">
//                     <img src={item.image} alt={item.name} />
//                     <span className="item-qty">{item.quantity}</span>
//                   </div>
//                   <div className="summary-item-info">
//                     <span className="summary-item-name">{item.name}</span>
//                     {item.isDigital && <span className="digital-badge">Digital</span>}
//                   </div>
//                   <span className="summary-item-price">
//                     ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="summary-totals">
//               <div className="summary-row">
//                 <span>Subtotal</span>
//                 <span>${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="summary-row">
//                 <span>Shipping</span>
//                 <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
//               </div>
//               <div className="summary-row total">
//                 <span>Total</span>
//                 <span>${total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Checkout
