<template>
  <!-- Dolum Grubu! Section -->
  <div class="mb-3 mt-2 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Dolum Grubu!</h2>
    <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">Bölüm-3</p>

    <!-- Dolum row 1 - Ünite Sayısı ve Ana Switch -->
    <div class="flex items-end mb-3">
      <!-- Dolum -->
      <div class="w-[50px] mr-[6px]">
        <div class="flex flex-col items-center">
          <label for="dolum" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Dolum</label>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.dolumSection.dolum">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
        </div>
      </div>

      <!-- Ünite Sayısı -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="uniteSayisi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ünite Sayısı</label>
        <select id="uniteSayisi" v-model="project.dolumSection.uniteSayisi" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
    </div>

    <div class="flex items-end mb-3">
      <!-- Ürün Tipi Switch -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <div class="flex flex-col items-center">
          <label for="urunTipiSwitch" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Ürün Tipi</label>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.dolumSection.urunTipiTanecikli" :disabled="!project.dolumSection.dolum" @change="handleUrunTipiSwitch">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1">{{ project.dolumSection.urunTipiTanecikli ? 'Tanecikli' : 'Taneciksiz' }}</span>
        </div>
      </div>

      <!-- Partekül Ölçüsü -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="partekulOlcusu" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Partekül Ölçüsü</label>
        <input type="text" id="partekulOlcusu" v-model="project.dolumSection.partikulOlcusu" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Ürün Sıcaklığı -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="urunSicakligi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Sıcaklığı "°C"</label>
        <input type="text" id="urunSicakligi" v-model="project.dolumSection.urunSicakligi" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Ürün Miktarı -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="urunMiktari" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Miktarı "gr./ml."</label>
        <input type="text" id="urunMiktari" v-model="project.dolumSection.urunMiktari" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Ürün Yapısı -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="urunYapisi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Yapısı</label>
        <select id="urunYapisi" v-model="project.dolumSection.urunYapisi" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Sıvı">Sıvı</option>
          <option value="Yarı Vizkoz">Yarı Vizkoz</option>
          <option value="Vizkoz">Vizkoz</option>
        </select>
      </div>

      <!-- Ürün Spektleri -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="urunSpektleri" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Spektleri</label>
        <input type="text" id="urunSpektleri" v-model="project.dolumSection.urunSpektleri" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Dolum Tipi -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="dolumTipi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dolum Tipi</label>
        <select id="dolumTipi" v-model="project.dolumSection.dolumTipi" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Serbest Akış">Serbest Akış</option>
          <option value="Dozajlama">Dozajlama</option>
        </select>
      </div>

      <!-- Dolum Hareketi -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="dolumHareketi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dolum Hareketi</label>
        <select id="dolumHareketi" v-model="project.dolumSection.dolumHareketi" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Servo">Servo</option>
          <option value="Pnömatik">Pnömatik</option>
        </select>
      </div>

      <!-- Manuel Dolum Alanı Textbox -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum || project.makineSection.kesmeTipi === 'Termoform'}">
        <label for="manuelDolumAlani" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Manuel Dolum Alanı</label>
        <input type="text" id="manuelDolumAlani" v-model="project.makineSection.manuelDolumAlani" :disabled="!project.dolumSection.dolum || project.makineSection.kesmeTipi === 'Termoform'" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Dolum Konumu -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="dolumKonumu" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dolum Konumu</label>
        <select id="dolumKonumu" v-model="project.dolumSection.dolumKonumu" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option v-for="option in dolumKonumuOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <!-- Dolum Ünitesi Yeri -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="dolumUnitesiYeri" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dolum Ünitesi Yeri</label>
        <select id="dolumUnitesiYeri" v-model="project.dolumSection.dolumUnitesiYeri" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Makine Üzeri Sabit">Makine Üzeri Sabit</option>
          <option value="Platform">Platform</option>
        </select>
      </div>

      <!-- Servis Arabası -->
      <div class="w-[50px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <div class="flex flex-col items-center">
          <label for="servisArabasi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Servis<br>Arabası</label>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.dolumSection.servisArabasi" :disabled="!project.dolumSection.dolum">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
        </div>
      </div>
    </div>

    <!-- Dynamic rows based on ünite sayısı -->
    <div v-if="parseInt(project.dolumSection.uniteSayisi) > 1" v-for="(_, index) in parseInt(project.dolumSection.uniteSayisi) - 1" :key="'dolum_row_'+index" class="flex items-end mb-3 pt-3 border-t border-gray-200 dark:border-gray-600">
      <!-- Ürün Tipi Switch Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <div class="flex flex-col items-center">
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" :id="'urunTipiTanecikli_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['urunTipiTanecikli_' + index]" :disabled="!project.dolumSection.dolum" @change="handleUrunTipiSwitchDynamic(index)">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1">{{ project.dolumSection.dinamikAlanlar['urunTipiTanecikli_' + index] ? 'Tanecikli' : 'Taneciksiz' }}</span>
        </div>
      </div>

      <!-- Partekül Ölçüsü Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <input type="text" :id="'partekulOlcusu_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['partikulOlcusu_' + index]" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Ürün Sıcaklığı Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <input type="text" :id="'urunSicakligi_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['urunSicakligi_' + index]" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Ürün Miktarı Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <input type="text" :id="'urunMiktari_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['urunMiktari_' + index]" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Ürün Yapısı Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <select :id="'urunYapisi_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['urunYapisi_' + index]" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Sıvı">Sıvı</option>
          <option value="Yarı Vizkoz">Yarı Vizkoz</option>
          <option value="Vizkoz">Vizkoz</option>
        </select>
      </div>

      <!-- Ürün Spektleri Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <input type="text" :id="'urunSpektleri_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['urunSpektleri_' + index]" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Dolum Tipi Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <select :id="'dolumTipi_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['dolumTipi_' + index]" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Serbest Akış">Serbest Akış</option>
          <option value="Dozajlama">Dozajlama</option>
        </select>
      </div>

      <!-- Dolum Hareketi Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <select :id="'dolumHareketi_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['dolumHareketi_' + index]" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Servo">Servo</option>
          <option value="Pnömatik">Pnömatik</option>
        </select>
      </div>

      <!-- Manuel Dolum Alanı Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum || project.makineSection.kesmeTipi === 'Termoform'}">
        <input type="text" :id="'manuelDolumAlani_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['manuelDolumAlani_' + index]" :disabled="!project.dolumSection.dolum || project.makineSection.kesmeTipi === 'Termoform'" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Dolum Konumu Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <select :id="'dolumKonumu_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['dolumKonumu_' + index]" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option v-for="option in dolumKonumuOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <!-- Dolum Ünitesi Yeri Dynamic -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <select :id="'dolumUnitesiYeri_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['dolumUnitesiYeri_' + index]" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Makine Üzeri Sabit">Makine Üzeri Sabit</option>
          <option value="Platform">Platform</option>
        </select>
      </div>

      <!-- Servis Arabası Dynamic -->
      <div class="w-[50px]" :class="{'opacity-50': !project.dolumSection.dolum}">
        <div class="flex flex-col items-center">
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" :id="'servisArabasi_' + (index + 1)" v-model="project.dolumSection.dinamikAlanlar['servisArabasi_' + index]" :disabled="!project.dolumSection.dolum">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Dolum Notlar -->
    <div class="flex items-end">
      <div class="w-full" :class="{'opacity-50': !project.dolumSection.dolum}">
        <label for="dolumNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Dolum Notlar</label>
        <input type="text" id="dolumNotlar" v-model="project.dolumSection.dolumNotlari" :disabled="!project.dolumSection.dolum" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Varsa, Belirtiniz!">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FillingSection',
  props: {
    project: { type: Object, required: true }
  },
  data() {
    return {
      dolumKonumuOptions: [
        'Şekil Sonrası ve Yapıştırma Öncesi',
        'Ekstra Dolum Alanı'
      ]
    }
  },
  watch: {
    'project.dolumSection.uniteSayisi': {
      handler(newValue) {
        if (!newValue || isNaN(parseInt(newValue))) return
        const count = parseInt(newValue) - 1
        for (let i = 0; i < count; i++) {
          const dyn = this.project.dolumSection.dinamikAlanlar || (this.project.dolumSection.dinamikAlanlar = {})
          dyn['urunYapisi_' + i] = dyn['urunYapisi_' + i] || ''
          dyn['dolumTipi_' + i] = dyn['dolumTipi_' + i] || ''
          dyn['dolumHareketi_' + i] = dyn['dolumHareketi_' + i] || ''
          dyn['dolumKonumu_' + i] = dyn['dolumKonumu_' + i] || ''
          dyn['dolumUnitesiYeri_' + i] = dyn['dolumUnitesiYeri_' + i] || ''
        }
      }
    }
  },
  methods: {
    handleUrunTipiSwitch() {
      // Intentionally left as no-op to mirror legacy behavior
    },
    handleUrunTipiSwitchDynamic(index) {
      // Intentionally left as no-op to mirror legacy behavior
    }
  }
}
</script>


