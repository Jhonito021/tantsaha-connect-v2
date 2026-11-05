const STORAGE_KEYS = {
  JOURNAL: 'tantsaha_journal_entries_v2', // bumped to v2 for clean user-partitioned data
  REGION: 'tantsaha_selected_region_v1',
  LANG: 'tantsaha_language_v1',
  PERSONA: 'tantsaha_active_persona_v1',
  SOUND_ENABLED: 'tantsaha_sound_v1',
  GPS_AUTO: 'tantsaha_gps_auto_v1',
  GPS_COORDS: 'tantsaha_gps_coords_v1',
  USERS: 'tantsaha_registered_users_v2',
  CURRENT_USER: 'tantsaha_current_user_v2',
  THEME: 'tantsaha_theme_v1',
};

const DEFAULT_USERS = [
  {
    id: 'user-rakoto',
    name: 'Rakoto',
    phone: '034 12 345 67',
    pin: '1234',
    regionId: 'ambatondrazaka',
    regionNameMg: 'Alaotra-Mangoro (Ambatondrazaka)',
    regionNameFr: 'Alaotra-Mangoro (Ambatondrazaka)',
    mainCrop: 'vary',
    mainCropLabelMg: 'Vary (Makalioka)',
    mainCropLabelFr: 'Riz (Makalioka)',
    roleMg: 'Mpamboly vary (Riziculteur)',
    roleFr: 'Riziculteur',
    avatar: '🌾',
    experience: '45 taona · CEPE',
    registeredAt: 1730000000000,
  },
  {
    id: 'user-mbolatiana',
    name: 'Mbolatiana',
    phone: '032 98 765 43',
    pin: '1234',
    regionId: 'antsirabe',
    regionNameMg: 'Vakinankaratra (Antsirabe)',
    regionNameFr: 'Vakinankaratra (Antsirabe)',
    mainCrop: 'voatabia',
    mainCropLabelMg: 'Legioma & Voatabia',
    mainCropLabelFr: 'Maraîchage & Tomates',
    roleMg: 'Mpamokatra legioma (Maraîchère)',
    roleFr: 'Maraîchère',
    avatar: '🍅',
    experience: '31 taona · BEPC',
    registeredAt: 1730100000000,
  },
];

// Seed entries partitioned strictly per user
const INITIAL_ENTRIES = [
  // Rakoto's private farm entries (Riziculture Alaotra)
  {
    id: 'entry-rakoto-1',
    userId: 'user-rakoto',
    authorName: 'Rakoto',
    type: 'semis',
    cropId: 'vary',
    cropNameMg: 'Vary (Makalioka)',
    cropNameFr: 'Riz (Makalioka)',
    date: '2026-11-01',
    quantity: '2',
    unit: 'Sobika / Dobo',
    notes: 'Ketsa tanora SRI 10 andro amin\'ny tanimbary atsinanana. Rano mitsika tsara.',
    parcelName: 'Tanimbary Atsinanana (Alaotra)',
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'entry-rakoto-2',
    userId: 'user-rakoto',
    authorName: 'Rakoto',
    type: 'pluie',
    date: '2026-11-03',
    rainfallMm: 28,
    notes: 'Orana malefaka naharitra adiny telo. Ampy rano ny tanimbary rehetra.',
    parcelName: 'Lemaka Alaotra',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'entry-rakoto-3',
    userId: 'user-rakoto',
    authorName: 'Rakoto',
    type: 'recolte',
    cropId: 'vary',
    cropNameMg: 'Vary (Makalioka)',
    cropNameFr: 'Riz (Makalioka)',
    date: '2026-10-22',
    quantity: '35',
    unit: 'Gony (Sacs)',
    notes: 'Vokatra tsara kalitao avy amin\'ny tanimbary avaradrano.',
    parcelName: 'Tanimbary Avaratra',
    createdAt: Date.now() - 86400000 * 14,
  },

  // Mbolatiana's private farm entries (Maraîchage Vakinankaratra)
  {
    id: 'entry-mbolatiana-1',
    userId: 'user-mbolatiana',
    authorName: 'Mbolatiana',
    type: 'semis',
    cropId: 'voatabia',
    cropNameMg: 'Voatabia (Roma)',
    cropNameFr: 'Tomate (Roma)',
    date: '2026-10-28',
    quantity: '1',
    unit: 'Tari-doko (parcelle)',
    notes: 'Zana-boatabia nafindra amin\'ny tany efa nasiana zezika kintana sy tain\'omby.',
    parcelName: 'Saha Afovoany (Antsirabe)',
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'entry-mbolatiana-2',
    userId: 'user-mbolatiana',
    authorName: 'Mbolatiana',
    type: 'parasite',
    cropId: 'voatabia',
    cropNameMg: 'Voatabia',
    cropNameFr: 'Tomate',
    date: '2026-10-31',
    severity: 'mora',
    notes: 'Fisorohana aretina bobongolo (mildiou): nofafazana ranom-paraky natoraly.',
    parcelName: 'Saha Avaratra',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'entry-mbolatiana-3',
    userId: 'user-mbolatiana',
    authorName: 'Mbolatiana',
    type: 'recolte',
    cropId: 'tsaramaso',
    cropNameMg: 'Tsaramaso',
    cropNameFr: 'Haricot',
    date: '2026-10-25',
    quantity: '6',
    unit: 'Gony (Sacs)',
    notes: 'Vokatra voa maina tsara tsy misy bibikely na lavaka.',
    parcelName: 'Lemaka Katsaka sy Tsaramaso',
    createdAt: Date.now() - 86400000 * 11,
  },
  {
    id: 'entry-mbolatiana-4',
    userId: 'user-mbolatiana',
    authorName: 'Mbolatiana',
    type: 'pluie',
    date: '2026-11-02',
    rainfallMm: 16,
    notes: 'Orana malefaka maraina, tsara ho an\'ny legioma maitso.',
    parcelName: 'Saha Atsimo',
    createdAt: Date.now() - 86400000 * 3,
  },
];

export const storage = {
  // USER ACCOUNTS & AUTH
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users in localStorage', e);
    }
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    try {
      if (!user) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      } else {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to save current user', e);
    }
  },

  updateUser(userId, updates) {
    const users = this.getUsers().map((u) => {
      if (u.id === userId) {
        return { ...u, ...updates };
      }
      return u;
    });
    this.saveUsers(users);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedCurrent = { ...currentUser, ...updates };
      this.setCurrentUser(updatedCurrent);
      return updatedCurrent;
    }
    return null;
  },

  registerUser({
    name,
    phone = '',
    pin = '1234',
    regionId = 'ambatondrazaka',
    regionNameMg = 'Alaotra-Mangoro (Ambatondrazaka)',
    regionNameFr = 'Alaotra-Mangoro (Ambatondrazaka)',
    mainCrop = 'vary',
    mainCropLabelMg = 'Vary',
    mainCropLabelFr = 'Riz',
    roleMg = 'Mpamboly',
    roleFr = 'Agriculteur',
    avatar = '👨‍🌾',
  }) {
    const cleanName = (name || '').trim();
    const cleanPhone = (phone || '').replace(/\s+/g, ' ').trim();
    const cleanPin = (pin || '').trim();

    if (!cleanName) {
      return {
        success: false,
        errorMg: 'Ampidiro azafady ny anaranao!',
        errorFr: 'Veuillez renseigner votre nom!',
      };
    }

    if (cleanPin.length < 4) {
      return {
        success: false,
        errorMg: 'Ny kaody miafina (PIN) dia tokony hisy tarehimarika 4 farafahakeliny!',
        errorFr: 'Le code PIN doit comporter au moins 4 chiffres!',
      };
    }

    const users = this.getUsers();

    if (cleanPhone) {
      const existingPhone = users.find(
        (u) => u.phone && u.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')
      );
      if (existingPhone) {
        return {
          success: false,
          errorMg: 'Efa misy kaonty mampiasa io laharana finday io! Midira azafady.',
          errorFr: 'Ce numéro de téléphone est déjà associé à un compte. Veuillez vous connecter.',
        };
      }
    }

    const existingName = users.find(
      (u) => u.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (existingName) {
      return {
        success: false,
        errorMg: 'Efa misy kaonty manana io anarana io! Misafidiana anarana hafa na midira.',
        errorFr: 'Un compte avec ce nom existe déjà. Choisissez un autre nom ou connectez-vous.',
      };
    }

    const newUser = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: cleanName,
      phone: cleanPhone || 'Tsy misy',
      pin: cleanPin,
      regionId,
      regionNameMg,
      regionNameFr,
      mainCrop,
      mainCropLabelMg,
      mainCropLabelFr,
      roleMg,
      roleFr,
      avatar: avatar || '👨‍🌾',
      experience: 'Mpamboly vaovao voasoratra anarana',
      registeredAt: Date.now(),
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    // Automatically seed an initial private farm entry for this new farmer!
    const initialUserEntry = {
      id: 'entry-' + Date.now() + '-init',
      userId: newUser.id,
      authorName: newUser.name,
      type: 'semis',
      cropId: mainCrop,
      cropNameMg: mainCropLabelMg,
      cropNameFr: mainCropLabelFr,
      date: new Date().toISOString().split('T')[0],
      quantity: '1',
      unit: 'Parcelle / Dobo',
      notes: `Fambolena voalohany nosoratan'i ${newUser.name}. Vonona ny fambolena!`,
      parcelName: `Saha 1 (${regionNameMg.split('(')[0].trim()})`,
      createdAt: Date.now(),
    };

    const allEntries = this.getAllEntries();
    this.saveEntries([initialUserEntry, ...allEntries]);

    return {
      success: true,
      user: newUser,
    };
  },

  loginUser(identifier, pin) {
    const cleanId = (identifier || '').trim().toLowerCase().replace(/\s+/g, '');
    const cleanPin = (pin || '').trim();

    if (!cleanId) {
      return {
        success: false,
        errorMg: 'Ampidiro ny laharana finday na ny anaranao!',
        errorFr: 'Veuillez saisir votre numéro de téléphone ou votre nom!',
      };
    }

    const users = this.getUsers();
    const user = users.find((u) => {
      const uPhone = (u.phone || '').trim().toLowerCase().replace(/\s+/g, '');
      const uName = (u.name || '').trim().toLowerCase().replace(/\s+/g, '');
      return uPhone === cleanId || uName === cleanId;
    });

    if (!user) {
      return {
        success: false,
        errorMg: 'Tsy hita io kaonty io. Hamarino tsara na hisoratra anarana vaovao!',
        errorFr: 'Compte introuvable. Vérifiez vos identifiants ou inscrivez-vous!',
      };
    }

    if (user.pin && cleanPin !== user.pin) {
      return {
        success: false,
        errorMg: 'Diso ny kaody miafina (PIN)! Manandrama indray.',
        errorFr: 'Code PIN incorrect! Veuillez réessayer.',
      };
    }

    this.setCurrentUser(user);
    return {
      success: true,
      user,
    };
  },

  logoutUser() {
    this.setCurrentUser(null);
  },

  // JOURNAL ENTRIES - STRICT DATA ISOLATION PER USER
  getAllEntries() {
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

  // Returns ONLY the private entries belonging to the specified user
  getUserEntries(userId) {
    const all = this.getAllEntries();
    if (!userId) {
      const current = this.getCurrentUser();
      userId = current?.id || 'user-rakoto';
    }
    return all.filter((entry) => entry.userId === userId);
  },

  // Legacy method now defaults to current user's private data
  getEntries(userId = null) {
    return this.getUserEntries(userId);
  },

  saveEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  },

  addEntry(entry, currentUser = null) {
    const allEntries = this.getAllEntries();
    const user = currentUser || this.getCurrentUser();
    const targetUserId = user?.id || 'user-rakoto';
    const targetAuthorName = user?.name || 'Tantsaha';

    const newEntry = {
      ...entry,
      id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      userId: targetUserId,
      authorName: targetAuthorName,
      createdAt: Date.now(),
    };

    allEntries.unshift(newEntry);
    this.saveEntries(allEntries);
    return newEntry;
  },

  deleteEntry(id) {
    const allEntries = this.getAllEntries().filter((e) => e.id !== id);
    this.saveEntries(allEntries);
  },

  clearAllEntries() {
    localStorage.removeItem(STORAGE_KEYS.JOURNAL);
  },

  resetToDemo() {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(INITIAL_ENTRIES));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    this.setCurrentUser(DEFAULT_USERS[0]);
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

  getTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn('Failed to save theme in localStorage', e);
    }
  },
};
