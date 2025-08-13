<template>
  <div class="min-h-screen flex overflow-hidden" v-cloak>
    <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" @toggle-collapsed="handleSidebarCollapse" />

    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300" :class="[isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64', isSidebarOpen ? '' : 'ml-0']">
      <AppHeader title="Yeni Proje Ekle" page-title="Yeni Proje Ekle" page-icon="fas fa-plus-circle" @toggle-sidebar="isSidebarOpen = true" />

      <div class="flex-1 p-4 lg:p-6 overflow-x-hidden">
        <div class="max-w-full mx-auto">
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 border-2 border-gray-300 dark:border-gray-600">
            
            <!-- Özel Değer Ekleme Modalı -->
            <div v-if="showCustomModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-96">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ customModalTitle }}</h3>
                <div class="mb-4">
                  <label for="customItemInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yeni Değer</label>
                  <input type="text" id="customItemInput" v-model="customItemValue" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Yeni değer girin..." @keyup.enter="addCustomItem">
                </div>
                <div class="flex justify-end">
                  <button type="button" @click="closeCustomModal" class="mr-2 px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-slate-500 focus:outline-none">İptal</button>
                  <button type="button" @click="addCustomItem" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none">Ekle</button>
                </div>
              </div>
            </div>

            <!-- Kesme Tipi Adet Girişi Modalı -->
            <div v-if="showKesmeTipiCountModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-96">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ currentKesmeTipi }} Adedi</h3>
                <div class="mb-4">
                  <label for="kesmeTipiCountInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adet</label>
                  <input type="number" id="kesmeTipiCountInput" v-model="kesmeTipiCountValue" min="1" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Adet girin..." @keyup.enter="addKesmeTipiWithCount">
                </div>
                <div class="flex justify-end">
                  <button type="button" @click="closeKesmeTipiCountModal" class="mr-2 px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-slate-500 focus:outline-none">İptal</button>
                  <button type="button" @click="addKesmeTipiWithCount" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none">Ekle</button>
                </div>
              </div>
            </div>

            <form @submit.prevent="onFormSubmit">
      <ProjectSection :project="project" :countries="countries" :states="states" :loadingStates="loadingStates" :pdfFileName="pdfFileName" :currentDate="currentDate" @pdf-upload="handlePdfUpload" @country-change="onCountryChange" @update-penalty="updateCezaiSartDate" />

      <MachineSection 
                ref="machineSectionRef"
                :project="project" 
                :availableModels="availableModels" 
                :availableAltModels="availableAltModels" 
                :productOptions="availableProducts" 
                @show-kesme-tipi-modal="showKesmeTipiCountModalForItem"
                @show-custom-modal="showCustomModalForField"
              />

      <FillingSection :project="project" />
      <BottomFoilSection :project="project" />
      <TopFoilSection :project="project" />

      <div class="flex flex-wrap justify-between">
        <HygieneSection :project="project" />
        <EndOfLineSection :project="project" />
      </div>

      <AccessorySection :project="project" />

      <div class="flex flex-wrap justify-between">
        <PackagingSection :project="project" />
        <ExtrasSection :project="project" />
      </div>

      <!-- Form Buttons -->
      <div class="flex justify-end gap-4 mt-6">
        <button type="button" @click="resetForm" class="px-6 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none">
          <div class="flex items-center">
            <i class="fas fa-times mr-2"></i>
            <span>Seçimleri Temizle</span>
          </div>
        </button>

        <button type="button" @click="saveProject" class="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none">
          <div class="flex items-center">
            <i class="fas fa-save mr-2"></i>
            <span>Proje Kaydet</span>
          </div>
        </button>
      </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import { Project } from '@/models/Project.js'
import { ApiService, API_CONFIG, TokenService } from '@/services/api.js'
import { machineTypeModels, modelAltModels, modelProducts } from '@/utils/dropdownData.js'
import { countryPowerData } from '@/utils/countryPowerData.js'
import { countryMappings, tryAlternativeCountryName } from '@/utils/countryMappings.js'
import ProjectSection from '@/components/project-sections/ProjectSection.vue'
import MachineSection from '@/components/project-sections/MachineSection.vue'
import FillingSection from '@/components/project-sections/FillingSection.vue'
import BottomFoilSection from '@/components/project-sections/BottomFoilSection.vue'
import TopFoilSection from '@/components/project-sections/TopFoilSection.vue'
import HygieneSection from '@/components/project-sections/HygieneSection.vue'
import EndOfLineSection from '@/components/project-sections/EndOfLineSection.vue'
import AccessorySection from '@/components/project-sections/AccessorySection.vue'
import PackagingSection from '@/components/project-sections/PackagingSection.vue'
import ExtrasSection from '@/components/project-sections/ExtrasSection.vue'

export default {
  name: 'AddProject',
  components: { AppSidebar, AppHeader, ProjectSection, MachineSection, FillingSection, BottomFoilSection, TopFoilSection, HygieneSection, EndOfLineSection, AccessorySection, PackagingSection, ExtrasSection },
  setup() {
    const isSidebarOpen = ref(window.innerWidth >= 1024)
    const isSidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
    const handleSidebarCollapse = (collapsed) => { isSidebarCollapsed.value = collapsed }
    
    const machineSectionRef = ref(null)

    const project = reactive(new Project())
    const currentDate = ref(new Date())
    project.projeSection.projeOlusturmaTarihi = currentDate.value.toISOString()

    const pdfFileInput = ref(null)
    const pdfFileName = ref('')
    const extraFileName = ref('')

    // Modal state variables
    const showCustomModal = ref(false)
    const customModalTitle = ref('')
    const customModalField = ref('')
    const customItemValue = ref('')
    
    const showKesmeTipiCountModal = ref(false)
    const currentKesmeTipi = ref('')
    const currentKesmeTipiOption = ref(null)
    const kesmeTipiCountValue = ref(1)

    // Custom arrays for storing custom values
    const customAltModels = ref([])
    const customProducts = ref([])
    const customKesmeTipi = ref([])

    const countries = ref([
      'Afganistan','Almanya','Amerika Birleşik Devletleri','Andorra','Angola','Antigua ve Barbuda','Arjantin','Arnavutluk','Avustralya','Avusturya','Azerbaycan','Bahamalar','Bahreyn','Bangladeş','Barbados','Belçika','Belize','Benin','Beyaz Rusya','Bhutan','Birleşik Arap Emirlikleri','Birleşik Krallık','Bolivya','Bosna Hersek','Botsvana','Brezilya','Brunei','Bulgaristan','Burkina Faso','Burundi','Cezayir','Cibuti','Çad','Çek Cumhuriyeti','Çin','Danimarka','Doğu Timor','Dominik Cumhuriyeti','Dominika','Ekvador','Ekvator Ginesi','El Salvador','Endonezya','Eritre','Ermenistan','Estonya','Esvatini','Etiyopya','Fas','Fiji','Fildişi Sahili','Filipinler','Finlandiya','Fransa','Gabon','Gambiya','Gana','Gine','Gine-Bissau','Grenada','Guyana','Guatemala','Güney Afrika','Güney Kore','Güney Sudan','Gürcistan','Haiti','Hırvatistan','Hindistan','Hollanda','Honduras','Irak','İran','İrlanda','İspanya','İsrail','İsveç','İsviçre','İtalya','İzlanda','Jamaika','Japonya','Kamboçya','Kamerun','Kanada','Karadağ','Katar','Kazakistan','Kenya','Kıbrıs','Kırgızistan','Kiribati','Kolombiya','Komorlar','Kongo','Kongo Demokratik Cumhuriyeti','Kosova','Kosta Rika','Kuveyt','Kuzey Kore','Kuzey Makedonya','Küba','Laos','Lesotho','Letonya','Liberya','Libya','Liechtenstein','Litvanya','Lübnan','Lüksemburg','Macaristan','Madagaskar','Malavi','Maldivler','Malezya','Mali','Malta','Marshall Adaları','Mauritius','Meksika','Mısır','Mikronezya','Moğolistan','Moldova','Monako','Moritanya','Mozambik','Myanmar','Namibya','Nauru','Nepal','Nijer','Nijerya','Nikaragua','Norveç','Orta Afrika Cumhuriyeti','Özbekistan','Pakistan','Palau','Panama','Papua Yeni Gine','Paraguay','Peru','Polonya','Portekiz','Romanya','Ruanda','Rusya','Saint Kitts ve Nevis','Saint Lucia','Saint Vincent ve Grenadinler','Samoa','San Marino','Sao Tome ve Principe','Senegal','Seyşeller','Sırbistan','Sierra Leone','Singapur','Slovakya','Slovenya','Solomon Adaları','Somali','Sri Lanka','Sudan','Surinam','Suriye','Suudi Arabistan','Şili','Tacikistan','Tanzanya','Tayland','Tayvan','Togo','Tonga','Trinidad ve Tobago','Tunus','Tuvalu','Türkiye','Türkmenistan','Uganda','Ukrayna','Umman','Uruguay','Ürdün','Vanuatu','Vatikan','Venezuela','Vietnam','Yemen','Yeni Zelanda','Yeşil Burun Adaları','Yunanistan','Zambiya','Zimbabve'
    ])
    const states = ref([])
    const loadingStates = ref(false)

    const availableModels = computed(() => machineTypeModels[project.makineSection.kesmeTipi] || [])
    const availableAltModels = computed(() => {
      const models = modelAltModels[project.makineSection.model] || []
      return [...models, ...customAltModels.value]
    })
    
    const availableProducts = computed(() => {
      if (!project.makineSection.model) return []
      
      let products = modelProducts[project.makineSection.model] || []
      
      if (project.makineSection.model === 'Bpz Series' && project.makineSection.altModel === 'Bpz-JR') {
        // Remove "Buz Kalıbı" from products for Bpz-JR alt model
        products = products.filter(p => p !== 'Buz Kalıbı')
      }
      
      // Add custom products
      products = [...products, ...customProducts.value]
      
      // Alfabetik sıraya göre sırala
      return products.sort((a, b) => a.localeCompare(b, 'tr'))
    })

    onMounted(() => { if (project.projeSection.ulke) updatePowerData() })

    const formatDateOnly = (date) => { const d = date instanceof Date ? date : new Date(date); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}` }
    const formatDate = (s) => { if(!s) return ''; const [y,m,d] = s.split('-'); return `${d}/${m}/${y}` }

    const updateCezaiSartDate = () => { const { sevkTarihi, revizeSevkTarihi, cezaiSart } = project.projeSection; if(!cezaiSart){project.projeSection.cezaiSartDate='';return} const base=revizeSevkTarihi||sevkTarihi; if(!base){project.projeSection.cezaiSartDate='';return} try{ const [y,m,d]=base.split('-').map(n=>parseInt(n,10)); const dt=new Date(y,m-1,d); dt.setDate(dt.getDate()+30); const ny=dt.getFullYear(); const nm=String(dt.getMonth()+1).padStart(2,'0'); const nd=String(dt.getDate()).padStart(2,'0'); project.projeSection.cezaiSartDate=`${ny}-${nm}-${nd}`}catch(e){project.projeSection.cezaiSartDate=''} }

    const handlePdfUpload = (e) => { const file=e.target.files?.[0]; if(file && file.type==='application/pdf'){ project.projeSection.pdfFile=file; project.projeSection.pdfFileName=file.name; pdfFileName.value=file.name } else { e.target.value=null; project.projeSection.pdfFile=null; project.projeSection.pdfFileName=''; pdfFileName.value=''; alert('Lütfen geçerli bir PDF dosyası yükleyin!') } }
    const handleExtraUpload = (e) => { const file=e.target.files?.[0]; if(file){ project.ekstraSection.extraPdfFile=file; extraFileName.value=file.name } else { extraFileName.value=''; project.ekstraSection.extraPdfFile=null } }

    const updatePowerData = () => { 
      const selectedCountry = project.projeSection.ulke;
      if (selectedCountry && countryPowerData && countryPowerData[selectedCountry]) {
        const powerData = countryPowerData[selectedCountry];
        project.projeSection.frekans = powerData.frequency;
        project.projeSection.gerilim = powerData.voltage;
      } else {
        project.projeSection.frekans = '';
        project.projeSection.gerilim = '';
      }
    }
    const onCountryChange = async () => { updatePowerData(); await fetchStates(project.projeSection.ulke) }

    const cleanStateName = (name) => (name||'').replace(/\s*\([^)]*\)/g,'').replace(/ Province$| State$| Region$| Département$| Distrito$| Bölge$| İl$| Eyalet$| County$| District$| Territory$| Area$| Zone$| Prefecture$| Governorate$| Municipality$| Canton$| Department$/ig,'').trim()
    
    const fetchStates = async (countryName) => {
      states.value = []
      if (!countryName) return
      
      loadingStates.value = true
      
      try {
        // Convert Turkish country name to English using our comprehensive mapping
        const englishCountryName = countryMappings[countryName] || countryName
        
        let response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            country: englishCountryName
          })
        })
        
        let data = await response.json()
        
        // If first attempt fails, try alternative country name formats
        if (data.error) {
          const alternativeName = tryAlternativeCountryName(englishCountryName)
          if (alternativeName !== englishCountryName) {
            response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                country: alternativeName
              })
            })
            data = await response.json()
          }
        }
        
        // If still no data, try to get basic states from countries API
        if (data.error || !data.data || !data.data.states) {
          try {
            const countriesResponse = await fetch('https://countriesnow.space/api/v0.1/countries')
            const countriesData = await countriesResponse.json()
            
            if (countriesData && countriesData.data) {
              const country = countriesData.data.find(c => 
                c.country.toLowerCase() === englishCountryName.toLowerCase() ||
                c.country.toLowerCase() === countryName.toLowerCase()
              )
              
              if (country && country.cities && country.cities.length > 0) {
                // Use cities as states if states are not available
                const basicStates = country.cities.map((city, index) => ({
                  id: index + 1,
                  name: cleanStateName(city),
                  state_code: 'CITY'
                }))
                
                if (country.capital && country.capital.length > 0) {
                  basicStates.unshift({
                    id: 0,
                    name: cleanStateName(`${country.capital[0]} (Capital)`),
                    state_code: 'CAP'
                  })
                }
                
                if (basicStates.length > 0) {
                  states.value = basicStates
                  return
                }
              }
            }
          } catch (fallbackError) {
            console.error('Fallback API error:', fallbackError)
          }
        }
        
        if (data && !data.error && data.data && data.data.states) {
          states.value = data.data.states.map((state, index) => ({
            id: index + 1,
            name: cleanStateName(state.name),
            state_code: state.state_code
          }))
        } else {
          states.value = []
        }
      } catch (error) {
        console.error('Error fetching states:', error)
        states.value = []
      } finally {
        loadingStates.value = false
      }
    }

    // Modal methods
    const showCustomModalForField = (field) => {
      customModalField.value = field
      switch (field) {
        case 'altModel':
          customModalTitle.value = 'Yeni Alt Model Ekle'
          break
        case 'product':
          customModalTitle.value = 'Yeni Ürün Çeşidi Ekle'
          break
        case 'kesmeTipi':
          customModalTitle.value = 'Yeni Kesme Tipi Ekle'
          break
        default:
          customModalTitle.value = 'Yeni Değer Ekle'
      }
      customItemValue.value = ''
      showCustomModal.value = true
    }

    const closeCustomModal = () => {
      showCustomModal.value = false
      customModalField.value = ''
      customModalTitle.value = ''
      customItemValue.value = ''
    }

    const addCustomItem = () => {
      if (!customItemValue.value.trim()) return
      
      switch (customModalField.value) {
        case 'altModel':
          customAltModels.value.push(customItemValue.value.trim())
          project.makineSection.altModel = customItemValue.value.trim()
          break
        case 'product':
          customProducts.value.push(customItemValue.value.trim())
          // Notify MachineSection about the new custom product
          if (machineSectionRef.value) {
            machineSectionRef.value.addCustomProductToList(customItemValue.value.trim())
          }
          break
        case 'kesmeTipi':
          customKesmeTipi.value.push(customItemValue.value.trim())
          // Notify MachineSection about the new custom kesme tipi
          if (machineSectionRef.value) {
            machineSectionRef.value.addCustomKesmeTipiToList(customItemValue.value.trim())
          }
          break
      }
      
      closeCustomModal()
    }

    const showKesmeTipiCountModalForItem = (option) => {
      currentKesmeTipi.value = option.label
      currentKesmeTipiOption.value = option
      
      // Eğer zaten eklenmiş bir öğe ise, mevcut adeti göster
      const existingItem = project.makineSection.kesmeTipiItems?.find(item => item.value === option.value)
      kesmeTipiCountValue.value = existingItem ? existingItem.count : 1
      
      showKesmeTipiCountModal.value = true
    }
    
    const closeKesmeTipiCountModal = () => {
      showKesmeTipiCountModal.value = false
      currentKesmeTipi.value = ''
      currentKesmeTipiOption.value = null
      kesmeTipiCountValue.value = 1
    }
    
    const addKesmeTipiWithCount = () => {
      if (!currentKesmeTipiOption.value) return
      
      // Ensure kesmeTipiItems is initialized
      if (!project.makineSection.kesmeTipiItems) {
        project.makineSection.kesmeTipiItems = []
      }
      
      const option = currentKesmeTipiOption.value
      const count = parseInt(kesmeTipiCountValue.value) || 1
      
      // Check if item already exists
      const existingIndex = project.makineSection.kesmeTipiItems.findIndex(item => item.value === option.value)
      
      if (existingIndex !== -1) {
        // Update existing item
        project.makineSection.kesmeTipiItems[existingIndex].count = count
      } else {
        // Add new item
        project.makineSection.kesmeTipiItems.push({
          value: option.value,
          label: option.label,
          count: count
        })
      }
      
      // Update kesmeTipiSayilari for display
      if (!project.makineSection.kesmeTipiSayilari) {
        project.makineSection.kesmeTipiSayilari = {}
      }
      project.makineSection.kesmeTipiSayilari[option.value] = count
      
      closeKesmeTipiCountModal()
    }

    const onFormSubmit = (e) => { e.preventDefault() }
    const resetForm = () => { const np = new Project(); Object.assign(project, np); pdfFileName.value=''; extraFileName.value='' }

    const uploadFile = async (file) => { const url=(API_CONFIG.BASE_URL.endsWith('/')?`${API_CONFIG.BASE_URL}Files/upload`:`${API_CONFIG.BASE_URL}/Files/upload`); const form=new FormData(); form.append('file',file); const token=TokenService.getToken(); const res=await fetch(url,{method:'POST',headers: token?{Authorization:`Bearer ${token}`}:{}, body:form}); if(!res.ok) throw new Error(`Yükleme hatası: ${res.status}`); const json=await res.json(); return json.fileName||'' }
    const buildPayload = (pdfName, extraName) => {
      // Build machine items (main + dynamic), mirroring legacy logic
      const machineItems = []
      const dyn = project.makineSection.dinamikAlanlar || {}
      const mainVacuum = dyn['vakum_0'] !== undefined ? !!dyn['vakum_0'] : !!project.makineSection.vakum
      const mainGas = dyn['gaz_0'] !== undefined ? !!dyn['gaz_0'] : !!project.makineSection.gaz
      const mainItem = {
        vacuum: mainVacuum,
        gas: mainGas,
        moldEyeCount: project.makineSection.moldEyeCount || '',
        strokeMin: project.makineSection.vurusDkMin?.toString() || '',
        strokeMax: project.makineSection.vurusDkMax?.toString() || '',
        capacityMinPerHour: project.makineSection.kapasiteMin?.toString() || '',
        capacityMaxPerHour: project.makineSection.kapasiteMax?.toString() || '',
        innerToInner: project.makineSection.ictenIce || '',
        outerToOuter: project.makineSection.distanDisa || '',
        height: project.makineSection.yukseklik || '',
        pitch: project.makineSection.hatve || ''
      }
      machineItems.push(mainItem)

      const moldCount = parseInt(project.makineSection.gozSayisi)
      if (moldCount && moldCount > 1) {
        for (let i = 0; i < moldCount - 1; i++) {
          machineItems.push({
            vacuum: !!dyn[`vakum_${i}`],
            gas: !!dyn[`gaz_${i}`],
            moldEyeCount: dyn[`kalipGozSayisi_${i}`] || '',
            strokeMin: dyn[`vurusDkMin_${i}`]?.toString() || '',
            strokeMax: dyn[`vurusDkMax_${i}`]?.toString() || '',
            capacityMinPerHour: dyn[`kapasiteMin_${i}`]?.toString() || '',
            capacityMaxPerHour: dyn[`kapasiteMax_${i}`]?.toString() || '',
            innerToInner: dyn[`ictenIce_${i}`] || '',
            outerToOuter: dyn[`distanDisa_${i}`] || '',
            height: dyn[`yukseklik_${i}`] || '',
            pitch: dyn[`hatve_${i}`] || ''
          })
        }
      }

      // Build cuttingType string from kesmeTipiItems with counts
      let cuttingType = ''
      if (Array.isArray(project.makineSection.kesmeTipiItems) && project.makineSection.kesmeTipiItems.length) {
        cuttingType = project.makineSection.kesmeTipiItems
          .map(item => `${item.value}${item.count > 1 ? ' x' + item.count : ''}`)
          .join(', ')
      } else if (Array.isArray(project.makineSection.selectedKesmeTipi)) {
        cuttingType = project.makineSection.selectedKesmeTipi.join(', ')
      }

      // Build fillingItems (main + dynamic), mirroring legacy service
      const fillingItems = []
      if (project.dolumSection.dolum) {
        fillingItems.push({
          hasGranuleProduct: !!project.dolumSection.urunTipiTanecikli,
          particleSize: project.dolumSection.partikulOlcusu || '',
          productTemperature: project.dolumSection.urunSicakligi || '',
          productAmount: project.dolumSection.urunMiktari || '',
          productStructure: project.dolumSection.urunYapisi || '',
          productSpecifications: project.dolumSection.urunSpektleri || '',
          fillingType: project.dolumSection.dolumTipi || '',
          fillingMovement: project.dolumSection.dolumHareketi || '',
          manualFillingArea: project.makineSection.manuelDolumAlani || '',
          fillingPosition: project.dolumSection.dolumKonumu || '',
          fillingUnitLocation: project.dolumSection.dolumUnitesiYeri || '',
          hasServiceCart: !!project.dolumSection.servisArabasi
        })
        const u = parseInt(project.dolumSection.uniteSayisi)
        const dyn = project.dolumSection.dinamikAlanlar || {}
        if (u && u > 1) {
          for (let i = 0; i < u - 1; i++) {
            fillingItems.push({
              hasGranuleProduct: !!dyn[`urunTipiTanecikli_${i}`],
              particleSize: dyn[`partikulOlcusu_${i}`] || '',
              productTemperature: dyn[`urunSicakligi_${i}`] || '',
              productAmount: dyn[`urunMiktari_${i}`] || '',
              productStructure: dyn[`urunYapisi_${i}`] || '',
              productSpecifications: dyn[`urunSpektleri_${i}`] || '',
              fillingType: dyn[`dolumTipi_${i}`] || '',
              fillingMovement: dyn[`dolumHareketi_${i}`] || '',
              manualFillingArea: dyn[`manuelDolumAlani_${i}`] || '',
              fillingPosition: dyn[`dolumKonumu_${i}`] || '',
              fillingUnitLocation: dyn[`dolumUnitesiYeri_${i}`] || '',
              hasServiceCart: !!dyn[`servisArabasi_${i}`]
            })
          }
        }
      }

      return {
        project:{ seriNo:project.projeSection.seriNo||'', company1:project.projeSection.firmaAdi||'', company2:project.projeSection.firma2||'', country:project.projeSection.ulke||'', city:project.projeSection.sehir||'', shipmentDate:project.projeSection.sevkTarihi?new Date(project.projeSection.sevkTarihi).toISOString():null, revisionDate:project.projeSection.revizeSevkTarihi?new Date(project.projeSection.revizeSevkTarihi).toISOString():null, expectedDate:project.projeSection.siparisTarihi?new Date(project.projeSection.siparisTarihi).toISOString():null, penaltyDate:project.projeSection.cezaiSartDate?new Date(project.projeSection.cezaiSartDate).toISOString():null, isActivePenalty:!!project.projeSection.cezaiSart, projectNote:project.projeSection.projeNotu||'', projectPdfName:pdfName||'' },
        sectionMachine:{ machineType:project.makineSection.kesmeTipi||'', cuttingType, cuttingNotes:project.makineSection.kesmeNotlari||'', machineItems, heatPlate:project.makineSection.isiPlakasi||'', pushingType:project.makineSection.pushType||'', model:project.makineSection.model||'', subModel:project.makineSection.altModel||'', productType:Array.isArray(project.makineSection.selectedProducts)?project.makineSection.selectedProducts.join(', '):'', moldCount:project.makineSection.gozSayisi?parseInt(project.makineSection.gozSayisi)||0:0, lubrication:project.makineSection.yaglama||'', screenSize:project.makineSection.ekranBoyutu||'', frequency:project.projeSection.frekans||'', voltage:project.projeSection.gerilim||'', machineSize:project.makineSection.makineBoyutu||'', plc:project.makineSection.plc||'Omron', machineNotes:project.makineSection.makineNotlari||'' },
        sectionFilling:{ isAvailable:!!project.dolumSection.dolum, unitCount:project.dolumSection.uniteSayisi?parseInt(project.dolumSection.uniteSayisi)||0:0, fillingNotes:project.dolumSection.dolumNotlari||'', fillingItems },
        sectionTopFoil:{ isAvailable:!!project.ustFolyoSection.ustFolyo, foilTypeName:Array.isArray(project.ustFolyoSection.selectedUstFolyoCesidi)?project.ustFolyoSection.selectedUstFolyoCesidi.join(', '):'', foilThickness:project.ustFolyoSection.ustFolyoKalinlik||'', foilWidth:project.ustFolyoSection.ustFolyoEni||'', foilSupply:project.ustFolyoSection.ustFolyoTedarik||'', uv:!!project.ustFolyoSection.ustFolyoUV, webCleaningAntistatic:!!project.ustFolyoSection.ustFolyoAntistatik, foilNotes:project.ustFolyoSection.ustFolyoNotlar||'' },
        sectionBottomFoil:{ sectionBottomFoilSoft:{ isAvailable:project.altFolyoSection.altFolyoYumusak?.isAvailable||false, foilTypeName:Array.isArray(project.altFolyoSection.selectedAltFolyoCesidiYumusak)?project.altFolyoSection.selectedAltFolyoCesidiYumusak.join(', '):'', foilThickness:project.altFolyoSection.altFolyoYumusak?.foilThickness||'', foilWidth:project.altFolyoSection.altFolyoYumusak?.foilWidth||'', foilSupply:project.altFolyoSection.altFolyoYumusak?.foilSupply||'', uv:!!project.altFolyoSection.altFolyoYumusak?.uv, webCleaningAntistatic:!!project.altFolyoSection.altFolyoYumusak?.webCleaningAntistatic }, sectionBottomFoilHard:{ isAvailable:project.altFolyoSection.altFolyoSert?.isAvailable||false, foilTypeName:Array.isArray(project.altFolyoSection.selectedAltFolyoCesidiSert)?project.altFolyoSection.selectedAltFolyoCesidiSert.join(', '):'', foilThickness:project.altFolyoSection.altFolyoSert?.foilThickness||'', foilWidth:project.altFolyoSection.altFolyoSert?.foilWidth||'', foilSupply:project.altFolyoSection.altFolyoSert?.foilSupply||'', uv:!!project.altFolyoSection.altFolyoSert?.uv, webCleaningAntistatic:!!project.altFolyoSection.altFolyoSert?.webCleaningAntistatic }, foilNotes:project.altFolyoSection.foilNotes||'' },
        sectionHygiene:{ sterileAirFilter:project.hijyenSection.sterilHavaFiltresi||'', hepa:!!project.hijyenSection.hepa, ultraClean:!!project.hijyenSection.ultraClean, fullCIP:!!project.hijyenSection.cipFull, cipInOut:!!project.hijyenSection.cipInOut, sip:!!project.hijyenSection.sip, hygieneNotes:project.hijyenSection.hijyenNotlari||'' },
        sectionEndOfLine:{ isRobot:!!project.hatSonuSection.robot, robotType:project.hatSonuSection.robotTipi||'', robotModel:project.hatSonuSection.robotModeli||'', boxOpening:!!project.hatSonuSection.koliAcma, boxClosing:!!project.hatSonuSection.koliKapatma, endOfLineNotes:project.hatSonuSection.hatSonuNotlari||'' },
        sectionAccessory:{
          vacuumPumpType: project.aksesuarSection.vakumPompasiTipi || '',
          vacuumPumpModel: Array.isArray(project.aksesuarSection.selectedVakumModelleri)
            ? project.aksesuarSection.selectedVakumModelleri.map(model => {
                const isX2 = !!(project.aksesuarSection.vakumPompasiX2 && project.aksesuarSection.vakumPompasiX2[model])
                // HTML yapıda stringe doğrudan 'x2' ekleniyordu
                return isX2 ? `${model} x2` : model
              }).join(', ')
            : '',
          chillerKcal: project.aksesuarSection.chiller || '',
          travers: Array.isArray(project.aksesuarSection.selectedTravers) ? project.aksesuarSection.selectedTravers.join(', ') : '',
          stickerUnit: Array.isArray(project.aksesuarSection.selectedStickerUnitesi) ? project.aksesuarSection.selectedStickerUnitesi.join(', ') : '',
          accessoryNotes: project.aksesuarSection.aksesuarNotlari || '',
          jumboBobbinTrolley: !!project.aksesuarSection.jumboBobin, 
          groundScrapWinding: !!project.aksesuarSection.yerdeFireSarma,
          foilTrolley: !!project.aksesuarSection.folyoArabasi,
          extraFoilTrolley: !!project.aksesuarSection.ekstraFolyoArabasi,
          easyMoldChangeTrolley: !!project.aksesuarSection.kalipDegistirmeArabasi,
          compressor: !!project.aksesuarSection.kompresor,
          panelAirConditioner: !!project.aksesuarSection.panoKlimasi,
          redPump: !!project.aksesuarSection.kirmiziPompa,
          waterFilter: !!project.aksesuarSection.suTutucuFiltre,
          printer: !!project.hatSonuSection.yazici,
          labelUnit: !!project.hatSonuSection.etiketUnitesi,
          scale: !!project.hatSonuSection.terazi,
          ...(project.hatSonuSection.terazi && project.hatSonuSection.teraziNotlar
            ? { scaleNotes: project.hatSonuSection.teraziNotlar }
            : {})
        },
        sectionPackaging:{ loadingType:project.paketlemeSection.yuklemeSekli||'', pallet:!!project.paketlemeSection.palet, standard:!!project.paketlemeSection.standart, crate:!!project.paketlemeSection.sandik, moisturePreventer:!!project.paketlemeSection.nemOnleyici, deliveryType:project.paketlemeSection.teslimatSekli||'', packagingNotes:project.paketlemeSection.paketlemeNotlari||'' },
        sectionExtras:{ extraFileName:extraName||'', extraNotes:project.ekstraSection.digerNotlar||'' }
      }
    }
    const saveProject = async () => { try{ const mainPdf = project.projeSection.pdfFile ? await uploadFile(project.projeSection.pdfFile) : ''; const extra = project.ekstraSection.extraPdfFile ? await uploadFile(project.ekstraSection.extraPdfFile) : ''; const data = buildPayload(mainPdf, extra); await ApiService.post('/Projects/create-with-sections', data); alert('Proje başarıyla kaydedildi!') } catch(e){ console.error(e); alert(`Proje kaydedilirken hata oluştu: ${e.message||e}`) } }

    // Watch for machine type changes to reset related fields
    watch(() => project.makineSection.kesmeTipi, (newValue) => {
      project.makineSection.model = ''
      project.makineSection.altModel = ''
      project.makineSection.selectedProducts = []
      project.makineSection.selectedKesmeTipi = []
      project.makineSection.kesmeTipiItems = []
      project.makineSection.hatve = ''
      
      if (newValue !== 'Hazır Kap') {
        project.makineSection.pushType = ''
      }
      
      if (newValue === 'Termoform' || newValue === 'Zincirli') {
        project.ustFolyoSection.ustFolyo = true
      }
      
      if (newValue === 'Termoform') {
        project.makineSection.isiPlakasi = 'Hareketli'
      }
      
      project.makineSection.plc = 'Omron'
    })

    return { 
      isSidebarOpen, isSidebarCollapsed, handleSidebarCollapse, project, countries, states, loadingStates, 
      availableModels, availableAltModels, availableProducts, pdfFileInput, pdfFileName, extraFileName, 
      currentDate, formatDateOnly, formatDate, onCountryChange, updateCezaiSartDate, handlePdfUpload, 
      handleExtraUpload, resetForm, saveProject, onFormSubmit,
      // Modal related
      showCustomModal, customModalTitle, customItemValue, showCustomModalForField, closeCustomModal, addCustomItem,
      showKesmeTipiCountModal, currentKesmeTipi, kesmeTipiCountValue, showKesmeTipiCountModalForItem, 
      closeKesmeTipiCountModal, addKesmeTipiWithCount,
      // Refs
      machineSectionRef
    }
  }
}
</script>