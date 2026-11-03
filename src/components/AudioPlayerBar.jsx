import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon, ICONS } from './FontAwesomeIcons.jsx';
import { audioEngine } from '../utils/audioVoice.js';

export const AudioPlayerBar = ({ language }) => {
  const [state, setState] = useState(audioEngine.getCurrentState());

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  if (!state.isPlaying && state.progress === 0) {
    return null;
  }

  const handleStop = () => {
    audioEngine.stopAudio();
  };

  return (
    <div
      role="region"
      aria-label="Mpitsoka feo"
      className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-6 md:w-96 max-w-[calc(100vw-1.5rem)] z-50 bg-stone-900 text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-stone-700/60 backdrop-blur-md transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 text-white shadow-inner animate-pulse">
            <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-base" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
              {language === 'mg' ? 'Feo mandeha · Malagasy' : 'Audio en cours · Malagasy'}
            </div>
            <div className="text-sm font-bold text-stone-100 truncate">
              {state.title || (language === 'mg' ? 'Torohevitra am-peo' : 'Conseil audio')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleStop}
            className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            title={language === 'mg' ? 'Atsaharo' : 'Arrêter'}
            aria-label="Atsaharo ny feo"
          >
            <FontAwesomeIcon icon={ICONS.pause} className="text-xs" />
          </button>
          <button
            onClick={handleStop}
            className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
            title={language === 'mg' ? 'Hakatona' : 'Fermer'}
            aria-label="Hakatona"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-200"
          style={{ width: `${Math.max(4, Math.min(100, state.progress))}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-1 text-[11px] text-stone-400 font-mono">
        <span>{language === 'mg' ? 'Fihainoana' : 'Écoute'}</span>
        <span>{Math.round(state.progress)}%</span>
      </div>
    </div>
  );
};
