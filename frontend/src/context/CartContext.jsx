import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }

  const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items))
    setCartItems(items)
  }

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex(item => item.id === product.id)
    
    if (existingIndex >= 0) {
      const updatedItems = [...cartItems]
      updatedItems[existingIndex].quantity += quantity
      saveCart(updatedItems)
      toast.success(`Updated quantity in cart`)
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images?.[0] || product.image,
        quantity,
        isDigital: product.isDigital || false,
        supplierUrl: product.supplierUrl
      }
      saveCart([...cartItems, newItem])
      toast.success(`${product.name} added to cart`)
    }
  }

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId)
    saveCart(updatedItems)
    toast.info('Item removed from cart')
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    
    const updatedItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    )
    saveCart(updatedItems)
  }

  const clearCart = () => {
    saveCart([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.salePrice || item.price
      return total + (price * item.quantity)
    }, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
