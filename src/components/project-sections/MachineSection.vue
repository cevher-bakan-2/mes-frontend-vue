<template>
  <!-- Makine Oluşturma Section -->
  <div class="mb-3 mt-2 bg-gray-100 dark:bg-slate-700 p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-1 text-gray-800 dark:text-white">Makine Oluşturma!</h2>

    <div class="flex items-end mb-3">
      <!-- Kalıp Sayısı (Moved to the beginning) -->
      <div class="w-[150px] mr-[6px]">
        <label for="kalipSayisi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kalıp Sayısı</label>
        <div class="h-8 w-full">
          <select id="kalipSayisi" v-model="project.makineSection.gozSayisi" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="" selected>Seçiniz!</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>

      <!-- Makine Tipi -->
      <div class="w-[150px] mr-[6px]">
        <label for="makineType" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Makine Tipi</label>
        <select id="makineType" v-model="project.makineSection.kesmeTipi" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Termoform">Termoform</option>
          <option value="Zincirli">Zincirli</option>
          <option value="Hazır Kap">Hazır Kap</option>
        </select>
      </div>

      <!-- Kesme Tipi -->
      <div class="w-[150px] mr-[6px]">
        <label for="kesmeTipi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kesme Tipi</label>
        <div class="h-8 w-full">
          <!-- Çoklu seçim dropdown -->
          <div class="multiselect-dropdown">
            <div class="multiselect-dropdown-toggle" data-dropdown="kesmeTipi" @click="toggleKesmeTipiDropdown">
              <span class="multiselect-selected-text text-xs">
                {{ project.makineSection.kesmeTipiItems && project.makineSection.kesmeTipiItems.length > 0 ? formatKesmeTipiDisplay() : 'Seçiniz!' }}
              </span>
              <i class="fas fa-chevron-down text-xs"></i>
            </div>

            <div v-if="kesmeTipiDropdownOpen" class="multiselect-dropdown-menu">
              <div v-for="option in availableKesmeTipi" :key="option.value" class="multiselect-option flex items-center p-1 cursor-pointer" @click="option.value === 'Diger' ? addCustomKesmeTipi() : showKesmeTipiCountModalForItem(option)">
                <label class="text-xs flex items-center w-full">
                  <input type="checkbox" :value="option.value" :checked="hasKesmeTipiItem(option.value)" :disabled="project.makineSection.kesmeTipi === 'Zincirli' && option.value === 'Enine Boyuna Kesme' && !project.makineSection.selectedKesmeTipi.includes('Enine Boyuna Kesme')" class="mr-2" @click.stop>
                  <span>{{ option.label }}</span>
                  <span v-if="getKesmeTipiCount(option.value)" class="ml-1 text-blue-600 font-medium">({{ getKesmeTipiCount(option.value) }})</span>
                </label>
              </div>
              
              <!-- Show selected items with remove option -->
              <div v-if="project.makineSection.kesmeTipiItems && project.makineSection.kesmeTipiItems.length > 0" class="border-t border-gray-200 pt-2 mt-2">
                <div class="text-xs text-gray-500 px-2 mb-1">Seçili Öğeler:</div>
                <div v-for="item in project.makineSection.kesmeTipiItems" :key="item.value" class="multiselect-option flex items-center justify-between p-1">
                  <span class="text-xs">{{ item.label }} ({{ item.count }})</span>
                  <button @click="removeKesmeTipiItem(item.value)" class="text-red-500 hover:text-red-700 text-xs">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Kesme Notlar -->
      <div class="w-[462px] mr-[6px]" :class="{'opacity-70': !project.makineSection.kesmeTipi}">
        <label for="kesmeNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kesme Notlar</label>
        <input type="text" id="kesmeNotlar" v-model="project.makineSection.kesmeNotlari" :disabled="!project.makineSection.kesmeTipi" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Varsa, Belirtiniz!">
      </div>

      <!-- Isı Plakası -->
      <div class="w-[150px] mr-[6px]" :class="{'toggle-container-disabled': project.makineSection.kesmeTipi !== 'Zincirli' && project.makineSection.kesmeTipi !== 'Hazır Kap'}">
        <label for="isiPlakasi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Isı Plakası</label>
        <div class="h-8 w-full">
          <select id="isiPlakasi" v-model="project.makineSection.isiPlakasi" :disabled="project.makineSection.kesmeTipi !== 'Zincirli' && project.makineSection.kesmeTipi !== 'Hazır Kap'" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="" selected>Seçiniz!</option>
            <option value="Hareketli">Hareketli</option>
            <option value="Hareketsiz">Hareketsiz</option>
          </select>
        </div>
      </div>

      <!-- Model -->
      <div class="w-[150px] mr-[6px]">
        <label for="model" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
        <div class="h-8 w-full">
          <select id="model" v-model="project.makineSection.model" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="" selected>Seçiniz!</option>
            <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
          </select>
        </div>
      </div>

      <!-- Alt Model -->
      <div class="w-[150px] mr-[6px]">
        <label for="altModel" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Model</label>
        <div class="h-8 w-full">
          <select id="altModel" v-model="project.makineSection.altModel" @change="checkForCustomOption('altModel')" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="" selected>Seçiniz!</option>
            <option v-for="model in availableAltModels" :key="model" :value="model">{{ model }}</option>
            <option v-for="model in customAltModels" :key="model" :value="model">{{ model }}</option>
            <option value="other">Diğer</option>
          </select>
        </div>
      </div>

      <!-- Ürün Çeşidi (Multi-Select) -->
      <div class="w-[150px] mr-[6px]">
        <label for="product" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Çeşidi</label>
        <!-- Çoklu seçim dropdown -->
        <div class="multiselect-dropdown">
          <div class="multiselect-dropdown-toggle" data-dropdown="products" @click="toggleProductsDropdown">
            <span class="multiselect-selected-text text-xs">
              {{ project.makineSection.selectedProducts.length > 0 ? (project.makineSection.selectedProducts.length + ' seçili') : 'Seçiniz!' }}
            </span>
            <i class="fas fa-chevron-down text-xs"></i>
          </div>

          <div v-if="productsDropdownOpen" class="multiselect-dropdown-menu">
            <div v-if="availableProducts.length === 0 && sortedCustomProducts.length === 0" class="multiselect-option text-center">
              <span class="text-xs text-gray-500">Ürün bulunamadı</span>
            </div>
            <div v-for="product in availableProducts" :key="product" class="multiselect-option flex items-center p-1 cursor-pointer" @click="toggleProductSelection(product, $event)">
              <input type="checkbox" :value="product" :checked="project.makineSection.selectedProducts && project.makineSection.selectedProducts.includes(product)" class="mr-2" @click.stop>
              <span class="text-xs">{{ product }}</span>
            </div>
            <div v-for="product in sortedCustomProducts" :key="product" class="multiselect-option flex items-center p-1 cursor-pointer" @click="toggleProductSelection(product, $event)">
              <input type="checkbox" :value="product" :checked="project.makineSection.selectedProducts && project.makineSection.selectedProducts.includes(product)" class="mr-2" @click.stop>
              <span class="text-xs">{{ product }}</span>
            </div>
            <div class="multiselect-option">
              <label class="text-xs">
                <button type="button" @click="addCustomProduct" class="text-blue-500 hover:text-blue-700">+ Diğer Ekle</button>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Second row -->
    <div class="flex items-end mb-3">
      <!-- Vakum & Gaz (Moved from first row) -->
      <div class="w-[150px] mr-[6px]">
        <!-- Labels for Vakum and Gaz -->
        <div class="flex justify-between items-start mb-1">
          <div class="w-1/2 text-center">
            <label for="vakum" class="block text-xs font-medium text-gray-700 dark:text-gray-300">Vakum</label>
          </div>
          <div class="w-1/2 text-center">
            <label for="gaz" class="block text-xs font-medium text-gray-700 dark:text-gray-300">Gaz</label>
          </div>
        </div>

        <!-- First row of toggle switches -->
        <div class="flex justify-between items-start h-8">
          <!-- Vakum -->
          <div class="w-1/2 flex flex-col items-center">
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" id="vakum_1" v-model="project.makineSection.vakum" :disabled="project.makineSection.kesmeTipi !== 'Zincirli' && project.makineSection.kesmeTipi !== 'Hazır Kap'">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
          </div>

          <!-- Gaz -->
          <div class="w-1/2 flex flex-col items-center">
            <label class="toggle-switch" style="width: 40px; height: 20px;">
              <input type="checkbox" id="gaz_1" v-model="project.makineSection.gaz" :disabled="project.makineSection.kesmeTipi !== 'Zincirli' && project.makineSection.kesmeTipi !== 'Hazır Kap'">
              <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
            </label>
            <span class="text-xs text-gray-500 mt-1">Yok/Var</span>
          </div>
        </div>
      </div>

      <!-- Kalıp Göz Sayısı -->
      <div class="w-[150px] mr-[6px]">
        <label for="kalipGozSayisi" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kalıp Göz Sayısı</label>
        <input type="text" id="kalipGozSayisi" v-model="project.makineSection.moldEyeCountInput" @input="formatMoldEyeCount" @keyup="formatMoldEyeCount" @blur="formatMoldEyeCount" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Örn: 2 3 → 2x3">
        <!-- Hidden input to store the product value -->
        <input type="hidden" id="moldEyeCountProduct" v-model="project.makineSection.moldEyeCountProduct">
      </div>

      <!-- Vuruş/dk. Min. -->
      <div class="w-[150px] mr-[6px]">
        <label for="vurusDkMin" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Min./Vuruş Dk.</label>
        <input type="number" id="vurusDkMin" v-model.number="project.makineSection.vurusDkMin" @change="calculateCapacity" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Vuruş/dk. Max. -->
      <div class="w-[150px] mr-[6px]">
        <label for="vurusDkMax" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Max./Vuruş Dk.</label>
        <input type="number" id="vurusDkMax" v-model.number="project.makineSection.vurusDkMax" @change="calculateCapacity" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Kapasite Min. "Adet/Sa." -->
      <div class="w-[150px] mr-[6px]">
        <label for="kapasiteMin" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kapasite Min. "Adet/Sa."</label>
        <input type="number" id="kapasiteMin" v-model.number="project.makineSection.kapasiteMin" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Otomatik hesaplanır" readonly>
      </div>

      <!-- Kapasite Max. "Adet/Sa." -->
      <div class="w-[150px] mr-[6px]">
        <label for="kapasiteMax" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kapasite Max. "Adet/Sa."</label>
        <input type="number" id="kapasiteMax" v-model.number="project.makineSection.kapasiteMax" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Otomatik hesaplanır" readonly>
      </div>

      <!-- İçten İçe -->
      <div class="w-[150px] mr-[6px]">
        <label for="ictenIce" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kap Ölçüsü İçten İçe mm.</label>
        <input type="text" id="ictenIce" v-model="project.makineSection.ictenIce" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Dıştan Dışa -->
      <div class="w-[150px] mr-[6px]">
        <label for="distanDisa" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kap Ölçüsü Dıştan Dışa mm.</label>
        <input type="text" id="distanDisa" v-model="project.makineSection.distanDisa" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Yükseklik "h." -->
      <div class="w-[150px] mr-[6px]">
        <label for="yukseklik" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kap Yükseklik mm.</label>
        <input type="text" id="yukseklik" v-model="project.makineSection.yukseklik" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
      </div>

      <!-- Hatve -->
      <div class="w-[150px] mr-[6px]">
        <label for="hatve" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Hatve</label>
        <input type="text" id="hatve" v-model="project.makineSection.hatve" 
               :disabled="project.makineSection.kesmeTipi === 'Termoform'"
               class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" 
               placeholder="Belirtiniz!">
      </div>
    </div>

    <!-- Dynamic rows based on kalıp sayısı - MOVED HERE to be immediately after mold fields -->
    <div v-if="parseInt(project.makineSection.gozSayisi) > 1">
      <div v-for="(_, index) in parseInt(project.makineSection.gozSayisi) - 1" :key="'row_'+index" class="flex items-end mb-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <!-- Vakum & Gaz for dynamic row -->
        <div class="w-[150px] mr-[6px]">
          <div class="flex justify-between items-start h-8">
            <!-- Vakum Dynamic -->
            <div class="w-1/2 flex flex-col items-center">
              <label class="toggle-switch" style="width: 40px; height: 20px;">
                <input type="checkbox" :id="'vakum_' + (index + 1)" v-model="project.makineSection.dinamikAlanlar['vakum_' + index]" :disabled="project.makineSection.kesmeTipi !== 'Zincirli' && project.makineSection.kesmeTipi !== 'Hazır Kap'">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
            </div>

            <!-- Gaz Dynamic -->
            <div class="w-1/2 flex flex-col items-center">
              <label class="toggle-switch" style="width: 40px; height: 20px;">
                <input type="checkbox" :id="'gaz_' + (index + 1)" v-model="project.makineSection.dinamikAlanlar['gaz_' + index]" :disabled="project.makineSection.kesmeTipi !== 'Zincirli' && project.makineSection.kesmeTipi !== 'Hazır Kap'">
                <span class="toggle-slider" style="width: 40px; height: 20px;"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Kalıp Göz Sayısı Dynamic -->
        <div class="w-[150px] mr-[6px]">
          <input type="text" :id="'kalipGozSayisi_' + (index + 1)" v-model="project.makineSection.dinamikAlanlar['kalipGozSayisi_' + index]" @input="formatDynamicMoldCount(index)" @keyup="formatDynamicMoldCount(index)" @blur="formatDynamicMoldCount(index)" @change="formatDynamicMoldCount(index)" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Örn: 2 3 → 2x3">
          <!-- Hidden input to store the product value for dynamic fields -->
          <input type="hidden" :id="'moldCountProduct_' + (index + 1)" v-model="project.makineSection.dinamikAlanlar['moldCountProduct_' + index]">
        </div>

        <!-- Vuruş/dk. Min. Dynamic -->
        <div class="w-[150px] mr-[6px]">
          <input type="number" :id="'vurusDkMin_' + (index + 1)" v-model.number="project.makineSection.dinamikAlanlar['vurusDkMin_' + index]" @change="calculateDynamicCapacity(index)" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
        </div>

        <!-- Vuruş/dk. Max. Dynamic -->
        <div class="w-[150px] mr-[6px]">
          <input type="number" :id="'vurusDkMax_' + (index + 1)" v-model.number="project.makineSection.dinamikAlanlar['vurusDkMax_' + index]" @change="calculateDynamicCapacity(index)" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
        </div>

        <!-- Kapasite Min. Dynamic -->
        <div class="w-[150px] mr-[6px]">
          <input type="number" :id="'kapasiteMin_' + (index + 1)" v-model.number="project.makineSection.dinamikAlanlar['kapasiteMin_' + index]" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Otomatik hesaplanır" readonly>
        </div>

        <!-- Kapasite Max. Dynamic -->
        <div class="w-[150px] mr-[6px]">
          <input type="number" :id="'kapasiteMax_' + (index + 1)" v-model.number="project.makineSection.dinamikAlanlar['kapasiteMax_' + index]" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Otomatik hesaplanır" readonly>
        </div>

        <!-- İçten İçe Dynamic -->
        <div class="w-[150px] mr-[6px]">
          <input type="text" :id="'ictenIce_' + (index + 1)" v-model="project.makineSection.dinamikAlanlar['ictenIce_' + index]" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
        </div>

        <!-- Dıştan Dışa Dynamic -->
        <div class="w-[150px] mr-[6px]">
          <input type="text" :id="'distanDisa_' + (index + 1)" v-model="project.makineSection.dinamikAlanlar['distanDisa_' + index]" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
        </div>

        <!-- Yükseklik Dynamic -->
        <div class="w-[150px] mr-[6px]">
          <input type="text" :id="'yukseklik_' + (index + 1)" v-model="project.makineSection.dinamikAlanlar['yukseklik_' + index]" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
        </div>

        <!-- Hatve Dynamic -->
        <div class="w-[150px] mr-[6px]">
          <input type="text" :id="'hatve_' + (index + 1)" v-model="project.makineSection.dinamikAlanlar['hatve_' + index]" class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Belirtiniz!">
        </div>
      </div>
    </div>

    <!-- Third row -->
    <div class="flex items-end mb-3">
      <!-- İtme Tipi -->
      <div class="w-[150px] mr-[6px]" :class="{'opacity-50': project.makineSection.kesmeTipi !== 'Hazır Kap'}">
        <label for="pushType" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">İtme Tipi</label>
        <select id="pushType" v-model="project.makineSection.pushType"
                :disabled="project.makineSection.kesmeTipi !== 'Hazır Kap'"
                class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Hareketli">Hareketli</option>
          <option value="Tel İle">Tel İle</option>
        </select>
      </div>
      
      <!-- Yağlama -->
      <div class="w-[150px] mr-[6px]">
        <label for="yaglama" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Yağlama</label>
        <select id="yaglama" v-model="project.makineSection.yaglama"
                class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="Otomatik">Otomatik</option>
          <option value="Manuel">Manuel</option>
        </select>
      </div>

      <!-- PLC -->
      <div class="w-[150px] mr-[6px]">
        <label for="plc" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">PLC</label>
        <input type="text" id="plc" v-model="project.makineSection.plc"
               class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none"
               placeholder="Omron" readonly>
      </div>

      <!-- Ekran Boyutu -->
      <div class="w-[150px] mr-[6px]">
        <label for="ekranBoyutu" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ekran Boyutu</label>
        <select id="ekranBoyutu" v-model="project.makineSection.ekranBoyutu"
                class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" selected>Seçiniz!</option>
          <option value="7'">7"</option>
          <option value="10'">10"</option>
          <option value="12'">12"</option>
          <option value="15'">15"</option>
        </select>
      </div>

      <!-- Şebeke Frekansı -->
      <div class="w-[150px] mr-[6px]">
        <label for="frekans" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Şebeke Frekansı</label>
        <input type="text" id="frekans" v-model="project.projeSection.frekans"
               class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100"
               placeholder="Ülke seçildiğinde otomatik gelir" readonly>
      </div>

      <!-- Şebeke Gerilimi -->
      <div class="w-[150px] mr-[6px]">
        <label for="volt" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Şebeke Gerilimi</label>
        <input type="text" id="volt" v-model="project.projeSection.gerilim"
               class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100"
               placeholder="Ülke seçildiğinde otomatik gelir" readonly>
      </div>

      <!-- Makine Boy -->
      <div class="w-[150px] mr-[6px]">
        <label for="makineBoy" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Makine Boy</label>
        <input type="text" id="makineBoy" v-model="project.makineSection.makineBoyutu"
               class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
               placeholder="Belirtiniz!">
      </div>

      <!-- Makine Notlar -->
      <div class="w-[462px] mr-[6px]">
        <label for="makineNotlar" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Makine Notlar</label>
        <input type="text" id="makineNotlar" v-model="project.makineSection.makineNotlari"
               class="w-full h-8 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
               placeholder="Varsa, Belirtiniz!">
      </div>
    </div>
  </div>
</template>

<script>
import { modelProducts, getKesmeTipiOptions } from '@/utils/dropdownData.js'

export default {
  name: 'MachineSection',
  props: {
    project: { type: Object, required: true },
    availableModels: { type: Array, default: () => [] },
    availableAltModels: { type: Array, default: () => [] },
    productOptions: { type: Array, default: () => [] }
  },
  data() {
    return {
      kesmeTipiDropdownOpen: false,
      productsDropdownOpen: false,
      customAltModels: [],
      customProducts: [],
      customKesmeTipi: []
    }
  },
  computed: {
    availableProducts() {
      return this.productOptions || []
    },
    sortedCustomProducts() {
      return this.customProducts || []
    },
    availableKesmeTipi() {
      if (!this.project.makineSection.kesmeTipi) return []
      
      // Get kesme tipi options from dropdownData utility
      const options = getKesmeTipiOptions(this.project.makineSection.kesmeTipi)
      
      // Add custom kesme tipi options
      if (this.customKesmeTipi && this.customKesmeTipi.length > 0) {
        this.customKesmeTipi.forEach(item => {
          options.push({ value: item, label: item })
        })
      }
      
      return options
    }
  },
  mounted() {
    this.initializeData()
    
    // Add click outside handler for dropdowns
    document.addEventListener('click', this.handleClickOutside)
  },
  
  beforeUnmount() {
    // Remove click outside handler
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    initializeData() {
      // Initialize kesme tipi arrays if they don't exist
      if (!this.project.makineSection.kesmeTipiItems) {
        this.project.makineSection.kesmeTipiItems = []
      }
      if (!this.project.makineSection.kesmeTipiSayilari) {
        this.project.makineSection.kesmeTipiSayilari = {}
      }
    },

    toggleKesmeTipiDropdown() {
      this.kesmeTipiDropdownOpen = !this.kesmeTipiDropdownOpen
      // No need to call updateKesmeTipiOptions since it's computed
    },

    toggleProductsDropdown() {
      this.productsDropdownOpen = !this.productsDropdownOpen
    },

    formatKesmeTipiDisplay() {
      if (!this.project.makineSection.kesmeTipiItems || this.project.makineSection.kesmeTipiItems.length === 0) {
        return 'Seçiniz!'
      }
      
      // Show summary instead of listing all items
      const totalItems = this.project.makineSection.kesmeTipiItems.length
      return `${totalItems} seçili`
    },

    hasKesmeTipiItem(value) {
      return this.project.makineSection.kesmeTipiItems && this.project.makineSection.kesmeTipiItems.some(item => item.value === value)
    },

    getKesmeTipiCount(value) {
      if (!this.project.makineSection.kesmeTipiItems) return null
      const item = this.project.makineSection.kesmeTipiItems.find(item => item.value === value)
      return item ? item.count : null
    },

    showKesmeTipiCountModalForItem(option) {
      // Close the dropdown when an item is selected
      this.kesmeTipiDropdownOpen = false
      
      // Emit event to parent to show modal
      this.$emit('show-kesme-tipi-modal', option)
    },

    addCustomKesmeTipi() {
      // Emit event to parent to show custom modal
      this.$emit('show-custom-modal', 'kesmeTipi')
    },

    // Add custom kesme tipi to the list
    addCustomKesmeTipiToList(customValue) {
      if (customValue && !this.customKesmeTipi.includes(customValue)) {
        this.customKesmeTipi.push(customValue)
        
        // Automatically select the newly added item
        if (!this.project.makineSection.kesmeTipiItems) {
          this.project.makineSection.kesmeTipiItems = []
        }
        
        // Add the new item with count 1
        this.project.makineSection.kesmeTipiItems.push({
          value: customValue,
          label: customValue,
          count: 1
        })
        
        // Initialize kesmeTipiSayilari if it doesn't exist
        if (!this.project.makineSection.kesmeTipiSayilari) {
          this.project.makineSection.kesmeTipiSayilari = {}
        }
        this.project.makineSection.kesmeTipiSayilari[customValue] = 1
        
        // Close the dropdown after selection
        this.kesmeTipiDropdownOpen = false
        
        // Force reactivity update
        this.$forceUpdate()
      }
    },

    // Get kesme tipi options for current machine type
    getKesmeTipiOptionsForMachineType() {
      return this.availableKesmeTipi
    },

    // Remove kesme tipi item
    removeKesmeTipiItem(value) {
      if (this.project.makineSection.kesmeTipiItems) {
        const index = this.project.makineSection.kesmeTipiItems.findIndex(item => item.value === value)
        if (index !== -1) {
          this.project.makineSection.kesmeTipiItems.splice(index, 1)
          // Also remove from counts
          if (this.project.makineSection.kesmeTipiSayilari) {
            delete this.project.makineSection.kesmeTipiSayilari[value]
          }
        }
      }
    },

    toggleProductSelection(product, event) {
      if (!this.project.makineSection.selectedProducts) {
        this.project.makineSection.selectedProducts = []
      }
      
      const index = this.project.makineSection.selectedProducts.indexOf(product)
      if (index === -1) {
        this.project.makineSection.selectedProducts.push(product)
      } else {
        this.project.makineSection.selectedProducts.splice(index, 1)
      }
      
      // Close the dropdown after selection
      this.productsDropdownOpen = false
    },

    addCustomProduct() {
      // Emit event to parent to show custom modal
      this.$emit('show-custom-modal', 'product')
    },

    // Add custom product to the list and automatically select it
    addCustomProductToList(customValue) {
      if (customValue && !this.customProducts.includes(customValue)) {
        this.customProducts.push(customValue)
        
        // Automatically select the newly added product
        if (!this.project.makineSection.selectedProducts) {
          this.project.makineSection.selectedProducts = []
        }
        
        if (!this.project.makineSection.selectedProducts.includes(customValue)) {
          this.project.makineSection.selectedProducts.push(customValue)
        }
        
        // Close the dropdown after selection
        this.productsDropdownOpen = false
        
        // Force reactivity update
        this.$forceUpdate()
      }
    },

    checkForCustomOption(field) {
      if (this.project.makineSection[field] === 'other') {
        // Emit event to parent to show custom modal
        this.$emit('show-custom-modal', field)
      }
    },

    formatMoldEyeCount() {
      const input = this.project.makineSection.moldEyeCountInput
      if (!input) return
      
      // If already in the correct format (contains 'x')
      if (input.includes('x')) {
        const parts = input.split('x')
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          this.project.makineSection.moldEyeCount = input
          const product = parseInt(parts[0]) * parseInt(parts[1])
          this.project.makineSection.moldEyeCountProduct = product
          this.calculateCapacity()
        }
        return
      }
      
      // Check for space-separated numbers (e.g., "2 3")
      const regex = /(\d+)\s+(\d+)/
      const match = regex.exec(input)
      if (match) {
        const row = parseInt(match[1])
        const col = parseInt(match[2])
        const formatted = `${row}x${col}`
        const product = row * col
        
        // Update the moldEyeCount field
        this.project.makineSection.moldEyeCount = formatted
        this.project.makineSection.moldEyeCountProduct = product
        
        // Update the input field to show the formatted value
        setTimeout(() => {
          this.project.makineSection.moldEyeCountInput = formatted
          this.calculateCapacity()
        }, 10)
      }
    },

    calculateCapacity() {
      const ms = this.project.makineSection
      if (ms.moldEyeCount && ms.vurusDkMin && ms.vurusDkMax) {
        const match = /^([0-9]+)x([0-9]+)$/.exec(ms.moldEyeCount)
        if (match) {
          const row = parseInt(match[1])
          const col = parseInt(match[2])
          const product = row * col
          ms.kapasiteMin = Math.floor(product * ms.vurusDkMin * 60)
          ms.kapasiteMax = Math.floor(product * ms.vurusDkMax * 60)
          ms.moldEyeCountProduct = product
        }
      }
    },

    formatDynamicMoldCount(index) {
      if (!this.project.makineSection.dinamikAlanlar) {
        this.project.makineSection.dinamikAlanlar = {}
      }
      
      const input = this.project.makineSection.dinamikAlanlar['kalipGozSayisi_' + index]
      if (!input) return
      
      // If already in the correct format (contains 'x')
      if (input.includes('x')) {
        const parts = input.split('x')
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          const product = parseInt(parts[0]) * parseInt(parts[1])
          this.project.makineSection.dinamikAlanlar['moldCountProduct_' + index] = product
          this.calculateDynamicCapacity(index)
        }
        return
      }
      
      // Check for space-separated numbers (e.g., "2 3")
      const regex = /(\d+)\s+(\d+)/
      const match = regex.exec(input)
      if (match) {
        const row = parseInt(match[1])
        const col = parseInt(match[2])
        const formatted = `${row}x${col}`
        const product = row * col
        
        // Store the product and formatted value
        this.project.makineSection.dinamikAlanlar['moldCountProduct_' + index] = product
        this.project.makineSection.dinamikAlanlar['kalipGozSayisi_' + index] = formatted
        
        // Calculate capacity after a short delay
        setTimeout(() => this.calculateDynamicCapacity(index), 50)
      }
    },

    calculateDynamicCapacity(index) {
      const dyn = this.project.makineSection.dinamikAlanlar
      if (!dyn) return
      
      const moldCount = dyn['kalipGozSayisi_' + index]
      const vmin = dyn['vurusDkMin_' + index] || 0
      const vmax = dyn['vurusDkMax_' + index] || 0
      
      if (moldCount && (vmin || vmax)) {
        const match = /^([0-9]+)x([0-9]+)$/.exec(moldCount)
        if (match) {
          const product = parseInt(match[1]) * parseInt(match[2])
          dyn['moldCountProduct_' + index] = product
          if (vmin) dyn['kapasiteMin_' + index] = Math.floor(product * vmin * 60)
          if (vmax) dyn['kapasiteMax_' + index] = Math.floor(product * vmax * 60)
        }
      }
    },

    processDynamicFields() {
      if (parseInt(this.project.makineSection.gozSayisi) > 1) {
        // Ensure dinamikAlanlar is initialized
        if (!this.project.makineSection.dinamikAlanlar) {
          this.project.makineSection.dinamikAlanlar = {}
        }

        for (let i = 1; i <= parseInt(this.project.makineSection.gozSayisi) - 1; i++) {
          const fieldName = 'kalipGozSayisi_' + i
          const value = this.project.makineSection.dinamikAlanlar[fieldName]
          
          if (value && typeof value === 'string' && value.includes(' ') && !value.includes('x')) {
            this.formatDynamicMoldCount(i)
          }
          
          this.calculateDynamicCapacity(i)
        }
      }
    },

    handleClickOutside(event) {
      const kesmeTipiDropdown = document.querySelector('.multiselect-dropdown-toggle[data-dropdown="kesmeTipi"]')
      const productsDropdown = document.querySelector('.multiselect-dropdown-toggle[data-dropdown="products"]')

      if (kesmeTipiDropdown && !kesmeTipiDropdown.contains(event.target) && !this.$el.contains(event.target)) {
        this.kesmeTipiDropdownOpen = false
      }

      if (productsDropdown && !productsDropdown.contains(event.target) && !this.$el.contains(event.target)) {
        this.productsDropdownOpen = false
      }
    }
  },

  watch: {
    'project.makineSection.kesmeTipi': {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          // Reset kesme tipi selections when machine type changes
          this.project.makineSection.kesmeTipiItems = []
          this.project.makineSection.kesmeTipiSayilari = {}
          this.customKesmeTipi = []
        }
      },
      // run only on actual changes after mount
      immediate: false
    },
    'project.makineSection.moldEyeCountInput': {
      handler() {
        this.formatMoldEyeCount()
      },
      deep: true
    },
    'project.makineSection.gozSayisi': {
      handler(newValue) {
        if (parseInt(newValue) > 1) {
          // Initialize dynamic fields when mold count changes
          if (!this.project.makineSection.dinamikAlanlar) {
            this.project.makineSection.dinamikAlanlar = {}
          }
        }
      },
      immediate: true
    },
    'project.makineSection.dinamikAlanlar': {
      handler() {
        // Process dynamic fields when they change
        this.processDynamicFields()
      },
      deep: true
    }
  }
}
</script>
