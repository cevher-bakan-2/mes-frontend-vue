// Dropdown Data and Relationship Maps
// Bu dosya, add-project.html'deki dropdown menulerinin verilerini ve ilişki haritalarını içerir.

// Machine type -> models mapping
export const machineTypeModels = {
  'Termoform': [
    'Bpt-P Series',
    'Bpt-Y Series',
    'Bpt-Y IML Series',
    'Bpt-S Series',
    'Bpt Complete Line & High Capacity'
  ],
  'Zincirli': [
    'Bpz Series',
    'Joy Box Line',
    'Medical Series'
  ],
  'Hazır Kap': [
    'Bph-S Lineer'
  ]
}

// Model -> products mapping
export const modelProducts = {
  // Termoform models
  'Bpt-P Series': ['Bal', 'Reçel', 'Ketçap', 'Mayonez', 'Krem Peynir', 'Sos', 'Domates Sosu', 'Wasabi Sos',
    'Soya Sosu', 'Marmelat', 'Tahin', 'Tahin-Pekmez', 'Hurma Şurubu', 'Sıvı Yağ', 'Tereyağ',
    'Margarin', 'Çokokrem'],
  'Bpt-Y Series': ['Yoğurt', 'Meyveli Yoğurt', 'Quark', 'Krem Peynir', 'Puding', 'Bebek Maması'],
  'Bpt-Y IML Series': ['Yoğurt', 'Meyveli Yoğurt', 'Quark', 'Krem Peynir', 'Puding', 'Bebek Maması'],
  'Bpt-S Series': ['Su', 'Limonata'],
  'Bpt Complete Line & High Capacity': ['Su', 'Limonata', 'Ketçap', 'Mayonez', 'Yoğurt'],

  // Zincirli models
  'Bpz Series': ['Et', 'Balık', 'Tavuk', 'Salam', 'Sosis', 'Sucuk', 'Peynir', 'Krem Peynir', 'Unlu Mamüller', 'Yufka', 'Buz Kalıbı',
    'Kahvaltı Seti', 'Tereyağ', 'Zeytin', 'Hazır Yemek', 'Sandviç', 'Mantı', 'Döner', 'Çiğköfte', 'Turşu', 'Helva', 'Hurma',
    'Tatlı Grubu', 'Kadayıf', 'Sütlü Tatlılar', 'Süt Burger', 'Puf Grubu', 'Çikolata', 'Grissini Çikolata', 'Çerez'],
  'Joy Box Line': ['Sürpriz Yumurta'],
  'Medical Series': ['Şırınga', 'İğne', 'İmplant', 'Kateter', 'Gazlı Bez', 'Ameliyat Önlüğü'],

  // Hazır Kap models
  'Bph-S Lineer': ['Puding', 'Profiterol', 'Peynir', 'Yoğurt', 'Quark', 'Sütlü Tatlı', 'Hazır Yemek', 'Çorba', 'Kahve', 'Zeytin', 'Hurma', 'Meyve']
}

// Model -> Alt Model mapping
export const modelAltModels = {
  'Bpt-P Series': ['Bpt-JR', 'Bpt-P 20/80', 'Bpt-P 25/50', 'Bpt-P 25/75', 'Bpt-P 25/100', 'Bpt-P 25/125'],
  'Bpt-Y Series': ['Bpt-Y 20/30', 'Bpt-P 25/30', 'Bpt-Y 25/40', 'Bpt-Y 25/45'],
  'Bpt-Y IML Series': ['Bpt-Y 20/30', 'Bpt-P 25/30', 'Bpt-Y 25/40', 'Bpt-Y 25/45'],
  'Bpt-S Series': ['Bpt-S 25/50', 'Bpt-S 25/75', 'Bpt-S 25/100'],
  'Bpt Complete Line & High Capacity': ['Bpt-S 25/100'],
  'Bpz Series': ['Bpz-JR', 'Z-105', 'Bpz 400', 'Bpz 400 Max'],
  'Joy Box Line': ['Bpz 400+Bph', 'Bpz 400 Max+Bph'],
  'Medical Series': ['Z 105 Medical', 'Bpz-JR Medical', 'Bpz 400 Medical', 'Bpz400 Max Medical'],
  'Bph-S Lineer': ['Bph-S1-Lineer', 'Bph-S2-Lineer', 'Bph-S3-Lineer', 'Bph-S4-Lineer', 'Bph-S5-Lineer',
    'Bph-S6-Lineer', 'Bph-S7-Lineer', 'Bph-S8-Lineer', 'Bph-S9-Lineer', 'Bph-S10-Lineer']
}

// Kesme Tipi options based on machine type
export const getKesmeTipiOptions = (machineType) => {
  if (machineType === 'Termoform') {
    return [
      { value: 'Köşe Kırma Kesme', label: 'Köşe Kırma Kesme' },
      { value: 'Kalıp Kesme', label: 'Kalıp Kesme' },
      { value: 'Perfore Kesme', label: 'Perfore Kesme' },
      { value: 'Diger', label: 'Diğer' }
    ]
  } else if (machineType === 'Zincirli') {
    return [
      { value: 'Yumuşak Punch Kesme', label: 'Yumuşak Punch Kesme' },
      { value: 'Yumuşak EuroHole Kesme', label: 'Yumuşak EuroHole Kesme' },
      { value: 'Sert Erkek-Dişi Kesme', label: 'Sert Erkek-Dişi Kesme'},
      { value: 'Sert Enine Perfore Kesme', label: 'Sert Enine Perfore Kesme'},
      { value: 'Sert Boyuna Perfore Kesme', label: 'Sert Boyuna Perfore Kesme'},
      { value: 'Yumuşak Boyuna Perfore Kesme', label: 'Yumuşak Boyuna Perfore Kesme'},
      { value: 'Köşe Kırma Kesme', label: 'Köşe Kırma Kesme'},
      { value: 'Yumuşak Motorlu Şekilli Kesme', label: 'Yumuşak Motorlu Şekilli Kesme'},
      { value: 'Enine Sert Kesme', label: 'Enine Sert Kesme'},
      { value: 'Enine Yumuşak Kesme', label: 'Enine Yumuşak Kesme'},
      { value: 'Enine Sabit Sert Kesme', label: 'Enine Sabit Sert Kesme'},
      { value: 'Enine Harektli (Pnömatik) Kesme', label: 'Enine Harektli (Pnömatik) Kesme'},
      { value: 'Enine Hareketli (Servo) Sert Kesme', label: 'Enine Hareketli (Servo) Sert Kesme'},
      { value: 'Boyuna Yumuşak Kesme', label: 'Boyuna Yumuşak Kesme'},
      { value: 'Diger', label: 'Diğer' }
    ]
  } else if (machineType === 'Hazır Kap') {
    return [
      { value: 'Kap Magazini', label: 'Kap Magazini' },
      { value: 'Pul Magazini', label: 'Pul Magazini' },
      { value: 'Kapak Magazini', label: 'Kapak Magazini' },
      { value: 'Pul\'dan Yapıştırma', label: 'Pul\'dan Yapıştırma'},
      { value: 'Rulo\'dan Yapıştırma ve Kesme', label: 'Rulo\'dan Yapıştırma ve Kesme'},
      { value: 'Diger', label: 'Diğer' }
    ]
  } else {
    return []
  }
}

// Vakum Pompası Modeli options based on type
export const getVakumPompasiModelOptions = (type) => {
  if (type === 'DVP') {
    return [
      { value: "25m³", label: "25m³" },
      { value: "63m³", label: "63m³" },
      { value: "100m³", label: "100m³" },
      { value: "150m³", label: "150m³" },
      { value: "200m³", label: "200m³" },
      { value: "300m³", label: "300m³" },
      { value: "Booster 500m3/h.", label: "Booster 500m3/h."}
    ]
  } else if (type === 'BUSCH') {
    return [
      { value: "63", label: "63" },
      { value: "100", label: "100" },
      { value: "165", label: "165" },
      { value: "205", label: "205" },
      { value: "255", label: "255" },
      { value: "305", label: "305" },
      { value: "Booster 500m3/h.", label: "Booster 500m3/h."}
    ]
  }
  return []
}

// Travers options
export const traversOptions = [
  { value: 'Tek Eksen Tek Kafa', label: 'Tek Eksen Tek Kafa' },
  { value: 'Tek Eksen Çift Kafa', label: 'Tek Eksen Çift Kafa' },
  { value: 'Çift Eksen Tek Kafa', label: 'Çift Eksen Tek Kafa' },
  { value: 'Çift Eksen Çift Kafa', label: 'Çift Eksen Çift Kafa' }
]

// İtme Tipi options
export const pushTypeOptions = [
  { value: 'Hareketli', label: 'Hareketli' },
  { value: 'Tel İle', label: 'Tel İle' }
]

// Alt Folyo Yumuşak options - Default
export const altFolyoYumusakOptions = [
  { value: "pvc", label: "PVC" },
  { value: "bops", label: "BOPS" },
  { value: "pet", label: "PET" },
  { value: "apet", label: "APET" },
  { value: "rpet", label: "RPET" },
  { value: "pp", label: "PP" },
  { value: "ps", label: "PS" }
]

// Alt Folyo Yumuşak options - Zincirli makine tipi için
export const zincirliAltFolyoYumusakOptions = [
  { value: "pa-pe", label: "PA-PE" },
  { value: "pa-evoh-pe", label: "PA+EVOH-PE" }
]

// Alt Folyo Sert options - Default
export const altFolyoSertOptions = [
  { value: "pvc", label: "PVC" },
  { value: "bops", label: "BOPS" },
  { value: "pet", label: "PET" },
  { value: "apet", label: "APET" },
  { value: "rpet", label: "RPET" },
  { value: "pp", label: "PP" },
  { value: "ps", label: "PS" }
]

// Alt Folyo Sert options - Zincirli makine tipi için
export const zincirliAltFolyoSertOptions = [
  { value: "pet", label: "PET" },
  { value: "pvc", label: "PVC" },
  { value: "ps", label: "PS" },
  { value: "pet-evoh-pe", label: "PET+EVOH+PE" },
  { value: "pvc-evoh-pe", label: "PVC+EVOH+PE" }
]

// Alt Folyo Sert options - Termoform makine tipi için
export const termoformAltFolyoSertOptions = [
  { value: "pet", label: "PET" },
  { value: "pvc", label: "PVC" },
  { value: "ps", label: "PS" },
  { value: "pet-evoh-pe", label: "PET+EVOH+PE" },
  { value: "pvc-evoh-pe", label: "PVC+EVOH+PE" }
]

// Üst Folyo options
export const ustFolyoOptions = [
  { value: "PVC", label: "PVC" },
  { value: "BOPS", label: "BOPS" },
  { value: "PET", label: "PET" },
  { value: "APET", label: "APET" },
  { value: "RPET", label: "RPET" },
  { value: "PP", label: "PP" },
  { value: "PS", label: "PS" },
  { value: "Kompozit", label: "Kompozit" },
  { value: "Aliminyum", label: "Aliminyum" },
  { value: "Kağıt", label: "Kağıt" }
]

// Function to get Alt Folyo Yumuşak options based on machine type
export const getAltFolyoYumusakOptions = (machineType) => {
  if (machineType === 'Zincirli') {
    return zincirliAltFolyoYumusakOptions
  } else {
    return altFolyoYumusakOptions
  }
}

// Function to get Alt Folyo Sert options based on machine type
export const getAltFolyoSertOptions = (machineType) => {
  if (machineType === 'Zincirli') {
    return zincirliAltFolyoSertOptions
  } else if (machineType === 'Termoform') {
    return termoformAltFolyoSertOptions
  } else {
    return altFolyoSertOptions
  }
}