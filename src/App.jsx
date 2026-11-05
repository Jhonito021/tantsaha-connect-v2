import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { AudioPlayerBar } from './components/AudioPlayerBar.jsx';
import { HomeView } from './components/HomeView.jsx';
import { WeatherView } from './components/WeatherView.jsx';
import { JournalView } from './components/JournalView.jsx';
import { AlertsView } from './components/AlertsView.jsx';
import { AdviceView } from './components/AdviceView.jsx';
import { NewEntryModal } from './components/NewEntryModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { AuthScreen } from './components/AuthScreen.jsx';
import { storage } from './utils/storage.js';
import { audioEngine } from './utils/audioVoice.js';
import { ALERTS_DATA, REGIONS_DATA } from './data/farmingData.js';
import {
  fetchLiveRegionWeather,
  fetchLiveWeatherByCoords,
  getCurrentCoordinates,
  getLastSavedCoordinates,
} from './services/weatherService.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [language, setLanguage] = useState(() => storage.getLanguage());
  const [activePersona, setActivePersona] = useState(() =>
    storage.getActivePersona()
  );
  const [selectedRegionId, setSelectedRegionId] = useState(() =>
    storage.getSelectedRegion()
  );
  const [soundEnabled, setSoundEnabled] = useState(() => storage.isSoundEnabled());
  const [theme, setTheme] = useState(() => storage.getTheme());

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Private per-user journal entries
  const [entries, setEntries] = useState(() =>
    storage.getUserEntries(storage.getCurrentUser()?.id)
  );

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState('semis');

  // Live OpenWeatherMap data state
  const [liveWeather, setLiveWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Automatic GPS Geolocation states
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [gpsCoords, setGpsCoords] = useState(() => storage.getLastGpsCoords());
  const hasAttemptedAutoGps = useRef(false);

  // Sync state changes with LocalStorage
  useEffect(() => {
    storage.setLanguage(language);
  }, [language]);

  useEffect(() => {
    storage.setActivePersona(activePersona);
  }, [activePersona]);

  useEffect(() => {
    storage.setSelectedRegion(selectedRegionId);
  }, [selectedRegionId]);

  useEffect(() => {
    storage.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Sync theme changes with DOM and LocalStorage
  useEffect(() => {
    storage.setTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load weather by preset region
  const loadRegionWeather = useCallback(async (regionId) => {
    setIsWeatherLoading(true);
    try {
      const res = await fetchLiveRegionWeather(regionId);
      if (res && res.weather) {
        setLiveWeather(res.weather);
        setIsGpsActive(false);
        setGpsError(null);
      }
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  // Geolocation trigger function (automatic or user click)
  const handleTriggerGeolocation = useCallback(
    async (isAutomatic = false) => {
      setIsGeolocating(true);
      setGpsError(null);

      if (!isAutomatic) {
        audioEngine.playChime('click');
      }

      try {
        const coords = await getCurrentCoordinates();
        setGpsCoords(coords);
        storage.setLastGpsCoords(coords);

        setIsWeatherLoading(true);
        const res = await fetchLiveWeatherByCoords(coords.lat, coords.lon);

        if (res && res.weather) {
          setLiveWeather(res.weather);
          setIsGpsActive(true);
          setSelectedRegionId('gps_current');

          if (!isAutomatic) {
            audioEngine.playChime('success');
            const cityName = res.weather.nameMg || 'toerana misy anao';
            const speakMsg =
              language === 'mg'
                ? `Voaray soa aman-tsara ny toetrandro amin'ny toerana misy anao ao ${cityName}.`
                : `Position GPS détectée. Météo locale chargée avec succès.`;
            audioEngine.speakConfirmation(speakMsg);
          }
        }
      } catch (err) {
        console.warn('Geolocation failed or denied:', err.message);
        setGpsError(err.message);
        setIsGpsActive(false);

        // If automatic on mount failed, silently fallback to chosen region
        if (isAutomatic) {
          await loadRegionWeather(selectedRegionId);
        } else {
          audioEngine.playChime('alert');
          const errMsg =
            language === 'mg'
              ? 'Tsy nahazoana alalana ny GPS. Nampiasa ny faritra mahazatra.'
              : 'Impossible d’accéder au GPS. Retour à la zone par défaut.';
          audioEngine.speakConfirmation(errMsg);
        }
      } finally {
        setIsGeolocating(false);
        setIsWeatherLoading(false);
      }
    },
    [language, selectedRegionId, loadRegionWeather]
  );

  // Automatic Geolocation on startup
  useEffect(() => {
    if (hasAttemptedAutoGps.current) return;
    hasAttemptedAutoGps.current = true;

    if (storage.isGpsAutoEnabled() && 'geolocation' in navigator) {
      handleTriggerGeolocation(true);
    } else {
      loadRegionWeather(selectedRegionId);
    }
  }, [handleTriggerGeolocation, loadRegionWeather, selectedRegionId]);

  const defaultRegion =
    REGIONS_DATA.find((r) => r.id === selectedRegionId) || REGIONS_DATA[0];
  const activeWeather = liveWeather || defaultRegion;

  const handleSelectRegion = (regId) => {
    setSelectedRegionId(regId);
    setIsGpsActive(false);
    loadRegionWeather(regId);
    if (currentUser) {
      storage.updateUser(currentUser.id, { regionId: regId });
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    audioEngine.playChime('click');
  };

  const handleUserChange = (newUser) => {
    setCurrentUser(newUser);
    if (newUser) {
      setEntries(storage.getUserEntries(newUser.id));
      if (newUser.regionId) {
        setSelectedRegionId(newUser.regionId);
        setIsGpsActive(false);
        loadRegionWeather(newUser.regionId);
      }
      if (newUser.id === 'user-rakoto') {
        setActivePersona('rakoto');
      } else if (newUser.id === 'user-mbolatiana') {
        setActivePersona('mbolatiana');
      }
    } else {
      setEntries([]);
    }
  };

  const handlePersonaChange = (newPersona) => {
    setActivePersona(newPersona);
    setIsGpsActive(false);
    if (newPersona === 'rakoto') {
      setSelectedRegionId('ambatondrazaka');
      loadRegionWeather('ambatondrazaka');
      const found = storage.getUsers().find((u) => u.id === 'user-rakoto');
      if (found) {
        setCurrentUser(found);
        storage.setCurrentUser(found);
        setEntries(storage.getUserEntries(found.id));
      }
      audioEngine.speakConfirmation(
        language === 'mg'
          ? 'Miarahaba anao Rakoto, mpamboly vary ao Alaotra-Mangoro.'
          : 'Bienvenue Rakoto, riziculteur en Alaotra-Mangoro.'
      );
    } else {
      setSelectedRegionId('antsirabe');
      loadRegionWeather('antsirabe');
      const found = storage.getUsers().find((u) => u.id === 'user-mbolatiana');
      if (found) {
        setCurrentUser(found);
        storage.setCurrentUser(found);
        setEntries(storage.getUserEntries(found.id));
      }
      audioEngine.speakConfirmation(
        language === 'mg'
          ? 'Miarahaba anao Mbolatiana, mpamokatra legioma ao Vakinankaratra.'
          : 'Bienvenue Mbolatiana, maraîchère en Vakinankaratra.'
      );
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      audioEngine.playChime('click');
    } else {
      audioEngine.stopAudio();
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    audioEngine.playChime('click');
    const msg =
      language === 'mg'
        ? (nextTheme === 'dark' ? 'Lohahevitra maizina mavitrika.' : 'Lohahevitra mazava mavitrika.')
        : (nextTheme === 'dark' ? 'Mode sombre activé.' : 'Mode clair activé.');
    audioEngine.speakConfirmation(msg);
  };

  const handleRefreshWeather = async () => {
    audioEngine.playChime('click');
    if (isGpsActive && gpsCoords) {
      setIsWeatherLoading(true);
      try {
        const res = await fetchLiveWeatherByCoords(gpsCoords.lat, gpsCoords.lon);
        if (res && res.weather) {
          setLiveWeather(res.weather);
        }
      } finally {
        setIsWeatherLoading(false);
      }
    } else {
      await loadRegionWeather(selectedRegionId);
    }
    audioEngine.playChime('success');
  };

  const handleOpenNewModalWithType = (type) => {
    setModalInitialType(type);
    setIsNewModalOpen(true);
    audioEngine.playChime('click');
  };

  const handleSaveEntry = (newEntryData) => {
    storage.addEntry(newEntryData, currentUser);
    setEntries(storage.getUserEntries(currentUser?.id));
  };

  const handleDeleteEntry = (id) => {
    storage.deleteEntry(id);
    setEntries(storage.getUserEntries(currentUser?.id));
    audioEngine.playChime('alert');
  };

  const handleResetDemo = () => {
    storage.resetToDemo();
    const curr = storage.getCurrentUser();
    setCurrentUser(curr);
    setEntries(storage.getUserEntries(curr?.id));
    audioEngine.playChime('success');
  };

  if (!currentUser) {
    return (
      <AuthScreen
        onLoginSuccess={handleUserChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isDarkMode={theme === 'dark'}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#0c120f] flex flex-col text-stone-900 dark:text-stone-100 pb-20 md:pb-8 selection:bg-emerald-600 selection:text-white w-full max-w-full overflow-x-hidden transition-colors">
      {/* 1. Accessible Top App Bar */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        activePersona={activePersona}
        onPersonaChange={handlePersonaChange}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isDarkMode={theme === 'dark'}
        onToggleTheme={handleToggleTheme}
        isGpsActive={isGpsActive}
        isGeolocating={isGeolocating}
        onTriggerGps={() => handleTriggerGeolocation(false)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 2. Main View Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 pt-3 sm:pt-6 overflow-hidden">
        {currentTab === 'home' && (
          <HomeView
            weather={activeWeather}
            alerts={ALERTS_DATA}
            recentEntries={entries}
            language={language}
            isGpsActive={isGpsActive}
            isGeolocating={isGeolocating}
            onTriggerGps={() => handleTriggerGeolocation(false)}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              audioEngine.playChime('click');
            }}
            onOpenNewEntry={() => handleOpenNewModalWithType('semis')}
          />
        )}

        {currentTab === 'weather' && (
          <WeatherView
            weather={activeWeather}
            selectedRegionId={selectedRegionId}
            onSelectRegion={handleSelectRegion}
            language={language}
            onRefresh={handleRefreshWeather}
            isLoading={isWeatherLoading}
            isGeolocating={isGeolocating}
            isGpsActive={isGpsActive}
            gpsError={gpsError}
            gpsCoords={gpsCoords}
            onTriggerGps={() => handleTriggerGeolocation(false)}
          />
        )}

        {currentTab === 'journal' && (
          <JournalView
            entries={entries}
            onOpenNewModalWithType={handleOpenNewModalWithType}
            onDeleteEntry={handleDeleteEntry}
            onResetDemo={handleResetDemo}
            language={language}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView alerts={ALERTS_DATA} language={language} />
        )}

        {currentTab === 'advice' && <AdviceView language={language} />}
      </main>

      {/* 3. Floating Voice Narration Audio Player Bar */}
      <AudioPlayerBar language={language} />

      {/* 4. Fixed Thumb-zone Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          audioEngine.playChime('click');
        }}
        language={language}
        unreadAlertCount={1}
      />

      {/* 5. Observation Recording Modal */}
      <NewEntryModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSaveEntry}
        language={language}
        initialType={modalInitialType}
        currentUser={currentUser}
      />

      {/* 6. Authentication & Farmer Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        language={language}
      />
    </div>
  );
}
