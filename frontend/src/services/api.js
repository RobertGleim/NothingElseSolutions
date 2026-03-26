import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Prefer token from cookie if available (for cookie-based auth).
    // Fallback to localStorage for backwards compatibility.
    const getTokenFromCookie = () => {
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
      return match ? match[2] : null
    }

    const token = getTokenFromCookie() || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')
      // Redirect to login if on protected route
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      } else if (window.location.pathname.startsWith('/member')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Product API calls
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category, params) => api.get(`/products/category/${category}`, { params }),
  getDigital: (params) => api.get('/products/digital', { params }),
  getFeatured: () => api.get('/products/featured'),
  getBestSellers: () => api.get('/products/best-sellers'),
  search: (query) => api.get(`/products/search?q=${query}`),
  getReviews: (productId) => api.get(`/products/${productId}/reviews`),
  addReview: (productId, review) => api.post(`/products/${productId}/reviews`, review),
}

// Order API calls
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  createPaymentIntent: (data) => api.post('/orders/create-payment-intent', data),
  // Checkout session removed — invoicing will be handled via Stripe dashboard
}

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

// Admin API calls
export const adminAPI = {
  // Products
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Orders
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  
  // Analytics
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getSalesData: (params) => api.get('/admin/analytics/sales', { params }),
  getVisitorData: (params) => api.get('/admin/analytics/visitors', { params }),
  getBestSellers: (params) => api.get('/admin/analytics/best-sellers', { params }),
  
  // Social Media
  postToSocial: (data) => api.post('/admin/social/post', data),
  getSocialAccounts: () => api.get('/admin/social/accounts'),
  
  // Promos
  getPromos: () => api.get('/admin/promos'),
  createPromo: (data) => api.post('/admin/promos', data),
  updatePromo: (id, data) => api.put(`/admin/promos/${id}`, data),
  deletePromo: (id) => api.delete(`/admin/promos/${id}`),
  
  // Contacts (stored in backend database)
  getContacts: (params) => api.get('/contact', { params }),
  getContact: (id) => api.get(`/contact/${id}`),
  updateContactStatus: (id, status) => api.put(`/contact/${id}`, { status }),
  deleteContact: (id) => api.delete(`/contact/${id}`),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
}

// Contact API - Backend only
export const contactAPI = {
  submit: async (data) => {
    const backendUrl = `${API_URL}/contact`
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        form_type: data.form_type || 'contact',
      }),
    })

    let json
    try {
      json = await response.json()
    } catch (err) {
      throw new Error('Invalid JSON response from contact endpoint')
    }

    if (!response.ok || json.success === false) {
      const errMsg = json.error || json.message || JSON.stringify(json)
      throw new Error(`Contact API error: ${errMsg}`)
    }

    return json
  }
}

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
}
