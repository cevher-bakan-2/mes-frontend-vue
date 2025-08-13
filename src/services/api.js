import axios from 'axios'

// API Configuration
const API_CONFIG = {
  // Ortam belirteci - geliştirme ortamında false, canlı ortamda true olmalı
  isProd: false, // Canlı ortamda bu değeri true yapınız
  
  // Base URL dinamik olarak belirleniyor
  get BASE_URL() {
    return this.isProd ? 'https://cevherbakan.com/api' : 'http://localhost:5000/api'
  },
  
  // Endpoints
  ENDPOINTS: {
    LOGIN: '/Auth/login',
    PROJECTS: '/Projects',
    USERS: '/Users'
  },
  
  // Token settings
  TOKEN: {
    // Token kontrol sıklığı (milisaniye cinsinden) - 2 dakika
    CHECK_INTERVAL: 2 * 60 * 1000
  }
}

// Kullanıcı adından avatar URL'i oluşturma fonksiyonu
export const createAvatarUrl = (name) => {
  if (!name) return 'https://ui-avatars.com/api/?name=User&background=random'
  
  // UI Avatars API kullanarak isimden avatar oluştur
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`
}

// Token management
export const TokenService = {
  // Save token and expiresAt to localStorage
  setToken(token, expiresAt) {
    const tokenData = {
      value: token,
      expiresAt: expiresAt,
      timestamp: Date.now()
    }
    localStorage.setItem('auth_token', JSON.stringify(tokenData))
  },
  
  // Get token from localStorage
  getToken() {
    const tokenData = localStorage.getItem('auth_token')
    if (!tokenData) return null
    
    try {
      return JSON.parse(tokenData).value
    } catch (e) {
      // Eski format token varsa (sadece string)
      return tokenData
    }
  },
  
  // Get token expiresAt
  getTokenExpiresAt() {
    const tokenData = localStorage.getItem('auth_token')
    if (!tokenData) return null
    
    try {
      return JSON.parse(tokenData).expiresAt
    } catch (e) {
      // Eski format token varsa, şimdiki zamanı kullan
      return Date.now()
    }
  },
  
  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem('auth_token')
  },
  
  // Check if token exists
  hasToken() {
    return !!this.getToken()
  },
  
  // Check if token is expired (using expiresAt)
  isTokenExpired() {
    const expiresAt = this.getTokenExpiresAt()
    if (!expiresAt) return true
    
    const now = Date.now()
    return now > expiresAt
  }
}

// User data management
export const UserService = {
  // Save user data to localStorage
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  },
  
  // Get user data from localStorage
  getUser() {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  },
  
  // Remove user data from localStorage
  removeUser() {
    localStorage.removeItem('user')
  }
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      TokenService.removeToken()
      UserService.removeUser()
      localStorage.removeItem('betapakLoggedIn')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Authentication service
export const AuthService = {
  // Login user
  async login(email, password) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, { 
        email, 
        password 
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed')
      }
      
      // Save token and user data
      TokenService.setToken(response.token, response.expiresAt)
      
      // Prepare user data for saving
      const userData = {
        id: response.user.id,
        name: response.user.name || 'Kullanıcı',
        email: response.user.email,
        avatar: createAvatarUrl(response.user.name),
        role: response.user.departmentName || 'Kullanıcı',
        departmentId: response.user.departmentId,
        departmentName: response.user.departmentName,
        fullAccess: response.user.fullAccess,
        writeAccess: response.user.writeAccess,
        isActive: response.user.isActive,
        phone: response.user.phone,
        createdDate: response.user.createdDate,
        updatedDate: response.user.updatedDate
      }
      
      // Save user data
      UserService.setUser(userData)
      
      // Set login state
      localStorage.setItem('betapakLoggedIn', 'true')
      
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },
  
  // Logout user
  logout() {
    TokenService.removeToken()
    UserService.removeUser()
    localStorage.removeItem('betapakLoggedIn')
    sessionStorage.removeItem('betapakLoggedIn')
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return TokenService.hasToken() && !TokenService.isTokenExpired()
  }
}

// API service with axios
export const ApiService = {
  // Generic request method
  async request(method, endpoint, data = null) {
    const config = {
      method,
      url: endpoint
    }
    
    if (data && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
      config.data = data
    }
    
    try {
      const response = await apiClient(config)
      return response
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  },
  
  // Convenience methods for different HTTP methods
  get(endpoint, params = null) {
    return apiClient.get(endpoint, { params })
  },
  
  post(endpoint, data) {
    return apiClient.post(endpoint, data)
  },
  
  put(endpoint, data) {
    return apiClient.put(endpoint, data)
  },
  
  patch(endpoint, data) {
    return apiClient.patch(endpoint, data)
  },
  
  delete(endpoint) {
    return apiClient.delete(endpoint)
  }
}

export { API_CONFIG }