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

// Demo accounts removed - only genuine user accounts are stored
const DEFAULT_USERS = [];
const INITIAL_ENTRIES = [];

export const storage = {
  // USER ACCOUNTS & AUTH
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      // Purge demo accounts (Rakoto & Mbolatiana) if still present in storage
      const cleaned = parsed.filter(
        (u) => u && u.id !== 'user-rakoto' && u.id !== 'user-mbolatiana'
      );
      if (cleaned.length !== parsed.length) {
        this.saveUsers(cleaned);
      }
      return cleaned;
    } catch {
      return [];
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
        const user = JSON.parse(data);
        if (user && (user.id === 'user-rakoto' || user.id === 'user-mbolatiana')) {
          this.setCurrentUser(null);
          return null;
        }
        return user;
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
        return [];
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      // Purge demo entries
      const cleaned = parsed.filter(
        (entry) =>
          entry &&
          entry.userId !== 'user-rakoto' &&
          entry.userId !== 'user-mbolatiana'
      );
      if (cleaned.length !== parsed.length) {
        this.saveEntries(cleaned);
      }
      return cleaned;
    } catch {
      return [];
    }
  },

  // Returns ONLY the private entries belonging to the specified user
  getUserEntries(userId) {
    const all = this.getAllEntries();
    if (!userId) {
      const current = this.getCurrentUser();
      userId = current?.id;
    }
    if (!userId) return [];
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
    const targetUserId = user?.id || ('user-' + Date.now());
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

  clearCurrentUserEntries(userId) {
    if (!userId) return;
    const allEntries = this.getAllEntries().filter((e) => e.userId !== userId);
    this.saveEntries(allEntries);
  },

  resetToDemo() {
    // Demo accounts have been removed - clears entries cleanly
    this.clearAllEntries();
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
