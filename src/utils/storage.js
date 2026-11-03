const STORAGE_KEYS = {
  JOURNAL: 'tantsaha_journal_entries_v1',
  REGION: 'tantsaha_selected_region_v1',
  LANG: 'tantsaha_language_v1',
  PERSONA: 'tantsaha_active_persona_v1',
  SOUND_ENABLED: 'tantsaha_sound_v1',
  GPS_AUTO: 'tantsaha_gps_auto_v1',
  GPS_COORDS: 'tantsaha_gps_coords_v1',
};

const INITIAL_ENTRIES = [
  {
    id: 'entry-seed-1',
    type: 'semis',
    cropId: 'vary',
    cropNameMg: 'Vary (Makalioka)',
    cropNameFr: 'Riz (Makalioka)',
    date: '2026-11-01',
    quantity: '2',
    unit: 'Sobika / Dobo',
    notes: 'Ketsa tanora SRI 10 andro eny amin\'ny tanimbary atsinanana.',
    parcelName: 'Tanimbary Atsinanana',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'entry-seed-2',
    type: 'semis',
    cropId: 'voatabia',
    cropNameMg: 'Voatabia',
    cropNameFr: 'Tomate',
    date: '2026-10-28',
    quantity: '1',
    unit: 'Tari-doko (parcelle)',
    notes: 'Zana-boatabia nafindra amin\'ny tany efa nasiana zezika kintana.',
    parcelName: 'Saha Afovoany',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'entry-seed-3',
    type: 'pluie',
    date: '2026-11-02',
    rainfallMm: 24,
    notes: 'Orana mikija nandritra ny adim-pamantaranandro 2. Rano ampy tsara.',
    parcelName: 'Toerana rehetra',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'entry-seed-4',
    type: 'parasite',
    cropId: 'voatabia',
    cropNameMg: 'Voatabia',
    cropNameFr: 'Tomate',
    date: '2026-10-30',
    severity: 'mora',
    notes: 'Misy olitra kely amin\'ny ravina. Nofafazana ranom-paraky natoraly.',
    parcelName: 'Saha Avaratra',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'entry-seed-5',
    type: 'recolte',
    cropId: 'tsaramaso',
    cropNameMg: 'Tsaramaso',
    cropNameFr: 'Haricot',
    date: '2026-10-25',
    quantity: '4',
    unit: 'Gony (Sacs)',
    notes: 'Vokatra tsara kalitao, voa maina tsara tsy misy bibikely.',
    parcelName: 'Lemaka Katsaka sy Tsaramaso',
    createdAt: Date.now() - 86400000 * 8,
  },
];

export const storage = {
  getEntries() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(INITIAL_ENTRIES));
        return INITIAL_ENTRIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ENTRIES;
    }
  },

  saveEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  },

  addEntry(entry) {
    const entries = this.getEntries();
    const newEntry = {
      ...entry,
      id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now(),
    };
    entries.unshift(newEntry);
    this.saveEntries(entries);
    return newEntry;
  },

  deleteEntry(id) {
    const entries = this.getEntries().filter((e) => e.id !== id);
    this.saveEntries(entries);
  },

  clearAllEntries() {
    localStorage.removeItem(STORAGE_KEYS.JOURNAL);
  },

  resetToDemo() {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(INITIAL_ENTRIES));
  },

  getSelectedRegion() {
    return localStorage.getItem(STORAGE_KEYS.REGION) || 'ambatondrazaka';
  },

  setSelectedRegion(regionId) {
    localStorage.setItem(STORAGE_KEYS.REGION, regionId);
  },

  getLanguage() {
    const lang = localStorage.getItem(STORAGE_KEYS.LANG);
    return lang === 'fr' ? 'fr' : 'mg';
  },

  setLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  },

  getActivePersona() {
    const p = localStorage.getItem(STORAGE_KEYS.PERSONA);
    if (p === 'rakoto' || p === 'mbolatiana') return p;
    return 'rakoto';
  },

  setActivePersona(persona) {
    localStorage.setItem(STORAGE_KEYS.PERSONA, persona);
  },

  isSoundEnabled() {
    const s = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return s !== 'false';
  },

  setSoundEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(enabled));
  },

  isGpsAutoEnabled() {
    const val = localStorage.getItem(STORAGE_KEYS.GPS_AUTO);
    // Defaults to true so auto-geolocation is on by default
    return val !== 'false';
  },

  setGpsAutoEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.GPS_AUTO, String(enabled));
  },

  getLastGpsCoords() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.GPS_COORDS);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  setLastGpsCoords(coords) {
    try {
      localStorage.setItem(STORAGE_KEYS.GPS_COORDS, JSON.stringify(coords));
    } catch (e) {
      console.warn('Failed to save GPS coords', e);
    }
  },
};
