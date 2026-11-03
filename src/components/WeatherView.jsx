import React from 'react';
import { FontAwesomeIcon, ICONS, getWeatherIcon } from './FontAwesomeIcons.jsx';
import { REGIONS_DATA } from '../data/farmingData.js';
import { audioEngine } from '../utils/audioVoice.js';

export const WeatherView = ({
  weather,
  selectedRegionId,
  onSelectRegion,
  language,
  onRefresh,
  isLoading = false,
  isGeolocating = false,
  isGpsActive = false,
  gpsError = null,
  gpsCoords = null,
  onTriggerGps,
}) => {
  const handleSpeakDay = (day, label) => {
    const text = language === 'mg' ? day.audioTextMg : day.farmingAdviceFr;
    audioEngine.speakText(text, label, language);
  };

  const handleSpeakFullReport = () => {
    const text =
      language === 'mg'
        ? `${weather.today.audioTextMg} Tolo-kevitra ho an'ny fambolena: ${weather.today.farmingAdviceMg}`
        : `Météo à ${weather.nameFr}. Température ${weather.today.tempMax} degrés. Conseil agricole : ${weather.today.farmingAdviceFr}`;
    audioEngine.speakText(text, `Toetrandro: ${weather.nameMg}`, language);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8 w-full max-w-full overflow-hidden">
      {/* 1. Header with Auto-GPS & Region Selector */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-stone-200 shadow-xs w-full space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {language === 'mg' ? 'Toerana & Faritra fambolena' : 'Emplacement & Zone agricole'}
          </label>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading || isGeolocating}
              className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <FontAwesomeIcon
                icon={ICONS.arrowsRotate}
                className={isLoading ? 'animate-spin' : ''}
              />
              <span>{language === 'mg' ? 'Havaozy (API)' : 'Actualiser'}</span>
            </button>
          )}
        </div>

        {/* Dedicated GPS Auto-Detection Banner */}
        <div
          className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isGpsActive
              ? 'bg-emerald-50 border-emerald-600 shadow-xs'
              : 'bg-stone-50 border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 text-base shadow-xs ${
                isGpsActive
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-emerald-700 border border-stone-200'
              }`}
            >
              <FontAwesomeIcon
                icon={ICONS.crosshairs}
                className={isGeolocating ? 'animate-spin text-amber-300' : ''}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-stone-900">
                  {language === 'mg'
                    ? 'Géolocalisation automatique (GPS)'
                    : 'Géolocalisation automatique (GPS)'}
                </span>
                {isGpsActive && (
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.2 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>{language === 'mg' ? 'Mavitrika izao' : 'Actif'}</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5">
                {isGpsActive
                  ? language === 'mg'
                    ? `Toerana marina: ${weather.nameMg}`
                    : `Position détectée: ${weather.nameFr}`
                  : language === 'mg'
                  ? 'Fantaro ny toetrandro marina eo amin\'ny taninao avy hatrany'
                  : 'Détecte automatiquement la météo exacte sur votre parcelle'}
              </p>
            </div>
          </div>

          <button
            onClick={onTriggerGps}
            disabled={isGeolocating}
            className={`w-full sm:w-auto h-9 sm:h-10 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0 ${
              isGpsActive
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
            }`}
          >
            <FontAwesomeIcon
              icon={ICONS.crosshairs}
              className={isGeolocating ? 'animate-spin text-amber-300' : ''}
            />
            <span>
              {isGeolocating
                ? language === 'mg' ? 'Mitady GPS...' : 'Détection GPS...'
                : isGpsActive
                ? language === 'mg' ? 'Havaozy ny GPS' : 'Recalculer GPS'
                : language === 'mg' ? 'Hikaroka toerana GPS' : 'Localiser ma position'}
            </span>
          </button>
        </div>

        {gpsError && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <FontAwesomeIcon icon={ICONS.alert} className="shrink-0 text-amber-600" />
            <span className="min-w-0 truncate">{gpsError}</span>
          </div>
        )}

        {/* Agricultural Granaries Quick Selector Grid */}
        <div>
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
            {language === 'mg' ? 'Na safidio ny lemaka fambolena' : 'Ou choisir un bassin agricole'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {REGIONS_DATA.map((reg) => {
              const isSelected = !isGpsActive && reg.id === selectedRegionId;
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    onSelectRegion(reg.id);
                    audioEngine.playChime('click');
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all min-w-0 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-stone-900 shadow-xs ring-1 ring-emerald-600'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                    <FontAwesomeIcon
                      icon={ICONS.location}
                      className={`shrink-0 ${isSelected ? 'text-emerald-700' : 'text-stone-400'}`}
                    />
                    <span className="truncate">
                      {language === 'mg'
                        ? reg.nameMg.split('(')[1]?.replace(')', '') || reg.nameMg
                        : reg.nameFr.split('(')[1]?.replace(')', '') || reg.nameFr}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 truncate mt-0.5">
                    {reg.nameMg.split('(')[0].trim()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Today's Giant Hero Weather Card */}
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 sm:space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  {language === 'mg' ? 'Toetrandro Androany' : 'Météo d’Aujourd’hui'}
                </span>
                {isGpsActive ? (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-400/40 flex items-center gap-1">
                    <FontAwesomeIcon icon={ICONS.crosshairs} className="text-[9px]" />
                    <span>GPS Mivantana</span>
                  </span>
                ) : weather.isLive ? (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>API Mivantana</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-white/10 text-stone-300">
                    {language === 'mg' ? 'Hors-ligne' : 'Hors-ligne'}
                  </span>
                )}
              </div>

              <h2 className="font-display text-lg sm:text-2xl font-black text-white mt-1 truncate">
                {language === 'mg' ? weather.nameMg : weather.nameFr}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-emerald-200/80 truncate">
                <span className="truncate">{weather.granaryType}</span>
                {weather.lastUpdated && (
                  <>
                    <span>·</span>
                    <span className="font-mono text-[10px] sm:text-[11px] text-emerald-300 shrink-0">
                      {weather.lastUpdated}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleSpeakFullReport}
              className="h-10 sm:h-12 px-3 sm:px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg active:scale-95 transition-all shrink-0"
              title="Henoy ny toetrandro am-peo"
            >
              <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-sm sm:text-base shrink-0" />
              <span>{language === 'mg' ? 'Henoy' : 'Écouter'}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 py-1 sm:py-2">
            <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl text-amber-300 shadow-inner shrink-0">
              <FontAwesomeIcon icon={getWeatherIcon(weather.today.condition)} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-display text-4xl sm:text-6xl font-black tabular-nums tracking-tight">
                  {weather.today.tempMax}°
                </span>
                <span className="text-lg sm:text-2xl font-bold text-emerald-300/80 tabular-nums">
                  / {weather.today.tempMin}°C
                </span>
              </div>
              <div className="text-xs sm:text-base font-semibold text-emerald-100 mt-0.5 truncate">
                {weather.today.condition === 'sunny'
                  ? language === 'mg' ? 'Masoandro mamiratra' : 'Plein soleil'
                  : weather.today.condition === 'rainy'
                  ? language === 'mg' ? 'Orana malefaka' : 'Pluie / Averses'
                  : weather.today.condition === 'storm'
                  ? language === 'mg' ? 'Tselatra sy varatra' : 'Orage / Fortes pluies'
                  : language === 'mg' ? 'Rahona sy masoandro' : 'Éclaircies'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-2 border-t border-white/15 w-full">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 text-center">
              <div className="text-blue-300 text-sm sm:text-base mb-0.5">
                <FontAwesomeIcon icon={ICONS.droplet} />
              </div>
              <div className="text-base sm:text-lg font-black tabular-nums">{weather.today.rainChance}%</div>
              <div className="text-[10px] text-emerald-200">
                {language === 'mg' ? 'Orana' : 'Pluie'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 text-center">
              <div className="text-amber-300 text-sm sm:text-base mb-0.5">
                <FontAwesomeIcon icon={ICONS.temp} />
              </div>
              <div className="text-base sm:text-lg font-black tabular-nums">{weather.today.humidity}%</div>
              <div className="text-[10px] text-emerald-200">
                {language === 'mg' ? 'Hamandoana' : 'Humidité'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 text-center">
              <div className="text-teal-300 text-sm sm:text-base mb-0.5">
                <FontAwesomeIcon icon={ICONS.wind} />
              </div>
              <div className="text-base sm:text-lg font-black tabular-nums">{weather.today.windSpeed}</div>
              <div className="text-[10px] text-emerald-200">km/h</div>
            </div>
          </div>

          <div className="bg-emerald-950/80 rounded-2xl p-3 sm:p-3.5 border border-emerald-700/60 flex items-start gap-2.5 sm:gap-3 w-full">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs sm:text-sm">
              <FontAwesomeIcon icon={ICONS.seedling} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                {language === 'mg' ? 'Torohevitra momba ny fambolena' : 'Conseil agricole'}
              </div>
              <p className="text-xs sm:text-sm text-stone-100 font-medium mt-0.5">
                {language === 'mg' ? weather.today.farmingAdviceMg : weather.today.farmingAdviceFr}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 2-Day to 3-Day Forecast Cards */}
      <section className="space-y-2.5 sm:space-y-3 w-full">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
            {language === 'mg' ? 'Vinavina andro manaraka' : 'Prévisions des jours suivants'}
          </h3>
          <span className="text-[11px] text-stone-500 font-medium">
            {language === 'mg' ? '+2 ka hatramin\'ny 3 andro' : '+2 à 3 jours'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 w-full">
          {weather.forecast.map((day, idx) => (
            <div
              key={day.date}
              className="bg-white rounded-3xl p-3.5 sm:p-4 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-all w-full"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-xl">
                    {language === 'mg' ? day.dayNameMg : day.dayNameFr}
                  </span>
                  <button
                    onClick={() => handleSpeakDay(day, `${day.dayNameMg}`)}
                    className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center active:scale-95 transition-all"
                    title="Henoy ity andro ity"
                  >
                    <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-xs" />
                  </button>
                </div>

                <div className="flex items-center gap-3 my-2.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl sm:text-3xl shadow-xs shrink-0">
                    <FontAwesomeIcon icon={getWeatherIcon(day.condition)} />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-stone-900 tabular-nums">
                      {day.tempMax}°C
                    </div>
                    <div className="text-[11px] text-stone-500 font-semibold">
                      {day.tempMin}°C maraina · {day.rainChance}% orana
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-700 font-medium bg-stone-50 p-2 sm:p-2.5 rounded-xl border border-stone-100">
                  {language === 'mg' ? day.farmingAdviceMg : day.farmingAdviceFr}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                <span>{idx === 0 ? (language === 'mg' ? 'Rahampitso' : 'Demain') : `${idx + 1} andro`}</span>
                <span className="text-emerald-700 font-bold">
                  {day.rainChance < 40 ? '✓ Tsara fiasana' : '⚠️ Miomàna orana'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
