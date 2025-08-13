<template>
  <div class="min-h-screen flex overflow-hidden">
    <AppSidebar 
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
      @toggle-collapsed="handleSidebarCollapse"
    />
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300" 
         :class="[isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64', isSidebarOpen ? '' : 'ml-0']">
      <AppHeader 
        title="Ayarlar"
        page-title="Kullanıcı Ayarları"
        page-icon="fas fa-cog"
        @toggle-sidebar="isSidebarOpen = true"
      />
      <div class="flex-1 overflow-x-hidden">
        <div class="container mx-auto px-4 py-8">
          <div class="bg-white rounded-xl shadow-md p-6">
            <div class="text-center py-12">
              <h3 class="text-lg font-medium text-gray-900">Ayarlar Sayfası</h3>
              <p class="mt-1 text-gray-500">Bu sayfa geliştirilecek.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'Settings',
  components: { AppSidebar, AppHeader },
  setup() {
    const isSidebarOpen = ref(window.innerWidth >= 1024)
    const isSidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
    const handleSidebarCollapse = (collapsed) => { isSidebarCollapsed.value = collapsed }
    return { isSidebarOpen, isSidebarCollapsed, handleSidebarCollapse }
  }
}
</script>