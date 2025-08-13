<template>
  <div class="min-h-screen flex overflow-hidden">
    <!-- Sidebar -->
    <AppSidebar 
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
      @toggle-collapsed="handleSidebarCollapse"
    />

    <!-- Ana İçerik -->
    <div 
      class="flex-1 flex flex-col min-w-0 transition-all duration-300" 
      :class="[isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64', isSidebarOpen ? '' : 'ml-0']"
    >
      <!-- Header -->
      <AppHeader 
        title="Proje Detayı"
        :page-title="`Proje: ${$route.params.id}`"
        page-icon="fas fa-folder-open"
        @toggle-sidebar="isSidebarOpen = true"
      />

      <!-- Ana İçerik Alanı -->
      <div class="flex-1 overflow-x-hidden">
        <div class="container mx-auto px-4 py-6">
          <!-- Secondary bar: project id & back link -->
          <div class="bg-white shadow-sm rounded-lg mb-4">
            <div class="flex items-center justify-between px-4 lg:px-6 py-3">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Proje Detayları</h2>
                <p class="text-sm text-gray-500">
                  <span class="font-medium text-gray-700">{{ projectNumber }}</span>
                  <span class="text-gray-700" v-if="projectName"> - {{ projectName }}</span>
                </p>
              </div>
              <router-link to="/" class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Listeye Dön
              </router-link>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>

          <!-- Error -->
          <div v-else-if="loadError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{{ loadError }}</p>
            <button @click="fetchProjectDetails" class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Yeniden Dene</button>
          </div>

          <!-- Content -->
          <div v-else>
            <!-- Proje Bilgileri -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('projectInfo')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Proje Bilgileri</h2>
                <i class="fas" :class="sectionVisibility.projectInfo ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.projectInfo" class="p-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Seri No</div>
                    <div class="text-xs text-gray-900">{{ projectNumber }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Müşteri</div>
                    <div class="text-xs text-gray-900">{{ projectData?.project?.company1 }}{{ projectData?.project?.company2 ? ' / ' + projectData?.project?.company2 : '' }}</div>
                  </div>
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ülke</div>
                    <div class="text-xs text-gray-900">{{ country }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Şehir</div>
                    <div class="text-xs text-gray-900">{{ city }}</div>
                  </div>
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Sipariş Tarihi</div>
                    <div class="text-xs text-gray-900">{{ orderDate }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Teslim Tarihi</div>
                    <div class="text-xs text-gray-900">{{ deliveryDate }}</div>
                  </div>
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Revize Sevk Tarihi</div>
                    <div class="text-xs text-gray-900">{{ revisionDate }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Cezai Şart</div>
                    <div class="text-xs text-gray-900">{{ penalty }}</div>
                  </div>
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ceza Tarihi</div>
                    <div class="text-xs text-gray-900">{{ penaltyDate }}</div>
                  </div>
                </div>

                <div v-if="notes" class="mt-3 bg-white border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Notlar</div>
                  <div class="text-xs text-gray-900">{{ notes }}</div>
                </div>

                <div class="mt-3 bg-gray-50 border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Proje PDF</div>
                  <div class="text-xs text-gray-900" v-if="projectPdfFile">
                    <a :href="apiBaseUrl + '/uploads/' + projectPdfFile" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
                      <i class="fas fa-file-pdf mr-2 text-red-500"></i>
                      {{ projectPdfFile }}
                    </a>
                  </div>
                  <div v-else class="text-xs text-gray-500">Yok</div>
                </div>

                <div v-if="projectData?.project?.status" class="mt-3 bg-white border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Proje Durumu</div>
                  <div class="text-xs text-gray-900">{{ projectData.project.status }}</div>
                </div>
                <div v-if="projectData?.project?.priority" class="mt-3 bg-gray-50 border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Öncelik</div>
                  <div class="text-xs text-gray-900">{{ projectData.project.priority }}</div>
                </div>
                <div v-if="projectData?.project?.projectManager" class="mt-3 bg-white border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Proje Yöneticisi</div>
                  <div class="text-xs text-gray-900">{{ projectData.project.projectManager }}</div>
                </div>
                <div v-if="projectData?.project?.projectType" class="mt-3 bg-gray-50 border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Proje Tipi</div>
                  <div class="text-xs text-gray-900">{{ projectData.project.projectType }}</div>
                </div>
              </div>
            </div>

            <!-- Makine Bilgileri -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('machineInfo')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Makine Bilgileri</h2>
                <i class="fas" :class="sectionVisibility.machineInfo ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.machineInfo" class="p-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Makine Tipi</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.machineType || '' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Model</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.model || '' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Alt Model</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.subModel || 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ürün</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.productType || '' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kalıp Sayısı</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.moldCount }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kesme Tipi</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.cuttingType || 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kesme Notu</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.cuttingNotes || 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Isı Plakası</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.heatPlate || 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Yağlama</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.lubrication || 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">İtme Tipi</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.pushingType || 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ekran Boyutu</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.screenSize || 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Frekans</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.frequency || 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Voltaj</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.voltage || 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Makine Boy</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.machineSize || 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">PLC</div><div class="text-xs text-gray-900">{{ projectData?.sectionMachine?.plc || 'Yok' }}</div></div>
                </div>
                <div v-if="machineItems.length > 0" class="mt-3">
                  <h3 class="text-xs font-medium text-gray-700 mb-2">Makine Özellikleri</h3>
                  <div class="space-y-2">
                    <div v-for="(item, index) in machineItems" :key="'machine-item-'+index" class="border border-gray-200 rounded-md overflow-hidden">
                      <div @click="toggleMachineItemDetails(index)" class="bg-gray-50 p-2 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                        <div class="font-medium text-xs text-gray-700">Kalıp {{ index + 1 }}: {{ item.moldEyeCount || '-' }}</div>
                        <div class="flex items-center"><span class="text-xs text-gray-500 mr-2">{{ item.capacityMinPerHour || '0' }} - {{ item.capacityMaxPerHour || '0' }} adet/saat</span><i class="fas fa-chevron-down text-gray-400 transition-transform" :class="{'transform rotate-180': showMachineItemDetails && activeItemIndex === index}"></i></div>
                      </div>
                      <div v-if="showMachineItemDetails && activeItemIndex === index" class="p-2 border-t border-gray-200">
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Vakum</div><div class="text-xs text-gray-900">{{ item.vacuum ? 'Var' : 'Yok' }}</div></div>
                          <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Gaz</div><div class="text-xs text-gray-900">{{ item.gas ? 'Var' : 'Yok' }}</div></div>
                          <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kalıp Göz Sayısı</div><div class="text-xs text-gray-900">{{ item.moldEyeCount || '-' }}</div></div>
                          <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Min./Vuruş Dk.</div><div class="text-xs text-gray-900">{{ item.strokeMin || '0' }}</div></div>
                          <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Max./Vuruş Dk.</div><div class="text-xs text-gray-900">{{ item.strokeMax || '0' }}</div></div>
                          <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kapasite Min. "Adet/Sa."</div><div class="text-xs text-gray-900">{{ item.capacityMinPerHour || '0' }}</div></div>
                          <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kapasite Max. "Adet/Sa."</div><div class="text-xs text-gray-900">{{ item.capacityMaxPerHour || '0' }}</div></div>
                          <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kap Ölçüsü İçten İçe mm.</div><div class="text-xs text-gray-900">{{ item.innerToInner || '-' }}</div></div>
                          <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kap Ölçüsü Dıştan Dışa mm.</div><div class="text-xs text-gray-900">{{ item.outerToOuter || '-' }}</div></div>
                          <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kap Yükseklik mm.</div><div class="text-xs text-gray-900">{{ item.height || '-' }}</div></div>
                          <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Hatve</div><div class="text-xs text-gray-900">{{ item.pitch || '-' }}</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="projectData?.sectionMachine?.machineNotes" class="mt-3 bg-white border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Makine Notları</div>
                  <div class="text-xs text-gray-900">{{ projectData.sectionMachine.machineNotes }}</div>
                </div>
              </div>
            </div>

            <!-- Üst Folyo Bilgileri -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('topFoil')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Üst Folyo Bilgileri</h2>
                <i class="fas" :class="sectionVisibility.topFoil ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.topFoil" class="p-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Durum</div><div class="text-xs text-gray-900">{{ projectData?.sectionTopFoil?.isAvailable ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Çeşidi</div><div class="text-xs text-gray-900">{{ projectData?.sectionTopFoil?.foilTypeName || '' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Kalınlığı "μ"</div><div class="text-xs text-gray-900">{{ projectData?.sectionTopFoil?.foilThickness || '' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Eni "mm."</div><div class="text-xs text-gray-900">{{ projectData?.sectionTopFoil?.foilWidth || '' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Tedarik</div><div class="text-xs text-gray-900">{{ projectData?.sectionTopFoil?.foilSupply || '' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">UV</div><div class="text-xs text-gray-900">{{ projectData?.sectionTopFoil?.uv ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Web Cleaning / Antistatik</div><div class="text-xs text-gray-900">{{ projectData?.sectionTopFoil?.webCleaningAntistatic ? 'Var' : 'Yok' }}</div></div>
                </div>
                <div v-if="projectData?.sectionTopFoil?.foilNotes" class="mt-3 bg-white border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Üst Folyo Notları</div>
                  <div class="text-xs text-gray-900">{{ projectData.sectionTopFoil.foilNotes }}</div>
                </div>
              </div>
            </div>

            <!-- Alt Folyo Bilgileri -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('bottomFoil')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Alt Folyo Bilgileri</h2>
                <i class="fas" :class="sectionVisibility.bottomFoil ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.bottomFoil" class="p-3">
                <div class="mb-4">
                  <h3 class="text-sm font-medium text-gray-800 mb-2 p-2 bg-gray-100 rounded-t-md">Alt Folyo Yumuşak</h3>
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 p-2 border border-t-0 border-gray-200 rounded-b-md">
                    <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Durum</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilSoft?.isAvailable ? 'Var' : 'Yok' }}</div></div>
                    <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Tipi</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilSoft?.foilTypeName || 'Yok' }}</div></div>
                    <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Kalınlığı "μ"</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilSoft?.foilThickness || 'Yok' }}</div></div>
                    <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Eni "mm."</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilSoft?.foilWidth || 'Yok' }}</div></div>
                    <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Tedarik</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilSoft?.foilSupply || 'Yok' }}</div></div>
                    <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">UV</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilSoft?.uv ? 'Var' : 'Yok' }}</div></div>
                    <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Web Cleaning</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilSoft?.webCleaningAntistatic ? 'Var' : 'Yok' }}</div></div>
                  </div>
                </div>
                <div class="mb-4">
                  <h3 class="text-sm font-medium text-gray-800 mb-2 p-2 bg-gray-100 rounded-t-md">Alt Folyo Sert</h3>
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl-grid-cols-8 gap-2 p-2 border border-t-0 border-gray-200 rounded-b-md">
                    <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Durum</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilHard?.isAvailable ? 'Var' : 'Yok' }}</div></div>
                    <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Tipi</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilHard?.foilTypeName || 'Yok' }}</div></div>
                    <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Kalınlığı "μ"</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilHard?.foilThickness || 'Yok' }}</div></div>
                    <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Eni "mm."</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilHard?.foilWidth || 'Yok' }}</div></div>
                    <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Tedarik</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilHard?.foilSupply || 'Yok' }}</div></div>
                    <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">UV</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilHard?.uv ? 'Var' : 'Yok' }}</div></div>
                    <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Web Cleaning</div><div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.sectionBottomFoilHard?.webCleaningAntistatic ? 'Var' : 'Yok' }}</div></div>
                  </div>
                </div>
                <div class="mt-3 bg-white border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Alt Folyo Notları</div>
                  <div class="text-xs text-gray-900">{{ projectData?.sectionBottomFoil?.foilNotes || '' }}</div>
                </div>
              </div>
            </div>

            <!-- Hijyen Bilgileri -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('hygiene')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Hijyen Bilgileri</h2>
                <i class="fas" :class="sectionVisibility.hygiene ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.hygiene" class="p-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Steril Hava Filtresi</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionHygiene?.sterileAirFilter || 'Yok' }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Hepa</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionHygiene?.hepa ? 'Var' : 'Yok' }}</div>
                  </div>
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ultra Clean</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionHygiene?.ultraClean ? 'Var' : 'Yok' }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Full CIP</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionHygiene?.fullCIP ? 'Var' : 'Yok' }}</div>
                  </div>
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">CIP In/Out</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionHygiene?.cipInOut ? 'Var' : 'Yok' }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">SIP</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionHygiene?.sip ? 'Var' : 'Yok' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dolum Bilgileri -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('filling')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Dolum Bilgileri</h2>
                <i class="fas" :class="sectionVisibility.filling ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.filling" class="p-3">
                <!-- Üst satır: Dolum ve Ünite Sayısı -->
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Dolum</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionFilling?.isAvailable ? 'Var' : 'Yok' }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ünite Sayısı</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionFilling?.unitCount ?? '0' }}</div>
                  </div>
                </div>

                <!-- Dolum Özellikleri (Ünite bazlı) -->
                <div class="mt-3">
                  <h3 class="text-xs font-medium text-gray-700 mb-2">Dolum Özellikleri</h3>
                  <div class="space-y-2">
                    <div v-for="(item, index) in fillingItems" :key="'filling-item-'+index" class="border border-gray-200 rounded-md overflow-hidden">
                      <!-- Başlık -->
                      <div @click="toggleFillingItemDetails(index)" class="bg-gray-50 p-2 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                        <div class="font-medium text-xs text-gray-700">Dolum Ünitesi {{ index + 1 }}</div>
                        <div class="text-[11px] text-gray-500">{{ item.hasGranuleProduct ? 'Tanecikli' : 'Taneciksiz' }}</div>
                        <i class="fas fa-chevron-down text-gray-400 text-xs ml-2 transition-transform" :class="{'transform rotate-180': showFillingItemDetails && activeItemIndex === index}"></i>
                      </div>
                      <!-- İçerik -->
                      <div v-if="showFillingItemDetails && activeItemIndex === index" class="p-2 border-t border-gray-200">
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Tanecikli Ürün</div><div class="text-xs text-gray-900">{{ item.hasGranuleProduct ? 'Evet' : 'Hayır' }}</div></div>
                          <div class="bg-white rounded p-2" v-if="item.productAmount"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ürün Miktarı "gr./ml."</div><div class="text-xs text-gray-900">{{ item.productAmount }}</div></div>
                          <div class="bg-gray-50 rounded p-2" v-if="item.productStructure"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ürün Yapısı</div><div class="text-xs text-gray-900">{{ item.productStructure }}</div></div>
                          <div class="bg-white rounded p-2" v-if="item.fillingPosition"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Dolum Konumu</div><div class="text-xs text-gray-900">{{ item.fillingPosition }}</div></div>
                          <div class="bg-gray-50 rounded p-2" v-if="item.fillingType"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Dolum Tipi</div><div class="text-xs text-gray-900">{{ item.fillingType }}</div></div>
                          <div class="bg-white rounded p-2" v-if="item.fillingMovement"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Dolum Hareketi</div><div class="text-xs text-gray-900">{{ item.fillingMovement }}</div></div>
                          <div class="bg-gray-50 rounded p-2" v-if="item.fillingUnitLocation"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Dolum Ünitesi Yeri</div><div class="text-xs text-gray-900">{{ item.fillingUnitLocation }}</div></div>
                          <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Servis Arabası</div><div class="text-xs text-gray-900">{{ item.hasServiceCart ? 'Var' : 'Yok' }}</div></div>

                          <!-- Opsiyonel alanlar (varsa göster) -->
                          <div class="bg-white rounded p-2" v-if="item.particleSize"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Partikül Ölçüsü</div><div class="text-xs text-gray-900">{{ item.particleSize }}</div></div>
                          <div class="bg-gray-50 rounded p-2" v-if="item.productTemperature"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ürün Sıcaklığı "°C"</div><div class="text-xs text-gray-900">{{ item.productTemperature }}</div></div>
                          <div class="bg-white rounded p-2" v-if="item.productSpecifications"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ürün Spektleri</div><div class="text-xs text-gray-900">{{ item.productSpecifications }}</div></div>
                          <div class="bg-gray-50 rounded p-2" v-if="item.manualFillingArea"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Manuel Dolum Alanı</div><div class="text-xs text-gray-900">{{ item.manualFillingArea }}</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dolum Notları -->
                <div class="mt-3 bg-white border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Dolum Notları</div>
                  <div class="text-xs text-gray-900">{{ projectData?.sectionFilling?.fillingNotes || '' }}</div>
                </div>
              </div>
            </div>

            <!-- Hat Sonu -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('endOfLine')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Hat Sonu</h2>
                <i class="fas" :class="sectionVisibility.endOfLine ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.endOfLine" class="p-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Robot</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionEndOfLine?.isRobot ? 'Var' : 'Yok' }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Robot Tipi</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionEndOfLine?.robotType || '' }}</div>
                  </div>
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Robot Modeli</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionEndOfLine?.robotModel || '' }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Koli Açma</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionEndOfLine?.boxOpening ? 'Var' : 'Yok' }}</div>
                  </div>
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Koli Kapama</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionEndOfLine?.boxClosing ? 'Var' : 'Yok' }}</div>
                  </div>
                  <div class="bg-white rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kutu Makinesi</div>
                    <div class="text-xs text-gray-900">{{ projectData?.sectionEndOfLine?.boxMachine ? 'Var' : 'Yok' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aksesuar Bilgileri -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('accessory')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Aksesuar Bilgileri</h2>
                <i class="fas" :class="sectionVisibility.accessory ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.accessory" class="p-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Vakum Pompası Tipi</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.vacuumPumpType || '' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Vakum Pompası Modeli "m³/Sa."</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.vacuumPumpModel || '' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Chiller</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.chillerKcal ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2" v-if="projectData?.sectionAccessory?.chillerKcal"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Chiller "kcal/h"</div><div class="text-xs text-gray-900">{{ projectData.sectionAccessory.chillerKcal }}</div></div>
                  <div class="bg-gray-50 rounded p-2" v-if="projectData?.sectionAccessory?.travers"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Travers</div><div class="text-xs text-gray-900">{{ projectData.sectionAccessory.travers }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Sticker Ünitesi</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.stickerUnit || '' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Yazıcı</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.printer ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Jumbo Bobin Arabası</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.jumboBobbinTrolley ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Yerde Fire Sarma</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.groundScrapWinding ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Folyo Arabası</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.foilTrolley ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ekstra Folyo Arabası</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.extraFoilTrolley ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kolay Kalıp Değiştirme Arabası</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.easyMoldChangeTrolley ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kompresör</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.compressor ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Pano Klima</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.panelAirConditioner ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Kırmızı Pompa</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.redPump ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Su Tutucu Filtresi</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.waterFilter ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Etiket Ünitesi</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.labelUnit ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Terazi</div><div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.scale ? 'Var' : 'Yok' }}</div></div>
                </div>
                <div class="mt-3 bg-white border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Aksesuar Notları</div>
                  <div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.accessoryNotes || '' }}</div>
                </div>
                <div class="mt-3 bg-gray-50 border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Terazi Notları</div>
                  <div class="text-xs text-gray-900">{{ projectData?.sectionAccessory?.scaleNotes || '' }}</div>
                </div>
              </div>
            </div>


            <!-- Paketleme Bilgileri -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('packaging')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Paketleme Bilgileri</h2>
                <i class="fas" :class="sectionVisibility.packaging ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.packaging" class="p-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Yükleme Tipi</div><div class="text-xs text-gray-900">{{ projectData?.sectionPackaging?.loadingType || '' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Palet</div><div class="text-xs text-gray-900">{{ projectData?.sectionPackaging?.pallet ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Standart</div><div class="text-xs text-gray-900">{{ projectData?.sectionPackaging?.standard ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Sandık</div><div class="text-xs text-gray-900">{{ projectData?.sectionPackaging?.crate ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-gray-50 rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Nem Önleyici</div><div class="text-xs text-gray-900">{{ projectData?.sectionPackaging?.moisturePreventer ? 'Var' : 'Yok' }}</div></div>
                  <div class="bg-white rounded p-2"><div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Teslimat Tipi</div><div class="text-xs text-gray-900">{{ projectData?.sectionPackaging?.deliveryType || '' }}</div></div>
                </div>
                <div v-if="projectData?.sectionPackaging?.packagingNotes" class="mt-3 bg-white border border-gray-200 rounded p-2">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Paketleme Notları</div>
                  <div class="text-xs text-gray-900">{{ projectData.sectionPackaging.packagingNotes }}</div>
                </div>
              </div>
            </div>

            <!-- Ekstra Bilgiler -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div @click="toggleSection('extras')" class="p-3 bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-200">
                <h2 class="text-base font-medium text-gray-900">Ekstra Bilgiler</h2>
                <i class="fas" :class="sectionVisibility.extras ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>
              <div v-if="sectionVisibility.extras" class="p-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  <div class="bg-gray-50 rounded p-2">
                    <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ekstra Dosya</div>
                    <div class="text-xs text-gray-900">
                      <template v-if="extraFileName">
                        <a :href="apiBaseUrl + '/uploads/' + extraFileName" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
                          <i class="fas fa-file mr-2"></i>
                          {{ extraFileName }}
                        </a>
                      </template>
                      <template v-else>Yok</template>
                    </div>
                  </div>
                </div>
                <div class="mt-3 bg-white border border-gray-200 rounded p-2" v-if="projectData?.sectionExtras?.extraNotes">
                  <div class="text-xs font-bold text-gray-700 pb-1 border-b border-gray-200 mb-1">Ekstra Notlar</div>
                  <div class="text-xs text-gray-900">{{ projectData.sectionExtras.extraNotes }}</div>
                </div>
              </div>
            </div>

            <!-- Proje Durumu -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div class="p-4 flex items-center justify-between">
                <h3 class="text-base font-medium text-gray-800">Proje Durumu</h3>
                <div class="flex gap-2">
                  <button @click="onUpdateProjectStatus('shipped')" :disabled="isUpdatingStatus" class="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
                    <i class="fas fa-truck mr-1"></i>
                    <span v-if="isUpdatingStatus">Güncelleniyor...</span>
                    <span v-else>Sevk Edildi</span>
                  </button>
                  <button @click="onUpdateProjectStatus('completed')" :disabled="isUpdatingStatus" class="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
                    <i class="fas fa-check-circle mr-1"></i>
                    <span v-if="isUpdatingStatus">Güncelleniyor...</span>
                    <span v-else>Tamamlandı</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Genel İlerleme -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div class="p-4">
                <h2 class="text-base font-medium text-gray-900 mb-2">Genel İlerleme %{{ overallProgress }}</h2>
                <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-green-500 rounded-full transition-all duration-700" :style="{ width: overallProgress + '%' }"></div>
                </div>
                <div class="mt-3 text-center">
                  <div class="text-sm text-gray-500">Kalan Süre</div>
                  <div class="font-bold text-lg">{{ remainingDays }} gün</div>
                </div>
              </div>
            </div>

            <!-- Üretim Süreçleri -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-2 p-3">
              <ProductionProcess :project-id="$route.params.id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import ProductionProcess from '@/components/ProductionProcess.vue'
import { ApiService, API_CONFIG } from '@/services/api'

export default {
  name: 'ProjectDetail',
  components: {
    AppSidebar,
    AppHeader,
    ProductionProcess
  },
  setup() {
    const isSidebarOpen = ref(window.innerWidth >= 1024)
    const isSidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
    const route = useRoute()
    const projectId = computed(() => (route.params.id ? String(route.params.id) : ''))

    // UI state
    const isLoading = ref(true)
    const loadError = ref(null)
    const isUpdatingStatus = ref(false)

    // Data
    const projectData = ref(null)
    const projectNumber = ref('')
    const projectName = ref('')
    const country = ref('')
    const city = ref('')
    const orderDate = ref('')
    const deliveryDate = ref('')
    const revisionDate = ref('')
    const penalty = ref('Hayır')
    const penaltyDate = ref('')
    const notes = ref('')
    const overallProgress = ref(0)
    const remainingDays = ref(0)

    const apiBaseUrl = API_CONFIG.BASE_URL.replace(/\/api$/, '')

    const sectionVisibility = ref({
      projectInfo: true,
      machineInfo: false,
      topFoil: false,
      bottomFoil: false,
      hygiene: false,
      filling: false,
      endOfLine: false,
      accessory: false,
      packaging: false,
      extras: false
    })

    const toggleSection = (section) => { sectionVisibility.value[section] = !sectionVisibility.value[section] }

    const formatDateFromAPI = (dateString) => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        return `${String(date.getDate()).padStart(2,'0')}.${String(date.getMonth()+1).padStart(2,'0')}.${date.getFullYear()}`
      } catch { return '' }
    }

    const projectPdfFile = computed(() => projectData.value?.project?.projectPdfFileName || projectData.value?.project?.projectPdfName || projectData.value?.project?.pdfFileName || '')
    const extraFileName = computed(() => projectData.value?.sectionExtras?.extraFileName || '')

    // Expandable lists (Makine ve Dolum kalemleri)
    const machineItems = ref([])
    const fillingItems = ref([])
    const showMachineItemDetails = ref(false)
    const showFillingItemDetails = ref(false)
    const activeItemIndex = ref(0)
    const toggleMachineItemDetails = (index) => {
      if (activeItemIndex.value === index && showMachineItemDetails.value) {
        showMachineItemDetails.value = false
      } else {
        activeItemIndex.value = index
        showMachineItemDetails.value = true
      }
    }
    const toggleFillingItemDetails = (index) => {
      if (activeItemIndex.value === index && showFillingItemDetails.value) {
        showFillingItemDetails.value = false
      } else {
        activeItemIndex.value = index
        showFillingItemDetails.value = true
      }
    }

    const fetchProjectDetails = async () => {
      try {
        isLoading.value = true
        loadError.value = null
        const response = await ApiService.get(`/Projects/${projectId.value}/details`)
        projectData.value = response
        if (response) {
          projectNumber.value = response.project.seriNo || ''
          projectName.value = `${response.project.company1 || ''}${response.project.company2 ? ' / ' + response.project.company2 : ''}`
          country.value = response.project.country || ''
          city.value = response.project.city || ''
          orderDate.value = formatDateFromAPI(response.project.createdDate)
          deliveryDate.value = formatDateFromAPI(response.project.shipmentDate)
          revisionDate.value = formatDateFromAPI(response.project.revisionDate)
          penalty.value = response.project.isActivePenalty ? 'Evet' : 'Hayır'
          penaltyDate.value = formatDateFromAPI(response.project.penaltyDate)
          notes.value = response.project.projectNote || ''

          // Overall progress (from API if exists, else default)
          overallProgress.value = typeof response.project.overallProgress === 'number' ? response.project.overallProgress : 73

          // Remaining days based on shipment date
          const today = new Date()
          const shipment = response.project.shipmentDate ? new Date(response.project.shipmentDate) : null
          if (shipment) {
            const diff = Math.ceil((shipment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            remainingDays.value = Math.max(diff, 0)
          } else {
            remainingDays.value = 0
          }

          if (response.sectionMachine?.machineItems?.length) {
            machineItems.value = response.sectionMachine.machineItems
          } else {
            machineItems.value = []
          }

          if (response.sectionFilling?.fillingItems?.length) {
            fillingItems.value = response.sectionFilling.fillingItems
          } else {
            fillingItems.value = []
          }
        }
      } catch (e) {
        loadError.value = 'Proje detayları yüklenirken bir hata oluştu.'
      } finally {
        isLoading.value = false
      }
    }

    // Update project status
    const onUpdateProjectStatus = async (status) => {
      try {
        isUpdatingStatus.value = true
        const payload = status === 'shipped' ? { isShipped: true } : { isCompleted: true }
        await ApiService.put(`/Projects/${projectId.value}/status`, payload)
        await fetchProjectDetails()
      } catch (e) {
        // handle error silently or show notification
      } finally {
        isUpdatingStatus.value = false
      }
    }
    
    const handleSidebarCollapse = (collapsed) => {
      isSidebarCollapsed.value = collapsed
    }
    
    onMounted(() => { fetchProjectDetails() })
    
    return {
      isSidebarOpen,
      isSidebarCollapsed,
      handleSidebarCollapse,
      // content
      isLoading,
      loadError,
      fetchProjectDetails,
      projectData,
      projectNumber,
      projectName,
      country,
      city,
      orderDate,
      deliveryDate,
      revisionDate,
      penalty,
      penaltyDate,
      notes,
      sectionVisibility,
      toggleSection,
      apiBaseUrl,
      projectPdfFile,
      extraFileName,
      isUpdatingStatus,
      onUpdateProjectStatus,
      overallProgress,
      remainingDays,
      // expandable lists
      machineItems,
      fillingItems,
      showMachineItemDetails,
      showFillingItemDetails,
      activeItemIndex,
      toggleMachineItemDetails,
      toggleFillingItemDetails
    }
  }
}
</script>