import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'
import api from '../services/api'

const WishlistContext = createContext(null)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [shareId, setShareId] = useState(null)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    loadWishlist()
  }, [isAuthenticated])

  const loadWishlist = async () => {
    if (isAuthenticated) {
      try {
        const response = await api.get('/wishlist')
        setWishlistItems(response.data.items || [])
        setShareId(response.data.shareId)
      } catch (error) {
        console.error('Error loading wishlist:', error)
      }
    } else {
      const savedWishlist = localStorage.getItem('wishlist')
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist))
      }
    }
  }

  const saveWishlist = async (items) => {
    if (isAuthenticated) {
      try {
        await api.post('/wishlist', { items })
      } catch (error) {
        console.error('Error saving wishlist:', error)
      }
    } else {
      localStorage.setItem('wishlist', JSON.stringify(items))
    }
    setWishlistItems(items)
  }

  const addToWishlist = (product) => {
    const exists = wishlistItems.some(item => item.id === product.id)
    
    if (exists) {
      toast.info('Item already in wishlist')
      return
    }

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images?.[0] || product.image,
      addedAt: new Date().toISOString()
    }
    
    const updatedItems = [...wishlistItems, newItem]
    saveWishlist(updatedItems)
    toast.success(`${product.name} added to wishlist`)
  }

  const removeFromWishlist = (productId) => {
    const updatedItems = wishlistItems.filter(item => item.id !== productId)
    saveWishlist(updatedItems)
    toast.info('Item removed from wishlist')
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId)
  }

  const generateShareLink = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to share your wishlist')
      return null
    }
    
    try {
      const response = await api.post('/wishlist/share')
      setShareId(response.data.shareId)
      return `${window.location.origin}/wishlist/shared/${response.data.shareId}`
    } catch (error) {
      toast.error('Error generating share link')
      return null
    }
  }

  const getSharedWishlist = async (id) => {
    try {
      const response = await api.get(`/wishlist/shared/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching shared wishlist:', error)
      return null
    }
  }

  const clearWishlist = () => {
    saveWishlist([])
  }

  const value = {
    wishlistItems,
    shareId,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    generateShareLink,
    getSharedWishlist,
    clearWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistContext
