import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await api.get('/auth/me')
        setUser(response.data)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
      }
    }
    setIsLoading(false)
  }

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    setIsAuthenticated(true)
    return user
  }

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData)
    const { token, user } = response.data
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    setIsAuthenticated(true)
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
  }

  const adminLogin = async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password })
    const { token, user } = response.data
    if (!user.is_admin) {
      throw new Error('Unauthorized')
    }
    localStorage.setItem('token', token)
    localStorage.setItem('isAdmin', 'true')
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    setIsAuthenticated(true)
    return user
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin: user?.is_admin || false,
    login,
    register,
    logout,
    adminLogin,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
