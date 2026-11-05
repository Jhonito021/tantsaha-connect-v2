import React, { useState } from 'react';
import { FontAwesomeIcon, ICONS } from './FontAwesomeIcons.jsx';
import { REGIONS_DATA, CROPS_DATA } from '../data/farmingData.js';
import { audioEngine } from '../utils/audioVoice.js';
import { storage } from '../utils/storage.js';

const AVATAR_OPTIONS = ['🌾', '🍅', '🌱', '🌽', '🥔', '👨‍🌾', '👩‍🌾', '🐄'];

export const AuthScreen = ({
  onLoginSuccess,
  language,
  onLanguageChange,
  soundEnabled,
  onToggleSound,
  isDarkMode = false,
  onToggleTheme,
}) => {
  const [registeredUsers, setRegisteredUsers] = useState(() => storage.getUsers());
  const [activeTab, setActiveTab] = useState(() => {
    const users = storage.getUsers();
    return users && users.length > 0 ? 'login' : 'register';
  });

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regRegionId, setRegRegionId] = useState('ambatondrazaka');
  const [regCropId, setRegCropId] = useState('vary');
  const [regAvatar, setRegAvatar] = useState('👨‍🌾');
  const [regError, setRegError] = useState('');

  const refreshUsers = () => {
    setRegisteredUsers(storage.getUsers());
  };

  const handleSpeakWelcome = () => {
    const text =
      language === 'mg'
        ? 'Tongasoa eto amin\'ny Tantsaha Connect. Mila miditra amin\'ny kaontinao ianao hampiasana ny fampiharana. Tsindrio ny sarinao na ampidiro ny laharana finday sy ny kaody miafina tarehimarika efatra.'
        : 'Bienvenue sur Tantsaha Connect. Veuillez vous connecter ou créer un compte pour accéder à la météo agricole, au journal des cultures et aux alertes.';
    audioEngine.speakText(text, language === 'mg' ? 'Tongasoa' : 'Bienvenue', language);
  };

  const handleFastAvatarLogin = (user) => {
    audioEngine.playChime('click');
    setLoginIdentifier(user.phone || user.name);
    setLoginPin(user.pin || '1234');
    const res = storage.loginUser(user.phone || user.name, user.pin || '1234');
    if (res.success) {
      audioEngine.playChime('success');
      const welcome =
        language === 'mg'
          ? `Miarahaba anao ${res.user.name}, tafiditra soa aman-tsara amin'ny kaontinao ianao!`
          : `Bienvenue ${res.user.name}, connexion réussie !`;
      audioEngine.speakConfirmation(welcome);
      onLoginSuccess(res.user);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const res = storage.loginUser(loginIdentifier, loginPin);
    if (!res.success) {
      setLoginError(language === 'mg' ? res.errorMg : res.errorFr);
      audioEngine.playChime('alert');
      return;
    }

    audioEngine.playChime('success');
    const welcome =
      language === 'mg'
        ? `Miarahaba anao ${res.user.name}, tafiditra soa aman-tsara amin'ny kaontinao ianao!`
        : `Bienvenue ${res.user.name}, connexion réussie !`;
    audioEngine.speakConfirmation(welcome);
    onLoginSuccess(res.user);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    const selectedRegion =
      REGIONS_DATA.find((r) => r.id === regRegionId) || REGIONS_DATA[0];
    const selectedCrop =
      CROPS_DATA.find((c) => c.id === regCropId) || CROPS_DATA[0];

    const res = storage.registerUser({
      name: regName,
      phone: regPhone,
      pin: regPin,
      regionId: regRegionId,
      regionNameMg: selectedRegion.nameMg,
      regionNameFr: selectedRegion.nameFr,
      mainCrop: regCropId,
      mainCropLabelMg: selectedCrop.nameMg,
      mainCropLabelFr: selectedCrop.nameFr,
      roleMg: `Mpamboly ${selectedCrop.nameMg.toLowerCase()}`,
      roleFr: `Agriculteur / Producteur de ${selectedCrop.nameFr.toLowerCase()}`,
      avatar: regAvatar,
    });

    if (!res.success) {
      setRegError(language === 'mg' ? res.errorMg : res.errorFr);
      audioEngine.playChime('alert');
      return;
    }

    refreshUsers();
    audioEngine.playChime('success');
    const welcome =
      language === 'mg'
        ? `Tafiditra soa aman-tsara ny fisoratana anarana, tongasoa ry ${res.user.name}!`
        : `Inscription réussie, bienvenue ${res.user.name} !`;
    audioEngine.speakConfirmation(welcome);
    onLoginSuccess(res.user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 via-emerald-50/40 to-stone-100 dark:from-[#080d0a] dark:via-[#0f1713] dark:to-[#080d0a] flex flex-col justify-between text-stone-900 dark:text-stone-100 w-full max-w-full overflow-x-hidden selection:bg-emerald-600 selection:text-white transition-colors">
      {/* Top Accessible Bar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-20 transition-colors">
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
              <FontAwesomeIcon icon={ICONS.seedling} className="text-lg" />
            </div>
            <div className="min-w-0">
              <span className="font-display text-base font-extrabold tracking-tight text-stone-900 leading-tight truncate block">
                Tantsaha Connect
              </span>
              <span className="text-[10px] text-stone-500 font-medium truncate block">
                {language === 'mg' ? 'Fampiharana ho an\'ny tantsaha' : 'App des agriculteurs malagasy'}
              </span>
            </div>
          </div>

          {/* Quick controls: Audio, Language, Dark Mode, Sound */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleSpeakWelcome}
              className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 active:scale-95 transition-all shadow-xs"
              title={language === 'mg' ? 'Henoy ny fanazavana' : 'Écouter'}
              aria-label="Henoy ny fanazavana"
            >
              <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-sm" />
            </button>

            <button
              onClick={() => {
                const next = language === 'mg' ? 'fr' : 'mg';
                onLanguageChange(next);
                audioEngine.playChime('click');
              }}
              className="h-9 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 flex items-center gap-0.5 active:scale-95 transition-colors"
              title="Changer de langue"
            >
              <span className={language === 'mg' ? 'text-emerald-700 font-extrabold' : 'text-stone-400'}>MG</span>
              <span className="text-stone-300">/</span>
              <span className={language === 'fr' ? 'text-emerald-700 font-extrabold' : 'text-stone-400'}>FR</span>
            </button>

            {/* Dark Mode toggle in AuthScreen */}
            <button
              onClick={onToggleTheme}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all active:scale-95 ${
                isDarkMode
                  ? 'bg-amber-400/20 text-amber-300 border-amber-500/40 hover:bg-amber-400/30'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
              }`}
              title={
                isDarkMode
                  ? (language === 'mg' ? 'Hiverina amin\'ny mazava' : 'Passer en mode clair')
                  : (language === 'mg' ? 'Hamadika ho maizina (Mode sombre)' : 'Passer en mode sombre')
              }
              aria-label="Mode sombre / clair"
            >
              <FontAwesomeIcon icon={isDarkMode ? ICONS.sun : ICONS.moon} className="text-xs" />
            </button>

            <button
              onClick={onToggleSound}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                soundEnabled
                  ? 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200'
                  : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
              }`}
              title={soundEnabled ? 'Atsaharo ny feo' : 'Alefaso ny feo'}
              aria-label="Son"
            >
              <FontAwesomeIcon icon={soundEnabled ? ICONS.volumeHigh : ICONS.volumeOff} className="text-xs" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 flex flex-col justify-center">
        {/* Visual Hero & Requirement Notice */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-700 text-white text-3xl shadow-lg mb-3">
            🌾
          </div>
          <h1 className="font-display font-black text-xl sm:text-2xl text-stone-900 leading-tight">
            {language === 'mg'
              ? 'Midira hampiasana ny fampiharana'
              : 'Connexion requise pour continuer'}
          </h1>
          <p className="text-xs text-stone-600 font-medium max-w-xs mx-auto mt-1">
            {language === 'mg'
              ? 'Mila kaonty ianao mba hidirana amin\'ny toetrandro sy ny bokin\'ny fambolenao manokana.'
              : 'Veuillez vous connecter pour accéder à votre journal privé, à la météo et aux conseils agricoles.'}
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-[10px] font-extrabold mt-2.5 border border-emerald-300/60 shadow-xs">
            <FontAwesomeIcon icon={ICONS.lock} className="text-[9px]" />
            <span>
              {language === 'mg'
                ? 'Angon-drakitra voaaro & 100% Hors-ligne'
                : 'Données protégées & 100% Hors-ligne'}
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-stone-200/80 p-1 rounded-2xl grid grid-cols-2 gap-1 mb-4 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('login');
              audioEngine.playChime('click');
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FontAwesomeIcon icon={ICONS.login} />
            <span>{language === 'mg' ? 'Fidirana (Miditra)' : 'Se connecter'}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              audioEngine.playChime('click');
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FontAwesomeIcon icon={ICONS.userPlus} />
            <span>{language === 'mg' ? 'Hisoratra anarana' : 'Créer un compte'}</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-md space-y-4">
            {/* Quick Login if accounts exist, or guide to register if none */}
            {registeredUsers.length > 0 ? (
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  {language === 'mg' ? 'Fidirana haingana (Tsindrio ny sarinao)' : 'Connexion rapide en 1 clic'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {registeredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleFastAvatarLogin(user)}
                      className="p-3 rounded-2xl border-2 border-stone-200 hover:border-emerald-600 bg-stone-50 hover:bg-emerald-50 text-left flex items-center gap-2.5 active:scale-95 transition-all shadow-xs"
                    >
                      <span className="text-3xl shrink-0">{user.avatar || '👨‍🌾'}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-xs text-stone-900 truncate">{user.name}</div>
                        <div className="text-[10px] text-emerald-800 font-semibold truncate">
                          {language === 'mg' ? user.roleMg?.split('(')[0]?.trim() || 'Tantsaha' : user.roleFr || 'Agriculteur'}
                        </div>
                        <div className="text-[9px] text-stone-400 font-mono">PIN: {user.pin || '1234'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-3 px-2 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 text-base">
                  <FontAwesomeIcon icon={ICONS.userPlus} />
                </div>
                <p className="text-xs font-bold text-stone-800 mb-0.5">
                  {language === 'mg' ? 'Tsy mbola misy kaonty voasoratra' : 'Aucun compte enregistré'}
                </p>
                <p className="text-[11px] text-stone-500 mb-2.5">
                  {language === 'mg'
                    ? 'Hisoratra anarana azafady mba hamoronana ny kaontinao manokana.'
                    : 'Veuillez créer votre compte pour commencer.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    audioEngine.playChime('click');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold active:scale-95 transition-all shadow-xs"
                >
                  {language === 'mg' ? 'Hisoratra anarana izao' : 'Créer un compte'}
                </button>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3 pt-3 border-t border-stone-100">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                {language === 'mg' ? 'Ampidiro ny finday na anarana' : 'Saisissez vos identifiants'}
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <FontAwesomeIcon icon={ICONS.alert} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'mg' ? 'Laharana finday na Anarana' : 'Numéro de téléphone ou Nom'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={language === 'mg' ? 'ohatra: 034 12 345 67 na Jean' : 'ex: 034 12 345 67 ou Jean'}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-medium"
                  />
                  <FontAwesomeIcon
                    icon={ICONS.phone}
                    className="absolute left-3.5 top-3.5 text-stone-400 text-xs pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'mg' ? 'Kaody miafina (PIN - 4 isa)' : 'Code PIN (4 chiffres)'}
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="****"
                    className="w-full h-11 pl-10 pr-12 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold tracking-widest"
                  />
                  <FontAwesomeIcon
                    icon={ICONS.lock}
                    className="absolute left-3.5 top-3.5 text-stone-400 text-xs pointer-events-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-2.5 text-xs text-stone-500 font-bold px-1.5 py-0.5 rounded hover:bg-stone-100"
                  >
                    {showPin ? 'Afeno' : 'Asehoy'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <FontAwesomeIcon icon={ICONS.login} />
                <span>{language === 'mg' ? 'Miditra amin\'ny fampiharana' : 'Se connecter et ouvrir l\'app'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: REGISTER */}
        {activeTab === 'register' && (
          <form
            onSubmit={handleRegisterSubmit}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-md space-y-3.5"
          >
            {regError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={ICONS.alert} className="shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'mg' ? 'Safidio ny sarinao (Avatar)' : 'Choisissez votre avatar'}
              </label>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      setRegAvatar(av);
                      audioEngine.playChime('click');
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center shrink-0 transition-all border-2 ${
                      regAvatar === av
                        ? 'border-emerald-600 bg-emerald-50 scale-105 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'mg' ? 'Anarana fenon\'ny tantsaha *' : 'Nom complet de l\'agriculteur *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={language === 'mg' ? 'ohatra: Randria Jean' : 'ex: Randria Jean'}
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-medium"
                />
                <FontAwesomeIcon
                  icon={ICONS.user}
                  className="absolute left-3.5 top-3.5 text-stone-400 text-xs pointer-events-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'mg' ? 'Laharana finday' : 'Numéro de téléphone portable'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="034 XX XXX XX"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-medium"
                />
                <FontAwesomeIcon
                  icon={ICONS.phone}
                  className="absolute left-3.5 top-3.5 text-stone-400 text-xs pointer-events-none"
                />
              </div>
            </div>

            {/* PIN Code */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'mg' ? 'Kaody miafina (PIN 4 isa) *' : 'Code secret (PIN à 4 chiffres) *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  placeholder="1234"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold tracking-widest"
                />
                <FontAwesomeIcon
                  icon={ICONS.lock}
                  className="absolute left-3.5 top-3.5 text-stone-400 text-xs pointer-events-none"
                />
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'mg' ? 'Faritra fambolena' : 'Zone agricole'}
              </label>
              <select
                value={regRegionId}
                onChange={(e) => setRegRegionId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-bold bg-white"
              >
                {REGIONS_DATA.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {language === 'mg' ? reg.nameMg : reg.nameFr}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Crop */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'mg' ? 'Karazam-boly lehibe' : 'Culture principale'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {CROPS_DATA.map((crop) => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => {
                      setRegCropId(crop.id);
                      audioEngine.playChime('click');
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      regCropId === crop.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs'
                    }`}
                  >
                    <div className="text-xs truncate font-bold">
                      {language === 'mg' ? crop.nameMg : crop.nameFr}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all mt-4"
            >
              <FontAwesomeIcon icon={ICONS.check} />
              <span>{language === 'mg' ? 'Hisoratra anarana (Hamorona kaonty)' : 'Créer mon compte et entrer'}</span>
            </button>
          </form>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="text-center py-3 text-[11px] text-stone-500 font-medium">
        Tantsaha Connect · Jhonito · {language === 'mg' ? 'Ho an\'ny tantsaha malagasy' : 'Pour les paysans malagasy'}
      </footer>
    </div>
  );
};
