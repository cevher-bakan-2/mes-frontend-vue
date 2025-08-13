<template>
  <div class="mb-3 mt-2 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Proje Oluşturma!</h2>
    <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">Bölüm-1</p>

    <div class="flex items-end mb-3">
      <div class="w-[150px] mr-[6px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sipariş Tarihi</label>
        <input type="date" v-model="project.projeSection.siparisTarihi" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
      </div>

      <div class="w-[150px] mr-[6px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Proje Oluşturma Tarihi</label>
        <div class="relative h-8">
          <input ref="pdfInput" type="file" accept=".pdf" class="hidden" @change="onPdfUpload" />
          <div @click="$refs.pdfInput.click()" class="cursor-pointer flex items-center justify-between w-full h-full px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
            <i class="fas fa-file-pdf text-red-500 text-lg mr-2"></i>
            <span>{{ formatDateOnly(currentDate) }}</span>
          </div>
        </div>
        <div v-if="pdfFileName" class="w-full flex justify-end items-center mt-1">
          <span class="flex items-center bg-white dark:bg-slate-800 rounded px-2 py-0.5 shadow text-green-600 text-xs"><i class="fas fa-check-circle mr-1"></i> Seçildi</span>
        </div>
      </div>

      <div class="w-[150px] mr-[6px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sevk Tarihi</label>
        <input type="date" v-model="project.projeSection.sevkTarihi" @change="$emit('update-penalty')" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
      </div>

      <div class="w-[150px] mr-[6px]">
        <label class="block text-xs font-medium text-red-600 dark:text-red-400 mb-1">Cezai Şart Tarihi</label>
        <div class="flex items-center">
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.projeSection.cezaiSart" @change="$emit('update-penalty')" />
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <div class="ml-2 text-center">
            <span v-if="project.projeSection.cezaiSart" class="text-red-500 font-semibold text-xs">{{ formatDate(project.projeSection.cezaiSartDate) }}</span>
            <span v-else class="text-xs text-gray-400">Belirtilmemiş</span>
          </div>
        </div>
      </div>

      <div class="w-[150px] mr-[6px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Revize Sevk Tarihi</label>
        <input type="date" v-model="project.projeSection.revizeSevkTarihi" @change="$emit('update-penalty')" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
      </div>

      <div class="w-[150px] mr-[6px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Seri No.</label>
        <input type="text" v-model="project.projeSection.seriNo" placeholder="Belirtiniz!" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
      </div>

      <div class="w-[150px] mr-[6px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Firma-1</label>
        <input type="text" v-model="project.projeSection.firmaAdi" placeholder="Belirtiniz!" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
      </div>

      <div class="w-[462px] mr-[6px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Firma-2</label>
        <input type="text" v-model="project.projeSection.firma2" placeholder="Belirtiniz!" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
      </div>
    </div>

    <div class="flex items-end mb-3">
      <div class="w-[150px] mr-[6px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ülke</label>
        <select v-model="project.projeSection.ulke" @change="$emit('country-change')" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
          <option value="" selected>Seçiniz!</option>
          <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="w-[150px] mr-[6px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Eyalet/Şehir</label>
        <select v-model="project.projeSection.sehir" :disabled="!project.projeSection.ulke || loadingStates" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
          <option value="" selected>{{ loadingStates ? 'Yükleniyor...' : 'Seçiniz!' }}</option>
          <option v-for="s in states" :key="s.id" :value="s.name">{{ s.name }}</option>
        </select>
      </div>

      <div class="w-[1242px]">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Proje Notlar</label>
        <input type="text" v-model="project.projeSection.projeNotu" placeholder="Varsa, Belirtiniz!" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectSection',
  props: {
    project: { type: Object, required: true },
    countries: { type: Array, default: () => [] },
    states: { type: Array, default: () => [] },
    loadingStates: { type: Boolean, default: false },
    pdfFileName: { type: String, default: '' },
    currentDate: { type: [String, Date], default: () => new Date() }
  },
  emits: ['pdf-upload','country-change','update-penalty'],
  methods: {
    onPdfUpload(e) { this.$emit('pdf-upload', e) },
    formatDateOnly(date) {
      const d = date instanceof Date ? date : new Date(date)
      const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const day = String(d.getDate()).padStart(2,'0')
      return `${y}-${m}-${day}`
    },
    formatDate(s) {
      if(!s) return ''
      const [y,m,d] = s.split('-')
      return `${d}/${m}/${y}`
    }
  }
}
</script>


