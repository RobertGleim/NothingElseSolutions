import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Used by the contact endpoint's bot check (instant submissions are bots)
const pageLoadedAt = Date.now()

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
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Admin API calls
export const adminAPI = {
  // Social Media
  postToSocial: (data) => api.post('/admin/social/post', data),
  getSocialAccounts: () => api.get('/admin/social/accounts'),
  
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
        nickname: data.nickname || '',
        elapsed_ms: Date.now() - pageLoadedAt,
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
  subscribe: (email) => api.post('/webhooks/newsletter', { email }),
}
