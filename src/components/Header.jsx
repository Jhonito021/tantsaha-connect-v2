import React from 'react';
import { FontAwesomeIcon, ICONS } from './FontAwesomeIcons.jsx';
import { PERSONAS } from '../data/farmingData.js';
import { audioEngine } from '../utils/audioVoice.js';

export const Header = ({
  language,
  onLanguageChange,
  activePersona,
  onPersonaChange,
  soundEnabled,
  onToggleSound,
  isGpsActive = false,
  isGeolocating = false,
  onTriggerGps,
}) => {
  const currentPersona = PERSONAS.find((p) => p.id === activePersona) || PERSONAS[0];

  const handleSpeakWelcome = () => {
    const text =
      language === 'mg'
        ? `Tongasoa eto amin'ny Tantsaha Connect, fampiharana ho anao tantsaha malagasy. Toetrandro, bokin'ny fambolena, fampitandremana ary torohevitra am-peo.`
        : `Bienvenue sur Tantsaha Connect de Jhonito. Météo locale, journal de culture, alertes et conseils agricoles en audio malagasy.`;
    audioEngine.speakText(text, 'Tongasoa', language);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 w-full max-w-full overflow-hidden">
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

          {/* Quick Actions (Audio, Lang, Sound) */}
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

        {/* Persona Switcher Strip (Fits smoothly without stretching the page) */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-stone-100">
          {/* Persona selector pills */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => {
                onPersonaChange('rakoto');
                audioEngine.playChime('click');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activePersona === 'rakoto'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="mr-1">🌾</span>
              <span>Rakoto</span>
            </button>
            <button
              onClick={() => {
                onPersonaChange('mbolatiana');
                audioEngine.playChime('click');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activePersona === 'mbolatiana'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="mr-1">🍅</span>
              <span>Mbolatiana</span>
            </button>
          </div>

          {/* Persona context & GPS / offline badge */}
          <div className="flex items-center gap-2 min-w-0 shrink-0">
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
