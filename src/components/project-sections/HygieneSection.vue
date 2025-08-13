<template>
  <!-- Hijyen Grubu! Section -->
  <div class="w-[49.7%] mb-3 mt-2 bg-gray-100 dark:bg-slate-700 p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Hijyen Grubu!</h2>

    <!-- Hijyen row - All on a single row -->
    <div class="flex items-end mb-3">
      <!-- Steril Hava Filtresi -->
      <div class="w-[150px] mr-[6px]">
        <label for="sterilHavaFiltresi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Steril Hava Filtresi</label>
        <select id="sterilHavaFiltresi" v-model="project.hijyenSection.sterilHavaFiltresi" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Üçlü Hava Filtresi">Üçlü Hava Filtresi</option>
          <option value="Dörtlü Hava Filtresi">Dörtlü Hava Filtresi</option>
        </select>
      </div>

      <!-- Switch butonları yan yana -->
      <div class="flex mr-[6px] items-end">
        <!-- Hepa -->
        <div class="flex flex-col items-center w-[75px]">
          <label for="hepa" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Hepa</label>
          <div>
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" v-model="project.hijyenSection.hepa">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
          </div>
        </div>

        <!-- Ultra Clean -->
        <div class="flex flex-col items-center w-[75px]">
          <label for="ultraClean" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Ultra Clean</label>
          <div>
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" v-model="project.hijyenSection.ultraClean">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
          </div>
        </div>

        <!-- FULL CIP -->
        <div class="flex flex-col items-center w-[75px]">
          <label for="cipFull" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">FULL CIP</label>
          <div>
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" v-model="project.hijyenSection.cipFull">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
          </div>
        </div>

        <!-- CIP IN&OUT -->
        <div class="flex flex-col items-center w-[75px]">
          <label for="cipInOut" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">CIP IN&OUT</label>
          <div>
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" v-model="project.hijyenSection.cipInOut">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
          </div>
        </div>

        <!-- SIP -->
        <div class="flex flex-col items-center w-[75px]">
          <label for="sip" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">SIP</label>
          <div>
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" v-model="project.hijyenSection.sip">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1 block">Yok/Var</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Hijyen Notlar -->
    <div class="flex items-end mt-3">
      <div class="w-[774px]">
        <label for="hijyenNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Hijyen Notlar</label>
        <input type="text" id="hijyenNotlar" v-model="project.hijyenSection.hijyenNotlari" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Varsa, Belirtiniz!">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HygieneSection',
  props: {
    project: { type: Object, required: true }
  },
  watch: {
    'project.hijyenSection.ultraClean'(val) {
      if (val) {
        // Legacy behavior: Ultra Clean açılırsa hepa ve full CIP de açık olsun
        this.project.hijyenSection.hepa = true
        this.project.hijyenSection.cipFull = true
      }
    }
  }
}
</script>


