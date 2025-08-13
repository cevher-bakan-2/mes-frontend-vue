<template>
  <div>
    <!-- Sidebar Overlay (Mobile) -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'fixed top-0 left-0 h-screen z-30 bg-gray-100 transform transition-all duration-300 ease-in-out flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        isCollapsed && !isMobile ? 'lg:w-20' : 'w-64'
      ]"
    >
      <!-- Logo Section (Fixed) -->
      <div class="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-100 relative">
        <div 
          @click="goToHome" 
          class="flex items-center w-full cursor-pointer hover:opacity-80 transition-opacity" 
          :class="{ 'lg:hidden': isCollapsed && !isMobile }"
        >
          <img src="/images/icon_transparent.png" alt="Beta-Pak Logo" class="h-12 mr-3" style="clip-path: inset(1px 0 0 0); object-fit: cover;">
          <div class="flex flex-col">
            <span class="text-2xl font-bold text-gray-900">Beta-Pak</span>
            <span class="text-sm text-gray-600">Smart Packaging</span>
          </div>
        </div>
        <div 
          v-if="isCollapsed && !isMobile" 
          @click="goToHome" 
          class="lg:flex lg:justify-center lg:items-center hidden w-full cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src="/images/icon_transparent.png" alt="Beta-Pak Logo" class="h-10 object-contain" style="clip-path: inset(0.5px 0 0 0); object-fit: cover;">
        </div>
      
        <!-- Mobile Close Button -->
        <button 
          v-if="isMobile"
          @click="$emit('close')" 
          class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:ring-2 focus:ring-inset focus:ring-blue-500 ml-1"
        >
          <span class="sr-only">Close menu</span>
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Toggle Button -->
      <button 
        @click="toggleSidebar" 
        class="hidden lg:flex items-center justify-center h-8 w-8 bg-gray-200 text-gray-700 rounded-full border border-gray-300 hover:bg-gray-300 transition-all shadow-md absolute"
        :style="{ right: '-12px' }"
      >
        <svg 
          :class="['w-5 h-5 transition-transform duration-300', isCollapsed && !isMobile ? '' : 'transform rotate-180']" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <!-- Scrollable Navigation Area -->
      <div class="flex-1 overflow-y-auto">
        <nav class="p-4 space-y-1">
          <!-- Dashboard -->
          <router-link 
            to="/dashboard" 
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group"
            :class="[
              $route.name === 'DashboardOngoing' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900',
              isCollapsed && !isMobile ? 'lg:justify-center lg:px-2' : ''
            ]"
            :title="isCollapsed && !isMobile ? 'Dashboard' : ''"
          >
            <svg 
              class="flex-shrink-0" 
              :class="[isCollapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span :class="{ 'lg:hidden': isCollapsed && !isMobile }">Dashboard</span>
            <span 
              v-if="isCollapsed && !isMobile" 
              class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              Dashboard
            </span>
          </router-link>

          <!-- Proje Ekle -->
          <router-link 
            to="/add-project" 
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group"
            :class="[
              $route.name === 'AddProject' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900',
              isCollapsed && !isMobile ? 'lg:justify-center lg:px-2' : ''
            ]"
            :title="isCollapsed && !isMobile ? 'Proje Ekle' : ''"
          >
            <img 
              src="/images/icons/new-project.png" 
              class="flex-shrink-0" 
              :class="[isCollapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
              alt="Proje Ekle"
            />
            <span :class="{ 'lg:hidden': isCollapsed && !isMobile }">Proje Ekle</span>
            <span 
              v-if="isCollapsed && !isMobile" 
              class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              Proje Ekle
            </span>
          </router-link>

          <!-- Devam Eden Projeler -->
          <router-link 
            to="/dashboard" 
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group"
            :class="[
              $route.name === 'DashboardOngoing' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900',
              isCollapsed && !isMobile ? 'lg:justify-center lg:px-2' : ''
            ]"
            :title="isCollapsed && !isMobile ? 'Devam Eden Projeler' : ''"
          >
            <img 
              src="/images/icons/product.png" 
              class="flex-shrink-0" 
              :class="[isCollapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
              alt="Devam Eden Projeler"
            />
            <span :class="{ 'lg:hidden': isCollapsed && !isMobile }">Devam Eden Projeler</span>
            <span 
              v-if="isCollapsed && !isMobile" 
              class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              Devam Eden Projeler
            </span>
          </router-link>

          <!-- Sevk Edilen Projeler -->
          <router-link 
            to="/dashboard/shipped" 
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group"
            :class="[
              $route.name === 'DashboardShipped' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900',
              isCollapsed && !isMobile ? 'lg:justify-center lg:px-2' : ''
            ]"
            :title="isCollapsed && !isMobile ? 'Sevk Edilen Projeler' : ''"
          >
            <img 
              src="/images/icons/completed-task.png" 
              class="flex-shrink-0" 
              :class="[isCollapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
              alt="Sevk Edilen Projeler"
            />
            <span :class="{ 'lg:hidden': isCollapsed && !isMobile }">Sevk Edilen Projeler</span>
            <span 
              v-if="isCollapsed && !isMobile" 
              class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              Sevk Edilen Projeler
            </span>
          </router-link>

          <!-- Tamamlanan Projeler -->
          <router-link 
            to="/dashboard/completed" 
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group"
            :class="[
              $route.name === 'DashboardCompleted' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900',
              isCollapsed && !isMobile ? 'lg:justify-center lg:px-2' : ''
            ]"
            :title="isCollapsed && !isMobile ? 'Tamamlanan Projeler' : ''"
          >
            <img 
              src="/images/icons/completed.png" 
              class="flex-shrink-0" 
              :class="[isCollapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
              alt="Tamamlanan Projeler"
            />
            <span :class="{ 'lg:hidden': isCollapsed && !isMobile }">Tamamlanan Projeler</span>
            <span 
              v-if="isCollapsed && !isMobile" 
              class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              Tamamlanan Projeler
            </span>
          </router-link>

          <router-link 
            to="/reports" 
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group"
            :class="[
              $route.name === 'Reports' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900',
              isCollapsed && !isMobile ? 'lg:justify-center lg:px-2' : ''
            ]"
            :title="isCollapsed && !isMobile ? 'Raporlar' : ''"
          >
            <img 
              src="/images/icons/bar-chart.png" 
              class="flex-shrink-0" 
              :class="[isCollapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
              alt="Raporlar"
            />
            <span :class="{ 'lg:hidden': isCollapsed && !isMobile }">Raporlar</span>
            <span 
              v-if="isCollapsed && !isMobile" 
              class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              Raporlar
            </span>
          </router-link>

          <router-link 
            to="/users" 
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group"
            :class="[
              $route.name === 'Users' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900',
              isCollapsed && !isMobile ? 'lg:justify-center lg:px-2' : ''
            ]"
            :title="isCollapsed && !isMobile ? 'Kullanıcılar' : ''"
          >
            <i 
              class="fas fa-users flex-shrink-0" 
              :class="[isCollapsed && !isMobile ? 'text-xl' : 'text-base mr-3']"
            ></i>
            <span :class="{ 'lg:hidden': isCollapsed && !isMobile }">Kullanıcılar</span>
            <span 
              v-if="isCollapsed && !isMobile" 
              class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              Kullanıcılar
            </span>
          </router-link>

          <router-link 
            to="/settings" 
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group"
            :class="[
              $route.name === 'Settings' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900',
              isCollapsed && !isMobile ? 'lg:justify-center lg:px-2' : ''
            ]"
            :title="isCollapsed && !isMobile ? 'Kullanıcı Ayarları' : ''"
          >
            <img 
              src="/images/icons/profile.png" 
              class="flex-shrink-0" 
              :class="[isCollapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
              alt="Kullanıcı Ayarları"
            />
            <span :class="{ 'lg:hidden': isCollapsed && !isMobile }">Kullanıcı Ayarları</span>
            <span 
              v-if="isCollapsed && !isMobile" 
              class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              Kullanıcı Ayarları
            </span>
          </router-link>

          <router-link 
            to="/support" 
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group"
            :class="[
              $route.name === 'Support' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900',
              isCollapsed && !isMobile ? 'lg:justify-center lg:px-2' : ''
            ]"
            :title="isCollapsed && !isMobile ? 'Destek' : ''"
          >
            <img 
              src="/images/icons/handshake.png" 
              class="flex-shrink-0" 
              :class="[isCollapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5 mr-3']" 
              alt="Destek"
            />
            <span :class="{ 'lg:hidden': isCollapsed && !isMobile }">Destek</span>
            <span 
              v-if="isCollapsed && !isMobile" 
              class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
            >
              Destek
            </span>
          </router-link>
        </nav>
      </div>

      <!-- User Profile Section -->
      <div class="border-t border-gray-200 bg-gray-100" :class="[isCollapsed && !isMobile ? 'p-2' : 'p-4']">
        <div 
          @click="goToSettings" 
          class="flex items-center cursor-pointer hover:bg-gray-200 rounded-lg transition-colors group relative"
          :class="[
            isCollapsed && !isMobile ? 'justify-center p-2' : 'mt-4 mb-6 px-4 p-2'
          ]"
          :title="isCollapsed && !isMobile ? currentUser.name + ' - ' + currentUser.role : ''"
        >
          <div class="flex-shrink-0">
            <img 
              class="rounded-full object-cover" 
              :class="[isCollapsed && !isMobile ? 'h-8 w-8' : 'h-10 w-10']"
              :src="currentUser.avatar" 
              :alt="currentUser.name"
            >
          </div>
          <div class="ml-3 overflow-hidden min-w-0" :class="{ 'lg:hidden': isCollapsed && !isMobile }">
            <p class="text-sm font-medium text-gray-900 truncate">{{ currentUser.name }}</p>
            <p class="text-xs text-gray-600 truncate">{{ currentUser.role }}</p>
            <p v-if="currentUser.email" class="text-xs text-gray-500 truncate">{{ currentUser.email }}</p>
          </div>
          <!-- Tooltip for collapsed state -->
          <div 
            v-if="isCollapsed && !isMobile" 
            class="absolute left-full ml-2 bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50"
          >
            {{ currentUser.name }}<br>{{ currentUser.role }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AppSidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'toggle-collapsed'],
  setup(props, { emit }) {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const isCollapsed = ref(false)
    const isMobile = ref(false)
    
    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
      localStorage.setItem('sidebarCollapsed', isCollapsed.value)
      emit('toggle-collapsed', isCollapsed.value)
    }
    
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 1024
    }
    
    const goToSettings = () => {
      router.push('/settings')
    }
    
    const goToHome = () => {
      router.push('/')
    }
    
    onMounted(() => {
      // Check initial sidebar state
      const savedState = localStorage.getItem('sidebarCollapsed')
      if (savedState !== null) {
        isCollapsed.value = savedState === 'true'
        emit('toggle-collapsed', isCollapsed.value)
      }
      
      // Check if mobile
      checkMobile()
      window.addEventListener('resize', checkMobile)
      
      // Emit initial state
      emit('toggle-collapsed', isCollapsed.value)
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })
    
    return {
      isCollapsed,
      isMobile,
      toggleSidebar,
      goToSettings,
      goToHome,
      currentUser: authStore.getCurrentUser
    }
  }
}
</script>