import React, { useState } from 'react';
import { FontAwesomeIcon, ICONS, getCropIcon } from './FontAwesomeIcons.jsx';
import { audioEngine } from '../utils/audioVoice.js';
import { storage } from '../utils/storage.js';

export const JournalView = ({
  entries,
  onOpenNewModalWithType,
  onDeleteEntry,
  onResetDemo,
  language,
  currentUser = null,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAllFarmers, setShowAllFarmers] = useState(false);

  const allEntries = storage.getAllEntries();
  const baseEntries = showAllFarmers ? allEntries : entries;

  const filteredEntries =
    activeFilter === 'all' ? baseEntries : baseEntries.filter((e) => e.type === activeFilter);

  const handleSpeakEntry = (entry) => {
    let text = '';
    const typeLabel =
      entry.type === 'semis'
        ? 'Famafazana'
        : entry.type === 'recolte'
        ? 'Fijinjana'
        : entry.type === 'parasite'
        ? 'Bibikely mpanimba'
        : 'Orana nilatsaka';

    if (entry.type === 'pluie') {
      text = `Fanamarihana orana ny ${entry.date}. Rano nilatsaka ${entry.rainfallMm || 0} milimetatra. ${entry.notes || ''}`;
    } else {
      text = `${typeLabel} ny ${entry.cropNameMg || 'voly'} ny ${entry.date}. ${entry.quantity ? `Habetsahana ${entry.quantity} ${entry.unit || ''}.` : ''} ${entry.notes || ''}`;
    }

    audioEngine.speakText(text, `${typeLabel}: ${entry.cropNameMg || 'Orana'}`, language);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 w-full max-w-full overflow-hidden">
      {/* 0. USER PRIVATE DATA OWNERSHIP BANNER */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 rounded-2xl p-3 sm:p-3.5 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
            {currentUser?.avatar || '👨‍🌾'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-display font-black text-xs sm:text-sm text-stone-900 truncate">
                {language === 'mg'
                  ? `Bokin'asa manokan'i ${currentUser?.name || 'Tantsaha'}`
                  : `Journal personnel de ${currentUser?.name || 'Agriculteur'}`}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full shrink-0 flex items-center gap-1">
                <FontAwesomeIcon icon={ICONS.lock} className="text-[8px]" />
                <span>{language === 'mg' ? 'Angon-drakitra manokana' : 'Données privées'}</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5">
              {language === 'mg'
                ? 'Ianao irery no tompon\'ireto fanamarihana sy fambolena ireto'
                : 'Vos enregistrements sont strictement réservés à votre compte'}
            </p>
          </div>
        </div>

        {/* Privacy Scope Toggle */}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs shrink-0 self-start sm:self-auto">
          <button
            onClick={() => {
              setShowAllFarmers(false);
              audioEngine.playChime('click');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              !showAllFarmers
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>{language === 'mg' ? `Asako ihany (${entries.length})` : `Mes données (${entries.length})`}</span>
          </button>
          <button
            onClick={() => {
              setShowAllFarmers(true);
              audioEngine.playChime('click');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              showAllFarmers
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>{language === 'mg' ? `Rehetra (${allEntries.length})` : `Tous (${allEntries.length})`}</span>
          </button>
        </div>
      </div>

      {/* 1. FOUR GIANT ACTION BUTTONS */}
      <section className="w-full">
        <div className="mb-2 px-0.5">
          <h2 className="font-display font-black text-base sm:text-xl text-stone-900">
            {language === 'mg' ? 'Fampidirana asa vaovao' : 'Enregistrer une observation'}
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
            {language === 'mg' ? 'Inona no asa nataonao androany?' : 'Sélectionnez une action rapide'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-1 w-full">
          <button
            onClick={() => onOpenNewModalWithType('semis')}
            className="group flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 sm:border-3 border-emerald-500/70 hover:border-emerald-600 hover:shadow-lg active:scale-97 transition-all text-center min-h-[120px] sm:min-h-[150px] shadow-xs min-w-0 w-full"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 group-hover:bg-emerald-200 text-emerald-800 flex items-center justify-center text-2xl sm:text-3xl mb-2 transition-colors shrink-0">
              <FontAwesomeIcon icon={ICONS.seedling} />
            </div>
            <span className="font-display font-black text-base sm:text-xl text-stone-900 truncate w-full">
              {language === 'mg' ? 'Semis' : 'Semis'}
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-800 font-semibold mt-0.5 truncate w-full">
              {language === 'mg' ? 'Famafazana' : 'Plantation'}
            </span>
          </button>

          <button
            onClick={() => onOpenNewModalWithType('recolte')}
            className="group flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 sm:border-3 border-amber-500/70 hover:border-amber-600 hover:shadow-lg active:scale-97 transition-all text-center min-h-[120px] sm:min-h-[150px] shadow-xs min-w-0 w-full"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 group-hover:bg-amber-200 text-amber-800 flex items-center justify-center text-2xl sm:text-3xl mb-2 transition-colors shrink-0">
              <FontAwesomeIcon icon={ICONS.wheat} />
            </div>
            <span className="font-display font-black text-base sm:text-xl text-stone-900 truncate w-full">
              {language === 'mg' ? 'Récolte' : 'Récolte'}
            </span>
            <span className="text-[10px] sm:text-xs text-amber-800 font-semibold mt-0.5 truncate w-full">
              {language === 'mg' ? 'Fijinjana' : 'Vente/Stock'}
            </span>
          </button>

          <button
            onClick={() => onOpenNewModalWithType('parasite')}
            className="group flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 sm:border-3 border-red-500/70 hover:border-red-600 hover:shadow-lg active:scale-97 transition-all text-center min-h-[120px] sm:min-h-[150px] shadow-xs min-w-0 w-full"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-red-100 group-hover:bg-red-200 text-red-700 flex items-center justify-center text-2xl sm:text-3xl mb-2 transition-colors shrink-0">
              <FontAwesomeIcon icon={ICONS.bug} />
            </div>
            <span className="font-display font-black text-base sm:text-xl text-stone-900 truncate w-full">
              {language === 'mg' ? 'Parasites' : 'Parasites'}
            </span>
            <span className="text-[10px] sm:text-xs text-red-700 font-semibold mt-0.5 truncate w-full">
              {language === 'mg' ? 'Bibikely' : 'Ravageurs'}
            </span>
          </button>

          <button
            onClick={() => onOpenNewModalWithType('pluie')}
            className="group flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border-2 sm:border-3 border-blue-500/70 hover:border-blue-600 hover:shadow-lg active:scale-97 transition-all text-center min-h-[120px] sm:min-h-[150px] shadow-xs min-w-0 w-full"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-100 group-hover:bg-blue-200 text-blue-800 flex items-center justify-center text-2xl sm:text-3xl mb-2 transition-colors shrink-0">
              <FontAwesomeIcon icon={ICONS.droplet} />
            </div>
            <span className="font-display font-black text-base sm:text-xl text-stone-900 truncate w-full">
              {language === 'mg' ? 'Pluie' : 'Pluie'}
            </span>
            <span className="text-[10px] sm:text-xs text-blue-800 font-semibold mt-0.5 truncate w-full">
              {language === 'mg' ? 'Orana nilatsaka' : 'Précipitations'}
            </span>
          </button>
        </div>
      </section>

      {/* 2. FILTER SEGMENTED CONTROLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
        <button
          onClick={() => {
            setActiveFilter('all');
            audioEngine.playChime('click');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            activeFilter === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          {language === 'mg' ? 'Rehetra' : 'Tous'} ({entries.length})
        </button>
        <button
          onClick={() => {
            setActiveFilter('semis');
            audioEngine.playChime('click');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            activeFilter === 'semis'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          🌱 {language === 'mg' ? 'Semis' : 'Semis'}
        </button>
        <button
          onClick={() => {
            setActiveFilter('recolte');
            audioEngine.playChime('click');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            activeFilter === 'recolte'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          🌾 {language === 'mg' ? 'Récolte' : 'Récolte'}
        </button>
        <button
          onClick={() => {
            setActiveFilter('parasite');
            audioEngine.playChime('click');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            activeFilter === 'parasite'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          🐛 {language === 'mg' ? 'Bibikely' : 'Parasites'}
        </button>
        <button
          onClick={() => {
            setActiveFilter('pluie');
            audioEngine.playChime('click');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
            activeFilter === 'pluie'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          💧 {language === 'mg' ? 'Orana' : 'Pluie'}
        </button>
      </div>

      {/* 3. LIST OF ENTRIES */}
      <section className="space-y-2.5 w-full">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="font-bold text-xs sm:text-sm text-stone-800 truncate">
            {language === 'mg' ? 'Tantaran\'ny asa voarakitra' : 'Historique des observations'}
          </h3>
          <span className="text-[11px] text-stone-500 font-mono shrink-0">
            {filteredEntries.length} {language === 'mg' ? 'voatahiry' : 'enregistrés'}
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-stone-200 shadow-xs w-full">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center text-xl mx-auto mb-2">
              <FontAwesomeIcon icon={ICONS.book} />
            </div>
            <p className="font-bold text-stone-700 text-xs sm:text-sm">
              {language === 'mg' ? 'Tsy mbola misy asa voasoratra amin\'ity sokajy ity.' : 'Aucun enregistrement pour cette catégorie.'}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {language === 'mg' ? 'Tsindrio ireo bokotra lehibe etsy ambony.' : 'Appuyez sur un bouton ci-dessus.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 w-full">
            {filteredEntries.map((entry) => {
              const cropIcon = getCropIcon(entry.cropId || '');
              const isSemis = entry.type === 'semis';
              const isRecolte = entry.type === 'recolte';
              const isParasite = entry.type === 'parasite';
              const isPluie = entry.type === 'pluie';

              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl p-3.5 border border-stone-200 hover:border-emerald-500/80 transition-all shadow-xs flex items-start justify-between gap-2.5 w-full"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-xs ${
                        isSemis
                          ? 'bg-emerald-100 text-emerald-800'
                          : isRecolte
                          ? 'bg-amber-100 text-amber-800'
                          : isParasite
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <FontAwesomeIcon icon={isPluie ? ICONS.droplet : cropIcon} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                          {isSemis
                            ? language === 'mg' ? 'Famafazana' : 'Semis'
                            : isRecolte
                            ? language === 'mg' ? 'Fijinjana' : 'Récolte'
                            : isParasite
                            ? language === 'mg' ? 'Bibikely' : 'Parasite'
                            : language === 'mg' ? 'Orana' : 'Pluie'}
                        </span>
                        {entry.cropNameMg && (
                          <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-1.5 py-0.2 rounded truncate">
                            {language === 'mg' ? entry.cropNameMg : entry.cropNameFr}
                          </span>
                        )}
                        {entry.severity && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              entry.severity === 'mahery'
                                ? 'bg-red-100 text-red-800'
                                : entry.severity === 'antonony'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {entry.severity === 'mahery'
                              ? 'Mahery'
                              : entry.severity === 'antonony'
                              ? 'Antonony'
                              : 'Mora'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5 flex-wrap font-medium">
                        <span className="font-bold text-stone-700">{entry.date}</span>
                        {entry.authorName && (
                          <>
                            <span>·</span>
                            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-md">
                              👤 {entry.authorName}
                            </span>
                          </>
                        )}
                        {entry.parcelName && (
                          <>
                            <span>·</span>
                            <span className="truncate">{entry.parcelName}</span>
                          </>
                        )}
                        {entry.quantity && (
                          <>
                            <span>·</span>
                            <span className="font-bold text-emerald-800 shrink-0">
                              {entry.quantity} {entry.unit}
                            </span>
                          </>
                        )}
                        {entry.rainfallMm && (
                          <>
                            <span>·</span>
                            <span className="font-bold text-blue-700 shrink-0">
                              {entry.rainfallMm} mm
                            </span>
                          </>
                        )}
                      </div>

                      {entry.notes && (
                        <p className="text-[11px] text-stone-700 bg-stone-50 p-1.5 rounded-xl mt-1.5 border border-stone-100 break-words">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => handleSpeakEntry(entry)}
                      className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center active:scale-95 transition-all"
                      title="Henoy ity asa ity"
                      aria-label="Henoy ity asa ity"
                    >
                      <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-xs" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(language === 'mg' ? 'Hofafana ve ity asa ity?' : 'Supprimer cette observation ?')) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 flex items-center justify-center active:scale-95 transition-all"
                      title="Fafao"
                      aria-label="Fafao"
                    >
                      <FontAwesomeIcon icon={ICONS.trash} className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Reset Demo Data */}
      <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-stone-500">
        <span>💾 Local Storage</span>
        <button
          onClick={onResetDemo}
          className="text-stone-500 hover:text-stone-800 underline font-medium"
        >
          {language === 'mg' ? 'Haverina ny ohatra' : 'Restaurer exemples'}
        </button>
      </div>
    </div>
  );
};
