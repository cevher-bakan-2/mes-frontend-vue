<template>
  <!-- Üst Folyo Grubu! Section -->
  <div class="mb-3 mt-2 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Üst Folyo Grubu!</h2>
    <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">Bölüm-5</p>

    <div class="flex">
      <div class="flex-1">
        <!-- Üst Folyo row -->
        <div class="flex items-end mb-3">
          <!-- Üst Folyo Toggle -->
          <div class="w-[150px] mr-[6px]">
            <div class="flex flex-col items-center">
              <label for="ustFolyo" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Üst Folyo</label>
              <label class="toggle-switch" style="width: 40px; height: 20px;" :class="{'opacity-50 cursor-not-allowed': isTopFoilDisabled}">
                <input type="checkbox" v-model="project.ustFolyoSection.ustFolyo" :disabled="isTopFoilDisabled">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
              <span class="text-xs text-gray-500 mt-1"><span>Yok/Var</span></span>
            </div>
          </div>

          <!-- Üst Folyo Çeşidi -->
          <div class="w-[150px] mr-[6px]">
            <label for="ustFolyoCesidi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Üst Folyo Çeşidi</label>
            <div class="h-8 w-full">
              <!-- Çoklu seçim dropdown -->
              <div class="multiselect-dropdown">
                <div class="multiselect-dropdown-toggle" data-dropdown="ustFolyoCesidi" @click="project.ustFolyoSection.ustFolyo ? toggleUstFolyoCesidiDropdown() : null" :class="{'opacity-50 cursor-not-allowed': !project.ustFolyoSection.ustFolyo}">
                  <span class="multiselect-selected-text text-xs">
                    {{ project.ustFolyoSection.selectedUstFolyoCesidi.length > 0 ? (project.ustFolyoSection.selectedUstFolyoCesidi.length + ' seçili') : 'Seçiniz!' }}
                  </span>
                  <i class="fas fa-chevron-down text-xs"></i>
                </div>

                <div v-if="ustFolyoCesidiDropdownOpen" class="multiselect-dropdown-menu">
                  <!-- Default options -->
                  <div class="multiselect-option flex items-center p-1 cursor-pointer" @click="toggleUstFolyoCesidiSelection('PA-PE', $event)">
                    <input type="checkbox" value="PA-PE" :checked="project.ustFolyoSection.selectedUstFolyoCesidi.includes('PA-PE')" class="mr-2" @click.stop>
                    <span class="text-xs">PA-PE</span>
                  </div>
                  <div class="multiselect-option flex items-center p-1 cursor-pointer" @click="toggleUstFolyoCesidiSelection('Alü-PET', $event)">
                    <input type="checkbox" value="Alü-PET" :checked="project.ustFolyoSection.selectedUstFolyoCesidi.includes('Alü-PET')" class="mr-2" @click.stop>
                    <span class="text-xs">Alü-PET</span>
                  </div>
                  <div class="multiselect-option flex items-center p-1 cursor-pointer" @click="toggleUstFolyoCesidiSelection('Mono-Alü', $event)">
                    <input type="checkbox" value="Mono-Alü" :checked="project.ustFolyoSection.selectedUstFolyoCesidi.includes('Mono-Alü')" class="mr-2" @click.stop>
                    <span class="text-xs">Mono-Alü</span>
                  </div>
                  <div class="multiselect-option flex items-center p-1 cursor-pointer" @click="toggleUstFolyoCesidiSelection('Mix-PAP', $event)">
                    <input type="checkbox" value="Mix-PAP" :checked="project.ustFolyoSection.selectedUstFolyoCesidi.includes('Mix-PAP')" class="mr-2" @click.stop>
                    <span class="text-xs">Mix-PAP (Yoğurt)</span>
                  </div>

                  <!-- Custom options -->
                  <div v-for="option in customUstFolyoOptions" :key="option.value" class="multiselect-option flex items-center p-1 cursor-pointer" @click="toggleUstFolyoCesidiSelection(option.value, $event)">
                    <input type="checkbox" :value="option.value" :checked="project.ustFolyoSection.selectedUstFolyoCesidi.includes(option.value)" class="mr-2" @click.stop>
                    <span class="text-xs">{{ option.label }}</span>
                  </div>

                  <div class="multiselect-option">
                    <button type="button" @click="addCustomUstFolyoCesidi" class="text-blue-500 hover:text-blue-700 text-xs">+ Diğer Ekle</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Üst Folyo Kalınlığı "μ" -->
          <div class="w-[150px] mr-[6px]">
            <label for="ustFolyoKalinlik" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Üst Folyo Kalınlığı "μ"</label>
            <input type="text" id="ustFolyoKalinlik" v-model="project.ustFolyoSection.ustFolyoKalinlik" :disabled="!project.ustFolyoSection.ustFolyo" :class="{'opacity-50 cursor-not-allowed': !project.ustFolyoSection.ustFolyo}" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
          </div>

          <!-- Üst Folyo Eni "mm." -->
          <div class="w-[150px] mr-[6px]">
            <label for="ustFolyoEni" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Üst Folyo Eni "mm."</label>
            <input type="text" id="ustFolyoEni" v-model="project.ustFolyoSection.ustFolyoEni" :disabled="!project.ustFolyoSection.ustFolyo" :class="{'opacity-50 cursor-not-allowed': !project.ustFolyoSection.ustFolyo}" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
          </div>

          <!-- Folyo Tedarik for Üst Folyo -->
          <div class="w-[150px] mr-[6px]">
            <label for="ustFolyoTedarik" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Üst Folyo Tedarik</label>
            <select id="ustFolyoTedarik" v-model="project.ustFolyoSection.ustFolyoTedarik" :disabled="!project.ustFolyoSection.ustFolyo" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="" selected>Seçiniz!</option>
              <option value="Betapak">Betapak</option>
              <option value="Müşteri">Müşteri</option>
            </select>
          </div>

          <!-- UV -->
          <div class="w-[75px] mr-[6px]">
            <div class="flex flex-col items-center">
              <label for="ustFolyoUV" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">UV</label>
              <label class="toggle-switch" style="width: 40px; height: 20px;">
                <input type="checkbox" v-model="project.ustFolyoSection.ustFolyoUV">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
              <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
            </div>
          </div>

          <!-- Web Cleaning & Antistatik combined -->
          <div class="w-[75px] mr-[6px]">
            <div class="flex flex-col items-center">
              <label for="ustFolyoWebCleaningAntistatik" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Web Cleaning<br>& Antistatik</label>
              <label class="toggle-switch" style="width: 40px; height: 20px;">
                <input type="checkbox" v-model="project.ustFolyoSection.ustFolyoAntistatik">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
              <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Üst Folyo Notlar -->
      <div class="ml-4 w-[618px]">
        <label for="ustFolyoNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Üst Folyo Notlar</label>
        <textarea id="ustFolyoNotlar" v-model="project.ustFolyoSection.ustFolyoNotlar" class="w-full h-20 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Varsa, Belirtiniz!" style="height: 70px;"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopFoilSection',
  props: {
    project: { type: Object, required: true }
  },
  data() {
    return {
      ustFolyoCesidiDropdownOpen: false,
      customUstFolyoOptions: []
    }
  },
  computed: {
    isTopFoilDisabled() {
      const t = this.project.makineSection.kesmeTipi
      return t === 'Termoform' || t === 'Zincirli'
    }
  },
  watch: {
    'project.ustFolyoSection.ustFolyo'(newVal) {
      if (!newVal) {
        this.ustFolyoCesidiDropdownOpen = false
        this.project.ustFolyoSection.selectedUstFolyoCesidi = []
        this.project.ustFolyoSection.ustFolyoKalinlik = ''
        this.project.ustFolyoSection.ustFolyoEni = ''
      }
    }
  },
  methods: {
    toggleUstFolyoCesidiDropdown() {
      this.ustFolyoCesidiDropdownOpen = !this.ustFolyoCesidiDropdownOpen
    },
    toggleUstFolyoCesidiSelection(value, event) {
      event && event.stopPropagation()
      const arr = this.project.ustFolyoSection.selectedUstFolyoCesidi || (this.project.ustFolyoSection.selectedUstFolyoCesidi = [])
      const idx = arr.indexOf(value)
      if (idx === -1) arr.push(value); else arr.splice(idx, 1)
      this.ustFolyoCesidiDropdownOpen = false
    },
    addCustomUstFolyoCesidi() {
      const val = window.prompt('Yeni Üst Folyo çeşidi:')
      if (val && !this.customUstFolyoOptions.find(o => o.value === val)) {
        this.customUstFolyoOptions.push({ value: val, label: val })
        const arr = this.project.ustFolyoSection.selectedUstFolyoCesidi || (this.project.ustFolyoSection.selectedUstFolyoCesidi = [])
        arr.push(val)
        this.ustFolyoCesidiDropdownOpen = false
      }
    }
  }
}
</script>


