import React, { useState } from 'react';
import { FontAwesomeIcon, ICONS } from './FontAwesomeIcons.jsx';
import { REGIONS_DATA, CROPS_DATA } from '../data/farmingData.js';
import { audioEngine } from '../utils/audioVoice.js';
import { storage } from '../utils/storage.js';

const AVATAR_OPTIONS = ['🌾', '🍅', '🌱', '🌽', '🥔', '👨‍🌾', '👩‍🌾', '🐄'];

export const AuthModal = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  language,
}) => {
  const [registeredUsers, setRegisteredUsers] = useState(() => storage.getUsers());
  const [activeTab, setActiveTab] = useState(() => {
    if (currentUser) return 'profile';
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

  if (!isOpen) return null;

  const refreshUsers = () => {
    setRegisteredUsers(storage.getUsers());
  };

  const handleSpeakLoginHelp = () => {
    const text =
      language === 'mg'
        ? 'Eto no idiranao amin\'ny kaontinao tantsaha. Tsindrio ny sarinao na ampidiro ny laharana finday sy ny kaody miafina tarehimarika efatra.'
        : 'Connectez-vous à votre compte agriculteur. Cliquez sur votre profil ou saisissez votre numéro de téléphone et votre code PIN à 4 chiffres.';
    audioEngine.speakText(text, language === 'mg' ? 'Fanazavana fidirana' : 'Aide connexion', language);
  };

  const handleSpeakRegisterHelp = () => {
    const text =
      language === 'mg'
        ? 'Hisoratra anarana vaovao ianao. Fenoy ny anaranao, ny laharana finday, ny kaody miafina tarehimarika efatra, ary safidio ny faritra sy ny voly lehibe ataonao.'
        : 'Inscription nouveau paysan. Indiquez votre nom, votre numéro de téléphone, votre code PIN secret à 4 chiffres, votre région agricole et vos cultures principales.';
    audioEngine.speakText(text, language === 'mg' ? 'Torolàlana fisoratana' : 'Guide inscription', language);
  };

  const handleFastAvatarLogin = (user) => {
    audioEngine.playChime('click');
    setLoginIdentifier(user.phone || user.name);
    setLoginPin(user.pin || '1234');
    // Direct login
    const res = storage.loginUser(user.phone || user.name, user.pin || '1234');
    if (res.success) {
      onUserChange(res.user);
      audioEngine.playChime('success');
      const welcome =
        language === 'mg'
          ? `Miarahaba anao ${res.user.name}, tafiditra soa aman-tsara amin'ny kaontinao ianao!`
          : `Bienvenue ${res.user.name}, connexion réussie !`;
      audioEngine.speakConfirmation(welcome);
      onClose();
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

    onUserChange(res.user);
    audioEngine.playChime('success');
    const welcome =
      language === 'mg'
        ? `Miarahaba anao ${res.user.name}, tafiditra soa aman-tsara amin'ny kaontinao ianao!`
        : `Bienvenue ${res.user.name}, connexion réussie !`;
    audioEngine.speakConfirmation(welcome);
    onClose();
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
    onUserChange(res.user);
    audioEngine.playChime('success');
    const welcome =
      language === 'mg'
        ? `Tafiditra soa aman-tsara ny fisoratana anarana, tongasoa ry ${res.user.name}!`
        : `Inscription réussie, bienvenue ${res.user.name} !`;
    audioEngine.speakConfirmation(welcome);
    onClose();
  };

  const handleLogout = () => {
    storage.logoutUser();
    onUserChange(null);
    audioEngine.playChime('alert');
    const msg =
      language === 'mg'
        ? 'Tafavoaka tamin\'ny kaonty ianao.'
        : 'Vous avez été déconnecté.';
    audioEngine.speakConfirmation(msg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-4 sm:p-5 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg shadow-inner">
                <FontAwesomeIcon icon={activeTab === 'register' ? ICONS.userPlus : ICONS.user} />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg leading-tight">
                  {activeTab === 'login' && (language === 'mg' ? 'Fidirana amin\'ny kaonty' : 'Connexion Agriculteur')}
                  {activeTab === 'register' && (language === 'mg' ? 'Fisoratana anarana vaovao' : 'Créer un Compte')}
                  {activeTab === 'profile' && (language === 'mg' ? 'Kaontiko (Tantsaha)' : 'Mon Profil Agricole')}
                </h3>
                <p className="text-[11px] text-emerald-200 font-medium">
                  {language === 'mg' ? 'Fampiharana Tantsaha Connect' : 'Tantsaha Connect de Jhonito'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm active:scale-95 transition-all"
              aria-label="Manidy"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 gap-1.5 mt-3.5 bg-black/20 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab(currentUser ? 'profile' : 'login');
                audioEngine.playChime('click');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login' || activeTab === 'profile'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={ICONS.login} className="text-xs" />
              <span>{currentUser ? (language === 'mg' ? 'Kaontiko' : 'Mon Profil') : (language === 'mg' ? 'Miditra' : 'Connexion')}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                audioEngine.playChime('click');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={ICONS.userPlus} className="text-xs" />
              <span>{language === 'mg' ? 'Hisoratra anarana' : 'Inscription'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* TAB 1: PROFILE VIEW (If logged in) */}
          {activeTab === 'profile' && currentUser && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-4 text-center relative overflow-hidden">
                <div className="text-5xl mb-2">{currentUser.avatar || '👨‍🌾'}</div>
                <h4 className="font-display font-black text-xl text-stone-900">{currentUser.name}</h4>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold mt-1">
                  <FontAwesomeIcon icon={ICONS.check} className="text-[9px]" />
                  <span>{language === 'mg' ? 'Mpamboly voasoratra' : 'Agriculteur certifié'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-left text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-stone-500 font-bold block uppercase">{language === 'mg' ? 'Finday' : 'Téléphone'}</span>
                    <span className="font-bold text-stone-800">{currentUser.phone || 'Tsy misy'}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-stone-500 font-bold block uppercase">{language === 'mg' ? 'Faritra' : 'Région'}</span>
                    <span className="font-bold text-stone-800 truncate block">
                      {language === 'mg' ? currentUser.regionNameMg?.split('(')[0]?.trim() : currentUser.regionNameFr?.split('(')[0]?.trim() || 'Alaotra'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200 col-span-2">
                    <span className="text-[10px] text-stone-500 font-bold block uppercase">{language === 'mg' ? 'Voly lehibe' : 'Culture principale'}</span>
                    <span className="font-bold text-emerald-800">
                      {language === 'mg' ? currentUser.mainCropLabelMg : currentUser.mainCropLabelFr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast Switch User Grid */}
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  {language === 'mg' ? 'Hanova mpamboly amin\'ity fitaovana ity' : 'Changer d’utilisateur sur cet appareil'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {registeredUsers
                    .filter((u) => u.id !== currentUser.id)
                    .map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleFastAvatarLogin(user)}
                        className="p-2.5 rounded-2xl border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/50 text-left flex items-center gap-2.5 active:scale-95 transition-all"
                      >
                        <span className="text-2xl">{user.avatar || '👨‍🌾'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-stone-900 truncate">{user.name}</div>
                          <div className="text-[10px] text-stone-500 truncate">{user.roleMg || user.phone}</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                <button
                  onClick={handleLogout}
                  className="flex-1 h-11 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 border border-red-200 active:scale-95 transition-all"
                >
                  <FontAwesomeIcon icon={ICONS.logout} />
                  <span>{language === 'mg' ? 'Hivoaka ny kaonty' : 'Se déconnecter'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                >
                  <span>{language === 'mg' ? 'Tohizana ny asa' : 'Continuer'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LOGIN FORM */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {/* Audio Help & Intro */}
              <div className="flex items-center justify-between bg-stone-100 p-2.5 rounded-2xl border border-stone-200">
                <div className="text-xs text-stone-700 font-medium">
                  {language === 'mg'
                    ? 'Midira amin\'ny findainao na tsindrio ny sarinao.'
                    : 'Connectez-vous par téléphone ou cliquez sur votre profil.'}
                </div>
                <button
                  type="button"
                  onClick={handleSpeakLoginHelp}
                  className="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-xs"
                  title="Henoy ny fanazavana"
                >
                  <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-xs" />
                </button>
              </div>

              {/* Fast 1-Tap Avatar Switcher if accounts exist */}
              {registeredUsers.length > 0 ? (
                <div>
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                    {language === 'mg' ? 'Fidirana haingana amin\'ny 1 kitika' : 'Connexion rapide en 1 clic'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {registeredUsers.slice(0, 4).map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleFastAvatarLogin(user)}
                        className="p-2.5 rounded-2xl border-2 border-stone-200 hover:border-emerald-600 bg-stone-50 hover:bg-emerald-50/60 text-left flex items-center gap-2.5 active:scale-95 transition-all"
                      >
                        <span className="text-3xl shrink-0">{user.avatar || '👨‍🌾'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-xs text-stone-900 truncate">{user.name}</div>
                          <div className="text-[10px] text-emerald-700 font-medium truncate">
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
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 text-sm">
                    <FontAwesomeIcon icon={ICONS.userPlus} />
                  </div>
                  <p className="text-xs font-bold text-stone-800 mb-0.5">
                    {language === 'mg' ? 'Tsy mbola misy kaonty voasoratra' : 'Aucun compte enregistré'}
                  </p>
                  <p className="text-[11px] text-stone-500 mb-2">
                    {language === 'mg'
                      ? 'Hisoratra anarana azafady mba hamoronana kaonty vaovao.'
                      : 'Créez votre compte pour commencer.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      audioEngine.playChime('click');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold active:scale-95 transition-all"
                  >
                    {language === 'mg' ? 'Hisoratra anarana' : 'Créer un compte'}
                  </button>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2 border-t border-stone-200">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {language === 'mg' ? 'Ampidiro ny finday na anarana' : 'Ou saisissez vos identifiants'}
                </div>

                {loginError && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
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
                    {language === 'mg' ? 'Kaody miafina (PIN - 4 isa)' : 'Code secret (PIN - 4 chiffres)'}
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
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    {language === 'mg' ? 'Kaody fototra ho an\'ny fitiliana: 1234' : 'Code de démonstration : 1234'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
                >
                  <FontAwesomeIcon icon={ICONS.login} />
                  <span>{language === 'mg' ? 'Miditra amin\'ny kaonty' : 'Se connecter'}</span>
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    audioEngine.playChime('click');
                  }}
                  className="text-xs text-emerald-800 font-bold hover:underline"
                >
                  {language === 'mg'
                    ? 'Mbola tsy manana kaonty? Tsindrio eto hisoratra anarana'
                    : 'Pas encore de compte ? Cliquez ici pour vous inscrire'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Audio Help Strip */}
              <div className="flex items-center justify-between bg-stone-100 p-2.5 rounded-2xl border border-stone-200">
                <div className="text-xs text-stone-700 font-medium">
                  {language === 'mg'
                    ? 'Fisoratana anarana maimaim-poana ho anao tantsaha.'
                    : 'Inscription gratuite pour les agriculteurs malagasy.'}
                </div>
                <button
                  type="button"
                  onClick={handleSpeakRegisterHelp}
                  className="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-xs"
                  title="Henoy ny torolàlana"
                >
                  <FontAwesomeIcon icon={ICONS.volumeHigh} className="text-xs" />
                </button>
              </div>

              {regError && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <FontAwesomeIcon icon={ICONS.alert} className="shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
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
                      className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center shrink-0 transition-all border-2 ${
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
                  {language === 'mg' ? 'Laharana finday (Aterineto na Tsia)' : 'Numéro de téléphone portable'}
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
                <span className="text-[10px] text-stone-500 mt-1 block">
                  {language === 'mg' ? 'Tsotra tsianjery mba hiarovana ny bokin\'ny fambolenao' : 'Code simple pour protéger votre journal agricole'}
                </span>
              </div>

              {/* Farming Region */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'mg' ? 'Faritra fambolena misy anao' : 'Votre zone agricole'}
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
                  {language === 'mg' ? 'Karazam-boly lehibe ataonao' : 'Culture principale'}
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                <span>{language === 'mg' ? 'Hisoratra anarana (Vita)' : 'Créer mon compte paysan'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
