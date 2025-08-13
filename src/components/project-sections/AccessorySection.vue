<template>
  <!-- Aksesuar Grubu! Section -->
  <div class="mb-3 mt-2 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Aksesuar Grubu!</h2>
    <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">Bölüm-8</p>

    <!-- Aksesuar row 1 - all fields on a single row -->
    <div class="flex items-end mb-3">
      <!-- Vakum Pompası Tipi -->
      <div class="w-[150px] mr-[6px]" ref="vakumDropdown">
        <label for="vakumPompasiTipi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Vakum Pompası Tipi</label>
        <select id="vakumPompasiTipi" v-model="project.aksesuarSection.vakumPompasiTipi" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="DVP">DVP</option>
          <option value="BUSCH">BUSCH</option>
        </select>
      </div>

      <!-- Vakum Pompası Modeli -->
      <div class="w-[150px] mr-[6px]">
        <label for="vakumPompasiModeli" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Vakum Pompası Modeli "m³/Sa."</label>
          <div class="multiselect-dropdown">
          <div class="multiselect-dropdown-toggle" @click.stop="toggleVakumModelleriDropdown" data-dropdown="vakumModelleri">
            <span class="multiselect-selected-text text-xs">{{ project.aksesuarSection.selectedVakumModelleri.length > 0 ? (project.aksesuarSection.selectedVakumModelleri.length + ' seçili') : 'Seçiniz!' }}</span>
            <i class="fas fa-chevron-down text-xs"></i>
          </div>

          <div v-if="vakumModelleriDropdownOpen" class="multiselect-dropdown-menu min-w-[11rem]">
            <div v-for="option in availableVakumPompasiModeli" :key="option.value" class="multiselect-option !flex flex-nowrap items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-600 p-1 overflow-hidden">
              <div class="flex items-center flex-1 min-w-0 cursor-pointer mr-2" @click.stop="toggleVakumModelSelection(option.value)">
                <input type="checkbox" :value="option.value" :checked="project.aksesuarSection.selectedVakumModelleri.includes(option.value)" class="mr-1 cursor-pointer shrink-0" @click.stop="toggleVakumModelSelection(option.value)">
                <span class="text-xs cursor-pointer truncate">{{ option.label }}</span>
              </div>
              <button type="button" @click.stop="toggleVakumPompasiX2(option.value); ensureVakumModelSelected(option.value)" class="ml-2 px-2 py-0.5 text-xs rounded flex-none self-center" :class="isVakumPompasiX2(option.value) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'">x2</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chiller -->
      <div class="w-[150px] mr-[6px]" ref="traversDropdown">
        <label for="chiller" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Chiller "kcal/h"</label>
        <select id="chiller" v-model="project.aksesuarSection.chiller" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="7000kcal/h">7000</option>
          <option value="9000kcal/h">9000</option>
          <option value="15.000kcal/h">15.000</option>
          <option value="20.000kcal/h">20.000</option>
          <option value="29.500kcal/h">29.500</option>
        </select>
      </div>

      <!-- Travers -->
      <div class="w-[150px] mr-[6px]">
        <label for="travers" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Travers</label>
        <div class="multiselect-dropdown">
          <div class="multiselect-dropdown-toggle" @click.stop="toggleTraversDropdown" data-dropdown="travers">
            <span class="multiselect-selected-text text-xs">{{ project.aksesuarSection.selectedTravers.length > 0 ? (project.aksesuarSection.selectedTravers.length + ' seçili') : 'Seçiniz!' }}</span>
            <i class="fas fa-chevron-down text-xs"></i>
          </div>
          <div v-if="traversDropdownOpen" class="multiselect-dropdown-menu">
            <div v-for="option in availableTravers" :key="option.value" class="multiselect-option">
              <div class="flex items-center" @click.stop="toggleTraversSelection(option.value)">
                <input type="checkbox" :value="option.value" :checked="project.aksesuarSection.selectedTravers.includes(option.value)" class="mr-1">
                <span class="text-xs">{{ option.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticker Ünitesi -->
      <div class="w-[150px] mr-[6px]" ref="stickerDropdown">
        <label for="stickerUnitesi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sticker Ünitesi</label>
        <div class="h-8 w-full">
          <div class="multiselect-dropdown relative">
            <div class="multiselect-dropdown-toggle flex items-center justify-between w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white cursor-pointer" @click.stop="toggleStickerUnitesiDropdown" data-dropdown="stickerUnitesi">
              <span class="multiselect-selected-text text-xs overflow-hidden">{{ project.aksesuarSection.selectedStickerUnitesi && project.aksesuarSection.selectedStickerUnitesi.length > 0 ? (project.aksesuarSection.selectedStickerUnitesi.length + ' seçili') : 'Seçiniz!' }}</span>
              <i class="fas fa-chevron-down text-xs ml-1"></i>
            </div>
            <div v-if="stickerUnitesiDropdownOpen" class="multiselect-dropdown-menu absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-lg z-10">
              <div class="multiselect-option flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600" @click="toggleStickerUnitesiSelection('ALT', $event)">
                <input type="checkbox" :checked="project.aksesuarSection.selectedStickerUnitesi && project.aksesuarSection.selectedStickerUnitesi.includes('ALT')" class="mr-2 h-4 w-4 cursor-pointer" @click.stop>
                <span class="text-xs font-medium">ALT</span>
              </div>
              <div class="multiselect-option flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600" @click="toggleStickerUnitesiSelection('ÜST', $event)">
                <input type="checkbox" :checked="project.aksesuarSection.selectedStickerUnitesi && project.aksesuarSection.selectedStickerUnitesi.includes('ÜST')" class="mr-2 h-4 w-4 cursor-pointer" @click.stop>
                <span class="text-xs font-medium">ÜST</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aksesuar Notlar -->
      <div class="w-[774px]">
        <label for="aksesuarNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Aksesuar Notlar</label>
        <input type="text" id="aksesuarNotlar" v-model="project.aksesuarSection.aksesuarNotlari" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Varsa, Belirtiniz!">
      </div>
    </div>

    <!-- Switches row -->
    <div class="flex items-end justify-start">
      <!-- Jumbo Bobin -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="jumboBobin" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">J.Bobin Arabası</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.aksesuarSection.jumboBobin">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Yerde Fire Sarma -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="yerdeFireSarma" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Yerde<br>Fire Sarma</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.aksesuarSection.yerdeFireSarma">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Folyo Arabası -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="folyoArabasi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Folyo<br>Arabası</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.aksesuarSection.folyoArabasi">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Ekstra Folyo Arabası -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="ekstraFolyoArabasi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Ekstra Folyo<br>Arabası</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.aksesuarSection.ekstraFolyoArabasi">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Kolay Kalıp Değiştirme Arabası -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="kalipDegistirmeArabasi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Kolay
            Kalıp<br>D. Arabası</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.aksesuarSection.kalipDegistirmeArabasi">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Kompresör -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="kompresor" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Kompresör</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.aksesuarSection.kompresor">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Pano Klİması -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="panoKlimasi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Pano<br>Kliması</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.aksesuarSection.panoKlimasi">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Kırmızı Pompa -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="kirmiziPompa" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Kırmızı<br>Pompa</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.aksesuarSection.kirmiziPompa">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Su Tutucu Filtre -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="suTutucuFiltre" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Su Tutucu<br>Filtre</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.aksesuarSection.suTutucuFiltre">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Yazıcı -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="yazici" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Yazıcı</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.hatSonuSection.yazici">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Etiket Ünitesi -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="etiketUnitesi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Etiket<br>Ünitesi</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.hatSonuSection.etiketUnitesi">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Terazi -->
      <div class="flex flex-col items-center justify-end w-[75px] mr-[6px] h-[80px]">
        <label for="terazi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Terazi</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.hatSonuSection.terazi">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Terazi Notlar -->
      <div class="w-[160px] ml-2" :class="{'opacity-50': !project.hatSonuSection.terazi}">
        <label for="teraziNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Terazi Notlar</label>
        <input type="text" id="teraziNotlar" v-model="project.hatSonuSection.teraziNotlar" :disabled="!project.hatSonuSection.terazi" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>
    </div>
  </div>
</template>

<script>
import { getVakumPompasiModelOptions, traversOptions } from '@/utils/dropdownData.js'

export default {
  name: 'AccessorySection',
  props: {
    project: { type: Object, required: true }
  },
  data() {
    return {
      vakumModelleriDropdownOpen: false,
      traversDropdownOpen: false,
      stickerUnitesiDropdownOpen: false
    }
  },
  mounted() {
    window.addEventListener('click', this.handleGlobalClick)
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleGlobalClick)
    window.removeEventListener('keydown', this.handleKeydown)
  },
  computed: {
    availableVakumPompasiModeli() {
      return getVakumPompasiModelOptions(this.project.aksesuarSection.vakumPompasiTipi) || []
    },
    availableTravers() {
      return traversOptions
    },
    disableFloorOptions() {
      const t = this.project.makineSection.kesmeTipi
      return t === 'Hazır Kap' || t === 'Zincirli'
    }
  },
  watch: {
    'project.aksesuarSection.vakumPompasiTipi'(newVal) {
      this.project.aksesuarSection.selectedVakumModelleri = []
      // Keep counts/x2 but reset if models are incompatible
      this.project.aksesuarSection.vakumPompasiSayisi = {}
      this.project.aksesuarSection.vakumPompasiX2 = {}
    }
  },
  methods: {
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.vakumModelleriDropdownOpen = false
        this.traversDropdownOpen = false
        this.stickerUnitesiDropdownOpen = false
      }
    },
    handleGlobalClick(e) {
      const target = e.target
      const vakumEl = this.$refs.vakumDropdown
      const traversEl = this.$refs.traversDropdown
      const stickerEl = this.$refs.stickerDropdown

      // İçerideki tıklamalar dropdown'ı açık tutsun, ama tıklama bubble'ı zaten stop ile kesiliyor.
      // Yine de güvenli tarafta kalalım:
      if ((vakumEl && vakumEl.contains(target)) ||
          (traversEl && traversEl.contains(target)) ||
          (stickerEl && stickerEl.contains(target))) {
        return
      }

      // Dışarı tıklama: kapat
      this.vakumModelleriDropdownOpen = false
      this.traversDropdownOpen = false
      this.stickerUnitesiDropdownOpen = false
    },
    toggleVakumModelleriDropdown() {
      this.vakumModelleriDropdownOpen = !this.vakumModelleriDropdownOpen
    },
    toggleVakumModelSelection(modelValue) {
      const selected = this.project.aksesuarSection.selectedVakumModelleri
      const idx = selected.indexOf(modelValue)
      if (idx === -1) {
        selected.push(modelValue)
        if (!this.project.aksesuarSection.vakumPompasiSayisi[modelValue]) {
          this.project.aksesuarSection.vakumPompasiSayisi[modelValue] = 1
        }
      } else {
        selected.splice(idx, 1)
        if (this.project.aksesuarSection.vakumPompasiX2[modelValue]) {
          delete this.project.aksesuarSection.vakumPompasiX2[modelValue]
        }
        if (this.project.aksesuarSection.vakumPompasiSayisi[modelValue]) {
          delete this.project.aksesuarSection.vakumPompasiSayisi[modelValue]
        }
      }
      // çoklu seçim: açık kalsın
    },
    toggleVakumPompasiX2(modelValue) {
      const current = !!this.project.aksesuarSection.vakumPompasiX2[modelValue]
      this.project.aksesuarSection.vakumPompasiX2[modelValue] = !current
    },
    isVakumPompasiX2(modelValue) {
      return !!this.project.aksesuarSection.vakumPompasiX2[modelValue]
    },
    ensureVakumModelSelected(modelValue) {
      const selected = this.project.aksesuarSection.selectedVakumModelleri
      if (!selected.includes(modelValue)) selected.push(modelValue)
      if (!this.project.aksesuarSection.vakumPompasiSayisi[modelValue]) {
        this.project.aksesuarSection.vakumPompasiSayisi[modelValue] = 1
      }
    },
    toggleTraversDropdown() {
      this.traversDropdownOpen = !this.traversDropdownOpen
    },
    toggleTraversSelection(value) {
      const arr = this.project.aksesuarSection.selectedTravers
      const idx = arr.indexOf(value)
      if (idx === -1) arr.push(value); else arr.splice(idx, 1)
      // çoklu seçim: açık kalsın
    },
    toggleStickerUnitesiDropdown() {
      this.stickerUnitesiDropdownOpen = !this.stickerUnitesiDropdownOpen
    },
    toggleStickerUnitesiSelection(item, event) {
      event && event.stopPropagation()
      const arr = this.project.aksesuarSection.selectedStickerUnitesi || (this.project.aksesuarSection.selectedStickerUnitesi = [])
      const idx = arr.indexOf(item)
      if (idx === -1) arr.push(item); else arr.splice(idx, 1)
    }
  }
}
</script>



