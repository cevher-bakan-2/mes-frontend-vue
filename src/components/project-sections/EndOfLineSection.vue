<template>
  <!-- Hat Sonu Grubu! Section -->
  <div class="w-[49.7%] mb-3 mt-2 bg-gray-100 dark:bg-slate-700 p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Hat Sonu Grubu!</h2>

    <!-- Hat Sonu row - All on a single row -->
    <div class="flex items-end mb-3">
      <!-- Robot -->
      <div class="flex flex-col w-[50px]">
        <label for="robot" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Robot</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.hatSonuSection.robot">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Robot Tipi -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.hatSonuSection.robot}">
        <label for="robotTipi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Robot Tipi</label>
        <select id="robotTipi" v-model="project.hatSonuSection.robotTipi" :disabled="!project.hatSonuSection.robot" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Tek Kafa">Tek Kafa</option>
          <option value="Çift Kafa">Çift Kafa</option>
          <option value="Üç Kafa">Üç Kafa</option>
        </select>
      </div>

      <!-- Robot Modeli -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': !project.hatSonuSection.robot}">
        <label for="robotModeli" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Robot Modeli</label>
        <select id="robotModeli" v-model="project.hatSonuSection.robotModeli" :disabled="!project.hatSonuSection.robot" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Betapak">Betapak</option>
          <option value="Festo">Festo</option>
          <option value="Özel">Özel</option>
        </select>
      </div>

      <!-- Koli Açma -->
      <div class="flex flex-col items-center w-[75px]" :class="{'opacity-50': !project.hatSonuSection.robot}">
        <label for="koliAcma" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Koli Açma</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.hatSonuSection.koliAcma" :disabled="!project.hatSonuSection.robot">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Koli Kapatma -->
      <div class="flex flex-col items-center w-[75px]" :class="{'opacity-50': !project.hatSonuSection.robot}">
        <label for="koliKapatma" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Koli Kapatma</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.hatSonuSection.koliKapatma" :disabled="!project.hatSonuSection.robot">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>

      <!-- Kutu Makinesi -->
      <div class="flex flex-col items-center w-[75px]" :class="{'opacity-50': !project.hatSonuSection.robot}">
        <label for="boxMachine" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Kutu Makinesi</label>
        <div>
          <label class="toggle-switch" style="width: 40px; height: 20px;">
            <input type="checkbox" v-model="project.hatSonuSection.boxMachine" :disabled="!project.hatSonuSection.robot">
            <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
          </label>
          <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
        </div>
      </div>
    </div>

    <!-- Hat Sonu Notlar -->
    <div class="flex items-end mt-3">
      <div class="w-[774px]">
        <label for="hatSonuNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Hat Sonu Notlar</label>
        <input type="text" id="hatSonuNotlar" v-model="project.hatSonuSection.hatSonuNotlari" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Varsa, Belirtiniz!">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EndOfLineSection',
  props: {
    project: { type: Object, required: true }
  }
}
</script>


