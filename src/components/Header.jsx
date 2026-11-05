import React from 'react';
import { FontAwesomeIcon, ICONS } from './FontAwesomeIcons.jsx';
import { audioEngine } from '../utils/audioVoice.js';

export const Header = ({
  language,
  onLanguageChange,
  soundEnabled,
  onToggleSound,
  isDarkMode = false,
  onToggleTheme,
  isGpsActive = false,
  isGeolocating = false,
  onTriggerGps,
  currentUser = null,
  onOpenAuthModal,
}) => {

  const handleSpeakWelcome = () => {
    const text =
      language === 'mg'
        ? `Tongasoa eto amin'ny Tantsaha Connect, fampiharana ho anao tantsaha malagasy. Toetrandro, bokin'ny fambolena, fampitandremana ary torohevitra am-peo.`
        : `Bienvenue sur Tantsaha Connect de Jhonito. Météo locale, journal de culture, alertes et conseils agricoles en audio malagasy.`;
    audioEngine.speakText(text, 'Tongasoa', language);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 w-full max-w-full overflow-hidden transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2">
        {/* Main Row: Brand + Essential Controls */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Brand Lockup (Compact and responsive) */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
              <FontAwesomeIcon icon={ICONS.seedling} className="text-lg sm:text-xl" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-stone-900 leading-tight truncate">
                  Tantsaha Connect
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded shrink-0">
                  Jhonito
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-none truncate hidden xs:block">
                {language === 'mg' ? 'Fampiharana ho an\'ny tantsaha' : 'App des agriculteurs'}
              </p>
            </div>
          </div>

          {/* Quick Actions (Audio, Lang, Theme, Sound) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Audio Voice Welcome */}
            <button
              onClick={handleSpeakWelcome}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 active:scale-95 transition-all"
              title={language === 'mg' ? 'Henoy ny fanazavana' : 'Écouter la présentation'}
              aria-label="Henoy ny fanazavana"
            >
              <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-sm sm:text-base" />
            </button>

            {/* Language Switcher (Compact MG/FR) */}
            <button
              onClick={() => {
                const next = language === 'mg' ? 'fr' : 'mg';
                onLanguageChange(next);
                audioEngine.playChime('click');
              }}
              className="h-9 sm:h-10 px-2 sm:px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 flex items-center gap-1 active:scale-95 transition-colors"
              title="Hanova ny fiteny / Changer de langue"
            >
              <span className={language === 'mg' ? 'text-emerald-700 font-extrabold' : 'text-stone-400'}>MG</span>
              <span className="text-stone-300">/</span>
              <span className={language === 'fr' ? 'text-emerald-700 font-extrabold' : 'text-stone-400'}>FR</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all active:scale-95 ${
                isDarkMode
                  ? 'bg-amber-400/20 text-amber-300 border-amber-500/40 hover:bg-amber-400/30'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
              }`}
              title={
                isDarkMode
                  ? (language === 'mg' ? 'Hiverina amin\'ny mazava' : 'Passer en mode clair')
                  : (language === 'mg' ? 'Hamadika ho maizina (Mode sombre)' : 'Passer en mode sombre')
              }
              aria-label="Mode sombre / Mode clair"
            >
              <FontAwesomeIcon icon={isDarkMode ? ICONS.sun : ICONS.moon} className="text-xs sm:text-sm" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-colors ${
                soundEnabled
                  ? 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200'
                  : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
              }`}
              title={soundEnabled ? 'Atsaharo ny feo' : 'Alefaso ny feo'}
              aria-label="Alefaso / Atsaharo ny feo"
            >
              <FontAwesomeIcon icon={soundEnabled ? ICONS.volumeHigh : ICONS.volumeOff} className="text-xs sm:text-sm" />
            </button>
          </div>
        </div>

        {/* User Account Bar & Quick Controls Strip */}
        <div className="flex items-center justify-between gap-1.5 mt-2 pt-1.5 border-t border-stone-100 min-w-0">
          {/* User Account Button (Tap to open Login/Register/Profile) */}
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={() => {
                onOpenAuthModal?.();
                audioEngine.playChime('click');
              }}
              className="h-7.5 px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all min-w-0"
              title={language === 'mg' ? 'Kaonty sy fisoratana anarana' : 'Compte et profil'}
            >
              <span className="text-sm shrink-0">{currentUser?.avatar || '👨‍🌾'}</span>
              <span className="truncate max-w-[95px] sm:max-w-[130px] font-extrabold text-stone-900">
                {currentUser?.name || (language === 'mg' ? 'Miditra' : 'Connexion')}
              </span>
              <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full shrink-0">
                {currentUser ? (language === 'mg' ? 'Kaonty' : 'Profil') : (language === 'mg' ? 'Miditra' : 'Connexion')}
              </span>
            </button>
          </div>

          {/* GPS button & Offline badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onTriggerGps && (
              <button
                onClick={onTriggerGps}
                disabled={isGeolocating}
                className={`h-7 px-2 rounded-lg text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 transition-all border shrink-0 ${
                  isGpsActive
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs ring-1 ring-emerald-500'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                }`}
                title={language === 'mg' ? 'Hikaroka toerana GPS' : 'Localiser par GPS'}
                aria-label="Localisation GPS"
              >
                <FontAwesomeIcon
                  icon={ICONS.crosshairs}
                  className={`text-xs ${
                    isGeolocating
                      ? 'animate-spin text-amber-500'
                      : isGpsActive
                      ? 'text-amber-300'
                      : 'text-emerald-700'
                  }`}
                />
                <span className="truncate">
                  {isGeolocating
                    ? (language === 'mg' ? 'GPS...' : 'GPS...')
                    : isGpsActive
                    ? (language === 'mg' ? 'GPS mavitrika' : 'GPS actif')
                    : 'GPS'}
                </span>
              </button>
            )}

            <div className="hidden xs:flex items-center gap-1.5 text-[11px] text-stone-500 truncate min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="truncate font-medium">
                {language === 'mg' ? 'Hors-ligne' : 'Hors-ligne'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
