<template>
  <!-- Paketleme Tercihleri! Section -->
  <div class="w-full md:w-[49.7%] mb-3 mt-2 bg-gray-100 dark:bg-slate-700 p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Paketleme Tercihleri!</h2>
    <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">Bölüm-9</p>

    <!-- Paketleme row - All on a single row -->
    <div class="flex items-end mb-3">
      <!-- Yükleme Şekli -->
      <div class="w-[150px] mr-[6px]">
        <label for="yuklemeSekli" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Yükleme Şekli</label>
        <select id="yuklemeSekli" v-model="project.paketlemeSection.yuklemeSekli" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Kara">Kara</option>
          <option value="Deniz">Deniz</option>
          <option value="Hava">Hava</option>
        </select>
      </div>

      <!-- Switch butonlar -->
      <div class="flex mr-[6px] items-end">
        <!-- Palet -->
        <div class="flex flex-col items-center w-[75px]">
          <label for="palet" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Palet</label>
          <div>
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" v-model="project.paketlemeSection.palet">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
          </div>
        </div>

        <!-- Standart -->
        <div class="flex flex-col items-center w-[75px]">
          <label for="standart" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Standart</label>
          <div>
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" v-model="project.paketlemeSection.standart">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
          </div>
        </div>

        <!-- Sandık -->
        <div class="flex flex-col items-center w-[75px]">
          <label for="sandik" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Sandık</label>
          <div>
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" v-model="project.paketlemeSection.sandik">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
          </div>
        </div>

        <!-- Nem Önleyici -->
        <div class="flex flex-col items-center w-[75px]">
          <label for="nemOnleyici" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Nem<br>Önleyici</label>
          <div>
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" v-model="project.paketlemeSection.nemOnleyici">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
          </div>
        </div>
      </div>

      <!-- Teslimat Şekli -->
      <div class="w-[150px] mr-[6px]">
        <label for="teslimatSekli" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Teslimat Şekli</label>
        <select id="teslimatSekli" v-model="project.paketlemeSection.teslimatSekli" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="BetapakFabrikaTeslim">Betapak Fabrika Teslim</option>
          <option value="MusteriFabrikaTeslimSigortali">Müşteri Fabrika Teslim (Sigortalı)</option>
          <option value="MusteriFabrikaTeslimSigortasiz">Müşteri Fabrika Teslim (Sigortasız)</option>
          <option value="LimanTeslim">Liman Teslim</option>
          <option value="LimanaKadarIcnNakliye">Liman'a Kadar İç Nakliye</option>
        </select>
      </div>
    </div>

    <!-- Paketleme Notları -->
    <div class="flex items-end mt-3">
      <div class="w-[774px]">
        <label for="paketlemeNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Paketleme Notları</label>
        <input type="text" id="paketlemeNotlar" v-model="project.paketlemeSection.paketlemeNotlari" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Varsa, Belirtiniz!">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PackagingSection',
  props: { project: { type: Object, required: true } }
}
</script>


