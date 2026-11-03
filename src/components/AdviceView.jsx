import React, { useState } from 'react';
import { FontAwesomeIcon, ICONS } from './FontAwesomeIcons.jsx';
import { ADVICE_DATA } from '../data/farmingData.js';
import { audioEngine } from '../utils/audioVoice.js';

export const AdviceView = ({ language }) => {
  const [selectedAdviceId, setSelectedAdviceId] = useState(ADVICE_DATA[0].id);

  const activeAdvice =
    ADVICE_DATA.find((a) => a.id === selectedAdviceId) || ADVICE_DATA[0];

  const handleSpeakAdvice = (advice) => {
    const text = language === 'mg' ? advice.audioScriptMg : `${advice.titleFr}. ${advice.summaryFr}`;
    audioEngine.speakText(text, advice.titleMg, language);
  };

  const getStepIcon = (iconName) => {
    switch (iconName) {
      case 'faSeedling':
        return ICONS.seedling;
      case 'faRulerCombined':
        return ICONS.ruler;
      case 'faDroplet':
        return ICONS.droplet;
      case 'faMortarPestle':
        return ICONS.mortarPestle;
      case 'faBottleDroplet':
        return ICONS.bottleDroplet;
      case 'faSprayCan':
        return ICONS.sprayCan;
      case 'faLayerGroup':
        return ICONS.layerGroup;
      case 'faArrowsRotate':
        return ICONS.arrowsRotate;
      default:
        return ICONS.leaf;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8 w-full max-w-full overflow-hidden">
      {/* 1. Header with Audio Indicator */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs w-full">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg sm:text-xl shrink-0">
              <FontAwesomeIcon icon={ICONS.earListen} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display font-black text-base sm:text-xl text-stone-900 truncate">
                {language === 'mg' ? 'Torohevitra & Torolàlana' : 'Conseils Pratiques'}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium truncate">
                {language === 'mg' ? 'Miaraka amin\'ny sary sy feo' : 'Guides illustrés avec audio'}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleSpeakAdvice(activeAdvice)}
            className="h-10 sm:h-11 px-3 sm:px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
            title="Henoy ity torohevitra ity"
          >
            <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-xs sm:text-sm shrink-0" />
            <span>{language === 'mg' ? 'Henoy' : 'Écouter'}</span>
          </button>
        </div>
      </div>

      {/* 2. Advice Topic Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
        {ADVICE_DATA.map((advice) => {
          const isSelected = advice.id === selectedAdviceId;
          return (
            <button
              key={advice.id}
              onClick={() => {
                setSelectedAdviceId(advice.id);
                audioEngine.playChime('click');
              }}
              className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all min-w-0 w-full ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/90 text-stone-900 shadow-xs ring-1 ring-emerald-600'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded truncate">
                  {language === 'mg' ? advice.categoryLabelMg : advice.categoryLabelFr}
                </span>
                <span className="text-[10px] sm:text-[11px] text-stone-400 font-mono shrink-0">
                  ~{advice.durationMinutes} min
                </span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-2">
                {language === 'mg' ? advice.titleMg : advice.titleFr}
              </h3>
            </button>
          );
        })}
      </div>

      {/* 3. Active Advice Detail Card */}
      <section className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-xs space-y-4 sm:space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-stone-100">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wide">
                {language === 'mg' ? activeAdvice.categoryLabelMg : activeAdvice.categoryLabelFr}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium">
                {language === 'mg' ? 'Torolàlana' : 'Guide illustré'}
              </span>
            </div>
            <h2 className="font-display font-black text-lg sm:text-2xl text-stone-900 leading-snug">
              {language === 'mg' ? activeAdvice.titleMg : activeAdvice.titleFr}
            </h2>
          </div>

          <button
            onClick={() => handleSpeakAdvice(activeAdvice)}
            className="w-full sm:w-auto h-11 sm:h-12 px-4 sm:px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all shrink-0"
          >
            <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-sm shrink-0" />
            <span>{language === 'mg' ? 'Henoy ny fanazavana' : 'Écouter le guide'}</span>
          </button>
        </div>

        <div className="bg-stone-50 rounded-2xl p-3 sm:p-4 border border-stone-200/80 flex items-start gap-2.5 w-full">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-xs">
            <FontAwesomeIcon icon={ICONS.info} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {language === 'mg' ? 'Fintinina haingana' : 'En résumé'}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-stone-900 mt-0.5">
              {language === 'mg' ? activeAdvice.summaryMg : activeAdvice.summaryFr}
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 w-full">
          <h3 className="font-bold text-sm sm:text-base text-stone-900">
            {language === 'mg' ? 'Ireo dingana tokony harahina:' : 'Les étapes à suivre :'}
          </h3>

          <div className="space-y-2.5 w-full">
            {activeAdvice.steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-stone-50 hover:bg-emerald-50/40 rounded-2xl p-3 sm:p-4 border border-stone-200/90 flex items-start gap-3 transition-colors w-full"
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-xl sm:text-2xl text-emerald-700 shrink-0 shadow-xs">
                  <FontAwesomeIcon icon={getStepIcon(step.iconName)} />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs sm:text-base text-stone-900 leading-snug">
                    {language === 'mg' ? step.stepTitleMg : step.stepTitleFr}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5 sm:mt-1 leading-relaxed">
                    {language === 'mg' ? step.descriptionMg : step.descriptionFr}
                  </p>
                </div>

                <button
                  onClick={() => {
                    const text = language === 'mg' ? `${step.stepTitleMg}. ${step.descriptionMg}` : `${step.stepTitleFr}. ${step.descriptionFr}`;
                    audioEngine.speakText(text, step.stepTitleMg, language);
                  }}
                  className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-emerald-800 flex items-center justify-center active:scale-95 transition-all shrink-0"
                  title="Henoy ity dingana ity"
                >
                  <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
