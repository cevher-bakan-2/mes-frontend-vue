<template>
  <!-- Alt Folyo Grubu! Section -->
  <div class="mb-3 mt-2 bg-gray-100 dark:bg-slate-700 p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Alt Folyo Grubu!</h2>

    <div class="flex">
      <div class="flex-1">
        <!-- Alt Folyo - Yumuşak row -->
        <div class="flex items-end mb-3">
          <!-- Alt Folyo Yumuşak Switch -->
          <div class="w-[150px] mr-[6px]">
            <div class="flex flex-col items-center">
              <label for="altFolyoYumusak" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Alt Folyo<br>Yumuşak</label>
              <label class="toggle-switch" style="width: 40px; height: 20px;" :class="{'opacity-50 cursor-not-allowed': isYumusakDisabled}">
                <input type="checkbox" v-model="project.altFolyoSection.altFolyoYumusak.isAvailable" :disabled="isYumusakDisabled">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
              <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
            </div>
          </div>

          <!-- Alt Folyo Çeşidi - Yumuşak -->
          <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.altFolyoSection.altFolyoYumusak.isAvailable}">
            <label for="altFolyoCesidiYumusak" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Folyo Çeşidi</label>
            <div class="h-8 w-full">
              <!-- Çoklu seçim dropdown -->
              <div class="multiselect-dropdown">
                <div class="multiselect-dropdown-toggle" data-dropdown="altFolyoCesidiYumusak" @click="project.altFolyoSection.altFolyoYumusak.isAvailable && project.makineSection.kesmeTipi ? toggleAltFolyoCesidiYumusakDropdown() : null" :class="{'opacity-50 cursor-not-allowed': !project.altFolyoSection.altFolyoYumusak.isAvailable || !project.makineSection.kesmeTipi}">
                  <span class="multiselect-selected-text text-xs">
                    {{
                      !project.makineSection.kesmeTipi ? 'Önce Makine Tipi Seçiniz!' :
                      project.altFolyoSection.selectedAltFolyoCesidiYumusak && project.altFolyoSection.selectedAltFolyoCesidiYumusak.length > 0
                        ? (project.altFolyoSection.selectedAltFolyoCesidiYumusak.length + ' seçili')
                        : 'Seçiniz!'
                    }}
                  </span>
                  <i class="fas fa-chevron-down text-xs"></i>
                </div>

                <div v-if="altFolyoCesidiYumusakDropdownOpen" class="multiselect-dropdown-menu">
                  <div v-for="option in yumusakOptions" :key="option.value" class="multiselect-option flex items-center p-1 cursor-pointer" @click="toggleAltFolyoCesidiYumusakSelection(option.value, $event)">
                    <input type="checkbox" :value="option.value" :checked="project.altFolyoSection.selectedAltFolyoCesidiYumusak && project.altFolyoSection.selectedAltFolyoCesidiYumusak.includes(option.value)" class="mr-2" @click.stop>
                    <span class="text-xs">{{ option.label }}</span>
                  </div>
                  <div v-if="yumusakOptions.length === 0 && project.makineSection.kesmeTipi" class="p-2 text-xs text-gray-500">Bu makine tipi için seçenek yok</div>
                  <div class="multiselect-option">
                    <button type="button" @click="addCustomAltFolyoCesidiYumusak" class="text-blue-500 hover:text-blue-700 text-xs">+ Diğer Ekle</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Alt Folyo Yumuşak Kalınlığı "μ" -->
          <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.altFolyoSection.altFolyoYumusak.isAvailable}">
            <label for="altFolyoKalinlik" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Folyo Kalınlığı "μ"</label>
            <input type="text" id="altFolyoKalinlik" v-model="project.altFolyoSection.altFolyoYumusak.foilThickness" :disabled="!project.altFolyoSection.altFolyoYumusak.isAvailable" :class="{'opacity-50 cursor-not-allowed': !project.altFolyoSection.altFolyoYumusak.isAvailable}" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
          </div>

          <!-- Alt Folyo Yumusak Eni "mm." -->
          <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.altFolyoSection.altFolyoYumusak.isAvailable}">
            <label for="altFolyoEniYumusak" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Folyo Eni "mm."</label>
            <input type="text" id="altFolyoEniYumusak" v-model="project.altFolyoSection.altFolyoYumusak.foilWidth" :disabled="!project.altFolyoSection.altFolyoYumusak.isAvailable" :class="{'opacity-50 cursor-not-allowed': !project.altFolyoSection.altFolyoYumusak.isAvailable}" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
          </div>

          <!-- Folyo Tedarik for Alt Folyo Yumuşak -->
          <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.altFolyoSection.altFolyoYumusak.isAvailable}">
            <label for="altFolyoTedarikYumusak" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Folyo Tedarik</label>
            <select id="altFolyoTedarikYumusak" v-model="project.altFolyoSection.altFolyoYumusak.foilSupply" :disabled="!project.altFolyoSection.altFolyoYumusak.isAvailable" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="" selected>Seçiniz!</option>
              <option value="Betapak">Betapak</option>
              <option value="Müşteri">Müşteri</option>
            </select>
          </div>

          <!-- Alt Folyo UV Yumuşak -->
          <div class="w-[75px] mr-[6px]">
            <div class="flex flex-col items-center">
              <label for="altFolyoUVYumusak" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">UV</label>
              <label class="toggle-switch" style="width: 40px; height: 20px;">
                <input type="checkbox" v-model="project.altFolyoSection.altFolyoYumusak.uv">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
              <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
            </div>
          </div>

          <!-- Alt Folyo Web Cleaning & Antistatik Yumuşak -->
          <div class="w-[75px] mr-[6px]">
            <div class="flex flex-col items-center">
              <label for="altFolyoWebCleaningAntistatikYumusak" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Web Cleaning<br>& Antistatik</label>
              <label class="toggle-switch" style="width: 40px; height: 20px;">
                <input type="checkbox" v-model="project.altFolyoSection.altFolyoYumusak.webCleaningAntistatic">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
              <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
            </div>
          </div>
        </div>

        <!-- Alt Folyo - Sert row -->
        <div class="flex items-end mb-3">
          <!-- Alt Folyo Sert Switch -->
          <div class="w-[150px] mr-[6px]">
            <div class="flex flex-col items-center">
              <label for="altFolyoSert" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Alt Folyo<br>Sert</label>
              <label class="toggle-switch" style="width: 40px; height: 20px;" :class="{'opacity-50 cursor-not-allowed': isSertDisabled}">
                <input type="checkbox" v-model="project.altFolyoSection.altFolyoSert.isAvailable" :disabled="isSertDisabled">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
              <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
            </div>
          </div>

          <!-- Alt Folyo Çeşidi - Sert -->
          <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.altFolyoSection.altFolyoSert.isAvailable}">
            <label for="altFolyoCesidiSert" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Folyo Çeşidi</label>
            <div class="h-8 w-full">
              <!-- Çoklu seçim dropdown -->
              <div class="multiselect-dropdown">
                <div class="multiselect-dropdown-toggle" data-dropdown="altFolyoCesidiSert" @click="project.altFolyoSection.altFolyoSert.isAvailable && project.makineSection.kesmeTipi ? toggleAltFolyoCesidiSertDropdown() : null" :class="{'opacity-50 cursor-not-allowed': !project.altFolyoSection.altFolyoSert.isAvailable || !project.makineSection.kesmeTipi}">
                  <span class="multiselect-selected-text text-xs">
                    {{
                      !project.makineSection.kesmeTipi ? 'Önce Makine Tipi Seçiniz!' :
                      project.altFolyoSection.selectedAltFolyoCesidiSert && project.altFolyoSection.selectedAltFolyoCesidiSert.length > 0
                        ? (project.altFolyoSection.selectedAltFolyoCesidiSert.length + ' seçili')
                        : 'Seçiniz!'
                    }}
                  </span>
                  <i class="fas fa-chevron-down text-xs"></i>
                </div>

                <div v-if="altFolyoCesidiSertDropdownOpen" class="multiselect-dropdown-menu">
                  <div v-for="option in sertOptions" :key="option.value" class="multiselect-option flex items-center p-1 cursor-pointer" @click="toggleAltFolyoCesidiSertSelection(option.value, $event)">
                    <input type="checkbox" :value="option.value" :checked="project.altFolyoSection.selectedAltFolyoCesidiSert && project.altFolyoSection.selectedAltFolyoCesidiSert.includes(option.value)" class="mr-2" @click.stop>
                    <span class="text-xs">{{ option.label }}</span>
                  </div>
                  <div v-if="sertOptions.length === 0 && project.makineSection.kesmeTipi" class="p-2 text-xs text-gray-500">Bu makine tipi için seçenek yok</div>
                  <div class="multiselect-option">
                    <button type="button" @click="addCustomAltFolyoCesidiSert" class="text-blue-500 hover:text-blue-700 text-xs">+ Diğer Ekle</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Alt Folyo Kalınlığı "μ" - Sert -->
          <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.altFolyoSection.altFolyoSert.isAvailable}">
            <label for="altFolyoKalinlikSert" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Folyo Kalınlığı "μ"</label>
            <input type="text" id="altFolyoKalinlikSert" v-model="project.altFolyoSection.altFolyoSert.foilThickness" :disabled="!project.altFolyoSection.altFolyoSert.isAvailable" :class="{'opacity-50 cursor-not-allowed': !project.altFolyoSection.altFolyoSert.isAvailable}" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
          </div>

          <!-- Alt Folyo Eni "mm." - Sert -->
          <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.altFolyoSection.altFolyoSert.isAvailable}">
            <label for="altFolyoEniSert" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Folyo Eni "mm."</label>
            <input type="text" id="altFolyoEniSert" v-model="project.altFolyoSection.altFolyoSert.foilWidth" :disabled="!project.altFolyoSection.altFolyoSert.isAvailable" :class="{'opacity-50 cursor-not-allowed': !project.altFolyoSection.altFolyoSert.isAvailable}" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
          </div>

          <!-- Folyo Tedarik for Alt Folyo - Sert -->
          <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.altFolyoSection.altFolyoSert.isAvailable}">
            <label for="altFolyoTedarikSert" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Folyo Tedarik</label>
            <select id="altFolyoTedarikSert" v-model="project.altFolyoSection.altFolyoSert.foilSupply" :disabled="!project.altFolyoSection.altFolyoSert.isAvailable" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="" selected>Seçiniz!</option>
              <option value="Betapak">Betapak</option>
              <option value="Müşteri">Müşteri</option>
            </select>
          </div>

          <!-- UV - Sert -->
          <div class="w-[75px] mr-[6px]">
            <div class="flex flex-col items-center">
              <label for="altFolyoUVSert" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">UV</label>
              <label class="toggle-switch" style="width: 40px; height: 20px;">
                <input type="checkbox" v-model="project.altFolyoSection.altFolyoSert.uv">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
              <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
            </div>
          </div>

          <!-- Web Cleaning & Antistatik - Sert -->
          <div class="w-[75px] mr-[6px]">
            <div class="flex flex-col items-center">
              <label for="altFolyoWebCleaningAntistatikSert" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Web Cleaning<br>& Antistatik</label>
              <label class="toggle-switch" style="width: 40px; height: 20px;">
                <input type="checkbox" v-model="project.altFolyoSection.altFolyoSert.webCleaningAntistatic">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
              <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Alt Folyo Notlar -->
      <div class="ml-4 w-[618px]">
        <label for="altFolyoNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Folyo Notlar</label>
        <textarea id="altFolyoNotlar" v-model="project.altFolyoSection.foilNotes" class="w-full h-20 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Varsa, Belirtiniz!" style="height: 150px;"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { getAltFolyoYumusakOptions, getAltFolyoSertOptions } from '@/utils/dropdownData.js'

export default {
  name: 'BottomFoilSection',
  props: {
    project: { type: Object, required: true }
  },
  data() {
    return {
      altFolyoCesidiYumusakDropdownOpen: false,
      altFolyoCesidiSertDropdownOpen: false,
      customAltFolyoOptionsYumusak: [],
      customAltFolyoOptionsSert: []
    }
  },
  computed: {
    isYumusakDisabled() {
      const t = this.project.makineSection.kesmeTipi
      return t === 'Termoform' || t === 'Hazır Kap'
    },
    isSertDisabled() {
      const t = this.project.makineSection.kesmeTipi
      return t === 'Hazır Kap'
    },
    yumusakOptions() {
      const base = this.project.makineSection.kesmeTipi ? getAltFolyoYumusakOptions(this.project.makineSection.kesmeTipi) : []
      return [...base, ...this.customAltFolyoOptionsYumusak.map(v => ({ value: v, label: v }))]
    },
    sertOptions() {
      const base = this.project.makineSection.kesmeTipi ? getAltFolyoSertOptions(this.project.makineSection.kesmeTipi) : []
      return [...base, ...this.customAltFolyoOptionsSert.map(v => ({ value: v, label: v }))]
    }
  },
  watch: {
    'project.altFolyoSection.altFolyoYumusak.isAvailable'(newVal) {
      if (!newVal) {
        // Close dropdown and clear selections/fields
        this.altFolyoCesidiYumusakDropdownOpen = false
        this.project.altFolyoSection.selectedAltFolyoCesidiYumusak = []
        this.project.altFolyoSection.altFolyoYumusak.foilThickness = ''
        this.project.altFolyoSection.altFolyoYumusak.foilWidth = ''
        this.project.altFolyoSection.altFolyoYumusak.foilSupply = ''
        this.project.altFolyoSection.altFolyoYumusak.uv = false
        this.project.altFolyoSection.altFolyoYumusak.webCleaningAntistatic = false
      }
    },
    'project.altFolyoSection.altFolyoSert.isAvailable'(newVal) {
      if (!newVal) {
        // Close dropdown and clear selections/fields
        this.altFolyoCesidiSertDropdownOpen = false
        this.project.altFolyoSection.selectedAltFolyoCesidiSert = []
        this.project.altFolyoSection.altFolyoSert.foilThickness = ''
        this.project.altFolyoSection.altFolyoSert.foilWidth = ''
        this.project.altFolyoSection.altFolyoSert.foilSupply = ''
        this.project.altFolyoSection.altFolyoSert.uv = false
        this.project.altFolyoSection.altFolyoSert.webCleaningAntistatic = false
      }
    }
  },
  methods: {
    toggleAltFolyoCesidiYumusakDropdown() {
      this.altFolyoCesidiYumusakDropdownOpen = !this.altFolyoCesidiYumusakDropdownOpen
    },
    toggleAltFolyoCesidiSertDropdown() {
      this.altFolyoCesidiSertDropdownOpen = !this.altFolyoCesidiSertDropdownOpen
    },
    toggleAltFolyoCesidiYumusakSelection(value, event) {
      event && event.stopPropagation()
      if (!this.project.altFolyoSection.selectedAltFolyoCesidiYumusak) {
        this.$set ? this.$set(this.project.altFolyoSection, 'selectedAltFolyoCesidiYumusak', []) : (this.project.altFolyoSection.selectedAltFolyoCesidiYumusak = [])
      }
      const arr = this.project.altFolyoSection.selectedAltFolyoCesidiYumusak
      const idx = arr.indexOf(value)
      if (idx === -1) arr.push(value); else arr.splice(idx, 1)
      this.altFolyoCesidiYumusakDropdownOpen = false
    },
    toggleAltFolyoCesidiSertSelection(value, event) {
      event && event.stopPropagation()
      if (!this.project.altFolyoSection.selectedAltFolyoCesidiSert) {
        this.$set ? this.$set(this.project.altFolyoSection, 'selectedAltFolyoCesidiSert', []) : (this.project.altFolyoSection.selectedAltFolyoCesidiSert = [])
      }
      const arr = this.project.altFolyoSection.selectedAltFolyoCesidiSert
      const idx = arr.indexOf(value)
      if (idx === -1) arr.push(value); else arr.splice(idx, 1)
      this.altFolyoCesidiSertDropdownOpen = false
    },
    addCustomAltFolyoCesidiYumusak() {
      const val = window.prompt('Yeni Alt Folyo (Yumuşak) çeşidi:')
      if (val && !this.customAltFolyoOptionsYumusak.includes(val)) {
        this.customAltFolyoOptionsYumusak.push(val)
        if (!this.project.altFolyoSection.selectedAltFolyoCesidiYumusak) this.project.altFolyoSection.selectedAltFolyoCesidiYumusak = []
        this.project.altFolyoSection.selectedAltFolyoCesidiYumusak.push(val)
        this.altFolyoCesidiYumusakDropdownOpen = false
      }
    },
    addCustomAltFolyoCesidiSert() {
      const val = window.prompt('Yeni Alt Folyo (Sert) çeşidi:')
      if (val && !this.customAltFolyoOptionsSert.includes(val)) {
        this.customAltFolyoOptionsSert.push(val)
        if (!this.project.altFolyoSection.selectedAltFolyoCesidiSert) this.project.altFolyoSection.selectedAltFolyoCesidiSert = []
        this.project.altFolyoSection.selectedAltFolyoCesidiSert.push(val)
        this.altFolyoCesidiSertDropdownOpen = false
      }
    }
  }
}
</script>


