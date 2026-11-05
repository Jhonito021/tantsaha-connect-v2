import React from 'react';
import { FontAwesomeIcon, ICONS, getCropIcon, getWeatherIcon } from './FontAwesomeIcons.jsx';
import { audioEngine } from '../utils/audioVoice.js';

export const HomeView = ({
  weather,
  alerts,
  recentEntries,
  language,
  isGpsActive = false,
  isGeolocating = false,
  onTriggerGps,
  currentUser = null,
  onOpenAuthModal,
  onNavigate,
  onOpenNewEntry,
}) => {
  const redAlert = alerts.find((a) => a.level === 'rouge') || alerts[0];

  const handleSpeakWeather = () => {
    const text = language === 'mg' ? weather.today.audioTextMg : weather.today.farmingAdviceFr;
    audioEngine.speakText(text, language === 'mg' ? `Toetrandro: ${weather.nameMg}` : `Météo: ${weather.nameFr}`, language);
  };

  const handleSpeakAlert = () => {
    const text = language === 'mg' ? redAlert.audioScriptMg : redAlert.messageFr;
    audioEngine.speakText(text, language === 'mg' ? `Loza: ${redAlert.titleMg}` : `Alerte: ${redAlert.titleFr}`, language);
  };

  return (
    <div className="space-y-3.5 sm:space-y-5 pb-6 w-full max-w-full overflow-hidden">
      {/* 0. FARMER PROFILE WELCOME STRIP */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-stone-200 shadow-xs flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl shrink-0 border border-emerald-200 shadow-xs">
            {currentUser?.avatar || '👨‍🌾'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-stone-900 truncate">
                {language === 'mg' ? `Miarahaba, ${currentUser?.name || 'Tantsaha'} !` : `Bonjour, ${currentUser?.name || 'Agriculteur'} !`}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded-full shrink-0">
                {currentUser ? (language === 'mg' ? 'Voasoratra' : 'Connecté') : (language === 'mg' ? 'Mpamangy' : 'Visiteur')}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5">
              {currentUser?.roleMg || (language === 'mg' ? 'Tsindrio hidirana na hisoratana anarana' : 'Connectez-vous ou créez votre compte')}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuthModal}
          className="h-8.5 sm:h-9 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 transition-all"
        >
          <FontAwesomeIcon icon={currentUser ? ICONS.user : ICONS.login} className="text-xs" />
          <span className="hidden xs:inline">
            {currentUser ? (language === 'mg' ? 'Kaontiko' : 'Mon profil') : (language === 'mg' ? 'Miditra' : 'Connexion')}
          </span>
        </button>
      </div>
      {/* 1. MÉTÉO SNAPSHOT WIDGET */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden w-full">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Giant Weather Pictogram */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl sm:text-4xl text-amber-300 shadow-inner shrink-0">
              <FontAwesomeIcon icon={getWeatherIcon(weather.today.condition)} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-300 uppercase tracking-wider truncate max-w-[150px]">
                  {weather.nameMg.split('(')[0].trim()}
                </span>
                <span className="text-emerald-400">·</span>
                <span className="text-[11px] sm:text-xs text-emerald-200">
                  {language === 'mg' ? weather.today.dayNameMg : weather.today.dayNameFr}
                </span>
                {isGpsActive ? (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-400/40 flex items-center gap-1 shrink-0">
                    <FontAwesomeIcon icon={ICONS.crosshairs} className="text-[8px]" />
                    <span>GPS</span>
                  </span>
                ) : onTriggerGps ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerGps();
                    }}
                    disabled={isGeolocating}
                    className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/20 flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                    title={language === 'mg' ? 'Hikaroka toerana GPS' : 'Localiser par GPS'}
                  >
                    <FontAwesomeIcon
                      icon={ICONS.crosshairs}
                      className={`text-[8px] ${isGeolocating ? 'animate-spin text-amber-300' : ''}`}
                    />
                    <span>GPS</span>
                  </button>
                ) : weather.isLive ? (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>API</span>
                  </span>
                ) : null}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
                  {weather.today.tempMax}°C
                </span>
                <span className="text-xs sm:text-sm text-emerald-300/90 font-medium">
                  {weather.today.tempMin}°C
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium truncate mt-0.5">
                {language === 'mg' ? weather.today.farmingAdviceMg : weather.today.farmingAdviceFr}
              </p>
            </div>
          </div>

          {/* Quick Audio & 3-Day details triggers */}
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/15 w-full md:w-auto">
            <button
              onClick={handleSpeakWeather}
              className="flex-1 md:flex-none h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all truncate"
              title="Henoy ny toetrandro"
            >
              <FontAwesomeIcon icon={ICONS.volumeHigh} className="shrink-0" />
              <span className="truncate">{language === 'mg' ? 'Henoy ny toetrandro' : 'Écouter météo'}</span>
            </button>
            <button
              onClick={() => onNavigate('weather')}
              className="h-10 sm:h-11 px-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shrink-0"
            >
              <span>{language === 'mg' ? '3 andro' : '3 jours'}</span>
              <FontAwesomeIcon icon={ICONS.chevronRight} className="text-xs" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. EMERGENCY ALERT STRIP */}
      {redAlert && (
        <section
          onClick={() => onNavigate('alerts')}
          className="cursor-pointer bg-red-50 hover:bg-red-100/80 border-2 border-red-300 rounded-2xl p-3.5 sm:p-4 transition-all shadow-xs w-full"
        >
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 text-base shadow-xs">
                <FontAwesomeIcon icon={ICONS.alert} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                    {language === 'mg' ? 'Loza mena' : 'Alerte'}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium truncate">{redAlert.region}</span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-900 mt-0.5 truncate">
                  {language === 'mg' ? redAlert.titleMg : redAlert.titleFr}
                </h3>
                <p className="text-[11px] text-stone-700 mt-0.5 line-clamp-1">
                  {language === 'mg' ? redAlert.actionRequiredMg : redAlert.actionRequiredFr}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeakAlert();
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-200/80 hover:bg-red-300 text-red-900 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              title="Henoy ny fampitandremana"
            >
              <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-xs sm:text-sm" />
            </button>
          </div>
        </section>
      )}

      {/* 3. FOUR GIANT TOUCH TILES */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="font-display text-sm sm:text-base font-bold text-stone-900">
            {language === 'mg' ? 'Fizarana lehibe' : 'Espaces Principaux'}
          </h2>
          <span className="text-[11px] text-stone-500 font-medium">
            {language === 'mg' ? 'Tsindrio ny sary' : 'Touchez une icône'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
          {/* Tile 1: Météo */}
          <button
            onClick={() => onNavigate('weather')}
            className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 border-stone-200/80 hover:border-amber-400 hover:shadow-md active:scale-98 transition-all text-center min-h-[120px] sm:min-h-[140px] w-full min-w-0"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl sm:text-3xl mb-2 shadow-xs shrink-0">
              <FontAwesomeIcon icon={ICONS.sun} />
            </div>
            <span className="font-display font-extrabold text-sm sm:text-base text-stone-900 truncate w-full">
              {language === 'mg' ? 'Toetrandro' : 'Météo'}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium mt-0.5 truncate w-full">
              {language === 'mg' ? 'Masoandro sy orana' : 'Prévisions locales'}
            </span>
          </button>

          {/* Tile 2: Journal / Carnet */}
          <button
            onClick={() => onNavigate('journal')}
            className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 border-stone-200/80 hover:border-emerald-500 hover:shadow-md active:scale-98 transition-all text-center min-h-[120px] sm:min-h-[140px] w-full min-w-0"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl sm:text-3xl mb-2 shadow-xs shrink-0">
              <FontAwesomeIcon icon={ICONS.book} />
            </div>
            <span className="font-display font-extrabold text-sm sm:text-base text-stone-900 truncate w-full">
              {language === 'mg' ? 'Bokin\'ny fambolena' : 'Journal'}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium mt-0.5 truncate w-full">
              {language === 'mg' ? 'Semis, Fijinjana' : 'Suivi cultures'}
            </span>
          </button>

          {/* Tile 3: Alertes */}
          <button
            onClick={() => onNavigate('alerts')}
            className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 border-stone-200/80 hover:border-red-400 hover:shadow-md active:scale-98 transition-all text-center min-h-[120px] sm:min-h-[140px] w-full min-w-0"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl sm:text-3xl mb-2 shadow-xs shrink-0">
              <FontAwesomeIcon icon={ICONS.alert} />
            </div>
            <span className="font-display font-extrabold text-sm sm:text-base text-stone-900 truncate w-full">
              {language === 'mg' ? 'Fampitandremana' : 'Alertes'}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium mt-0.5 truncate w-full">
              {language === 'mg' ? 'Mena, mavo, maintso' : 'Risques & Urgences'}
            </span>
          </button>

          {/* Tile 4: Conseils & Audio */}
          <button
            onClick={() => onNavigate('advice')}
            className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 border-stone-200/80 hover:border-blue-400 hover:shadow-md active:scale-98 transition-all text-center min-h-[120px] sm:min-h-[140px] w-full min-w-0"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl sm:text-3xl mb-2 shadow-xs shrink-0">
              <FontAwesomeIcon icon={ICONS.earListen} />
            </div>
            <span className="font-display font-extrabold text-sm sm:text-base text-stone-900 truncate w-full">
              {language === 'mg' ? 'Torohevitra am-peo' : 'Conseils Audio'}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium mt-0.5 truncate w-full">
              {language === 'mg' ? 'SRI, Komposta, Paraky' : 'Guides audio'}
            </span>
          </button>
        </div>
      </section>

      {/* 4. PRIMARY BIG CTA BUTTON */}
      <div className="pt-0.5 w-full">
        <button
          onClick={onOpenNewEntry}
          className="w-full h-13 sm:h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/15 active:scale-98 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-base shrink-0">
            <FontAwesomeIcon icon={ICONS.plus} />
          </div>
          <span className="truncate">{language === 'mg' ? 'Hampiditra asa vaovao' : 'Noter une observation'}</span>
        </button>
      </div>

      {/* 5. RECENT ENTRIES SNIPPET */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs w-full overflow-hidden">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <FontAwesomeIcon icon={ICONS.calendar} className="text-emerald-700 shrink-0" />
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
              {language === 'mg' ? 'Asa farany voasoratra' : 'Activités récentes'}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('journal')}
            className="text-xs font-bold text-emerald-800 hover:underline shrink-0 ml-2"
          >
            {language === 'mg' ? 'Hijery rehetra' : 'Voir tout'}
          </button>
        </div>

        {recentEntries.length === 0 ? (
          <p className="text-xs text-stone-500 py-3 text-center">
            {language === 'mg' ? 'Mbola tsy misy asa voasoratra.' : 'Aucune observation enregistrée.'}
          </p>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentEntries.slice(0, 3).map((entry) => {
              const cropIcon = getCropIcon(entry.cropId || '');
              return (
                <div key={entry.id} className="py-2.5 flex items-center justify-between gap-2.5 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 text-base shrink-0">
                      <FontAwesomeIcon
                        icon={entry.type === 'pluie' ? ICONS.droplet : cropIcon}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-stone-900 capitalize truncate">
                          {entry.type === 'semis'
                            ? language === 'mg' ? 'Famafazana' : 'Semis'
                            : entry.type === 'recolte'
                            ? language === 'mg' ? 'Fijinjana' : 'Récolte'
                            : entry.type === 'parasite'
                            ? language === 'mg' ? 'Bibikely' : 'Parasite'
                            : language === 'mg' ? 'Orana' : 'Pluie'}
                        </span>
                        {entry.cropNameMg && (
                          <span className="text-[11px] text-stone-500 font-medium truncate">
                            · {language === 'mg' ? entry.cropNameMg : entry.cropNameFr}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        <span>{entry.date}</span>
                        {entry.parcelName && <span> · {entry.parcelName}</span>}
                      </div>
                    </div>
                  </div>

                  {entry.quantity && (
                    <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-lg shrink-0">
                      {entry.quantity} {entry.unit}
                    </span>
                  )}
                  {entry.rainfallMm && (
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg shrink-0">
                      {entry.rainfallMm} mm
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
