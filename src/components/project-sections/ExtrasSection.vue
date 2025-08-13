<template>
  <!-- Ekstralar! Section -->
  <div class="w-full md:w-[49.7%] mb-3 mt-2 bg-gray-100 dark:bg-slate-700 p-4 rounded-lg relative">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Ekstralar!</h2>

    <!-- PDF Yükleme - Sağ üst köşe -->
    <div class="absolute top-4 right-4">
      <div class="cursor-pointer" @click="$refs.extraFileInput.click()">
        <input type="file" id="extraUpload" class="hidden" ref="extraFileInput" @change="handleExtraUpload">
        <div class="flex items-center text-red-500">
          <i class="fas fa-file-pdf text-2xl"></i>
          <span class="text-xs ml-1">Varsa, Yükleyiniz!</span>
        </div>
        <div v-if="extraFileName" class="flex items-center mt-1 text-green-600 text-xs">
          <i class="fas fa-check-circle mr-1"></i>
          Dosya seçildi: {{ extraFileName }}
        </div>
      </div>
    </div>

    <!-- Diğer Notlar -->
    <div class="flex items-end mb-3">
      <div class="w-[774px]">
        <label for="digerNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Diğer Notlar</label>
        <textarea id="digerNotlar" v-model="project.ekstraSection.digerNotlar" class="w-full h-24 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Varsa, Belirtiniz!"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExtrasSection',
  props: { project: { type: Object, required: true } },
  data() {
    return { extraFileName: '' }
  },
  methods: {
    handleExtraUpload(event) {
      const file = event.target.files && event.target.files[0]
      this.project.ekstraSection.extraPdfFile = file || null
      this.extraFileName = file ? file.name : ''
    }
  }
}
</script>


