import React, { useState } from 'react';
import { FontAwesomeIcon, ICONS, getCropIcon } from './FontAwesomeIcons.jsx';
import { CROPS_DATA } from '../data/farmingData.js';
import { audioEngine } from '../utils/audioVoice.js';

export const NewEntryModal = ({
  isOpen,
  onClose,
  onSave,
  language,
  initialType = 'semis',
  currentUser = null,
}) => {
  const [type, setType] = useState(initialType);
  const [selectedCropId, setSelectedCropId] = useState('vary');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Sobika / Gony');
  const [parcelName, setParcelName] = useState('Tanimbary / Saha');
  const [severity, setSeverity] = useState('antonony');
  const [rainfallMm, setRainfallMm] = useState(15);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedCrop = CROPS_DATA.find((c) => c.id === selectedCropId) || CROPS_DATA[0];

  const handleSelectType = (newType) => {
    setType(newType);
    audioEngine.playChime('click');
    if (newType === 'pluie') {
      audioEngine.playChime('water');
    }
  };

  const handleSave = () => {
    const newEntry = {
      type,
      date,
      userId: currentUser?.id || 'user-rakoto',
      authorName: currentUser?.name || 'Tantsaha',
      parcelName: parcelName.trim() || (type === 'pluie' ? 'Toerana misy anao' : 'Saha 1'),
      notes: notes.trim() || undefined,
    };

    if (type === 'semis' || type === 'recolte') {
      newEntry.cropId = selectedCrop.id;
      newEntry.cropNameMg = selectedCrop.nameMg;
      newEntry.cropNameFr = selectedCrop.nameFr;
      newEntry.quantity = String(quantity);
      newEntry.unit = unit;
    } else if (type === 'parasite') {
      newEntry.cropId = selectedCrop.id;
      newEntry.cropNameMg = selectedCrop.nameMg;
      newEntry.cropNameFr = selectedCrop.nameFr;
      newEntry.severity = severity;
    } else if (type === 'pluie') {
      newEntry.rainfallMm = rainfallMm;
    }

    setIsSuccess(true);
    audioEngine.speakConfirmation(
      language === 'mg'
        ? `Vita ny fanoratana! Voatahiry soamantsara ny bokin\'ny fambolenao.`
        : `Enregistrement réussi ! Votre observation a été sauvegardée.`
    );

    setTimeout(() => {
      onSave(newEntry);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const setDatePreset = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setDate(d.toISOString().split('T')[0]);
    audioEngine.playChime('click');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FontAwesomeIcon icon={ICONS.book} />
            </span>
            <h2 className="font-display font-bold text-lg text-stone-900">
              {language === 'mg' ? 'Fanamarihana vaovao' : 'Nouvelle observation'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-sm"
            aria-label="Hakatona"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900 animate-bounce">
              <FontAwesomeIcon icon={ICONS.checkCircle} className="text-2xl text-emerald-600" />
              <div>
                <div className="font-bold text-base">
                  {language === 'mg' ? 'Vita ny fanoratana !' : 'Enregistrement réussi !'}
                </div>
                <div className="text-xs text-emerald-700">
                  {language === 'mg' ? 'Voatahiry ao amin\'ny fitaovanao.' : 'Sauvegardé dans la mémoire locale.'}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Main Type Buttons */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              {language === 'mg' ? '1. Karazana asa (Safidio)' : '1. Type d’activité (Choisir)'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectType('semis')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  type === 'semis'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-1">
                  <FontAwesomeIcon icon={ICONS.seedling} />
                </div>
                <span className="font-bold text-sm">{language === 'mg' ? 'Semis' : 'Semis'}</span>
                <span className="text-[10px] text-stone-500">
                  {language === 'mg' ? 'Famafazana' : 'Plantation'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('recolte')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  type === 'recolte'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-900 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg mb-1">
                  <FontAwesomeIcon icon={ICONS.wheat} />
                </div>
                <span className="font-bold text-sm">{language === 'mg' ? 'Récolte' : 'Récolte'}</span>
                <span className="text-[10px] text-stone-500">
                  {language === 'mg' ? 'Fijinjana' : 'Vente/Stock'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('parasite')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  type === 'parasite'
                    ? 'border-red-600 bg-red-50/80 text-red-900 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center text-lg mb-1">
                  <FontAwesomeIcon icon={ICONS.bug} />
                </div>
                <span className="font-bold text-sm">{language === 'mg' ? 'Parasite' : 'Parasite'}</span>
                <span className="text-[10px] text-stone-500">
                  {language === 'mg' ? 'Bibikely / Aretina' : 'Maladie'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('pluie')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  type === 'pluie'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg mb-1">
                  <FontAwesomeIcon icon={ICONS.droplet} />
                </div>
                <span className="font-bold text-sm">{language === 'mg' ? 'Pluie' : 'Pluie'}</span>
                <span className="text-[10px] text-stone-500">
                  {language === 'mg' ? 'Orana nilatsaka' : 'Précipitations'}
                </span>
              </button>
            </div>
          </div>

          {/* STEP 2: Crop selection */}
          {type !== 'pluie' && (
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                {language === 'mg' ? '2. Safidio ny Voly (Pictogramme)' : '2. Choisissez la culture'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {CROPS_DATA.map((crop) => {
                  const isSelected = selectedCropId === crop.id;
                  const icon = getCropIcon(crop.id);
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => {
                        setSelectedCropId(crop.id);
                        audioEngine.playChime('click');
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-stone-900 ring-2 ring-emerald-600/30'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-1 ${crop.bgLight} ${crop.color}`}>
                        <FontAwesomeIcon icon={icon} />
                      </div>
                      <span className="font-bold text-xs truncate max-w-full">
                        {language === 'mg' ? crop.nameMg : crop.nameFr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Details */}
          {type === 'pluie' ? (
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider">
                {language === 'mg' ? 'Hatevin\'ny orana (Milimetatra)' : 'Quantité de pluie (mm)'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRainfallMm(Math.max(2, rainfallMm - 5))}
                  className="w-12 h-12 rounded-xl bg-white border border-blue-300 text-blue-800 font-bold text-xl active:scale-95 shadow-xs"
                >
                  -5
                </button>
                <div className="flex-1 text-center bg-white py-2.5 rounded-xl border border-blue-200">
                  <span className="text-2xl font-black text-blue-900 tabular-nums">{rainfallMm}</span>
                  <span className="text-xs text-blue-700 ml-1 font-semibold">mm</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRainfallMm(rainfallMm + 5)}
                  className="w-12 h-12 rounded-xl bg-white border border-blue-300 text-blue-800 font-bold text-xl active:scale-95 shadow-xs"
                >
                  +5
                </button>
              </div>
              <div className="flex justify-between text-[11px] text-blue-700 font-medium px-1">
                <span>{rainfallMm < 10 ? 'Orana malefaka' : rainfallMm < 30 ? 'Orana antonony' : 'Orana mikija / be'}</span>
                <span>{rainfallMm >= 25 ? '⚠️ Hamarino ny tatatra' : '✓ Tsara ho an\'ny tany'}</span>
              </div>
            </div>
          ) : type === 'parasite' ? (
            <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 space-y-2">
              <label className="block text-xs font-bold text-red-900 uppercase tracking-wider">
                {language === 'mg' ? 'Herin\'ny fahasimbana' : 'Niveau d’infestation'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['mora', 'antonony', 'mahery'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border text-center capitalize transition-all ${
                      severity === sev
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-stone-700 border-red-200 hover:bg-red-50'
                    }`}
                  >
                    {sev === 'mora' ? 'Mora (Léger)' : sev === 'antonony' ? 'Antonony (Moyen)' : 'Mahery (Grave)'}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                {language === 'mg' ? 'Habetsahana' : 'Quantité / Superficie'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xl active:scale-95 shadow-xs"
                >
                  -1
                </button>
                <div className="flex-1 text-center bg-white py-2 rounded-xl border border-stone-200">
                  <span className="text-2xl font-black text-stone-900 tabular-nums">{quantity}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xl active:scale-95 shadow-xs"
                >
                  +1
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Sobika / Gony', 'Tari-doko (parcelle)', 'Hektara (Ha)', 'Kilao (kg)'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                      unit === u
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Date */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              {language === 'mg' ? 'Daty' : 'Date de l’observation'}
            </label>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setDatePreset(0)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                  date === todayStr
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                }`}
              >
                {language === 'mg' ? 'Androany' : 'Aujourd’hui'}
              </button>
              <button
                type="button"
                onClick={() => setDatePreset(1)}
                className="flex-1 py-2 text-xs font-bold rounded-xl border bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
              >
                {language === 'mg' ? 'Omaly' : 'Hier'}
              </button>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-36 text-xs py-2 px-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              {language === 'mg' ? 'Anaran\'ny saha / Fanamarihana (Safidy)' : 'Parcelle ou note (Optionnel)'}
            </label>
            <input
              type="text"
              placeholder={language === 'mg' ? 'Ohatra: Tanimbary atsinanana, ketsa SRI...' : 'Ex: Parcelle est, semis SRI...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm py-2.5 px-3.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 bg-stone-50 border-t border-stone-200 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-100 transition-colors"
          >
            {language === 'mg' ? 'Aoka ihany' : 'Annuler'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSuccess}
            className="flex-2 py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={ICONS.check} />
            <span>{language === 'mg' ? 'Tehirizo (Valider)' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
