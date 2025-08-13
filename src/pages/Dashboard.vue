<template>
  <div class="min-h-screen flex overflow-hidden">
    <!-- Sidebar -->
    <AppSidebar 
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
      @toggle-collapsed="handleSidebarCollapse"
    />

    <!-- Ana İçerik -->
    <div 
      class="flex-1 flex flex-col min-w-0 transition-all duration-300" 
      :class="[isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64', isSidebarOpen ? '' : 'ml-0']"
    >
      <!-- Header -->
      <AppHeader 
        title="Makine Durum Tablosu"
        :page-title="pageTitle"
        :page-icon="pageIcon"
        @toggle-sidebar="isSidebarOpen = true"
      />

      <!-- Ana İçerik Alanı -->
      <div class="flex-1 overflow-x-hidden">
        <div class="container mx-auto px-4 py-8">
          <!-- Üretim Siparişleri Tablosu -->
          <div class="table-container">
            <!-- Tablo Başlığı -->
            <div class="table-header">
              <h1 class="table-title">{{ pageTitle }}</h1>
              <p class="table-subtitle">Toplam {{ sortedAndFilteredOrders.length }} proje</p>
            </div>

            <!-- Loading State -->
            <div v-if="projectsStore.isLoading" class="loading-overlay">
              <div class="loading-spinner"></div>
              <span class="ml-2 text-gray-600">Projeler yükleniyor...</span>
            </div>

            <!-- Error State -->
            <div v-else-if="projectsStore.hasError" class="p-4 text-center text-red-600">
              {{ projectsStore.error }}
            </div>

            <!-- Empty State -->
            <div v-else-if="sortedAndFilteredOrders.length === 0" class="empty-state">
              <div class="empty-state-icon">
                <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="empty-state-title">Proje bulunamadı</h3>
              <p class="empty-state-description">Seçilen kriterlere uygun proje bulunmamaktadır.</p>
            </div>

            <!-- Tablo -->
            <div v-else class="overflow-x-auto">
              <table class="data-table">
                <thead>
                  <tr>
                    <th 
                      v-for="column in sortableColumns" 
                      :key="column.key" 
                      class="sortable"
                      :class="[
                        'sortable',
                        {'centered': column.centered},
                        {'active': sortKey === column.key}
                      ]"
                      @click="sortBy(column.key)"
                    >
                      <div class="flex items-center justify-between">
                        <span>{{ column.label }}</span>
                        <div class="flex items-center gap-2">
                          <!-- Sort Icon -->
                          <svg 
                            v-if="sortKey === column.key" 
                            class="sort-icon active" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                          >
                            <path 
                              v-if="sortAsc" 
                              stroke-linecap="round" 
                              stroke-linejoin="round" 
                              stroke-width="2" 
                              d="M5 15l7-7 7 7"
                            />
                            <path 
                              v-else
                              stroke-linecap="round" 
                              stroke-linejoin="round" 
                              stroke-width="2" 
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          <svg 
                            v-else 
                            class="sort-icon" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          
                          <!-- Filter Button -->
                          <button 
                            v-if="column.filterable"
                            @click.stop="toggleFilter(column.key, $event)"
                            class="filter-button compact"
                            :class="[
                              {'has-filter': hasActiveFilter(column.key)},
                              {'active': activeFilter === column.key}
                            ]"
                          >
                            <svg class="filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707l-2 2A1 1 0 0111 21v-6.586a1 1 0 00-.293-.707L4.293 7.293A1 1 0 014 6.586V4z" />
                            </svg>
                            <span v-if="hasActiveFilter(column.key)" class="filter-count compact">
                              {{ columnFilters[column.key]?.length || 0 }}
                            </span>
                          </button>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="order in paginatedOrders" 
                    :key="order.id || order.serialNumber"
                    @click="goToProjectDetail(order.id || order.serialNumber)"
                    class="cursor-pointer"
                  >
                    <td>{{ order.serialNumber || order.id }}</td>
                    <td>{{ order.projectName }}</td>
                    <td>{{ order.machineType }}</td>
                    <td>{{ order.subModel }}</td>
                    <td>{{ order.product }}</td>
                    <td class="centered">
                      <span v-if="order.robot" class="status-badge completed">Var</span>
                      <span v-else class="status-badge delayed">Yok</span>
                    </td>
                    <td>{{ order.orderDate }}</td>
                    <td>{{ order.revisionDate }}</td>
                    <td>{{ order.deliveryDate }}</td>
                    <td>{{ order.penaltyDate }}</td>
                    <td>{{ order.country }}</td>
                    <td>{{ order.city }}</td>
                    <td>{{ order.loadingMethod }}</td>
                    <td class="centered">
                      <div class="status-progress-container">
                        <div class="status-progress-wrapper">
                          <div class="status-progress-bar">
                            <div 
                              class="status-progress-fill"
                              :class="{
                                'completed': order.status >= 70,
                                'in-progress': order.status >= 40 && order.status < 70,
                                'delayed': order.status < 40
                              }"
                              :style="{ width: order.status + '%' }"
                            ></div>
                          </div>
                          <span class="status-percentage">%{{ order.status }}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Sayfalama -->
            <div class="pagination-container">
              <div class="pagination-info">
                {{ paginationInfo }}
              </div>
              
              <div class="pagination-controls">
                <div class="items-per-page">
                  <span>Sayfa başına:</span>
                  <select v-model="itemsPerPage" @change="onItemsPerPageChange">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
                
                <div class="pagination-buttons">
                  <!-- Previous Button -->
                  <button 
                    @click="previousPage" 
                    :disabled="currentPage === 1"
                    class="pagination-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <!-- Start Ellipsis -->
                  <span v-if="showStartEllipsis" class="pagination-ellipsis">...</span>
                  
                  <!-- Page Numbers -->
                  <button 
                    v-for="page in visiblePages" 
                    :key="page"
                    @click="goToPage(page)"
                    class="pagination-btn"
                    :class="{'active': page === currentPage}"
                  >
                    {{ page }}
                  </button>
                  
                  <!-- End Ellipsis -->
                  <span v-if="showEndEllipsis" class="pagination-ellipsis">...</span>
                  
                  <!-- Next Button -->
                  <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                    class="pagination-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Grafikler Bölümü -->
          <div class="charts-section">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">İstatistikler</h2>
            
            <div class="charts-grid">
              <!-- Makine Tipi Grafiği -->
              <div class="chart-card">
                <div class="chart-header">
                  <h3 class="chart-title">
                    <img src="/images/icons/product.png" alt="Makine Tipi" class="chart-icon">
                    Makine Tipi Dağılımı
                  </h3>
                </div>
                <div class="chart-content">
                  <div id="chart-types" class="chart-container"></div>
                  <div class="chart-legend">
                    <div 
                      v-for="(item, index) in typeLegendItems" 
                      :key="item"
                      class="legend-item"
                    >
                      <div 
                        class="legend-color" 
                        :style="{ backgroundColor: getTypeColor(index) }"
                      ></div>
                      <span class="legend-label">{{ item }}</span>
                      <span class="legend-count">
                        ({{ typeChartData.find(d => d.type === item)?.count || 0 }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Model Grafiği -->
              <div class="chart-card">
                <div class="chart-header">
                  <h3 class="chart-title">
                    <img src="/images/icons/product.png" alt="Model" class="chart-icon">
                    Model Dağılımı
                  </h3>
                </div>
                <div class="chart-content">
                  <div id="chart-models" class="chart-container"></div>
                  <div class="chart-legend">
                    <div 
                      v-for="(item, index) in modelLegendItems" 
                      :key="item"
                      class="legend-item"
                    >
                      <div 
                        class="legend-color" 
                        :style="{ backgroundColor: getModelColor(index) }"
                      ></div>
                      <span class="legend-label">{{ item }}</span>
                      <span class="legend-count">
                        ({{ modelChartData.find(d => d.model === item)?.count || 0 }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ürün Grafiği -->
              <div class="chart-card">
                <div class="chart-header">
                  <h3 class="chart-title">
                    <img src="/images/icons/product.png" alt="Ürün" class="chart-icon">
                    Ürün Dağılımı
                  </h3>
                </div>
                <div class="chart-content">
                  <div id="chart-products" class="chart-container"></div>
                  <div class="chart-legend">
                    <div 
                      v-for="(item, index) in productLegendItems" 
                      :key="item"
                      class="legend-item"
                    >
                      <div 
                        class="legend-color" 
                        :style="{ backgroundColor: getProductColor(index) }"
                      ></div>
                      <span class="legend-label">{{ item }}</span>
                      <span class="legend-count">
                        ({{ productChartData.find(d => d.model === item)?.count || 0 }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- İlerleme Durumu Grafiği -->
              <div class="chart-card">
                <div class="chart-header">
                  <h3 class="chart-title">
                    <img src="/images/icons/statisctics.png" alt="İlerleme" class="chart-icon">
                    İlerleme Durumu
                  </h3>
                </div>
                <div class="chart-content">
                  <div id="chart-progress-summary" class="chart-container"></div>
                  <div class="chart-legend">
                    <div 
                      v-for="item in progressLegendItems" 
                      :key="item.category"
                      class="legend-item"
                    >
                      <div 
                        class="legend-color" 
                        :style="{ backgroundColor: item.color }"
                      ></div>
                      <span class="legend-label">{{ item.category }}</span>
                      <span class="legend-count">
                        ({{ item.count }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ülke Grafiği -->
              <div class="chart-card">
                <div class="chart-header">
                  <h3 class="chart-title">
                    <img src="/images/icons/business.png" alt="Ülke" class="chart-icon">
                    Ülke Dağılımı
                  </h3>
                </div>
                <div class="chart-content">
                  <div id="chart-countries" class="chart-container"></div>
                  <div class="chart-legend">
                    <div 
                      v-for="(item, index) in countryLegendItems" 
                      :key="item"
                      class="legend-item"
                    >
                      <div 
                        class="legend-color" 
                        :style="{ backgroundColor: getCountryColor(index) }"
                      ></div>
                      <span class="legend-label">{{ item }}</span>
                      <span class="legend-count">
                        ({{ countryChartData.find(d => d.country === item)?.count || 0 }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Dropdown -->
    <div 
      v-if="activeFilter" 
      class="filter-dropdown"
      :style="getDropdownPosition()"
      @click.stop
    >
      <div class="filter-dropdown-header">
        <h4 class="filter-dropdown-title">
          {{ sortableColumns.find(col => col.key === activeFilter)?.label }} Filtresi
        </h4>
      </div>
      
      <div class="filter-dropdown-options">
        <div 
          v-for="option in getFilterOptions(activeFilter)" 
          :key="option"
          class="filter-option"
          :class="{'selected': isFilterOptionSelected(activeFilter, option)}"
          @click="toggleFilterOption(activeFilter, option)"
        >
          <input 
            type="checkbox" 
            :checked="isFilterOptionSelected(activeFilter, option)"
            @change="toggleFilterOption(activeFilter, option)"
          >
          <span>{{ option }}</span>
        </div>
      </div>
      
      <div class="filter-dropdown-footer">
        <button 
          @click="clearFilter(activeFilter)"
          class="clear-filter-btn"
        >
          Filtreyi Temizle
        </button>
        <span class="text-sm text-gray-500">
          {{ columnFilters[activeFilter]?.length || 0 }} seçili
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import ApexCharts from 'apexcharts'

export default {
  name: 'Dashboard',
  components: {
    AppSidebar,
    AppHeader
  },
  props: {
    projectType: {
      type: String,
      default: 'ongoing',
      validator: (value) => ['ongoing', 'completed', 'shipped'].includes(value)
    }
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const projectsStore = useProjectsStore()
    
    const isSidebarOpen = ref(window.innerWidth >= 1024)
    const isSidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
    
    // Sorting and filtering
    const sortKey = ref('id')
    const sortAsc = ref(false)
    const activeFilter = ref(null)
    const columnFilters = ref({})
    const dropdownPosition = ref({ top: 0, left: 0 })
    
    // Pagination
    const itemsPerPage = ref(5)
    const currentPage = ref(1)
    
    // Chart data
    const charts = ref({
      typeChart: null,
      modelChart: null,
      productChart: null,
      progressChart: null,
      countryChart: null
    })
    
    // Legend items
    const typeLegendItems = ref([])
    const modelLegendItems = ref([])
    const productLegendItems = ref([])
    const progressLegendItems = ref([])
    const countryLegendItems = ref([])
    
    // Chart colors
    const typeColors = ['#6366f1', '#93c5fd', '#60a5fa', '#818cf8', '#a5b4fc']
    const modelColors = ['#3b82f6', '#f59e42', '#10b981', '#ef4444', '#6366f6', '#f472b6', '#fbbf24', '#0ea5e9', '#a21caf', '#eab308']
    const productColors = ['#FF1493', '#00BFFF', '#4169E1', '#8A2BE2', '#FF69B4']
    const progressColors = ['#22c55e', '#f97316', '#ef4444']
    const countryColors = ['#00BFFF', '#FFA500', '#9370DB', '#FF69B4', '#3CB371', '#FFD700', '#FF6347']
    
    // Sortable columns configuration
    const sortableColumns = ref([
      { key: 'serialNumber', label: 'Seri No', filterable: false },
      { key: 'projectName', label: 'Firma', filterable: true },
      { key: 'machineType', label: 'Makine', filterable: true },
      { key: 'subModel', label: 'Model', filterable: true },
      { key: 'product', label: 'Ürün', filterable: true },
      { key: 'robot', label: 'Robot', centered: true, filterable: true },
      { key: 'orderDate', label: 'Sipariş', filterable: false },
      { key: 'revisionDate', label: 'Revize', filterable: false },
      { key: 'deliveryDate', label: 'Teslim', filterable: false },
      { key: 'penaltyDate', label: 'Cezai', filterable: false },
      { key: 'country', label: 'Ülke', filterable: true },
      { key: 'city', label: 'Şehir', filterable: true },
      { key: 'loadingMethod', label: 'Yükleme', filterable: true },
      { key: 'status', label: 'Durum', centered: true, filterable: false }
    ])
    
    // URL parametrelerine göre sayfa başlığı
    const pageTitle = computed(() => {
      switch (props.projectType) {
        case 'completed':
          return 'Tamamlanan Projeler'
        case 'shipped':
          return 'Sevk Edilen Projeler'
        default:
          return 'Devam Eden Projeler'
      }
    })
    
    // URL parametrelerine göre sayfa ikonu
    const pageIcon = computed(() => {
      switch (props.projectType) {
        case 'completed':
          return '/images/icons/completed.png'
        case 'shipped':
          return '/images/icons/completed-task.png'
        default:
          return '/images/icons/product.png'
      }
    })
    
    // Computed properties for data processing
    const sortedAndFilteredOrders = computed(() => {
      let result = [...projectsStore.getAllProjects]
      
      // Props'a göre filtreleme (bayraklar)
      if (props.projectType === 'completed') {
        result = result.filter(order => order.isCompleted === true)
      } else if (props.projectType === 'shipped') {
        result = result.filter(order => order.isShipped === true)
      } else {
        // ongoing
        result = result.filter(order => order.isCompleted === false && order.isShipped === false)
      }
      
      // Apply column filters
      Object.keys(columnFilters.value).forEach(columnKey => {
        const selectedOptions = columnFilters.value[columnKey]
        if (selectedOptions && selectedOptions.length > 0) {
          result = result.filter(order => {
            const value = order[columnKey]
            
            if (columnKey === 'product' && value && typeof value === 'string' && value.includes(',')) {
              const products = value.split(',').map(p => p.trim())
              return selectedOptions.some(selectedProduct => 
                products.includes(selectedProduct)
              )
            } else {
              return selectedOptions.includes(value)
            }
          })
        }
      })
      
      return result.sort((a, b) => {
        // ID yoksa seriNo'ya göre sırala
        let sortKeyValue = sortKey.value
        if (sortKeyValue === 'id' && (!a.id || !b.id)) {
          sortKeyValue = 'serialNumber'
        }
        
        let valueA = a[sortKeyValue]
        let valueB = b[sortKeyValue]
        
        if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
          valueA = Number(valueA)
          valueB = Number(valueB)
        }
        else if (sortKeyValue.includes('Date')) {
          const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('.')
            return `${year}-${month}-${day}`
          }
          valueA = parseDate(valueA)
          valueB = parseDate(valueB)
        }
        
        if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase()
        }
        if (typeof valueB === 'string') {
          valueB = valueB.toLowerCase()
        }
        
        if (valueA < valueB) return sortAsc.value ? -1 : 1
        if (valueA > valueB) return sortAsc.value ? 1 : -1
        return 0
      })
    })
    
    // Pagination computed properties
    const paginatedOrders = computed(() => {
      const itemsPerPageValue = parseInt(itemsPerPage.value) || 5
      const start = (currentPage.value - 1) * itemsPerPageValue
      const end = start + itemsPerPageValue
      return sortedAndFilteredOrders.value.slice(start, end)
    })
    
    const totalPages = computed(() => {
      const itemsPerPageValue = parseInt(itemsPerPage.value) || 5
      return Math.ceil(sortedAndFilteredOrders.value.length / itemsPerPageValue)
    })
    
    const paginationInfo = computed(() => {
      const total = sortedAndFilteredOrders.value.length
      const itemsPerPageValue = parseInt(itemsPerPage.value) || 5
      const start = (currentPage.value - 1) * itemsPerPageValue + 1
      const end = Math.min(currentPage.value * itemsPerPageValue, total)
      return `${start}-${end} / ${total} kayıt`
    })
    
    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      const halfVisible = Math.floor(maxVisible / 2)
      
      let start = Math.max(1, currentPage.value - halfVisible)
      let end = Math.min(totalPages.value, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })
    
    const showStartEllipsis = computed(() => {
      return visiblePages.value[0] > 1
    })
    
    const showEndEllipsis = computed(() => {
      return visiblePages.value[visiblePages.value.length - 1] < totalPages.value
    })
    
    // Chart data computed properties
    const typeChartData = computed(() => {
      const typeCount = {}
      projectsStore.getAllProjects.forEach(order => {
        const type = order.machineType || 'Bilinmiyor'
        typeCount[type] = (typeCount[type] || 0) + 1
      })
      
      // Update legend items
      typeLegendItems.value = Object.keys(typeCount)
      
      return Object.keys(typeCount).map(type => ({
        type: type,
        count: typeCount[type]
      }))
    })
    
    const modelChartData = computed(() => {
      const modelCount = {}
      projectsStore.getAllProjects.forEach(order => {
        const model = order.subModel || 'Bilinmiyor'
        modelCount[model] = (modelCount[model] || 0) + 1
      })
      
      // Update legend items
      modelLegendItems.value = Object.keys(modelCount)
      
      return Object.keys(modelCount).map(model => ({
        model: model,
        count: modelCount[model]
      }))
    })
    
    const productChartData = computed(() => {
      const productCount = {}
      
      projectsStore.getAllProjects.forEach(order => {
        const product = order.product || 'Bilinmiyor'
        
        // Eğer virgül içeriyorsa, her ürünü ayrı ayrı say
        if (product.includes(',')) {
          const products = product.split(',').map(p => p.trim())
          products.forEach(singleProduct => {
            if (singleProduct && singleProduct !== '') {
              productCount[singleProduct] = (productCount[singleProduct] || 0) + 1
            }
          })
        } else {
          productCount[product] = (productCount[product] || 0) + 1
        }
      })
      
      // Update legend items
      productLegendItems.value = Object.keys(productCount)
      
      return Object.keys(productCount).map(product => ({
        model: product,
        count: productCount[product]
      }))
    })
    
    const progressChartData = computed(() => {
      const statusGroups = {
        high: { category: "Yeşil (≥ %70)", count: 0, color: "#22c55e" },
        medium: { category: "Turuncu (%40–69)", count: 0, color: "#f97316" },
        low: { category: "Kırmızı (< %40)", count: 0, color: "#ef4444" }
      }
      
      projectsStore.getAllProjects.forEach(order => {
        if (order.status >= 70) {
          statusGroups.high.count++
        } else if (order.status >= 40) {
          statusGroups.medium.count++
        } else {
          statusGroups.low.count++
        }
      })
      
      // Update legend items
      progressLegendItems.value = Object.values(statusGroups)
      
      return Object.values(statusGroups)
    })
    
    const countryChartData = computed(() => {
      const countryCount = {}
      projectsStore.getAllProjects.forEach(order => {
        const country = order.country || 'Bilinmiyor'
        countryCount[country] = (countryCount[country] || 0) + 1
      })
      
      // Update legend items
      countryLegendItems.value = Object.keys(countryCount)
      
      return Object.keys(countryCount).map(country => ({
        country: country,
        count: countryCount[country]
      }))
    })
    
    // Methods
    const handleSidebarCollapse = (collapsed) => {
      isSidebarCollapsed.value = collapsed
    }
    
    const goToProjectDetail = (id) => {
      router.push(`/project/${id}`)
    }
    
    const sortBy = (key) => {
      if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value
      } else {
        sortKey.value = key
        sortAsc.value = true
      }
    }
    
    // Filter methods
    const toggleFilter = (columnKey, event) => {
      if (activeFilter.value === columnKey) {
        activeFilter.value = null
      } else {
        activeFilter.value = columnKey
        calculateDropdownPosition(event)
      }
    }
    
    const calculateDropdownPosition = (event) => {
      nextTick(() => {
        const button = event.target.closest('button')
        const rect = button.getBoundingClientRect()
        
        // Calculate position
        let top = rect.bottom + 4
        let left = rect.left
        
        // Check if dropdown would go off-screen
        const dropdownWidth = 200
        const dropdownHeight = 300
        
        // Adjust horizontal position if needed
        if (left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 10
        }
        
        // Adjust vertical position if needed
        if (top + dropdownHeight > window.innerHeight) {
          top = rect.top - dropdownHeight - 4
        }
        
        dropdownPosition.value = { top: `${top}px`, left: `${left}px` }
      })
    }
    
    const getDropdownPosition = () => {
      return dropdownPosition.value
    }
    
    const getFilterOptions = (columnKey) => {
      const allValues = []
      
      projectsStore.getAllProjects.forEach(order => {
        const value = order[columnKey]
        if (value && value !== null && value !== undefined && value !== '') {
          // Eğer ürün sütunu ise ve virgül içeriyorsa, parçala
          if (columnKey === 'product' && value.includes(',')) {
            const products = value.split(',').map(p => p.trim())
            allValues.push(...products)
          } else {
            allValues.push(value)
          }
        }
      })
      
      // Tekrar eden değerleri kaldır ve sırala
      const uniqueValues = [...new Set(allValues)]
      return uniqueValues.sort()
    }
    
    const hasActiveFilter = (columnKey) => {
      return columnFilters.value[columnKey] && columnFilters.value[columnKey].length > 0
    }
    
    const isFilterOptionSelected = (columnKey, option) => {
      return columnFilters.value[columnKey] && columnFilters.value[columnKey].includes(option)
    }
    
    const toggleFilterOption = (columnKey, option) => {
      if (!columnFilters.value[columnKey]) {
        columnFilters.value[columnKey] = []
      }
      
      const index = columnFilters.value[columnKey].indexOf(option)
      if (index > -1) {
        columnFilters.value[columnKey].splice(index, 1)
      } else {
        columnFilters.value[columnKey].push(option)
      }
    }
    
    const clearFilter = (columnKey) => {
      if (columnFilters.value[columnKey]) {
        columnFilters.value[columnKey] = []
      }
      activeFilter.value = null
    }
    
    // Chart color methods
    const getTypeColor = (index) => {
      return typeColors[index % typeColors.length]
    }
    
    const getModelColor = (index) => {
      return modelColors[index % modelColors.length]
    }
    
    const getProductColor = (index) => {
      return productColors[index % productColors.length]
    }
    
    const getCountryColor = (index) => {
      return countryColors[index % countryColors.length]
    }
    
    // Pagination methods
    const goToPage = (page) => {
      currentPage.value = page
    }
    
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }
    
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }
    
    const onItemsPerPageChange = () => {
      // Reset to first page when changing items per page
      currentPage.value = 1
    }
    
    // Chart initialization methods
    const initCharts = () => {
      if (projectsStore.getAllProjects.length === 0) return
      
      initTypeChart()
      initModelChart()
      initProductChart()
      initProgressSummaryChart()
      initCountryChart()
    }
    
    const updateCharts = () => {
      if (projectsStore.getAllProjects.length === 0) return
      
      if (charts.value.typeChart) {
        charts.value.typeChart.updateOptions({
          series: typeChartData.value.map(item => item.count),
          labels: typeChartData.value.map(item => item.type)
        })
      }
      
      if (charts.value.modelChart) {
        charts.value.modelChart.updateOptions({
          series: modelChartData.value.map(item => item.count),
          labels: modelChartData.value.map(item => item.model)
        })
      }
      
      if (charts.value.productChart) {
        charts.value.productChart.updateOptions({
          series: productChartData.value.map(item => item.count),
          labels: productChartData.value.map(item => item.model)
        })
      }
      
      if (charts.value.progressChart) {
        charts.value.progressChart.updateOptions({
          series: progressChartData.value.map(item => item.count),
          labels: progressChartData.value.map(item => item.category),
          colors: progressChartData.value.map(item => item.color)
        })
      }
      
      if (charts.value.countryChart) {
        charts.value.countryChart.updateOptions({
          series: countryChartData.value.map(item => item.count),
          labels: countryChartData.value.map(item => item.country)
        })
      }
    }
    
    const initTypeChart = () => {
      if (projectsStore.getAllProjects.length === 0) return
      
      const options = {
        series: typeChartData.value.map(item => item.count),
        labels: typeChartData.value.map(item => item.type),
        chart: {
          type: 'pie',
          height: 180,
          fontFamily: 'Inter, system-ui, sans-serif',
          toolbar: {
            show: false
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          },
          plotOptions: {
            pie: {
              customScale: 0.9,
              expandOnClick: false,
              donut: {
                size: '0%'
              },
              dataLabels: {
                offset: 0
              }
            }
          }
        },
        colors: typeColors,
        stroke: {
          width: 2,
          colors: ['#ffffff']
        },
        fill: {
          opacity: 1
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opts) {
            const count = opts.w.globals.series[opts.seriesIndex]
            const total = opts.w.globals.series.reduce((a, b) => a + b, 0)
            const percent = (count / total * 100).toFixed(0)
            return `${percent}%\n${count} mak.`
          },
          textAnchor: 'middle',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 'bold',
            colors: ['#ffffff']
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            opacity: 0.5
          },
          position: 'centroid',
          offsetX: 0,
          offsetY: 0,
          anchor: 'center',
          distributed: false,
          total: {
            show: false
          }
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif'
          },
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const label = w.globals.labels[seriesIndex]
            const value = series[seriesIndex]
            const percentage = w.globals.seriesTotals[seriesIndex] / w.globals.seriesTotals.reduce((a, b) => a + b, 0) * 100
            
            return `<div class="apexcharts-tooltip-box">
              <div class="p-2">
                <div class="font-semibold">${label} – %${percentage.toFixed(1)}</div>
                <div>${value} makine</div>
              </div>
            </div>`
          }
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'none'
            }
          }
        },
        responsive: [{
          breakpoint: 640,
          options: {
            chart: {
              height: 180,
              width: '100%'
            }
          }
        }]
      }

      charts.value.typeChart = new ApexCharts(document.querySelector("#chart-types"), options)
      charts.value.typeChart.render()
    }
    
    const initModelChart = () => {
      if (projectsStore.getAllProjects.length === 0) return
      
      const options = {
        series: modelChartData.value.map(item => item.count),
        labels: modelChartData.value.map(item => item.model),
        chart: {
          type: 'pie',
          height: 180,
          fontFamily: 'Inter, system-ui, sans-serif',
          toolbar: {
            show: false
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          },
          plotOptions: {
            pie: {
              customScale: 0.9,
              expandOnClick: false,
              donut: {
                size: '0%'
              },
              dataLabels: {
                offset: 0
              }
            }
          }
        },
        colors: modelColors,
        stroke: {
          width: 2,
          colors: ['#ffffff']
        },
        fill: {
          opacity: 1
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opts) {
            const count = opts.w.globals.series[opts.seriesIndex]
            const total = opts.w.globals.series.reduce((a, b) => a + b, 0)
            const percent = (count / total * 100).toFixed(0)
            return `${percent}%\n${count} mak.`
          },
          textAnchor: 'middle',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 'bold',
            colors: ['#ffffff']
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            opacity: 0.5
          },
          position: 'centroid',
          offsetX: 0,
          offsetY: 0,
          anchor: 'center',
          distributed: false,
          total: {
            show: false
          }
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif'
          },
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const label = w.globals.labels[seriesIndex]
            const value = series[seriesIndex]
            const percentage = w.globals.seriesTotals[seriesIndex] / w.globals.seriesTotals.reduce((a, b) => a + b, 0) * 100
            
            return `<div class="apexcharts-tooltip-box">
              <div class="p-2">
                <div class="font-semibold">${label} – %${percentage.toFixed(1)}</div>
                <div>${value} makine</div>
              </div>
            </div>`
          }
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'none'
            }
          }
        },
        responsive: [{
          breakpoint: 640,
          options: {
            chart: {
              height: 180,
              width: '100%'
            }
          }
        }]
      }

      charts.value.modelChart = new ApexCharts(document.querySelector("#chart-models"), options)
      charts.value.modelChart.render()
    }
    
    const initProductChart = () => {
      if (projectsStore.getAllProjects.length === 0) return
      
      const options = {
        series: productChartData.value.map(item => item.count),
        labels: productChartData.value.map(item => item.model),
        chart: {
          type: 'pie',
          height: 180,
          fontFamily: 'Inter, system-ui, sans-serif',
          toolbar: {
            show: false
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          },
          plotOptions: {
            pie: {
              customScale: 0.9,
              expandOnClick: false,
              donut: {
                size: '0%'
              },
              dataLabels: {
                offset: 0
              }
            }
          }
        },
        colors: productColors,
        stroke: {
          width: 2,
          colors: ['#ffffff']
        },
        fill: {
          opacity: 1
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opts) {
            const count = opts.w.globals.series[opts.seriesIndex]
            const total = opts.w.globals.series.reduce((a, b) => a + b, 0)
            const percent = (count / total * 100).toFixed(0)
            return `${percent}%\n${count} mak.`
          },
          textAnchor: 'middle',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 'bold',
            colors: ['#ffffff']
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            opacity: 0.5
          },
          position: 'centroid',
          offsetX: 0,
          offsetY: 0,
          anchor: 'center',
          distributed: false,
          total: {
            show: false
          }
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif'
          },
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const label = w.globals.labels[seriesIndex]
            const value = series[seriesIndex]
            const percentage = w.globals.seriesTotals[seriesIndex] / w.globals.seriesTotals.reduce((a, b) => a + b, 0) * 100
            
            return `<div class="apexcharts-tooltip-box">
              <div class="p-2">
                <div class="font-semibold">${label} – %${percentage.toFixed(1)}</div>
                <div>${value} makine</div>
              </div>
            </div>`
          }
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'none'
            }
          }
        },
        responsive: [{
          breakpoint: 640,
          options: {
            chart: {
              height: 180,
              width: '100%'
            }
          }
        }]
      }

      charts.value.productChart = new ApexCharts(document.querySelector("#chart-products"), options)
      charts.value.productChart.render()
    }
    
    const initProgressSummaryChart = () => {
      if (projectsStore.getAllProjects.length === 0) return
      
      const options = {
        series: progressChartData.value.map(item => item.count),
        labels: progressChartData.value.map(item => item.category),
        colors: progressChartData.value.map(item => item.color),
        chart: {
          type: 'pie',
          height: 180,
          fontFamily: 'Inter, system-ui, sans-serif',
          toolbar: {
            show: false
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          },
          plotOptions: {
            pie: {
              customScale: 0.9,
              expandOnClick: false,
              donut: {
                size: '0%'
              },
              dataLabels: {
                offset: 0
              }
            }
          }
        },
        stroke: {
          width: 2,
          colors: ['#ffffff']
        },
        fill: {
          opacity: 1
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opts) {
            const count = opts.w.globals.series[opts.seriesIndex]
            const total = opts.w.globals.series.reduce((a, b) => a + b, 0)
            const percent = (count / total * 100).toFixed(0)
            return `${percent}%\n${count} mak.`
          },
          textAnchor: 'middle',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 'bold',
            colors: ['#ffffff']
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            opacity: 0.5
          },
          position: 'centroid',
          offsetX: 0,
          offsetY: 0,
          anchor: 'center',
          distributed: false,
          total: {
            show: false
          }
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif'
          },
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const category = w.globals.labels[seriesIndex]
            const value = series[seriesIndex]
            const percentage = w.globals.seriesTotals[seriesIndex] / w.globals.seriesTotals.reduce((a, b) => a + b, 0) * 100
            
            return `<div class="apexcharts-tooltip-box">
              <div class="p-2">
                <div class="font-semibold">${category} – %${percentage.toFixed(1)}</div>
                <div>${value} makine</div>
              </div>
            </div>`
          }
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'none'
            }
          }
        },
        responsive: [{
          breakpoint: 640,
          options: {
            chart: {
              height: 180,
              width: '100%'
            }
          }
        }]
      }

      charts.value.progressChart = new ApexCharts(document.querySelector("#chart-progress-summary"), options)
      charts.value.progressChart.render()
    }
    
    const initCountryChart = () => {
      if (projectsStore.getAllProjects.length === 0) return
      
      const options = {
        series: countryChartData.value.map(item => item.count),
        labels: countryChartData.value.map(item => item.country),
        chart: {
          type: 'pie',
          height: 180,
          fontFamily: 'Inter, system-ui, sans-serif',
          toolbar: {
            show: false
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          },
          plotOptions: {
            pie: {
              customScale: 0.9,
              expandOnClick: false,
              donut: {
                size: '0%'
              },
              dataLabels: {
                offset: 0
              }
            }
          }
        },
        colors: countryColors,
        stroke: {
          width: 2,
          colors: ['#ffffff']
        },
        fill: {
          opacity: 1
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opts) {
            const count = opts.w.globals.series[opts.seriesIndex]
            const total = opts.w.globals.series.reduce((a, b) => a + b, 0)
            const percent = (count / total * 100).toFixed(0)
            return `${percent}%\n${count} mak.`
          },
          textAnchor: 'middle',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 'bold',
            colors: ['#ffffff']
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            opacity: 0.5
          },
          position: 'centroid',
          offsetX: 0,
          offsetY: 0,
          anchor: 'center',
          distributed: false,
          total: {
            show: false
          }
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif'
          },
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const label = w.globals.labels[seriesIndex]
            const value = series[seriesIndex]
            const percentage = w.globals.seriesTotals[seriesIndex] / w.globals.seriesTotals.reduce((a, b) => a + b, 0) * 100
            
            return `<div class="apexcharts-tooltip-box">
              <div class="p-2">
                <div class="font-semibold">${label} – %${percentage.toFixed(1)}</div>
                <div>${value} makine</div>
              </div>
            </div>`
          }
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'none'
            }
          }
        },
        responsive: [{
          breakpoint: 640,
          options: {
            chart: {
              height: 180,
              width: '100%'
            }
          }
        }]
      }

      charts.value.countryChart = new ApexCharts(document.querySelector("#chart-countries"), options)
      charts.value.countryChart.render()
    }
    
    // Responsive sidebar
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        isSidebarOpen.value = true
      }
    }
    
    // Close filter dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown') && !event.target.closest('button')) {
        activeFilter.value = null
      }
    }
    
    onMounted(() => {
      // Projeleri yükle
      const queryParams = {}
      
      // Props'a göre query parametreleri oluştur
      switch (props.projectType) {
        case 'completed':
          queryParams.isCompleted = 'true'
          break
        case 'shipped':
          queryParams.isShipped = 'true'
          break
        case 'ongoing':
        default:
          queryParams.isCompleted = 'false'
          queryParams.isShipped = 'false'
          break
      }
      
      console.log('Fetching projects with params:', queryParams) // Debug için
      projectsStore.fetchProjects(queryParams)
      
      window.addEventListener('resize', handleResize)
      document.addEventListener('click', handleClickOutside)
    })
    
    // Watch for projects changes to update charts
    watch(() => projectsStore.getAllProjects, (newValue) => {
      if (newValue.length > 0) {
        nextTick(() => {
          if (!charts.value.modelChart) {
            initCharts()
          } else {
            updateCharts()
          }
        })
      }
    }, { deep: true })

    // Watch for props changes to refresh data
    watch(() => props.projectType, (newType, oldType) => {
      if (newType !== oldType) {
        console.log('Project type changed from', oldType, 'to', newType) // Debug için
        
        // Reset pagination
        currentPage.value = 1
        
        // Clear all filters
        Object.keys(columnFilters.value).forEach(key => {
          columnFilters.value[key] = []
        })
        
        // Fetch projects with new type
        const queryParams = {}
        
        switch (newType) {
          case 'completed':
            queryParams.isCompleted = 'true'
            break
          case 'shipped':
            queryParams.isShipped = 'true'
            break
          case 'ongoing':
          default:
            queryParams.isCompleted = 'false'
            queryParams.isShipped = 'false'
            break
        }
        
        console.log('Refetching projects with new params:', queryParams) // Debug için
        projectsStore.fetchProjects(queryParams)
      }
    })
    
    return {
      // State
      isSidebarOpen,
      isSidebarCollapsed,
      sortKey,
      sortAsc,
      activeFilter,
      columnFilters,
      dropdownPosition,
      itemsPerPage,
      currentPage,
      charts,
      typeLegendItems,
      modelLegendItems,
      productLegendItems,
      progressLegendItems,
      countryLegendItems,
      sortableColumns,
      
      // Computed
      pageTitle,
      pageIcon,
      sortedAndFilteredOrders,
      paginatedOrders,
      totalPages,
      paginationInfo,
      visiblePages,
      showStartEllipsis,
      showEndEllipsis,
      typeChartData,
      modelChartData,
      productChartData,
      progressChartData,
      countryChartData,
      
      // Methods
      handleSidebarCollapse,
      goToProjectDetail,
      sortBy,
      toggleFilter,
      calculateDropdownPosition,
      getDropdownPosition,
      getFilterOptions,
      hasActiveFilter,
      isFilterOptionSelected,
      toggleFilterOption,
      clearFilter,
      getTypeColor,
      getModelColor,
      getProductColor,
      getCountryColor,
      goToPage,
      nextPage,
      previousPage,
      onItemsPerPageChange,
      initCharts,
      updateCharts,
      initTypeChart,
      initModelChart,
      initProductChart,
      initProgressSummaryChart,
      initCountryChart,
      
      // Store
      projectsStore
    }
  }
}
</script>

<style scoped>
/* Dashboard Container */
.dashboard-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* Table Styles */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
}

.table-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 12px 12px 0 0;
}

.table-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.table-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0.25rem 0 0 0;
}

/* Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.data-table th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  text-align: left;
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
  font-size: 0.75rem;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.data-table th.sortable:hover {
  background: #f1f5f9;
}

.data-table th.sortable .sort-icon {
  margin-left: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.data-table th.sortable:hover .sort-icon {
  opacity: 1;
}

.data-table th.sortable.active .sort-icon {
  opacity: 1;
  color: #3b82f6;
}

.data-table th.centered {
  text-align: center;
}

.data-table td {
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.data-table td.centered {
  text-align: center;
}

.data-table tbody tr {
  transition: background-color 0.2s;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.in-progress {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.delayed {
  background: #fee2e2;
  color: #991b1b;
}

/* Filter Button */
.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.filter-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.filter-button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.filter-button.has-filter {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.filter-button .filter-icon {
  width: 1rem;
  height: 1rem;
}

.filter-button .filter-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 1.25rem;
  text-align: center;
}

/* Compact Filter Button */
.filter-button.compact {
  padding: 0.25rem 0.5rem;
  gap: 0.25rem;
}

.filter-button.compact .filter-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.filter-button.compact .filter-count.compact {
  padding: 0.125rem 0.25rem;
  font-size: 0.625rem;
  min-width: 1rem;
}

/* Status Progress Bar */
.status-progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.status-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.status-progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  min-width: 60px;
}

.status-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.status-progress-fill.completed {
  background: linear-gradient(90deg, #10b981, #059669);
}

.status-progress-fill.in-progress {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.status-progress-fill.delayed {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.status-percentage {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

/* Filter Dropdown */
.filter-dropdown {
  position: fixed;
  z-index: 50;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
}

.filter-dropdown-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0.5rem 0.5rem 0 0;
}

.filter-dropdown-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.filter-dropdown-options {
  padding: 0.5rem 0;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.875rem;
  color: #374151;
}

.filter-option:hover {
  background: #f3f4f6;
}

.filter-option.selected {
  background: #dbeafe;
  color: #1e40af;
}

.filter-option input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
}

.filter-dropdown-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 0.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-filter-btn {
  padding: 0.375rem 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-filter-btn:hover {
  background: #dc2626;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.items-per-page select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Charts Section */
.charts-section {
  margin-top: 1.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
}

.chart-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 18px -6px rgba(0, 0, 0, 0.15);
}

.chart-header {
  padding: 0.7rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.chart-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.chart-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.chart-content {
  padding: 0;
  width: 100%;
}

.chart-container {
  height: 320px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* Apex kök öğeyi tam genişliğe zorla */
.chart-container .apexcharts-canvas,
.chart-container svg,
.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
}

.chart-legend {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.legend-color {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  white-space: nowrap;
}

.legend-count {
  font-weight: 600;
  color: #374151;
  font-size: 0.75rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .data-table {
    min-width: 800px;
  }
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .pagination-controls {
    justify-content: center;
  }
  
  .chart-card {
    margin: 0 -1rem;
    border-radius: 0;
  }
}

@media (max-width: 640px) {
  .table-header {
    padding: 0.75rem;
  }
  
  .table-title {
    font-size: 1.25rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .filter-button {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .charts-grid {
    gap: 1rem;
  }
  
  .chart-card {
    margin: 0 -0.5rem;
  }
}

/* Loading States */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  min-height: 200px;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.empty-state-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  opacity: 0.5;
}

.empty-state-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state-description {
  font-size: 0.875rem;
  margin: 0;
}

/* Tooltip Styles */
.apexcharts-tooltip-box {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Scrollbar Styles */
.filter-dropdown::-webkit-scrollbar {
  width: 6px;
}

.filter-dropdown::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.filter-dropdown::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.filter-dropdown::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation Classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateY(-10px);
}

.slide-leave-to {
  transform: translateY(10px);
}

/* Focus States */
.filter-button:focus,
.pagination-btn:focus,
.filter-option:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Print Styles */
@media print {
  .sidebar,
  .header,
  .pagination-container,
  .filter-button {
    display: none !important;
  }
  
  .table-container {
    box-shadow: none;
    border: 1px solid #d1d5db;
  }
  
  .data-table th {
    background: #f3f4f6 !important;
    color: #000 !important;
  }
  
  .charts-section {
    display: none;
  }
}
</style>