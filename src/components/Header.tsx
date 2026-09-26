import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  theme: 'light' | 'dark';
  onSelectTheme: (theme: 'light' | 'dark') => void;
  onOpenDrawer: () => void;
  onOpenSensoryReset: () => void;
  onOpenPreferences: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  theme,
  onSelectTheme,
  onOpenDrawer,
  onOpenSensoryReset,
  onOpenPreferences,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'health-area':
        return 'Health Area';
      case 'activities-area':
      default:
        return 'Activities';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#12121c]/85 backdrop-blur-xl border-b border-[#2c2c3a]/50 shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
      <div className="h-16 px-3 flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Left: Drawer Trigger + Brand */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="header-drawer-toggle"
            onClick={onOpenDrawer}
            aria-label="Open navigation menu"
            className="w-11 h-11 flex items-center justify-center rounded-lg text-[#e3e1ef] hover:bg-[#1f1f2e] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]"
          >
            <span className="material-symbols-outlined text-[26px]">menu</span>
          </button>
          
          <div className="flex items-center gap-2">
            <img
              src="/assets/aunicorn-logo.svg"
              alt="Aunicorn logo"
              className="h-7 w-auto object-contain drop-shadow"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-[18px] text-[#f7f7fa] tracking-wide hidden xs:inline">
              Aunicorn
            </span>
          </div>
        </div>

        {/* Center: Current Tab Header Title */}
        <div className="flex items-center">
          <h1 className="font-semibold text-[18px] text-[#f7f7fa] tracking-wide text-center px-1 truncate max-w-[140px]">
            {getTabTitle()}
          </h1>
        </div>

        {/* Right: Theme Toggle + Sensory Quick Reset Pill + User Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            id="header-theme-toggle"
            onClick={() => onSelectTheme(theme === 'light' ? 'dark' : 'light')}
            title={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}`}
            aria-label={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}`}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#1f1f2e] border border-[#2c2c3a] text-[#8f5fe8] hover:bg-[#252536] hover:border-[#8f5fe8]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#8f5fe8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          <button
            type="button"
            id="header-sensory-reset"
            onClick={onOpenSensoryReset}
            title="Sensory Quick Reset"
            className="h-9 sm:h-10 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-full bg-[#1f1f2e] border border-[#00c2ff]/30 text-[#00c2ff] hover:bg-[#252536] hover:border-[#00c2ff]/60 transition-all focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
          >
            <span className="material-symbols-outlined text-[18px]">spa</span>
            <span className="text-[13px] font-semibold hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            id="header-user-profile"
            onClick={onOpenPreferences}
            aria-label="User Profile & Preferences"
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#bdc2ff] transition-all focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
