<template>
  <div class="min-h-screen flex overflow-hidden">
    <!-- Notification Container -->
    <div v-if="notification.show" 
         :class="['notification', notification.type, notification.slideOut ? 'slide-out' : '']"
         @animationend="onNotificationAnimationEnd">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <i v-if="notification.type === 'success'" class="fas fa-check-circle text-lg"></i>
            <i v-else-if="notification.type === 'error'" class="fas fa-exclamation-circle text-lg"></i>
            <i v-else class="fas fa-info-circle text-lg"></i>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium">{{ notification.title }}</h3>
            <div class="mt-1 text-sm opacity-90" v-html="notification.message"></div>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button @click="hideNotification" class="text-white hover:text-gray-200 focus:outline-none">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppSidebar 
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
      @toggle-collapsed="handleSidebarCollapse"
    />
    
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300" 
         :class="[isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64', isSidebarOpen ? '' : 'ml-0']">
      <AppHeader 
        title="Kullanıcı Yönetimi"
        page-title="Kullanıcı Yönetimi"
        page-icon="fas fa-users"
        @toggle-sidebar="isSidebarOpen = true"
      />
      
      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-6 overflow-x-auto">
        <div class="max-w-6xl mx-auto px-4 py-8">
          <!-- User Creation Form -->
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">{{ isEditMode ? 'Kullanıcıyı Güncelle' : 'Yeni Kullanıcı Ekle' }}</h2>
            
            <form @submit.prevent="saveUser">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ad</label>
                  <input type="text" id="name" v-model="form.name" required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ad giriniz">
                </div>
                
                <!-- Surname -->
                <div>
                  <label for="surname" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Soyad</label>
                  <input type="text" id="surname" v-model="form.surname" required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Soyad giriniz">
                </div>
                
                <!-- Email -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-posta</label>
                  <input type="email" id="email" v-model="form.email" required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ornek@mail.com">
                </div>

                <!-- Phone -->
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
                  <input type="tel" id="phone" v-model="form.phone"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+90 555 555 5555">
                </div>

                <!-- Department -->
                <div>
                  <label for="department" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departman</label>
                  <select id="department" v-model="form.departmentId" required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option :value="null" disabled>Seçiniz</option>
                    <option v-for="dep in departments" :key="dep.id" :value="dep.id">{{ dep.name }}</option>
                  </select>
                </div>
                
                <!-- Permissions & Status -->
                <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <!-- Permissions -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Erişim Yetkileri</label>
                    <div class="flex items-center space-x-6 mt-1">
                      <div class="flex items-center">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">Yazma Yetkisi</label>
                        <label class="toggle-switch">
                          <input type="checkbox" v-model="form.writeAccess">
                          <span class="toggle-slider"></span>
                        </label>
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ form.writeAccess ? 'Açık' : 'Kapalı' }}</span>
                      </div>
                      <div class="flex items-center">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">Tam Erişim</label>
                        <label class="toggle-switch">
                          <input type="checkbox" v-model="form.fullAccess">
                          <span class="toggle-slider"></span>
                        </label>
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ form.fullAccess ? 'Açık' : 'Kapalı' }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- Status - Only show in edit mode -->
                  <div v-if="isEditMode" class="flex items-center">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">Durum</label>
                    <label class="toggle-switch">
                      <input type="checkbox" v-model="form.isActive">
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ form.isActive ? 'Aktif' : 'Pasif' }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Form Buttons -->
              <div class="flex justify-end items-center mt-6 space-x-4">
                <button v-if="isEditMode" type="button" @click="clearForm"
                    class="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-400">
                  <i class="fas fa-times mr-2"></i>İptal
                </button>
                <button type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <i class="fas fa-save mr-2"></i>{{ isEditMode ? 'Güncelle' : 'Kaydet' }}
                </button>
              </div>
            </form>
          </div>
          
          <!-- User List Table -->
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">Kullanıcı Listesi</h2>
            </div>
            
            <div v-if="isLoading" class="p-6 text-center text-gray-500 dark:text-gray-400">
              <i class="fas fa-spinner fa-spin mr-2"></i> Kullanıcılar yükleniyor...
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead class="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ad Soyad</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">E-posta & Telefon</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Departman</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Erişim</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durum</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  <tr v-for="user in users" :key="user.id" @click="selectUserForEdit(user)" class="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{{ user.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ user.name }} {{ user.surname }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>{{ user.email }}</div>
                      <div class="text-xs">{{ user.phone }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ user.departmentName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <span v-if="user.fullAccess" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Tam</span>
                      <span v-else-if="user.writeAccess" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Yazma</span>
                      <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">Okuma</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
                        {{ user.isActive ? 'Aktif' : 'Pasif' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center space-x-2">
                        <!-- Activate/Deactivate Button -->
                        <button @click.stop="toggleUserStatus(user)" 
                                :class="user.isActive ? 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-300 dark:border-orange-600' : 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300 dark:border-green-600'"
                                class="px-3 py-1 text-xs font-medium border rounded-md transition-colors duration-200">
                          {{ user.isActive ? 'Pasif Et' : 'Aktif Et' }}
                        </button>
                        <!-- Delete Button -->
                        <button @click.stop="deleteUser(user.id)" 
                                class="px-3 py-1 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-md transition-colors duration-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 dark:border-red-600">
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="users.length === 0">
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Kullanıcı bulunamadı.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import { ApiService } from '@/services/api.js'

export default {
  name: 'Users',
  components: { AppSidebar, AppHeader },
  setup() {
    const isSidebarOpen = ref(window.innerWidth >= 1024)
    const isSidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
    const isLoading = ref(true)
    const isEditMode = ref(false)
    const users = ref([])
    const departments = ref([])
    
    // Notification system
    const notification = reactive({
      show: false,
      type: 'success',
      title: '',
      message: '',
      slideOut: false
    })

    const initialFormData = {
      id: null,
      name: '',
      surname: '',
      email: '',
      phone: '',
      departmentId: null,
      writeAccess: false,
      fullAccess: false,
      isActive: false, // Varsayılan olarak pasif
    }
    
    const form = reactive({ ...initialFormData })

    const loadUsers = async () => {
      isLoading.value = true
      try {
        const response = await ApiService.get('/User')
        users.value = response
      } catch (error) {
        console.error("Kullanıcıları yüklerken hata oluştu:", error)
        alert("Kullanıcılar yüklenemedi. Lütfen daha sonra tekrar deneyin.")
      } finally {
        isLoading.value = false
      }
    }

    const loadDepartments = async () => {
      try {
        // Assuming an endpoint /api/Department exists
        const response = await ApiService.get('/Departments')
        departments.value = response
      } catch (error) {
        console.error("Departmanları yüklerken hata oluştu:", error)
      }
    }

    const clearForm = () => {
      Object.assign(form, initialFormData)
      isEditMode.value = false
    }
    
    // Notification functions
    const showNotification = (type, title, message, duration = 5000) => {
      notification.type = type
      notification.title = title
      notification.message = message
      notification.show = true
      notification.slideOut = false
      
      // Auto hide after duration
      setTimeout(() => {
        hideNotification()
      }, duration)
    }
    
    const hideNotification = () => {
      notification.slideOut = true
    }
    
    const onNotificationAnimationEnd = () => {
      if (notification.slideOut) {
        notification.show = false
        notification.slideOut = false
      }
    }

    const selectUserForEdit = (user) => {
      isEditMode.value = true
      form.id = user.id
      form.name = user.name
      form.surname = user.surname
      form.email = user.email
      form.phone = user.phone
      form.departmentId = user.departmentId
      form.writeAccess = user.writeAccess
      form.fullAccess = user.fullAccess
      form.isActive = user.isActive
      window.scrollTo(0, 0) // Scroll to top to see the form
    }

    const saveUser = async () => {
      const payload = { ...form }
      // Backend expects departmentId to be a number
      payload.departmentId = Number(payload.departmentId)

      // Add frontendBaseUrl for new user creation
      if (!isEditMode.value) {
        payload.frontendBaseUrl = window.location.origin
      }

      try {
        if (isEditMode.value) {
          // Update user - Correct endpoint is /api/User/{id}
          await ApiService.put(`/User/${payload.id}`, payload)
          showNotification('success', 'Başarılı!', 'Kullanıcı başarıyla güncellendi.')
        } else {
          // Create new user
          await ApiService.post('/User', payload)
          showNotification('success', 'Kullanıcı Oluşturuldu!', 
            `Kullanıcı başarıyla oluşturuldu.<br><br>
            <strong>E-posta doğrulaması:</strong><br>
            Kullanıcıya e-posta gönderildi. E-posta adresini kontrol edin ve gelen linke tıklayarak parolanızı oluşturun ve hesabınızı aktifleştirin.`)
        }
        await loadUsers()
        clearForm()
      } catch (error) {
        console.error("Kullanıcı kaydedilirken hata oluştu:", error)
        showNotification('error', 'Hata!', error.message || 'İşlem sırasında bir hata oluştu.')
      }
    }
    
    const deleteUser = async (userId) => {
      if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
        try {
          // Backend expects a DELETE request to /api/User/{id}
          await ApiService.delete(`/User/${userId}`)
          showNotification('success', 'Başarılı!', 'Kullanıcı başarıyla silindi.')
          await loadUsers()
          clearForm() // If the deleted user was in edit mode
        } catch (error) {
          console.error("Kullanıcı silinirken hata oluştu:", error)
          showNotification('error', 'Hata!', error.message || 'Kullanıcı silinirken bir hata oluştu.')
        }
      }
    }
    
    const toggleUserStatus = async (user) => {
      const action = user.isActive ? 'deactivate' : 'activate'
      const actionText = user.isActive ? 'pasif' : 'aktif'
      const confirmMessage = `Bu kullanıcıyı ${actionText} etmek istediğinizden emin misiniz?`
      
      if (confirm(confirmMessage)) {
        try {
          // Send PUT request to activate/deactivate endpoint
          await ApiService.put(`/User/${user.id}/${action}`)
          showNotification('success', 'Başarılı!', `Kullanıcı başarıyla ${actionText} edildi.`)
          await loadUsers()
          clearForm() // If the updated user was in edit mode
        } catch (error) {
          console.error(`Kullanıcı ${actionText} edilirken hata oluştu:`, error)
          showNotification('error', 'Hata!', error.message || `Kullanıcı ${actionText} edilirken bir hata oluştu.`)
        }
      }
    }
    
    // Handle sidebar collapse
    const handleSidebarCollapse = (isCollapsed) => {
      isSidebarCollapsed.value = isCollapsed
      localStorage.setItem('sidebarCollapsed', isCollapsed)
    }

    onMounted(() => {
      loadUsers()
      loadDepartments()
    })
    
    return {
      isSidebarOpen,
      isSidebarCollapsed,
      isLoading,
      isEditMode,
      users,
      departments,
      form,
      notification,
      saveUser,
      deleteUser,
      toggleUserStatus,
      selectUserForEdit,
      clearForm,
      showNotification,
      hideNotification,
      onNotificationAnimationEnd,
      handleSidebarCollapse,
    }
  }
}
</script>

<style scoped>
/* Toggle Switch Styles */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3B82F6;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.dark .toggle-slider {
  background-color: #374151;
}

.dark input:checked + .toggle-slider {
  background-color: #3B82F6;
}

/* Notification Styles */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.notification.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.notification.info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.notification.slide-out {
  animation: slideOut 0.3s ease-in forwards;
}
</style>