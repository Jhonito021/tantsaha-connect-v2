import React from 'react';
import { FontAwesomeIcon, ICONS } from './FontAwesomeIcons.jsx';

export const BottomNav = ({
  currentTab,
  onTabChange,
  language,
  unreadAlertCount = 1,
}) => {
  const tabs = [
    {
      id: 'home',
      labelMg: 'Fandraisana',
      labelFr: 'Accueil',
      icon: ICONS.home,
    },
    {
      id: 'weather',
      labelMg: 'Toetrandro',
      labelFr: 'Météo',
      icon: ICONS.sun,
    },
    {
      id: 'journal',
      labelMg: 'Bokin\'asa',
      labelFr: 'Journal',
      icon: ICONS.book,
    },
    {
      id: 'alerts',
      labelMg: 'Loza & Alerte',
      labelFr: 'Alertes',
      icon: ICONS.alert,
      badge: unreadAlertCount,
    },
    {
      id: 'advice',
      labelMg: 'Torohevitra',
      labelFr: 'Conseils',
      icon: ICONS.earListen,
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Fitetezana fototra"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg safe-area-inset-bottom w-full max-w-full overflow-hidden"
    >
      <div className="max-w-md md:max-w-3xl mx-auto grid grid-cols-5 h-16 px-1 w-full">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full w-full min-w-0 transition-all ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span className="absolute top-1 w-8 sm:w-10 h-1 bg-emerald-600 rounded-full" />
              )}

              <div className="relative mt-1">
                <FontAwesomeIcon
                  icon={tab.icon}
                  className={`text-base sm:text-lg transition-transform ${isActive ? 'scale-110 text-emerald-700' : ''}`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-tight truncate max-w-full px-0.5 mt-1">
                {language === 'mg' ? tab.labelMg : tab.labelFr}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
