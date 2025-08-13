/**
 * Project.js
 * Proje veri modelini temsil eder
 */

export class Project {
  constructor() {
    // Ana veri bölümleri
    this.projeSection = {
      number: '',
      name: '',
      firmaAdi: '',
      firma2: '',
      ulke: '',
      sehir: '',
      siparisTarihi: '',
      projeOlusturmaTarihi: '',
      sevkTarihi: '',
      revizeSevkTarihi: '',
      cezaiSartDate: '',
      cezaiSart: false,
      projeNotu: '',
      seriNo: '',
      notes: '',
      pdfFileName: '',
      pdfFile: null,
      extraPdfFileName: ''
    }
    
    this.makineSection = {
      kesmeTipi: '',
      kesmeType: '',
      kesmeTipiItems: [], // Tracks the cutting type items with counts
      kesmeNotlari: '',
      isiPlakasi: '',
      model: '',
      altModel: '',
      customModel: '',
      pushType: '', // İtme Tipi field
      selectedKesmeTipi: [],
      vakum: false,
      gaz: false,
      kapasite: '',
      gozSayisi: '',
      plc: '',
      ekranBoyutu: '',
      frekans: '',
      gerilim: '',
      makineBoyutu: '',
      hatve: '',
      dinamikAlanlar: {}, // This will store all dynamic fields for kalıp details
      moldCount: '',
      moldCountInput: '',
      moldCountProduct: 0,
      vurusDkMin: '',
      vurusDkMax: '',
      kapasiteMin: '',
      kapasiteMax: '',
      ictenIce: '',
      distanDisa: '',
      yukseklik: '',
      yaglama: '',
      makineNotlari: '',
      selectedProducts: [],
      manualFillingArea: '',
      manuelDolumAlani: ''
    }

    this.dolumSection = {
      dolum: false,
      dolumSayisi: '',
      uniteSayisi: '',
      urunTipiTanecikli: false,
      partikulOlcusu: '',
      urunSicakligi: '',
      urunMiktari: '',
      urunYapisi: '',
      urunSpektleri: '',
      dolumTipi: '',
      dolumHareketi: '',
      dolumKonumu: '',
      dolumUnitesiYeri: '',
      servisArabasi: false,
      dolumNotlari: '',
      filling: '',
      dinamikAlanlar: {} // Store dynamic fields for multiple filling units
    }

    this.altFolyoSection = {
      altFolyoYumusak: {
        isAvailable: false,
        foilTypeName: '',
        foilThickness: '',
        foilWidth: '',
        foilSupply: '',
        uv: false,
        webCleaningAntistatic: false
      },
      altFolyoSert: {
        isAvailable: false,
        foilTypeName: '',
        foilThickness: '',
        foilWidth: '',
        foilSupply: '',
        uv: false,
        webCleaningAntistatic: false
      },
      foilNotes: ''
    }

    this.ustFolyoSection = {
      ustFolyo: false,
      ustFolyoCesidi: '',
      selectedUstFolyoCesidi: [],
      ustFolyoKalinlik: '',
      ustFolyoEni: '',
      ustFolyoTipi: '',
      ustFolyoWebCleaning: false,
      ustFolyoUV: false,
      ustFolyoAntistatik: false,
      ustFolyoNotlar: '',
      ustFolyoTedarik: '',
      topFoil: '',
      uvUstFolyo: false,
      antistaticUstFolyo: false
    }

    this.hijyenSection = {
      sterilHavaFiltresi: '',
      hepa: false,
      ultraClean: false,
      cipFull: false,
      cipInOut: false,
      sip: false,
      hijyenNotlari: '',
      steril: false,
      cip: false,
      filtre: ''
    }

    this.hatSonuSection = {
      yazici: false,
      terazi: false,
      teraziNotlari: '',
      robotTipi: '',
      robotModeli: '',
      koliAcma: false,
      koliKapatma: false,
      hatSonuNotlari: '',
      robot: false,
      boxOpen: false,
      boxClose: false,
      etiketUnitesi: false,
      boxMachine: false
    }

    this.aksesuarSection = {
      vakumPompasiTipi: '',
      vakumPompasiModeli: '',
      vakumPompasiSayisi: {}, // Tracks the count for each model
      vakumPompasiX2: {}, // Tracks which vacuum pump models are set to X2
      selectedVakumModelleri: [], // Selected vacuum pump models
      selectedStickerUnitesi: [], // Selected sticker units
      selectedTravers: [],
      folyoArabasi: false,
      kalipDegistirmeArabasi: false,
      panoKlimasi: false,
      kirmiziPompa: false,
      yerdeFireSarma: false,
      kompresor: false,
      suTutucuFiltre: false,
      chiller: '',
      travers: '',
      aksesuarNotlari: '',
      vakumPompasi: '',
      vakumPompasiBool: false,
      uv: false,
      yaglama: '',
      webCleaning: false,
      antistatik: false
    }
    
    this.paketlemeSection = {
      palet: false,
      standart: false,
      sandik: false,
      nemOnleyici: false,
      yuklemeSekli: '',
      teslimatSekli: '',
      paketlemeNotlari: '',
      standartPaketleme: false,
      sandikPaketleme: false
    }
    
    this.ekstraSection = {
      digerNotlar: '',
      extraPdfFile: null,
      product: '',
      gramaj: '',
      urunTipi: ''
    }

    // Geriye dönük uyumluluk için eski alanlar
    this.legacyFields = {
      deliveryDate: '',
      elektrik: '',
      volt: '',
      kesme: '',
      sekilVerme: '',
      yapistirma: '',
      penaltyDate: '',
      penaltyClause: false,
      projectNote: ''
    }

    // Geriye dönük uyumluluk için temel getter/setter metodları
    this._setupBasicAccessors()
  }

  /**
   * Temel erişim metodlarını tanımlar
   * @private
   */
  _setupBasicAccessors() {
    // Yaygın kullanılan özellikler için doğrudan erişim sağlar
    
    // ProjeSection
    Object.defineProperty(this, 'firmaAdi', {
      get: function() { return this.projeSection.firmaAdi },
      set: function(value) { this.projeSection.firmaAdi = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'firma2', {
      get: function() { return this.projeSection.firma2 },
      set: function(value) { this.projeSection.firma2 = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'ulke', {
      get: function() { return this.projeSection.ulke },
      set: function(value) { this.projeSection.ulke = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'sehir', {
      get: function() { return this.projeSection.sehir },
      set: function(value) { this.projeSection.sehir = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'siparisTarihi', {
      get: function() { return this.projeSection.siparisTarihi },
      set: function(value) { this.projeSection.siparisTarihi = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'sevkTarihi', {
      get: function() { return this.projeSection.sevkTarihi },
      set: function(value) { this.projeSection.sevkTarihi = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'revizeSevkTarihi', {
      get: function() { return this.projeSection.revizeSevkTarihi },
      set: function(value) { this.projeSection.revizeSevkTarihi = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'cezaiSart', {
      get: function() { return this.projeSection.cezaiSart },
      set: function(value) { this.projeSection.cezaiSart = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'cezaiSartDate', {
      get: function() { return this.projeSection.cezaiSartDate },
      set: function(value) { this.projeSection.cezaiSartDate = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'seriNo', {
      get: function() { return this.projeSection.seriNo },
      set: function(value) { this.projeSection.seriNo = value },
      enumerable: true
    })
    
    // MakineSection
    Object.defineProperty(this, 'kesmeTipi', {
      get: function() { return this.makineSection.kesmeTipi },
      set: function(value) { this.makineSection.kesmeTipi = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'model', {
      get: function() { return this.makineSection.model },
      set: function(value) { this.makineSection.model = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'altModel', {
      get: function() { return this.makineSection.altModel },
      set: function(value) { this.makineSection.altModel = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'frekans', {
      get: function() { return this.makineSection.frekans },
      set: function(value) { this.makineSection.frekans = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'gerilim', {
      get: function() { return this.makineSection.gerilim },
      set: function(value) { this.makineSection.gerilim = value },
      enumerable: true
    })
    
    // DolumSection
    Object.defineProperty(this, 'dolumTipi', {
      get: function() { return this.dolumSection.dolumTipi },
      set: function(value) { this.dolumSection.dolumTipi = value },
      enumerable: true
    })
    
    Object.defineProperty(this, 'dolumHareketi', {
      get: function() { return this.dolumSection.dolumHareketi },
      set: function(value) { this.dolumSection.dolumHareketi = value },
      enumerable: true
    })
    
    // AksesuarSection
    Object.defineProperty(this, 'vakumPompasiTipi', {
      get: function() { return this.aksesuarSection.vakumPompasiTipi },
      set: function(value) { this.aksesuarSection.vakumPompasiTipi = value },
      enumerable: true
    })
    
    // Diğer yaygın kullanılan özellikler için de tanımlanabilir
  }

  /**
   * Özellik erişimi için genel metod
   * @param {string} propName - Özellik adı
   * @param {string} sectionName - Bölüm adı
   * @returns {*} Özellik değeri
   */
  getProp(propName, sectionName) {
    if (sectionName && this[sectionName] && propName in this[sectionName]) {
      return this[sectionName][propName]
    }
    
    // Bölüm belirtilmemişse tüm bölümlerde ara
    const sections = ['projeSection', 'makineSection', 'dolumSection', 'altFolyoSection', 
                     'ustFolyoSection', 'hijyenSection', 'hatSonuSection', 'aksesuarSection', 
                     'paketlemeSection', 'ekstraSection']
    
    for (const section of sections) {
      if (this[section] && propName in this[section]) {
        return this[section][propName]
      }
    }
    
    return undefined
  }
  
  /**
   * Özellik değiştirme için genel metod
   * @param {string} propName - Özellik adı
   * @param {*} value - Yeni değer
   * @param {string} sectionName - Bölüm adı
   * @returns {boolean} İşlem başarılı mı
   */
  setProp(propName, value, sectionName) {
    if (sectionName && this[sectionName] && propName in this[sectionName]) {
      this[sectionName][propName] = value
      return true
    }
    
    // Bölüm belirtilmemişse tüm bölümlerde ara
    const sections = ['projeSection', 'makineSection', 'dolumSection', 'altFolyoSection', 
                     'ustFolyoSection', 'hijyenSection', 'hatSonuSection', 'aksesuarSection', 
                     'paketlemeSection', 'ekstraSection']
    
    for (const section of sections) {
      if (this[section] && propName in this[section]) {
        this[section][propName] = value
        return true
      }
    }
    
    return false
  }

  /**
   * Projeyi API formatında döndürür
   * @returns {Object} API formatında proje verisi
   */
  toApiFormat() {
    // Burada tüm bölümleri bir araya getirip API'ye uygun formatta döndürme işlemini yapacağız
    return {
      projeSection: this.projeSection,
      makineSection: this.makineSection,
      dolumSection: this.dolumSection,
      altFolyoSection: this.altFolyoSection,
      ustFolyoSection: this.ustFolyoSection,
      hijyenSection: this.hijyenSection,
      hatSonuSection: this.hatSonuSection,
      aksesuarSection: this.aksesuarSection,
      paketlemeSection: this.paketlemeSection,
      ekstraSection: this.ekstraSection
    }
  }

  /**
   * Projeyi sıfırlar/temizler
   */
  resetProject() {
    // Yeni boş bir proje örneği oluştur
    const newProject = new Project()
    
    // Tüm bölümleri kopyala
    Object.keys(newProject).forEach(key => {
      if (typeof newProject[key] === 'object' && newProject[key] !== null) {
        this[key] = JSON.parse(JSON.stringify(newProject[key]))
      } else {
        this[key] = newProject[key]
      }
    })
  }
}

export default Project