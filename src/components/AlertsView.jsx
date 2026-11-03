import React from 'react';
import { FontAwesomeIcon, ICONS } from './FontAwesomeIcons.jsx';
import { audioEngine } from '../utils/audioVoice.js';

export const AlertsView = ({ alerts, language }) => {
  const handleSpeakAlert = (alert) => {
    const text = language === 'mg' ? alert.audioScriptMg : alert.messageFr;
    audioEngine.speakText(text, alert.titleMg, language);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8 w-full max-w-full overflow-hidden">
      {/* 1. View Header with Visual Meaning Guide */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
            <FontAwesomeIcon icon={ICONS.alert} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display font-black text-base sm:text-xl text-stone-900 truncate">
              {language === 'mg' ? 'Fampitandremana momba ny Fambolena' : 'Alertes Agricoles & Risques'}
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium truncate">
              {language === 'mg' ? 'Fampandrenesana araka ny lokon\'ny loza' : 'Signaux visuels par niveau d’urgence'}
            </p>
          </div>
        </div>

        {/* Color Legend */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-stone-100 mt-2 text-center w-full">
          <div className="bg-red-50 p-1.5 sm:p-2 rounded-xl border border-red-200 min-w-0">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block mr-1"></span>
            <span className="text-[11px] sm:text-xs font-bold text-red-800 truncate block">
              {language === 'mg' ? 'Mena: Loza' : 'Rouge: Danger'}
            </span>
          </div>
          <div className="bg-orange-50 p-1.5 sm:p-2 rounded-xl border border-orange-200 min-w-0">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block mr-1"></span>
            <span className="text-[11px] sm:text-xs font-bold text-orange-800 truncate block">
              {language === 'mg' ? 'Mavo: Fampit.' : 'Orange: Risque'}
            </span>
          </div>
          <div className="bg-emerald-50 p-1.5 sm:p-2 rounded-xl border border-emerald-200 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block mr-1"></span>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 truncate block">
              {language === 'mg' ? 'Maintso: Mety' : 'Vert: Propice'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Urgent Alerts Cards */}
      <div className="space-y-3 sm:space-y-4 w-full">
        {alerts.map((alert) => {
          const isRed = alert.level === 'rouge';
          const isOrange = alert.level === 'orange';

          return (
            <div
              key={alert.id}
              className={`rounded-3xl p-4 sm:p-5 border-2 shadow-xs transition-all w-full ${
                isRed
                  ? 'bg-red-50/90 border-red-400'
                  : isOrange
                  ? 'bg-amber-50/90 border-amber-400'
                  : 'bg-emerald-50/90 border-emerald-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs ${
                      isRed
                        ? 'bg-red-600 text-white'
                        : isOrange
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        isRed
                          ? ICONS.alert
                          : isOrange
                          ? ICONS.bug
                          : ICONS.seedling
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md ${
                          isRed
                            ? 'bg-red-200 text-red-900'
                            : isOrange
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        {isRed
                          ? language === 'mg' ? 'Loza mena' : 'Danger'
                          : isOrange
                          ? language === 'mg' ? 'Fampitandremana' : 'Vigilance'
                          : language === 'mg' ? 'Fotoana mety' : 'Favorable'}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium truncate">
                        {alert.region}
                      </span>
                    </div>
                    <h3 className="font-display font-extrabold text-sm sm:text-base text-stone-900 mt-1 leading-snug">
                      {language === 'mg' ? alert.titleMg : alert.titleFr}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakAlert(alert)}
                  className={`h-9 sm:h-10 px-2.5 sm:px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all shrink-0 ${
                    isRed
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : isOrange
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-emerald-700 text-white hover:bg-emerald-800'
                  }`}
                  title="Henoy ity fampitandremana ity"
                >
                  <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-xs shrink-0" />
                  <span>{language === 'mg' ? 'Henoy' : 'Écouter'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed mb-3">
                {language === 'mg' ? alert.messageMg : alert.messageFr}
              </p>

              <div className="bg-white/90 rounded-2xl p-3 border border-stone-200/80 flex items-start gap-2.5 w-full">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                    isRed ? 'text-red-700' : isOrange ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  <FontAwesomeIcon icon={ICONS.checkCircle} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold uppercase text-stone-500 tracking-wide block">
                    {language === 'mg' ? 'Asa maika:' : 'Action recommandée :'}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                    {language === 'mg' ? alert.actionRequiredMg : alert.actionRequiredFr}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
