<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
    <div class="flex justify-between items-center">
      <!-- Sol taraf: Sidebar toggle ve başlıklar -->
      <div class="flex items-center">
        <button @click="$emit('toggle-sidebar')" class="lg:hidden mr-3 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Ana başlık ve alt başlık -->
        <div class="flex flex-col">
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">Üretim Yönetim & Takip Sistemi</h1>
          <div class="flex items-center mt-1">
            <img v-if="pageIcon && pageIcon.startsWith('/images/')" :src="pageIcon" class="w-4 h-4 mr-2" alt="Page Icon">
            <i v-else :class="pageIcon" class="text-gray-500 dark:text-gray-400 mr-2"></i>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ pageTitle }}</span>
          </div>
        </div>
      </div>
      
      <!-- Sağ taraf: Tarih/saat ve kullanıcı menüsü -->
      <div class="flex items-center space-x-4">
        <!-- Tarih ve saat -->
        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <i class="fas fa-calendar mr-2 text-gray-500 dark:text-gray-400"></i>
          <span>{{ currentDateTime }}</span>
        </div>
        
        <!-- User profile dropdown -->
        <div class="relative group">
          <button @click="toggleUserMenu" class="flex items-center space-x-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 cursor-pointer">
            <img :src="currentUser.avatar" :alt="currentUser.name" class="h-8 w-8 rounded-full border-2 border-gray-200 dark:border-gray-600">
            <div class="hidden md:block">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ currentUser.name }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400 block">{{ currentUser.role }}</span>
            </div>
            <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Dropdown menu -->
          <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ currentUser.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ currentUser.email }}</p>
            </div>
            <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ayarlar
              </div>
            </router-link>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış Yap
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      default: 'MES Sistemi'
    },
    pageTitle: {
      type: String,
      default: 'Dashboard'
    },
    pageIcon: {
      type: String,
      default: 'fas fa-tachometer-alt'
    }
  },
  emits: ['toggle-sidebar'],
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const isUserMenuOpen = ref(false)
    const currentDateTime = ref('')
    
    // Tarih ve saat güncelleme fonksiyonu
    const updateDateTime = () => {
      const now = new Date()
      const day = String(now.getDate()).padStart(2, '0')
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = now.getFullYear()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      
      currentDateTime.value = `${day}/${month}/${year} - ${hours}:${minutes}`
    }
    
    const toggleUserMenu = () => {
      isUserMenuOpen.value = !isUserMenuOpen.value
    }
    
    const logout = () => {
      authStore.logout()
      router.push('/login')
    }
    
    // Close menu when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.group')) {
        isUserMenuOpen.value = false
      }
    }
    
    let dateInterval
    
    onMounted(() => {
      updateDateTime()
      // Her dakika tarih ve saati güncelle
      dateInterval = setInterval(updateDateTime, 60000)
      
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      if (dateInterval) {
        clearInterval(dateInterval)
      }
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      currentUser: authStore.getCurrentUser,
      isUserMenuOpen,
      toggleUserMenu,
      logout,
      currentDateTime
    }
  }
}
</script>