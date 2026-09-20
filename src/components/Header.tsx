import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenDrawer: () => void;
  onOpenSensoryReset: () => void;
  onOpenPreferences: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
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
              src="https://lh3.googleusercontent.com/aida/AEtjO1Wry_clvL8eY7k5TTGMuaK5OVxCMsjqybdb1iygYcwr6eInlQYu75J66yI6d8HbfbkR9hGr6bEKguPyOPSpUhzp3BbolkYE9PQby7yCPqynVfUr5IPc0DXRju9-zS5wWf-j9_YPrDEA4ig2ig8A3kRi0VTnOlC-JzIU8pYQrP6oI6LOVyHiMPBrrXhkqW-fShJIGLvF60MO9NpI3J8m6RqBbCyU2giMgu8OJE0lN8wQsSJq7TnHtdL32w"
              alt="Aunicorn logo"
              className="h-7 w-auto object-contain drop-shadow"
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

        {/* Right: Sensory Quick Reset Pill + User Avatar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="header-sensory-reset"
            onClick={onOpenSensoryReset}
            title="Sensory Quick Reset"
            className="h-10 px-3 flex items-center gap-1.5 rounded-full bg-[#1f1f2e] border border-[#00c2ff]/30 text-[#00c2ff] hover:bg-[#252536] hover:border-[#00c2ff]/60 transition-all focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
          >
            <span className="material-symbols-outlined text-[18px]">spa</span>
            <span className="text-[13px] font-semibold hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            id="header-user-profile"
            onClick={onOpenPreferences}
            aria-label="User Profile & Preferences"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#bdc2ff] transition-all focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#bdc2ff] text-[#121f8b] flex items-center justify-center font-bold text-xs shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
