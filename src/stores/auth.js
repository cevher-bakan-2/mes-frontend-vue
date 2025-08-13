import { defineStore } from 'pinia'
import { AuthService, UserService, TokenService } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    getCurrentUser: (state) => state.user || {
      name: 'Demo User',
      email: 'demo@betapak.com',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random&color=fff',
      role: 'Administrator'
    },
    isLoggedIn: (state) => state.isAuthenticated,
    hasError: (state) => !!state.error,
    isLoading: (state) => state.loading
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        const response = await AuthService.login(email, password)
        
        // Get user data from UserService
        this.user = UserService.getUser()
        this.isAuthenticated = true
        
        return response
      } catch (error) {
        this.error = error.message || 'Giriş yapılırken bir hata oluştu'
        this.isAuthenticated = false
        this.user = null
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      AuthService.logout()
      this.user = null
      this.isAuthenticated = false
      this.error = null
    },

    // Check if user is authenticated on app init
    checkAuth() {
      if (AuthService.isAuthenticated()) {
        this.user = UserService.getUser()
        this.isAuthenticated = true
      } else {
        this.logout()
      }
    },

    clearError() {
      this.error = null
    }
  }
})