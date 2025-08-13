import { defineStore } from 'pinia'
import { ApiService } from '@/services/api'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    filters: {
      isCompleted: null,
      isShipped: null,
      country: null,
      status: null
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0
    }
  }),

  getters: {
    getAllProjects: (state) => state.projects,
    getProjectById: (state) => (id) => state.projects.find(p => p.id === id),
    getFilteredProjects: (state) => {
      let filtered = [...state.projects]
      
      // Apply filters
      if (state.filters.isCompleted !== null) {
        filtered = filtered.filter(p => p.isCompleted === state.filters.isCompleted)
      }
      
      if (state.filters.isShipped !== null) {
        filtered = filtered.filter(p => p.isShipped === state.filters.isShipped)
      }
      
      if (state.filters.country) {
        filtered = filtered.filter(p => p.country === state.filters.country)
      }
      
      if (state.filters.status) {
        if (state.filters.status === 'low') {
          filtered = filtered.filter(p => p.status < 30)
        } else if (state.filters.status === 'medium') {
          filtered = filtered.filter(p => p.status >= 30 && p.status <= 70)
        } else if (state.filters.status === 'high') {
          filtered = filtered.filter(p => p.status > 70)
        }
      }
      
      return filtered
    },
    getTotalPages: (state) => {
      return Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage)
    },
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  },

  actions: {
    async fetchProjects(queryParams = {}) {
      this.loading = true
      this.error = null

      try {
        // Build query parameters
        const params = new URLSearchParams()
        
        Object.keys(queryParams).forEach(key => {
          if (queryParams[key] !== null && queryParams[key] !== undefined) {
            params.append(key, queryParams[key])
          }
        })
        
        const endpoint = params.toString() ? `/Projects?${params.toString()}` : '/Projects'
        const response = await ApiService.get(endpoint)
        
        // Map API response to project format (stabil)
        this.projects = response.map(project => {
          // Status hesaplama - mümkünse API değeri, yoksa flag'lere göre sabit
          let statusValue = 0
          // Varsayılan olarak API'de varsa kullan
          if (typeof project.status === 'number') {
            statusValue = project.status
          } else if (typeof project.progress === 'number') {
            statusValue = project.progress
          } else if (typeof project.progressPercent === 'number') {
            statusValue = project.progressPercent
          } else if (project.isCompleted) {
            statusValue = 100
          } else if (project.isShipped) {
            // Sevk edildi ama tamamlanmadı ise yüksek ama 100 olmayan bir değer verilebilir; ancak
            // filtreleme bayraklarla yapılacağı için 80 sabit veriyoruz ki dalgalanma olmasın
            statusValue = 80
          } else {
            // Bilgi yoksa 0 ver
            statusValue = 0
          }
          
          return {
            id: project.id,
            serialNumber: project.seriNo || project.id || '',
            projectName: project.company1 || project.companyName || '',
            machineType: project.machineType || 'Termoform',
            subModel: project.subModel || '',
            country: project.country || '',
            city: project.city || '-',
            product: project.productType || project.product || '',
            orderDate: this.formatDate(project.createdDate),
            revisionDate: this.formatDate(project.revisionDate) || 'Yok',
            deliveryDate: this.formatDate(project.expectedDate),
            penaltyDate: this.formatDate(project.penaltyDate) || 'Yok',
            robot: !!project.hasRobot, // boolean
            loadingMethod: project.loadingType || project.loadingMethod || '',
            status: statusValue,
            isCompleted: !!project.isCompleted,
            isShipped: !!project.isShipped,
            // Keep original project data
            originalData: project
          }
        })
        
        this.pagination.totalItems = this.projects.length
        
        console.log('Fetched projects:', this.projects) // Debug
        
      } catch (error) {
        console.error('Error fetching projects:', error)
        this.error = 'Projeler yüklenirken bir hata oluştu.'
        
        // Load dummy data if API fails
        this.loadDummyData()
      } finally {
        this.loading = false
      }
    },

    async fetchProjectById(id) {
      this.loading = true
      this.error = null

      try {
        const response = await ApiService.get(`/Projects/${id}`)
        this.currentProject = response
        return response
      } catch (error) {
        console.error('Error fetching project:', error)
        this.error = 'Proje detayları yüklenirken bir hata oluştu.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProject(projectData) {
      this.loading = true
      this.error = null

      try {
        const response = await ApiService.post('/Projects', projectData)
        await this.fetchProjects() // Refresh projects list
        return response
      } catch (error) {
        console.error('Error creating project:', error)
        this.error = 'Proje oluşturulurken bir hata oluştu.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProject(id, projectData) {
      this.loading = true
      this.error = null

      try {
        const response = await ApiService.put(`/Projects/${id}`, projectData)
        await this.fetchProjects() // Refresh projects list
        return response
      } catch (error) {
        console.error('Error updating project:', error)
        this.error = 'Proje güncellenirken bir hata oluştu.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProject(id) {
      this.loading = true
      this.error = null

      try {
        await ApiService.delete(`/Projects/${id}`)
        await this.fetchProjects() // Refresh projects list
      } catch (error) {
        console.error('Error deleting project:', error)
        this.error = 'Proje silinirken bir hata oluştu.'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Filter methods
    setFilter(filterName, value) {
      this.filters[filterName] = value
    },

    clearFilters() {
      this.filters = {
        isCompleted: null,
        isShipped: null,
        country: null,
        status: null
      }
    },

    // Pagination methods
    setCurrentPage(page) {
      this.pagination.currentPage = page
    },

    setItemsPerPage(items) {
      this.pagination.itemsPerPage = items
      this.pagination.currentPage = 1 // Reset to first page
    },

    // Utility methods
    formatDate(dateString) {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      
      return `${day}.${month}.${year}`
    },

    loadDummyData() {
      this.projects = [
        {
          id: "P0001",
          serialNumber: "SN0001",
          projectName: "DEF Şirketi",
          machineType: "Termoform",
          subModel: "Bpt-P 25/75",
          country: "Türkiye",
          product: "Ketçap",
          orderDate: "01.01.2025",
          deliveryDate: "01.07.2025",
          penaltyDate: "15.07.2025",
          robot: "Var",
          loadingMethod: "Kara",
          status: 75,
          isCompleted: false,
          isShipped: false
        },
        {
          id: "P0002",
          serialNumber: "SN0002",
          projectName: "KLM Yan Kuruluş",
          machineType: "Termoform",
          subModel: "Bpt-Y 25/40",
          country: "Almanya",
          product: "Yoğurt",
          orderDate: "01.12.2024",
          deliveryDate: "11.04.2025",
          penaltyDate: "Yok",
          robot: "Yok",
          loadingMethod: "Deniz",
          status: 45,
          isCompleted: false,
          isShipped: false
        },
        {
          id: "P0003",
          serialNumber: "SN0003",
          projectName: "ABC Şirketi",
          machineType: "Zincirli",
          subModel: "Bpz 400",
          country: "Amerika Birleşik Devletleri",
          product: "Et",
          orderDate: "01.02.2025",
          deliveryDate: "27.09.2025",
          penaltyDate: "10.10.2025",
          robot: "Var",
          loadingMethod: "Hava",
          status: 90,
          isCompleted: false,
          isShipped: false
        },
        {
          id: "P0004",
          serialNumber: "SN0004",
          projectName: "XYZ Şirketi",
          machineType: "Hazır Kap",
          subModel: "Bph-S Lineer",
          country: "Fransa",
          product: "Puding",
          orderDate: "15.03.2025",
          deliveryDate: "15.08.2025",
          penaltyDate: "Yok",
          robot: "Var",
          loadingMethod: "Deniz",
          status: 25,
          isCompleted: false,
          isShipped: false
        }
      ]
    },

    clearError() {
      this.error = null
    }
  }
})