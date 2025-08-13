<template>
  <div class="mt-4">
    <!-- Stage Details Modal -->
    <transition name="modal">
      <div v-if="showStageModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeStageModal"></div>
        <div class="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
          <div class="flex items-center justify-between mb-4">
            <div class="font-semibold text-gray-900 text-lg">{{ selectedStage?.name }}</div>
            <button @click="closeStageModal" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div class="bg-gray-50 rounded-md p-3">
              <div class="text-xs text-gray-500">Tarih Aralığı</div>
              <div class="text-sm font-medium text-gray-800">{{ selectedStage?.startDate }} - {{ selectedStage?.endDate }}</div>
            </div>
            <div class="bg-gray-50 rounded-md p-3">
              <div class="text-xs text-gray-500">İlerleme</div>
              <div class="text-sm font-bold text-gray-800">%{{ selectedStage?.progress }}</div>
            </div>
            <div class="bg-gray-50 rounded-md p-3">
              <div class="text-xs text-gray-500">Aşama</div>
              <div class="text-sm font-medium text-gray-800">{{ selectedStage?.name }}</div>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>İlerleme</span>
              <span class="font-medium text-gray-700">%{{ selectedStage?.progress || 0 }}</span>
            </div>
            <div class="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="selectedStage && selectedStage.progress >= 70 ? 'bg-green-500' : (selectedStage && selectedStage.progress >= 40 ? 'bg-orange-400' : 'bg-red-500')"
                :style="{ width: ((selectedStage?.progress || 0) + '%') }"
              ></div>
            </div>
          </div>
          
          <div>
            <div class="text-xs text-gray-500 mb-2">Alt Görevler</div>
            <div class="max-h-72 overflow-y-auto pr-1">
              <template v-for="subtask in selectedStage?.subtasks" :key="subtask.id">
                <div class="border rounded-md p-2 mb-2" :class="subtask.approved ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'">
                  <div class="flex items-center gap-2">
                    <i :class="['fas', subtask.approved ? 'fa-check-circle text-green-600' : 'fa-circle text-gray-300']"></i>
                    <div class="text-sm font-medium text-gray-800">{{ subtask.name }}</div>
                    <div class="ml-auto text-xs" :class="subtask.approved ? 'text-green-600' : 'text-gray-400'">{{ subtask.approved ? 'Onaylandı' : 'Beklemede' }}</div>
                  </div>
                  <div v-if="subtask.items && subtask.items.length" class="mt-2 ml-6 space-y-1">
                    <div v-for="item in subtask.items" :key="item.id" class="text-xs flex items-center gap-2">
                      <i :class="['fas', item.approved ? 'fa-check text-green-600' : 'fa-minus text-gray-300']"></i>
                      <span class="text-gray-800">{{ item.name }}</span>
                      <span v-if="item.approved" class="text-gray-500">— {{ item.approvedBy }} tarafından {{ item.approvedDate }} tarihinde onaylandı</span>
                    </div>
                  </div>
                  <div v-else-if="subtask.approved" class="text-xs text-gray-600 ml-6 mt-1">
                    {{ subtask.approvedBy }} tarafından {{ subtask.approvedDate }} tarihinde onaylandı
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <button @click="closeStageModal" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Kapat</button>
          </div>
        </div>
      </div>
    </transition>

    
    <transition name="modal">
      <div v-if="showConfirmation" class="fixed inset-0 z-50 flex items-center justify-center">
        <transition name="backdrop">
          <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        </transition>
        <transition name="modal-content">
          <div class="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div class="flex items-center justify-between mb-4">
              <div class="font-medium text-gray-800 text-lg">Onay</div>
              <button @click="cancelApproval" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="mb-6 text-gray-700">
              Bu adımı kesinleştirmek istiyor musunuz?
            </div>
            <div class="flex justify-end space-x-3">
              <button @click="cancelApproval" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                İptal
              </button>
              <button @click="confirmApproval" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                Onayla
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <h2 class="text-base font-medium text-gray-900 mb-3">Üretim Süreçleri</h2>

    <div class="relative">
      <div class="production-flow-container">
        <div class="production-flow">
          <template v-for="(stage, index) in stages" :key="stage.id">
            <div class="production-step" :class="{'active-step': stage.progress > 0 && stage.progress < 100}">
              <div class="chart-wrapper">
                <div v-if="stage.progress > 0 && stage.progress < 100" class="active-indicator">Aktif</div>
                <div class="step-icon"
                     :style="{
                       '--icon-start-color': stage.progress > 0 ? stage.color : '#9ca3af',
                       '--icon-end-color': stage.progress > 0 ? lightenColor(stage.color, 30) : '#e5e7eb',
                       filter: stage.progress > 0 ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' : 'none'
                     }">
                  <i :class="stage.icon"></i>
                </div>
                <div :id="'chart-' + stage.id + '-' + index" class="chart-container" :key="'chart-' + stage.id + '-' + index" @click="openStageModal(stage)" title="Detayları görmek için tıklayın"></div>
                <div class="step-title">{{ stage.name }}</div>
                <div class="date-range relative" v-if="stage.id !== 'projeOnayi'">
                  <div class="flex items-center gap-2 w-full justify-center">
                    <div class="date-range-input editable w-auto" role="button" @click.stop="toggleStageCalendar(stage, $event)">
                      <i class="fas fa-calendar-alt calendar-icon"></i>
                      <span>{{ stage.startDate }} - {{ stage.endDate }}</span>
                    </div>
                    <button
                      type="button"
                      class="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      title="Tarihleri kaydet"
                      :disabled="saveLoadingId === stage.id"
                      @click.stop="saveStageDates(stage)"
                    >
                      <span v-if="saveLoadingId === stage.id"><i class="fas fa-spinner fa-spin mr-1"></i>Kaydediliyor</span>
                      <span v-else>Kaydet</span>
                    </button>
                  </div>
                  <!-- Inline calendar dropdown -->
                  <div
                    v-if="openStageId === stage.id"
                    ref="calendarEl"
                    class="fixed z-[2147483647] bg-white rounded-lg shadow-xl border p-2 calendar-fixed"
                    :style="{ ...calendarFixedPos, transform: calendarTransform }"
                  >
                                         <v-date-picker
                       v-model="stage.__rangeModel"
                       is-range
                       :rows="1"
                       :columns="1"
                       is-inline
                       :min-date="new Date(2020, 0, 1)"
                       :max-date="new Date(2030, 11, 31)"
                       @update:model-value="onRangePicked(stage, true)"
                     />
                  </div>
                  <div v-if="saveSuccessId === stage.id" class="text-green-600 text-[10px] mt-1 text-center">
                    <i class="fas fa-check mr-1"></i>Kaydedildi
                  </div>
                </div>
                <div class="subtasks-container">
                  <div class="subtasks-scrollable">
                    <template v-for="subtask in stage.subtasks" :key="subtask.id">
                      <div v-if="subtask.items && subtask.items.length" :class="['group-task', { 'task-completed': subtask.approved }]">
                        <div class="group-task-header" @click="toggleSubtaskGroup(subtask)">
                          <div class="flex items-center">
                            <template v-if="subtask.id !== 'mt-2' && subtask.id !== 'im-4'">
                              <input type="checkbox" :id="subtask.id" class="modern-checkbox" :checked="subtask.approved" :disabled="subtask.approved || subtask.requiresDateApproval" @click="initiateApproval(subtask, $event)">
                              <label :for="subtask.id" class="subtask-label font-medium">{{ subtask.name }}</label>
                            </template>
                            <template v-else>
                              <span class="subtask-label font-medium">{{ subtask.name }}</span>
                            </template>
                          </div>
                          <i class="fas fa-chevron-down ml-auto text-gray-400 text-xs" :class="{ 'transform rotate-180': !subtask.collapsed }"></i>
                        </div>
                        <div v-if="!subtask.collapsed" class="group-task-content">
                          <div v-for="item in subtask.items" :key="item.id" :class="['subtask-item', { 'task-completed': item.approved }]">
                            <div class="flex items-center">
                              <input type="checkbox" :id="item.id" class="modern-checkbox" :checked="item.approved" :disabled="item.approved" @click="initiateApproval(item, $event)">
                              <label :for="item.id" class="subtask-label">{{ item.name }}</label>
                            </div>
                            <div v-if="showApprovalInline && item.approved" class="approval-info">{{ item.approvedBy }} tarafından {{ item.approvedDate }} tarihinde onaylandı</div>
                          </div>
                        </div>
                        <div v-if="showApprovalInline && subtask.approved" class="approval-info mt-2">
                          <span v-if="subtask.dateLabel">{{ subtask.approvedBy }}</span>
                          <span v-else>{{ subtask.approvedBy }} tarafından {{ item.approvedDate }} tarihinde onaylandı</span>
                        </div>
                      </div>
                      <div v-else :class="['subtask-item', { 'task-completed': subtask.approved }]">
                        <div class="flex items-center">
                          <input type="checkbox" :id="subtask.id" class="modern-checkbox" :checked="subtask.approved" :disabled="subtask.approved || subtask.requiresDateApproval" @click="initiateApproval(subtask, $event)">
                          <label :for="subtask.id" class="subtask-label">{{ subtask.name }}</label>
                        </div>
                        <div v-if="subtask.id === 'po-1' && subtask.approved" class="mt-2 ml-7">
                          <div v-if="uploadedFile" class="flex items-center p-2 bg-gray-50 border border-gray-200 rounded-md">
                            <i class="fas fa-file-pdf mr-2 text-red-500"></i>
                            <span class="text-sm truncate">{{ uploadedFile.name }}</span>
                            <div class="ml-auto flex items-center">
                              <span v-if="uploadSuccess" class="text-xs text-green-500 mr-2"><i class="fas fa-check mr-1"></i>Yüklendi</span>
                              <button type="button" @click="resetFileUpload" class="text-gray-400 hover:text-red-500">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div v-if="subtask.id === 'ta-1' && showOperatorInput && !subtask.approved" class="mt-2 ml-7">
                          <div class="flex flex-col">
                            <div class="text-xs text-gray-500 mb-1">İsim Soyisim</div>
                            <input type="text" v-model="operatorNameInput" class="text-sm py-1 px-2 border border-gray-200 rounded-md bg-gray-50 w-full" placeholder="İsim ve soyisim giriniz" @input="operatorInputError = false">
                            <div v-if="operatorInputError" class="text-xs text-red-500 mt-1">
                              <i class="fas fa-exclamation-circle mr-1"></i>
                              İsim soyisim zorunludur
                            </div>
                          </div>
                          <div class="flex justify-end mt-2">
                            <button @click="initiateApproval(subtask)" class="text-xs px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Onayla</button>
                          </div>
                        </div>
                        <div v-if="subtask.id === 'ts-3' && showImalatTeknikResimInput && !subtask.approved" class="mt-2 ml-7">
                          <div class="flex flex-col">
                            <div class="text-xs text-gray-500 mb-1">İsim Soyisim</div>
                            <input type="text" v-model="imalatTeknikResimNameInput" class="text-sm py-1 px-2 border border-gray-200 rounded-md bg-gray-50 w-full" placeholder="İsim ve soyisim giriniz" @input="imalatTeknikResimInputError = false">
                            <div v-if="imalatTeknikResimInputError" class="text-xs text-red-500 mt-1">
                              <i class="fas fa-exclamation-circle mr-1"></i>
                              İsim soyisim zorunludur
                            </div>
                          </div>
                          <div class="flex justify-end mt-2">
                            <button @click="initiateApproval(subtask)" class="text-xs px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Onayla</button>
                          </div>
                        </div>
                        <div v-if="showApprovalInline && subtask.approved" class="approval-info">
                          <span v-if="subtask.dateLabel">{{ subtask.approvedBy }}</span>
                          <span v-else>{{ subtask.approvedBy }} tarafından {{ subtask.approvedDate }} tarihinde onaylandı</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        
        <!-- inline takvim kullanıldığı için ekstra popover yok -->
      </div>
      <div class="text-center text-xs text-gray-500 mt-1 lg:hidden">
        <i class="fas fa-arrows-left-right mr-1"></i> Sola/sağa kaydırın
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import ApexCharts from 'apexcharts'
import { ApiService } from '@/services/api'

export default {
  name: 'ProductionProcess',
    components: { },
  props: {
    projectId: { type: String, required: true }
  },
  setup(props) {
    // Modal state for stage details
    const showStageModal = ref(false)
    const selectedStage = ref(null)
    const showApprovalInline = ref(false) // inline approval texts hidden; shown in modal

    const openStageModal = (stage) => {
      selectedStage.value = JSON.parse(JSON.stringify(stage))
      showStageModal.value = true
    }

    const closeStageModal = () => {
      showStageModal.value = false
      selectedStage.value = null
    }
    const showConfirmation = ref(false)
    const currentSubtask = ref(null)

    const operatorNameInput = ref('')
    const showOperatorInput = ref(false)
    const operatorInputError = ref(false)

    const imalatTeknikResimNameInput = ref('')
    const showImalatTeknikResimInput = ref(false)
    const imalatTeknikResimInputError = ref(false)

    const uploadedFile = ref(null)
    const isUploading = ref(false)
    const uploadSuccess = ref(false)

    const stages = ref([
      { id: 'projeOnayi', name: 'Proje Onayı', progress: 100, color: '#3B82F6', icon: 'fas fa-file-signature', iconColorClass: 'text-blue-500', description: 'Proje teknik detayları ve planlaması onaylandı', startDate: '15.01.2025', endDate: '25.01.2025', subtasks: [ { id: 'po-1', name: 'İş Emrinin Yayınlanması', approved: true, approvedBy: 'Gökhan Özyürek', approvedDate: '15.01.2025' } ] },
      { id: 'tasarimOnayi', name: 'Tasarım Süreçleri', progress: 100, color: '#10B981', icon: 'fas fa-drafting-compass', iconColorClass: 'text-green-500', description: 'Ürünün teknik çizimleri ve dizaynı tamamlandı', startDate: '25.01.2025', endDate: '10.02.2025', subtasks: [ { id: 'ts-1', name: '3D Tasarım Süreci', approved: true, approvedBy: 'Gökhan Özyürek', approvedDate: '25.01.2025' }, { id: 'ts-2', name: 'Müşteri Onayı Planı', approved: true, approvedBy: 'Gökhan Özyürek', approvedDate: '28.01.2025' }, { id: 'ts-3', name: 'İmalat Teknik Resim', approved: false, approvedBy: '', approvedDate: '' } ] },
      { id: 'stokOnayi', name: 'Malzeme ve Tedarik Süreci', progress: 100, color: '#6366F1', icon: 'fas fa-boxes-stacked', iconColorClass: 'text-indigo-500', description: 'Gerekli malzeme ve parçalar temin edildi', startDate: '10.02.2025', endDate: '01.03.2025', subtasks: [ { id: 'mt-1', name: 'Tedarik Parça Temini', approved: true, approvedBy: 'Gökhan Özyürek', approvedDate: '10.02.2025' }, { id: 'mt-2', name: 'Satın Alma Süreci', approved: true, approvedBy: 'Gökhan Özyürek', approvedDate: '15.02.2025', collapsed: false, items: [ { id: 'mt-2-1', name: 'Makina', approved: true, approvedBy: 'Gökhan Özyürek', approvedDate: '15.02.2025' }, { id: 'mt-2-2', name: 'Dolum', approved: true, approvedBy: 'Gökhan Özyürek', approvedDate: '15.02.2025' } ] } ] },
      { id: 'imalatSureci', name: 'İmalat Süreci', progress: 81, color: '#8B5CF6', icon: 'fas fa-industry', iconColorClass: 'text-purple-500', description: 'Üretim aşaması devam ediyor, montaj süreci tamamlanıyor', startDate: '01.03.2025', endDate: '15.04.2025', subtasks: [ { id: 'im-1', name: 'Talaşlı İmalat', approved: false }, { id: 'im-2', name: 'Kaplama', approved: false }, { id: 'im-3', name: 'Şasi', approved: false }, { id: 'im-4', name: 'İstasyon', approved: false, collapsed: false, items: [ { id: 'im-4-1', name: 'Yapıştırma', approved: false }, { id: 'im-4-2', name: 'Şekillendirme', approved: false }, { id: 'im-4-3', name: 'Isı', approved: false }, { id: 'im-4-4', name: 'Kesme', approved: false } ] }, { id: 'im-5', name: 'Elektrik Panosu', approved: false }, { id: 'im-6', name: 'Dolum', approved: false }, { id: 'im-7', name: 'Robot', approved: false } ] },
      { id: 'makineMontaj', name: 'Makine Montaj', progress: 0, color: '#6D28D9', icon: 'fas fa-cogs', iconColorClass: 'text-purple-700', description: 'Makine montaj aşamaları devam ediyor', startDate: '15.04.2025', endDate: '30.04.2025', subtasks: [ { id: 'mm-1', name: 'Mekanik', approved: false }, { id: 'mm-2', name: 'Pnömatik', approved: false }, { id: 'mm-3', name: 'Elektrik', approved: false }, { id: 'mm-4', name: 'Programlama', approved: false }, { id: 'mm-5', name: 'Kaplama / Giydirme', approved: false }, { id: 'mm-6', name: 'Operatör Test', approved: false } ] },
      { id: 'testAdimlari', name: 'Test', progress: 0, color: '#F59E0B', icon: 'fas fa-flask', iconColorClass: 'text-amber-500', description: 'Kalite kontrol ve fonksiyon testleri yapılacak', startDate: '15.04.2025', endDate: '01.05.2025', subtasks: [ { id: 'fat-1', name: 'Müşteri Folyosu', approved: false, requiresDateApproval: true }, { id: 'fat-2', name: 'PRE FAT', approved: false, requiresDateApproval: true }, { id: 'fat-3', name: 'Müşteri FAT', approved: false, requiresDateApproval: true } ] },
      { id: 'sevkiyat', name: 'Sevkiyat & Teslim', progress: 0, color: '#EC4899', icon: 'fas fa-truck', iconColorClass: 'text-pink-500', description: 'Ürünün paketlenmesi ve müşteriye sevkiyatı', startDate: '01.05.2025', endDate: '30.06.2025', subtasks: [ { id: 'se-1', name: 'Sevke Hazır', approved: false, requiresDateApproval: true, dateLabel: 'Hazır' }, { id: 'se-2', name: 'Paketleme Tamamlandı', approved: false }, { id: 'se-3', name: 'Sevk Edildi', approved: false, requiresDateApproval: true, dateLabel: 'Sevk Tarihi' } ] }
    ])

    function formatDate() {
      const today = new Date()
      return `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`
    }

    const chartInstances = ref(new Map())

    const adjustColor = (color, amount) => {
      return '#' + color.replace(/^#/, '').replace(/../g, c => ('0' + Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).slice(-2))
    }

    const lightenColor = (color, percent) => {
      const num = parseInt(color.replace('#', ''), 16)
      const amt = Math.round(2.55 * percent)
      const R = (num >> 16) + amt
      const G = (num >> 8 & 0x00FF) + amt
      const B = (num & 0x0000FF) + amt
      return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)
    }

    const createStageChart = (stage, index) => {
      const chartId = 'chart-' + stage.id + '-' + index
      const chartElement = document.getElementById(chartId)
      if (!chartElement) return

      if (chartInstances.value.has(chartId)) {
        const existingChart = chartInstances.value.get(chartId)
        try { existingChart && existingChart.destroy && existingChart.destroy() } catch {}
        chartInstances.value.delete(chartId)
      }

      chartElement.innerHTML = ''

      setTimeout(() => {
        const container = chartElement.closest('.production-step')
        const available = container ? container.clientWidth : 180
        let chartSize = Math.min(Math.max(available - 20, 120), 180)

        const isActive = stage.progress > 0
        const activeColor = stage.color
        const inactiveColor = '#E0E0E0'
        const chartColor = isActive ? activeColor : inactiveColor

        const options = {
          chart: {
            height: chartSize,
            type: 'radialBar',
            sparkline: { enabled: true },
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 900,
              animateGradually: { enabled: true, delay: 120 },
              dynamicAnimation: { enabled: true, speed: 400 }
            },
            toolbar: { show: false }
          },
          series: [stage.progress],
          colors: [chartColor],
          plotOptions: {
            radialBar: {
              startAngle: 0,
              endAngle: 360,
              hollow: {
                size: '60%',
                background: '#ffffff',
                dropShadow: { enabled: true, top: 2, blur: 4, opacity: 0.08 }
              },
              track: {
                background: '#f3f4f6',
                strokeWidth: '95%',
                margin: 3,
                dropShadow: { enabled: true, top: 2, left: 0, blur: 4, opacity: 0.15 }
              },
              dataLabels: {
                name: { show: false },
                value: {
                  color: isActive ? '#111827' : '#9CA3AF',
                  fontSize: '22px',
                  fontWeight: 700,
                  offsetY: 6,
                  formatter: val => `${Math.round(val)}%`
                }
              },
              stroke: { lineCap: 'round' }
            }
          },
          stroke: { dashArray: 0, width: 12 },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              type: 'horizontal',
              gradientToColors: [adjustColor(chartColor, 25)],
              shadeIntensity: 0.35,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100]
            }
          },
          tooltip: { enabled: false },
          states: { hover: { filter: { type: 'none' } } }
        }

        const chart = new ApexCharts(chartElement, options)
        chart.render()
        chartInstances.value.set(chartId, chart)
      }, 100)
    }

    const toggleSubtaskGroup = (subtask) => { subtask.collapsed = !subtask.collapsed }

    const initiateApproval = (subtask, event) => {
      if (event) { event.preventDefault(); event.stopPropagation() }

      if (subtask.id === 'ta-1' && !subtask.approved) {
        showOperatorInput.value = true
        if (operatorNameInput.value.trim() !== '') {
          approveTask(subtask, operatorNameInput.value)
          showOperatorInput.value = false
        } else {
          operatorInputError.value = true
        }
        return
      }

      if (subtask.id === 'ts-3' && !subtask.approved) {
        showImalatTeknikResimInput.value = true
        if (imalatTeknikResimNameInput.value.trim() !== '') {
          approveTask(subtask, imalatTeknikResimNameInput.value)
          showImalatTeknikResimInput.value = false
        } else {
          imalatTeknikResimInputError.value = true
        }
        return
      }

      if (subtask.requiresDateApproval) {
        currentSubtask.value = subtask
        showConfirmation.value = true
        return
      }

      currentSubtask.value = subtask
      showConfirmation.value = true
    }

    const confirmApproval = () => {
      if (!currentSubtask.value) return
      if (currentSubtask.value.id === 'ta-1') currentSubtask.value.approvedBy = operatorNameInput.value
      else if (currentSubtask.value.id === 'ts-3') currentSubtask.value.approvedBy = imalatTeknikResimNameInput.value
      else currentSubtask.value.approvedBy = 'Gökhan Özyürek'
      approveTask(currentSubtask.value, currentSubtask.value.approvedBy)
      showConfirmation.value = false
      currentSubtask.value = null
    }

    const cancelApproval = () => { showConfirmation.value = false; currentSubtask.value = null }

    const approveTask = (task, approver) => {
      task.approved = true
      task.approvedBy = approver
      task.approvedDate = formatDate()
      if (task.items && task.items.length) {
        task.items.forEach(item => { item.approved = true; item.approvedBy = approver; item.approvedDate = formatDate() })
      }
      nextTick(() => { updateStageProgress() })
    }

    const countTotalTasks = (subtasks) => {
      let count = 0
      subtasks.forEach(st => { count += (st.items && st.items.length) ? st.items.length : 1 })
      return count
    }

    const countCompletedTasks = (subtasks) => {
      let count = 0
      subtasks.forEach(st => {
        if (st.items && st.items.length) st.items.forEach(item => { if (item.approved) count += 1 })
        else if (st.approved) count += 1
      })
      return count
    }

    const updateStageProgress = () => {
      stages.value.forEach((stage, index) => {
        const totalTasks = countTotalTasks(stage.subtasks)
        const completedTasks = countCompletedTasks(stage.subtasks)
        const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        if (newProgress !== stage.progress) {
          stage.progress = newProgress
          setTimeout(() => { createStageChart(stage, index) }, 200)
        }
      })
    }

    const handleFileUpload = (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      uploadedFile.value = file
      isUploading.value = true
      setTimeout(() => { isUploading.value = false; uploadSuccess.value = true }, 1500)
    }

    const resetFileUpload = () => { uploadedFile.value = null; isUploading.value = false; uploadSuccess.value = false }

    const completedStages = computed(() => stages.value.filter(s => s.progress === 100).length)

    // datepicker state
    // v-calendar model için geçici alan
    const dateRange = ref([null, null])
    const saveLoadingId = ref(null)
    const saveSuccessId = ref(null)

    const onRangePicked = (stage, shouldClose = false) => {
      if (!stage.__rangeModel || !stage.__rangeModel.start || !stage.__rangeModel.end) return
      const s = stage.__rangeModel.start
      const e = stage.__rangeModel.end
      stage.startDate = `${String(s.getDate()).padStart(2,'0')}.${String(s.getMonth()+1).padStart(2,'0')}.${s.getFullYear()}`
      stage.endDate = `${String(e.getDate()).padStart(2,'0')}.${String(e.getMonth()+1).padStart(2,'0')}.${e.getFullYear()}`
      if (shouldClose) closeAllCalendars()
    }

    const parseDateString = (str) => {
      if (!str) return null
      const parts = str.split('.')
      if (parts.length !== 3) return null
      const [d, m, y] = parts.map(n => parseInt(n, 10))
      if (!d || !m || !y) return null
      return new Date(y, m - 1, d)
    }

    const openStageId = ref(null)
    const currentStage = ref(null)
    const calendarFixedPos = ref({ top: '0px', left: '0px' })
    const calendarTransform = ref('translateX(-50%)')
    let outsideHandler = null
         const closeAllCalendars = () => {
       openStageId.value = null
       currentStage.value = null
       if (outsideHandler) {
         document.removeEventListener('click', outsideHandler, true)
         outsideHandler = null
       }
       // Reset all stages' range models to prevent conflicts
       stages.value.forEach(stage => {
         if (stage.__rangeModel) {
           delete stage.__rangeModel
         }
       })
     }
     const toggleStageCalendar = (stage, evt) => {
       const isSame = openStageId.value === stage.id
       // Önce açık olan tüm takvimleri kapat
       closeAllCalendars()
       if (isSame) return
       openStageId.value = stage.id
       currentStage.value = stage
       // mevcut tarih aralığını takvim açılışında göster
       const start = parseDateString(stage.startDate) || new Date()
       const end = parseDateString(stage.endDate) || start
       stage.__rangeModel = { start, end }
       // Ensure we're not reusing the same object reference
       stage.__rangeModel = { start: new Date(start), end: new Date(end) }
      const rect = evt.currentTarget.getBoundingClientRect()
      // default: center align under trigger
      let left = rect.left + window.scrollX + rect.width / 2
      const width = 320 // approx width for 1-month inline calendar (smaller)
      const padding = 8
      const viewportRight = window.scrollX + window.innerWidth
      const overflowRight = left + width / 2 + padding - viewportRight
      if (overflowRight > 0) {
        left -= overflowRight
      }
      const overflowLeft = left - width / 2 - padding - window.scrollX
      if (overflowLeft < 0) {
        left -= overflowLeft
      }
      calendarFixedPos.value = { top: `${rect.bottom + window.scrollY + 8}px`, left: `${left}px` }
      calendarTransform.value = 'translateX(-50%)'
      // dışarı tıklayınca kapat
      setTimeout(() => {
        outsideHandler = (e) => {
          const target = e.target
          const inCalendar = target.closest && target.closest('.calendar-fixed')
          if (inCalendar) return
          // Tetikleyiciye tıklama dahil her durumda mevcut açık takvimi kapat
          closeAllCalendars()
        }
        document.addEventListener('click', outsideHandler, true)
      }, 0)
    }

    const saveStageDates = async (stage) => {
      try {
        saveLoadingId.value = stage.id
        saveSuccessId.value = null
        // örnek payload; backend ile uyumlu olacak şekilde düzenleyin
        const payload = {
          startDate: stage.startDate?.split('.').reverse().join('-'),
          endDate: stage.endDate?.split('.').reverse().join('-'),
          stageId: stage.id
        }
        await ApiService.post(`/Projects/${props.projectId}/production-process/${stage.id}/dates`, payload)
        saveSuccessId.value = stage.id
        setTimeout(() => { if (saveSuccessId.value === stage.id) saveSuccessId.value = null }, 2000)
      } catch (e) {
        // burada kullanıcıya toast gösterilebilir
        console.error('Tarih kaydetme hatası', e)
      } finally {
        saveLoadingId.value = null
      }
    }

    const cleanupCharts = () => {
      chartInstances.value.forEach((chart) => { try { chart?.destroy() } catch {} })
      chartInstances.value.clear()
      stages.value.forEach((stage, index) => {
        const chartId = 'chart-' + stage.id + '-' + index
        const chartElement = document.getElementById(chartId)
        if (chartElement) chartElement.innerHTML = ''
      })
    }

    const fetchProductionProcessData = async () => {
      try {
        const response = await ApiService.get(`/Projects/${props.projectId}/production-process`)
        if (response && response.stages) {
          stages.value = response.stages
          setTimeout(() => { stages.value.forEach((stage, index) => createStageChart(stage, index)) }, 100)
        }
      } catch (e) {
        // continue with defaults on error
      }
    }

    onMounted(() => {
      setTimeout(() => {
        stages.value.forEach((stage, index) => { setTimeout(() => createStageChart(stage, index), index * 100) })
        setTimeout(() => { updateStageProgress() }, stages.value.length * 100 + 200)
        const onResize = () => {
          clearTimeout(window.resizeTimeout)
          window.resizeTimeout = setTimeout(() => { stages.value.forEach((stage, index) => createStageChart(stage, index)) }, 250)
        }
        window.addEventListener('resize', onResize, { passive: true })
        window.__pp_onResize = onResize
      }, 300)
    })

    onUnmounted(() => {
      cleanupCharts()
      if (window.resizeTimeout) clearTimeout(window.resizeTimeout)
      if (window.__pp_onResize) window.removeEventListener('resize', window.__pp_onResize)
    })

    watch(() => props.projectId, (newId) => { if (newId) fetchProductionProcessData() }, { immediate: true })

    return {
      stages,
      completedStages,
      showConfirmation,
      currentSubtask,
      // modal
      showStageModal,
      selectedStage,
      openStageModal,
      closeStageModal,
      showApprovalInline,
      // range picker
      dateRange,
      saveLoadingId,
      saveSuccessId,
      onRangePicked,
      openStageId,
      toggleStageCalendar,
      currentStage,
      calendarFixedPos,
      saveStageDates,
      operatorNameInput,
      showOperatorInput,
      operatorInputError,
      imalatTeknikResimNameInput,
      showImalatTeknikResimInput,
      imalatTeknikResimInputError,
      uploadedFile,
      isUploading,
      uploadSuccess,
      createStageChart,
      toggleSubtaskGroup,
      initiateApproval,
      confirmApproval,
      cancelApproval,
      handleFileUpload,
      resetFileUpload,
      lightenColor,
      cleanupCharts
    }
  }
}
</script>

<style>
.production-flow-container { position: relative; width: 100%; overflow-x: auto; padding: 0.75rem 0.5rem; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; }
.production-flow-container::-webkit-scrollbar { height: 8px; }
.production-flow-container::-webkit-scrollbar-track { background: transparent; }
.production-flow-container::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 20px; }
.production-flow { display: flex; flex-wrap: nowrap; justify-content: flex-start; align-items: flex-start; position: relative; min-height: 160px; margin: 0.5rem 0; padding-bottom: 0.5rem; gap: 0.75rem; width: max-content; min-width: 100%; }
.production-step { position: relative; z-index: 5; transition: transform 0.25s ease-out, box-shadow 0.25s ease-out; flex: 0 0 auto; width: 180px; min-width: 180px; max-width: 180px; margin-bottom: 0.75rem; }
.production-step:hover { transform: translateY(-5px); z-index: 10; }
.chart-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; padding: 0.5rem; width: 100%; height: 100%; }
.chart-container { width: 160px; height: 160px; margin-left: auto; margin-right: auto; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; transition: all 0.3s; }
.chart-container { cursor: pointer; }
.step-icon { position: absolute; top: 0.5rem; font-size: 1.5rem; background: linear-gradient(135deg, var(--icon-start-color, #e5e7eb), var(--icon-end-color, #9ca3af)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15)); z-index: 8; }
.step-title { font-weight: 700; font-size: 1rem; color: #1F2937; margin-top: 0.75rem; text-align: center; max-width: 160px; min-height: 2.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 0.25rem; }
.date-range { display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0.35rem 0; padding: 0 0.5rem; width: 100%; }
.date-range-input { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; font-size: 0.75rem; color: #4B5563; background-color: #f9fafb; cursor: pointer; text-align: center; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.date-range-input:hover { border-color: #d1d5db; background-color: #f3f4f6; }
.date-range-input.editable { background-color: #f0f9ff; border-color: #93c5fd; }
.date-range-input.editable:hover { background-color: #e0f2fe; }
.calendar-icon { color: #3b82f6; font-size: 0.875rem; }
.active-indicator { position: absolute; top: -1rem; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #3B82F6, #2563EB); color: #fff; font-size: 0.7rem; font-weight: bold; padding: 0.2rem 0.5rem; border-radius: 9999px; box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); animation: pulse 2.5s infinite; z-index: 20; }
.active-step { z-index: 15; }
.active-step .chart-container { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.35)); animation: glow 3s infinite alternate; }
.apexcharts-radialbar-area { transform-origin: center bottom; animation: fillWater 2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.calendar-fixed .vc-container { font-size: 12px; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.7);} 70% { box-shadow: 0 0 0 10px rgba(59,130,246,0);} 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0);} }
@keyframes glow { from { filter: drop-shadow(0 0 10px rgba(59,130,246,0.3)); } to { filter: drop-shadow(0 0 20px rgba(59,130,246,0.7)); } }
@keyframes fillWater { 0% { transform: scaleY(0); opacity: 0.6; } 20% { transform: scaleY(0.2); opacity: 0.7; } 60% { transform: scaleY(1.05); opacity: 0.9; } 100% { transform: scaleY(1); opacity: 1; } }
.subtasks-container { margin-top: 0.5rem; padding: 0.4rem; background-color: #f9fafb; border-radius: 0.5rem; width: 100%; box-shadow: 0 1px 3px rgba(0,0,0,0.05); min-height: 90px; position: relative; z-index: 1; }
.subtasks-scrollable { overflow-y: visible; }
.subtask-item { padding: 0.4rem; border-radius: 0.375rem; margin-bottom: 0.4rem; transition: all 0.2s; }
.subtask-item:hover { background-color: rgba(241,245,249,0.8); }
.subtask-label { margin-left: 0.4rem; font-size: 0.85rem; color: #1F2937; }
.modern-checkbox { position: relative; cursor: pointer; width: 18px; height: 18px; min-width: 18px; -webkit-appearance: none; appearance: none; background-color: #fff; border: 2px solid #d1d5db; border-radius: 0.25rem; transition: all 0.2s ease-in-out; }
.modern-checkbox:not(:disabled):hover { border-color: #9ca3af; }
.modern-checkbox:checked { background-color: #10B981; border-color: #10B981; }
.modern-checkbox:checked::after { content: ''; position: absolute; top: 2px; left: 5px; width: 6px; height: 9px; border-right: 2px solid #fff; border-bottom: 2px solid #fff; transform: rotate(45deg); }
.modern-checkbox:disabled { cursor: not-allowed; opacity: 0.8; }
.approval-info { font-size: 0.65rem; color: #4B5563; margin-left: 1.4rem; margin-top: 0.2rem; font-style: italic; }
.task-completed { background: rgba(16,185,129,0.1); }
.group-task { border-left: 3px solid #10B981; background-color: rgba(240,253,244,0.5); padding: 0.5rem; border-radius: 0.375rem; margin-bottom: 0.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.group-task-header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.group-task-content { margin-top: 0.5rem; padding-left: 0.25rem; }
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.backdrop-enter-active, .backdrop-leave-active { transition: opacity 0.3s ease; }
.backdrop-enter-from, .backdrop-leave-to { opacity: 0; }
.modal-content-enter-active, .modal-content-leave-active { transition: all 0.3s ease; }
.modal-content-enter-from, .modal-content-leave-to { opacity: 0; transform: scale(0.9) translateY(-20px); }
.modal-content-enter-to, .modal-content-leave-from { opacity: 1; transform: scale(1) translateY(0); }
/* date popover local render, modal overlay yok */
.flatpickr-calendar.static.open { position: static !important; transform: none !important; }
/* v-calendar popover ayarları */
.vc-popover-content { box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; border-radius: 8px !important; z-index: 999999 !important; }
.vc-popover-content, .vc-popover-caret { z-index: 999999 !important; }
.vc-container, .vc-pane { z-index: 999999 !important; }
@media (min-width: 1536px) { .production-step { width: 200px; min-width: 200px; max-width: 200px; } .chart-container { width: 170px; height: 170px; } }
@media (min-width: 1280px) and (max-width: 1535px) { .production-step { width: 180px; min-width: 180px; max-width: 180px; } .chart-container { width: 160px; height: 160px; } }
@media (max-width: 1279px) { .production-step { width: 170px; min-width: 170px; max-width: 170px; } .chart-container { width: 150px; height: 150px; } }
@media (max-width: 767px) { .production-step { width: 160px; min-width: 160px; max-width: 160px; } .chart-container { width: 140px; height: 140px; } }
@media (max-width: 639px) { .production-step { width: 150px; min-width: 150px; max-width: 150px; } .chart-container { width: 130px; height: 130px; } }
</style>


