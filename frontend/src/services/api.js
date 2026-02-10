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
    const token = localStorage.getItem('token')
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
  
  // Contacts
  getContacts: (params) => api.get('/admin/contacts', { params }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
}

// Contact API - Uses Web3Forms (no backend required, no CORS issues)
export const contactAPI = {
  submit: async (data) => {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '0e391c88-5f68-40c7-b6e7-0f8469a7e9f8', // Replace with your Web3Forms access key
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        to_email: 'nothingelsestore@nothingelsesolutions.com'
      })
    })
    return response.json()
  }
}

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
}
